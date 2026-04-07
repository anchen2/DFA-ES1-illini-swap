import React, { useEffect, useMemo, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Switch,
} from 'react-native';
import {
  createOffer,
  getCurrentUserId,
  getPresence,
  markMessageRead,
  onEvent,
  sendMessage,
  setCurrentUserId,
  updateOfferStatus,
  updatePresence,
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
  putNotificationPreferencesEndpoint,
} from './services/api/MockRealtimeApi';

function timestamp() {
  return new Date().toLocaleTimeString();
}

export default function RealtimeLabScreen() {
  const [userId, setUserId] = useState(getCurrentUserId());
  const [peerUserId, setPeerUserId] = useState('dev-user-b');
  const [conversationId, setConversationId] = useState('conv-1');
  const [messageBody, setMessageBody] = useState('Hello from Illini Swap realtime lab');
  const [messageIdToRead, setMessageIdToRead] = useState('');
  const [lastMessageId, setLastMessageId] = useState('');
  const [offerItemTitle, setOfferItemTitle] = useState('Desk lamp');
  const [offerId, setOfferId] = useState('');
  const [tokenInput, setTokenInput] = useState('dev-token-001');
  const [tokens, setTokens] = useState([]);
  const [presenceState, setPresenceState] = useState(getPresence(getCurrentUserId()));
  const [preferences, setPreferences] = useState({
    messages: true,
    offers: true,
    approvals: true,
    quietHours: { enabled: false, start: '22:00', end: '07:00' },
  });
  const [logs, setLogs] = useState([]);
  const [notificationFeed, setNotificationFeed] = useState([]);

  const currentReadTarget = messageIdToRead || lastMessageId;

  function appendLog(line) {
    setLogs((prev) => [`[${timestamp()}] ${line}`, ...prev].slice(0, 80));
  }

  async function refreshPreferencesAndTokens(targetUserId) {
    const prefsResult = await getNotificationPreferencesEndpoint(targetUserId);
    const tokenResult = await listDeviceTokensEndpoint(targetUserId);
    setPreferences(prefsResult.body);
    setTokens(tokenResult.body.tokens);
  }

  function refreshFeed() {
    setNotificationFeed(getNotificationFeed());
  }

  useEffect(() => {
    initializeNotificationBridge();
    refreshPreferencesAndTokens(userId);
    refreshFeed();

    const unsubscribe = onEvent((event) => {
      appendLog(`${event.type} (${event.id})`);
      setPresenceState(getPresence(getCurrentUserId()));
      refreshFeed();
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const presenceLabel = useMemo(() => {
    if (presenceState.online) {
      return `Online (last seen ${presenceState.lastSeenAt || 'n/a'})`;
    }
    return `Offline (last seen ${presenceState.lastSeenAt || 'n/a'})`;
  }, [presenceState]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Realtime + Notifications Lab</Text>
        <Text style={styles.subTitle}>Use this screen to test your deliverable end to end.</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Identity</Text>
          <TextInput style={styles.input} value={userId} onChangeText={setUserId} placeholder="Current user id" />
          <TextInput style={styles.input} value={peerUserId} onChangeText={setPeerUserId} placeholder="Peer user id" />
          <TouchableOpacity
            style={styles.button}
            onPress={async () => {
              setCurrentUserId(userId);
              setPresenceState(getPresence(userId));
              await refreshPreferencesAndTokens(userId);
              appendLog(`Switched current user to ${userId}`);
            }}
          >
            <Text style={styles.buttonText}>Apply User Context</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Presence</Text>
          <Text style={styles.infoText}>{presenceLabel}</Text>
          <View style={styles.row}>
            <TouchableOpacity
              style={styles.buttonHalf}
              onPress={() => {
                const next = updatePresence({ userId, online: true });
                setPresenceState(next);
              }}
            >
              <Text style={styles.buttonText}>Set Online</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.buttonHalf}
              onPress={() => {
                const next = updatePresence({ userId, online: false });
                setPresenceState(next);
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
            onPress={() => {
              if (!currentReadTarget) {
                appendLog('No message id available to mark read.');
                return;
              }
              markMessageRead({ messageId: currentReadTarget, userId });
              appendLog(`Marked read: ${currentReadTarget}`);
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
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4EFE3',
  },
  content: {
    padding: 16,
    paddingBottom: 40,
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

