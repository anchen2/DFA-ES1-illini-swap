import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Switch,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  createOffer,
  getCurrentUserId,
  markMessageRead,
  onEvent,
  sendMessage,
  setCurrentUserId,
  updateOfferStatus,
} from './services/realtime/RealtimeService';
import {
  clearNotificationFeed,
  getNotificationFeed,
  initializeNotificationBridge,
} from './services/notifications/NotificationService';
import {
  deleteDeviceTokenEndpoint,
  getNotificationPreferencesEndpoint,
  getPresenceEndpoint,
  listDeviceTokensEndpoint,
  postDeviceTokenEndpoint,
  postPresenceHeartbeatEndpoint,
  putPresenceOnlineStateEndpoint,
  putNotificationPreferencesEndpoint,
} from './services/api/FirestoreRealtimeApi';
import {
  getConversationEndpoint,
  getConversationsEndpoint,
  getMessagesEndpoint,
  patchMessageReadEndpoint,
  patchConversationStatusEndpoint,
  postConversationEndpoint,
  postMessageEndpoint,
  subscribeToMessagesEndpoint,
} from './services/api/FirestoreConversationApi';
import { patchOfferStatusEndpoint } from './services/api/MockConversationApi';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebaseConfig';

function timestamp() {
  return new Date().toLocaleTimeString();
}

export default function RealtimeLabScreen() {
  const [userId, setUserId] = useState(auth.currentUser?.uid || getCurrentUserId());
  const [peerUserId, setPeerUserId] = useState('dev-user-b');
  const [conversationId, setConversationId] = useState('conv-local-1');
  const [messageBody, setMessageBody] = useState('Hello from Illini Swap realtime lab');
  const [messageIdToRead, setMessageIdToRead] = useState('');
  const [lastMessageId, setLastMessageId] = useState('');
  const [offerItemTitle, setOfferItemTitle] = useState('Desk lamp');
  const [offerId, setOfferId] = useState('');
  const [tokenInput, setTokenInput] = useState('dev-token-001');
  const [tokens, setTokens] = useState([]);
  const [presenceState, setPresenceState] = useState({
    userId: auth.currentUser?.uid || getCurrentUserId(),
    online: false,
    lastSeenAt: null,
    heartbeatAt: null,
  });
  const [preferences, setPreferences] = useState({
    messages: true,
    offers: true,
    approvals: true,
    quietHours: { enabled: false, start: '22:00', end: '07:00' },
  });
  const [conversationPeerId, setConversationPeerId] = useState('');
  const [conversationCreateStatus, setConversationCreateStatus] = useState('active');
  const [conversationFilterStatus, setConversationFilterStatus] = useState('');
  const [conversationUpdateStatus, setConversationUpdateStatus] = useState('archived');
  const [conversationTargetId, setConversationTargetId] = useState('');
  const [conversationMessageBody, setConversationMessageBody] = useState('Message from conversation API');
  const [offerStatusTargetId, setOfferStatusTargetId] = useState('');
  const [offerStatusValue, setOfferStatusValue] = useState('accepted');
  const [conversationRecords, setConversationRecords] = useState([]);
  const [conversationDetail, setConversationDetail] = useState(null);
  const [conversationMessages, setConversationMessages] = useState([]);
  const [offerStatusResult, setOfferStatusResult] = useState(null);
  const [logs, setLogs] = useState([]);
  const [notificationFeed, setNotificationFeed] = useState([]);
  const [authStateLabel, setAuthStateLabel] = useState(
    auth.currentUser?.uid
      ? `Signed in as ${auth.currentUser.uid}`
      : 'Not signed in'
  );
  const [liveMessagesActive, setLiveMessagesActive] = useState(false);
  const liveMessageUnsubscribeRef = useRef(null);

  const currentReadTarget = messageIdToRead || lastMessageId;

  function appendLog(line) {
    setLogs((prev) => [`[${timestamp()}] ${line}`, ...prev].slice(0, 80));
  }

  async function refreshPreferencesAndTokens(targetUserId) {
    if (!targetUserId) {
      setTokens([]);
      return;
    }
    const prefsResult = await getNotificationPreferencesEndpoint(targetUserId);
    const tokenResult = await listDeviceTokensEndpoint(targetUserId);
    setPreferences(prefsResult.body);
    setTokens(tokenResult.body.tokens);
  }

  async function refreshPresence(targetUserId) {
    if (!targetUserId) {
      return;
    }
    try {
      const res = await getPresenceEndpoint(targetUserId);
      setPresenceState(res.body);
    } catch (error) {
      appendLog(`Presence load failed: ${error.message}`);
    }
  }

  function stopLiveMessagesListener(shouldLog = true) {
    if (liveMessageUnsubscribeRef.current) {
      liveMessageUnsubscribeRef.current();
      liveMessageUnsubscribeRef.current = null;
      setLiveMessagesActive(false);
      if (shouldLog) {
        appendLog('Stopped Firestore message stream.');
      }
    }
  }

  function startLiveMessagesListener() {
    if (!conversationTargetId) {
      appendLog('Enter a conversation id before starting stream.');
      return;
    }
    stopLiveMessagesListener(false);
    try {
      liveMessageUnsubscribeRef.current = subscribeToMessagesEndpoint(
        userId,
        conversationTargetId,
        (messages) => {
          setConversationMessages(messages);
          if (messages[0]?.id) {
            setLastMessageId(messages[0].id);
          }
        },
        (error) => {
          setLiveMessagesActive(false);
          appendLog(`Firestore stream error: ${error.message}`);
        }
      );
      setLiveMessagesActive(true);
      appendLog(`Started Firestore stream for ${conversationTargetId}.`);
    } catch (error) {
      appendLog(`Failed to start Firestore stream: ${error.message}`);
    }
  }

  function refreshFeed() {
    setNotificationFeed(getNotificationFeed());
  }

  useEffect(() => {
    initializeNotificationBridge();
    if (userId) {
      refreshPreferencesAndTokens(userId).catch((error) => {
        appendLog(`Preference load failed: ${error.message}`);
      });
      refreshPresence(userId).catch((error) => {
        appendLog(`Presence load failed: ${error.message}`);
      });
    }
    refreshFeed();

    const unsubscribe = onEvent((event) => {
      appendLog(`${event.type} (${event.id})`);
      refreshFeed();
    });

    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setAuthStateLabel('Not signed in. Firestore messaging tests require sign-in.');
        stopLiveMessagesListener(false);
        return;
      }

      setAuthStateLabel(`Signed in as ${user.uid}`);
      setUserId(user.uid);
      setCurrentUserId(user.uid);
      try {
        await refreshPreferencesAndTokens(user.uid);
        await refreshPresence(user.uid);
      } catch (error) {
        appendLog(`Preference load failed: ${error.message}`);
      }
      appendLog(`Auth session ready (${user.uid}).`);
    });

    return () => {
      unsubscribeAuth();
    };
  }, []);

  useEffect(() => {
    return () => {
      stopLiveMessagesListener(false);
    };
  }, []);

  useEffect(() => {
    if (Platform.OS !== 'web' || typeof document === 'undefined') {
      return;
    }

    const html = document.documentElement;
    const body = document.body;
    const root = document.getElementById('root');

    html.style.height = '100%';
    body.style.height = '100%';
    html.style.overflow = 'auto';
    body.style.overflow = 'auto';

    if (root) {
      root.style.height = '100%';
      root.style.overflow = 'auto';
    }
  }, []);

  const presenceLabel = useMemo(() => {
    if (presenceState.online) {
      return `Online (last seen ${presenceState.lastSeenAt || 'n/a'})`;
    }
    return `Offline (last seen ${presenceState.lastSeenAt || 'n/a'})`;
  }, [presenceState]);

  const labSections = (
    <>
      <Text style={styles.title}>Realtime + Notifications Lab</Text>
      <Text style={styles.subTitle}>Firestore conversation APIs are enabled on this screen.</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Identity</Text>
        <Text style={styles.infoText}>{authStateLabel}</Text>
        <TextInput style={styles.input} value={userId} onChangeText={setUserId} placeholder="Current user id" />
        <TextInput style={styles.input} value={peerUserId} onChangeText={setPeerUserId} placeholder="Peer user id" />
        <TouchableOpacity
          style={styles.button}
          onPress={async () => {
            try {
              const normalizedUserId = userId.trim();
              if (!normalizedUserId) {
                appendLog('Enter a user id before applying context.');
                return;
              }
              if (auth.currentUser?.uid && auth.currentUser.uid !== normalizedUserId) {
                appendLog(`User id must match signed-in user (${auth.currentUser.uid}).`);
                return;
              }
              setCurrentUserId(normalizedUserId);
              await refreshPreferencesAndTokens(normalizedUserId);
              await refreshPresence(normalizedUserId);
              appendLog(`Switched current user to ${normalizedUserId}`);
            } catch (error) {
              appendLog(`Failed to apply user context: ${error.message}`);
            }
          }}
        >
          <Text style={styles.buttonText}>Apply User Context</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Firestore Conversation API Demo</Text>
        <Text style={styles.infoText}>Use Firebase Auth UIDs for both users.</Text>
        <TextInput
          style={styles.input}
          value={conversationPeerId}
          onChangeText={setConversationPeerId}
          placeholder="Peer user id for conversation create"
        />
        <TextInput
          style={styles.input}
          value={conversationCreateStatus}
          onChangeText={setConversationCreateStatus}
          placeholder="Create status: active | archived | closed"
        />
        <TouchableOpacity
          style={styles.button}
          onPress={async () => {
            try {
              const res = await postConversationEndpoint(userId, {
                peerUserId: conversationPeerId,
                status: conversationCreateStatus || 'active',
              });
              const conv = res.body.conversation;
              setConversationTargetId(conv.id);
              setOfferStatusTargetId(res.body.placeholderOfferId || '');
              appendLog(`POST /conversations -> ${conv.id}`);
            } catch (error) {
              appendLog(`Conversation create failed: ${error.message}`);
            }
          }}
        >
          <Text style={styles.buttonText}>POST /conversations</Text>
        </TouchableOpacity>

        <TextInput
          style={styles.input}
          value={conversationFilterStatus}
          onChangeText={setConversationFilterStatus}
          placeholder="Optional status filter (active/archived/closed)"
        />
        <View style={styles.row}>
          <TouchableOpacity
            style={styles.buttonHalf}
            onPress={async () => {
              try {
                const res = await getConversationsEndpoint(userId, {
                  direction: 'all',
                  status: conversationFilterStatus || undefined,
                });
                setConversationRecords(res.body);
                appendLog(`GET /conversations?direction=all -> ${res.body.length}`);
              } catch (error) {
                appendLog(`Conversation list failed: ${error.message}`);
              }
            }}
          >
            <Text style={styles.buttonText}>List All</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.buttonHalf}
            onPress={async () => {
              try {
                const res = await getConversationsEndpoint(userId, {
                  direction: 'sent',
                  status: conversationFilterStatus || undefined,
                });
                setConversationRecords(res.body);
                appendLog(`GET /conversations?direction=sent -> ${res.body.length}`);
              } catch (error) {
                appendLog(`Conversation sent list failed: ${error.message}`);
              }
            }}
          >
            <Text style={styles.buttonText}>List Sent</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.buttonHalf}
            onPress={async () => {
              try {
                const res = await getConversationsEndpoint(userId, {
                  direction: 'received',
                  status: conversationFilterStatus || undefined,
                });
                setConversationRecords(res.body);
                appendLog(`GET /conversations?direction=received -> ${res.body.length}`);
              } catch (error) {
                appendLog(`Conversation received list failed: ${error.message}`);
              }
            }}
          >
            <Text style={styles.buttonText}>List Received</Text>
          </TouchableOpacity>
        </View>

        <TextInput
          style={styles.input}
          value={conversationTargetId}
          onChangeText={setConversationTargetId}
          placeholder="Conversation id for GET/PATCH/messages"
        />
        <TextInput
          style={styles.input}
          value={conversationUpdateStatus}
          onChangeText={setConversationUpdateStatus}
          placeholder="PATCH status: active | archived | closed"
        />
        <View style={styles.row}>
          <TouchableOpacity
            style={styles.buttonHalf}
            onPress={async () => {
              try {
                const res = await getConversationEndpoint(userId, conversationTargetId);
                setConversationDetail(res.body);
                appendLog(`GET /conversations/${conversationTargetId} ok`);
              } catch (error) {
                appendLog(`Conversation fetch failed: ${error.message}`);
              }
            }}
          >
            <Text style={styles.buttonText}>GET by Id</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.buttonHalf}
            onPress={async () => {
              try {
                const res = await patchConversationStatusEndpoint(
                  userId,
                  conversationTargetId,
                  { status: conversationUpdateStatus }
                );
                appendLog(`PATCH /conversations/:id/status -> ${res.body.status}`);
              } catch (error) {
                appendLog(`Conversation status patch failed: ${error.message}`);
              }
            }}
          >
            <Text style={styles.buttonText}>PATCH Status</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.infoText}>Conversation list ({conversationRecords.length}):</Text>
        {conversationRecords.slice(0, 5).map((conversation) => (
          <Text key={conversation.id} style={styles.logLine}>
            {conversation.id} | {conversation.status} | createdBy={conversation.createdBy}
          </Text>
        ))}
        {conversationDetail ? (
          <Text style={styles.infoText}>
            Selected: {conversationDetail.id} | status={conversationDetail.status} | messages={conversationDetail.messages.length} | offers={conversationDetail.offers.length}
          </Text>
        ) : null}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Firestore Message API + Realtime Stream</Text>
        <TextInput
          style={styles.input}
          value={conversationMessageBody}
          onChangeText={setConversationMessageBody}
          placeholder="Message body for POST /messages"
        />
        <View style={styles.row}>
          <TouchableOpacity
            style={styles.buttonHalf}
            onPress={async () => {
              try {
                const res = await postMessageEndpoint(userId, conversationTargetId, {
                  body: conversationMessageBody,
                  status: 'sent',
                });
                setLastMessageId(res.body.id);
                appendLog(`POST /conversations/:id/messages -> ${res.body.id}`);
              } catch (error) {
                appendLog(`Message create failed: ${error.message}`);
              }
            }}
          >
            <Text style={styles.buttonText}>POST Message</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.buttonHalf}
            onPress={async () => {
              try {
                const res = await getMessagesEndpoint(userId, conversationTargetId);
                setConversationMessages(res.body);
                appendLog(`GET /conversations/:id/messages -> ${res.body.length}`);
              } catch (error) {
                appendLog(`Message list failed: ${error.message}`);
              }
            }}
          >
            <Text style={styles.buttonText}>GET Messages</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.row}>
          <TouchableOpacity
            style={styles.buttonHalf}
            onPress={() => {
              startLiveMessagesListener();
            }}
          >
            <Text style={styles.buttonText}>Start Live Stream</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.buttonHalf}
            onPress={() => {
              stopLiveMessagesListener();
            }}
          >
            <Text style={styles.buttonText}>Stop Live Stream</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.infoText}>
          Firestore stream status: {liveMessagesActive ? 'ACTIVE' : 'OFF'}
        </Text>
        {conversationMessages.slice(0, 5).map((message) => (
          <Text key={message.id} style={styles.logLine}>
            {message.id} | {message.senderId}{' -> '}{message.receiverId} | {message.status}
          </Text>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Offer Status Demo (No Offer POST/GET)</Text>
        <TextInput
          style={styles.input}
          value={offerStatusTargetId}
          onChangeText={setOfferStatusTargetId}
          placeholder="Offer id for PATCH"
        />
        <TextInput
          style={styles.input}
          value={offerStatusValue}
          onChangeText={setOfferStatusValue}
          placeholder="Offer status: pending/accepted/declined/cancelled"
        />
        <TouchableOpacity
          style={styles.button}
          onPress={async () => {
            try {
              const res = await patchOfferStatusEndpoint(userId, offerStatusTargetId, {
                status: offerStatusValue,
              });
              setOfferStatusResult(res.body);
              appendLog(`PATCH /offers/:id/status -> ${res.body.status}`);
            } catch (error) {
              appendLog(`Offer status patch failed: ${error.message}`);
            }
          }}
        >
          <Text style={styles.buttonText}>PATCH /offers/:id/status</Text>
        </TouchableOpacity>
        {offerStatusResult ? (
          <Text style={styles.infoText}>
            Updated offer {offerStatusResult.id}: {offerStatusResult.status}
          </Text>
        ) : null}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Presence</Text>
        <Text style={styles.infoText}>{presenceLabel}</Text>
        <View style={styles.row}>
          <TouchableOpacity
            style={styles.buttonHalf}
            onPress={async () => {
              try {
                const res = await putPresenceOnlineStateEndpoint(userId, true);
                setPresenceState(res.body);
                appendLog(`Presence set online for ${userId}`);
              } catch (error) {
                appendLog(`Set online failed: ${error.message}`);
              }
            }}
          >
            <Text style={styles.buttonText}>Set Online</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.buttonHalf}
            onPress={async () => {
              try {
                const res = await putPresenceOnlineStateEndpoint(userId, false);
                setPresenceState(res.body);
                appendLog(`Presence set offline for ${userId}`);
              } catch (error) {
                appendLog(`Set offline failed: ${error.message}`);
              }
            }}
          >
            <Text style={styles.buttonText}>Set Offline</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={styles.button}
          onPress={async () => {
            const res = await postPresenceHeartbeatEndpoint(userId);
            setPresenceState(res.body);
            appendLog(`Heartbeat posted for ${userId}`);
          }}
        >
          <Text style={styles.buttonText}>POST /presence/heartbeat</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.buttonMuted}
          onPress={async () => {
            const res = await getPresenceEndpoint(userId);
            appendLog(`GET /presence/${userId} -> online=${res.body.online}`);
          }}
        >
          <Text style={styles.buttonText}>GET /presence/:userId</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Messaging + Read Receipts</Text>
        <TextInput style={styles.input} value={conversationId} onChangeText={setConversationId} placeholder="Conversation id" />
        <TextInput style={styles.input} value={messageBody} onChangeText={setMessageBody} placeholder="Message body" />
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            const msg = sendMessage({
              conversationId,
              senderId: userId,
              recipientId: peerUserId,
              body: messageBody,
            });
            setLastMessageId(msg.id);
            appendLog(`Message sent: ${msg.id}`);
          }}
        >
          <Text style={styles.buttonText}>Send Message Event</Text>
        </TouchableOpacity>
        <TextInput
          style={styles.input}
          value={messageIdToRead}
          onChangeText={setMessageIdToRead}
          placeholder={`Message id to mark read (latest: ${lastMessageId || 'none'})`}
        />
        <TouchableOpacity
          style={styles.button}
          onPress={async () => {
            if (!currentReadTarget) {
              appendLog('No message id available to mark read.');
              return;
            }

            const targetConversationId = conversationTargetId || conversationId;
            if (targetConversationId) {
              try {
                const res = await patchMessageReadEndpoint(
                  userId,
                  targetConversationId,
                  currentReadTarget
                );
                appendLog(`PATCH message read -> ${res.body.id} (${res.body.status})`);
                return;
              } catch (error) {
                appendLog(`Firestore read receipt failed: ${error.message}`);
              }
            }

            markMessageRead({ messageId: currentReadTarget, userId });
            appendLog(`Marked read (local fallback): ${currentReadTarget}`);
          }}
        >
          <Text style={styles.buttonText}>Emit message.read</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Offer + Approval Notifications</Text>
        <TextInput style={styles.input} value={offerItemTitle} onChangeText={setOfferItemTitle} placeholder="Item title" />
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            const offer = createOffer({
              fromUserId: userId,
              toUserId: peerUserId,
              itemTitle: offerItemTitle,
            });
            setOfferId(offer.offerId);
            appendLog(`Offer created: ${offer.offerId}`);
          }}
        >
          <Text style={styles.buttonText}>Create Offer Event</Text>
        </TouchableOpacity>
        <TextInput style={styles.input} value={offerId} onChangeText={setOfferId} placeholder="Offer id" />
        <View style={styles.row}>
          <TouchableOpacity
            style={styles.buttonHalf}
            onPress={() => {
              if (!offerId) {
                appendLog('Enter an offer id first.');
                return;
              }
              updateOfferStatus({ offerId, status: 'approved', changedByUserId: peerUserId });
              appendLog(`Offer approved: ${offerId}`);
            }}
          >
            <Text style={styles.buttonText}>Approve</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.buttonHalf}
            onPress={() => {
              if (!offerId) {
                appendLog('Enter an offer id first.');
                return;
              }
              updateOfferStatus({ offerId, status: 'declined', changedByUserId: peerUserId });
              appendLog(`Offer declined: ${offerId}`);
            }}
          >
            <Text style={styles.buttonText}>Decline</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notification Preferences Endpoints</Text>
        <View style={styles.switchRow}>
          <Text style={styles.switchLabel}>Messages</Text>
          <Switch
            value={preferences.messages}
            onValueChange={(value) => setPreferences((prev) => ({ ...prev, messages: value }))}
          />
        </View>
        <View style={styles.switchRow}>
          <Text style={styles.switchLabel}>Offers</Text>
          <Switch
            value={preferences.offers}
            onValueChange={(value) => setPreferences((prev) => ({ ...prev, offers: value }))}
          />
        </View>
        <View style={styles.switchRow}>
          <Text style={styles.switchLabel}>Approvals</Text>
          <Switch
            value={preferences.approvals}
            onValueChange={(value) => setPreferences((prev) => ({ ...prev, approvals: value }))}
          />
        </View>
        <View style={styles.switchRow}>
          <Text style={styles.switchLabel}>Quiet Hours</Text>
          <Switch
            value={preferences.quietHours.enabled}
            onValueChange={(value) =>
              setPreferences((prev) => ({
                ...prev,
                quietHours: { ...prev.quietHours, enabled: value },
              }))
            }
          />
        </View>
        <TextInput
          style={styles.input}
          value={preferences.quietHours.start}
          onChangeText={(value) =>
            setPreferences((prev) => ({
              ...prev,
              quietHours: { ...prev.quietHours, start: value },
            }))
          }
          placeholder="Quiet start (HH:mm)"
        />
        <TextInput
          style={styles.input}
          value={preferences.quietHours.end}
          onChangeText={(value) =>
            setPreferences((prev) => ({
              ...prev,
              quietHours: { ...prev.quietHours, end: value },
            }))
          }
          placeholder="Quiet end (HH:mm)"
        />
        <View style={styles.row}>
          <TouchableOpacity
            style={styles.buttonHalf}
            onPress={async () => {
              const res = await putNotificationPreferencesEndpoint(userId, preferences);
              setPreferences(res.body);
              appendLog(`PUT /notifications/preferences for ${userId}`);
            }}
          >
            <Text style={styles.buttonText}>PUT preferences</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.buttonHalf}
            onPress={async () => {
              const res = await getNotificationPreferencesEndpoint(userId);
              setPreferences(res.body);
              appendLog(`GET /notifications/preferences for ${userId}`);
            }}
          >
            <Text style={styles.buttonText}>GET preferences</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Device Token Endpoints</Text>
        <TextInput style={styles.input} value={tokenInput} onChangeText={setTokenInput} placeholder="Device token" />
        <View style={styles.row}>
          <TouchableOpacity
            style={styles.buttonHalf}
            onPress={async () => {
              await postDeviceTokenEndpoint(userId, { token: tokenInput, platform: 'expo' });
              await refreshPreferencesAndTokens(userId);
              appendLog(`POST /notifications/device-token for ${userId}`);
            }}
          >
            <Text style={styles.buttonText}>Register Token</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.buttonHalf}
            onPress={async () => {
              await deleteDeviceTokenEndpoint(userId, tokenInput);
              await refreshPreferencesAndTokens(userId);
              appendLog(`DELETE /notifications/device-token/${tokenInput}`);
            }}
          >
            <Text style={styles.buttonText}>Delete Token</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.infoText}>
          Registered tokens: {tokens.length ? tokens.map((token) => token.token).join(', ') : 'none'}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notification Feed</Text>
        <View style={styles.row}>
          <TouchableOpacity
            style={styles.buttonHalf}
            onPress={() => {
              refreshFeed();
              appendLog('Feed refreshed');
            }}
          >
            <Text style={styles.buttonText}>Refresh Feed</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.buttonHalf}
            onPress={() => {
              clearNotificationFeed();
              refreshFeed();
              appendLog('Feed cleared');
            }}
          >
            <Text style={styles.buttonText}>Clear Feed</Text>
          </TouchableOpacity>
        </View>
        {notificationFeed.length === 0 ? (
          <Text style={styles.mutedText}>No notifications yet.</Text>
        ) : (
          notificationFeed.slice(0, 10).map((entry) => (
            <View key={entry.id} style={styles.feedItem}>
              <Text style={styles.feedTitle}>
                {entry.delivered ? 'DELIVERED' : 'SUPPRESSED'}: {entry.title}
              </Text>
              <Text style={styles.feedBody}>{entry.body}</Text>
              <Text style={styles.feedMeta}>
                user={entry.userId} category={entry.category} reason={entry.reason || 'none'}
              </Text>
            </View>
          ))
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Realtime Event Log</Text>
        {logs.length === 0 ? (
          <Text style={styles.mutedText}>No events yet.</Text>
        ) : (
          logs.map((line, idx) => (
            <Text key={`${idx}-${line}`} style={styles.logLine}>
              {line}
            </Text>
          ))
        )}
      </View>
    </>
  );

  const Container = Platform.OS === 'web' ? View : SafeAreaView;

  return (
    <Container style={styles.container}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        nestedScrollEnabled
        showsVerticalScrollIndicator
        scrollEnabled
      >
        {labSections}
      </ScrollView>
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4EFE3',
    ...Platform.select({
      web: {
        height: '100vh',
        overflow: 'auto',
      },
    }),
  },
  scroll: {
    flex: 1,
    minHeight: 0,
    ...Platform.select({
      web: {
        overflow: 'auto',
      },
    }),
  },
  content: {
    padding: 16,
    paddingBottom: 120,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#13281F',
  },
  subTitle: {
    marginTop: 4,
    color: '#37594D',
    marginBottom: 12,
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#D7D1C3',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
    color: '#13281F',
  },
  input: {
    borderWidth: 1,
    borderColor: '#9AAEA6',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 8,
    color: '#13281F',
    backgroundColor: '#FBF9F3',
  },
  button: {
    backgroundColor: '#1F4035',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
    marginBottom: 8,
  },
  buttonMuted: {
    backgroundColor: '#567870',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  buttonHalf: {
    flex: 1,
    backgroundColor: '#1F4035',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
    marginRight: 6,
  },
  buttonText: {
    color: '#FAF7E8',
    fontWeight: '600',
    fontSize: 13,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 13,
    color: '#37594D',
    marginBottom: 8,
  },
  mutedText: {
    color: '#7A7A7A',
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  switchLabel: {
    color: '#13281F',
    fontWeight: '500',
  },
  feedItem: {
    borderWidth: 1,
    borderColor: '#D7D1C3',
    borderRadius: 8,
    padding: 8,
    marginBottom: 8,
    backgroundColor: '#FBF9F3',
  },
  feedTitle: {
    fontWeight: '700',
    color: '#13281F',
    fontSize: 13,
  },
  feedBody: {
    color: '#37594D',
    marginTop: 2,
  },
  feedMeta: {
    marginTop: 4,
    color: '#6A6A6A',
    fontSize: 12,
  },
  logLine: {
    fontSize: 12,
    color: '#21362E',
    marginBottom: 4,
  },
});
