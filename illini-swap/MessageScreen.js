import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebaseConfig';
import {
  getConversationsEndpoint,
  postConversationEndpoint,
} from './services/api/FirestoreConversationApi';

function shortUserId(userId) {
  if (!userId) {
    return 'Unknown user';
  }
  if (userId.length <= 14) {
    return userId;
  }
  return `${userId.slice(0, 6)}...${userId.slice(-4)}`;
}

function formatActivityLabel(updatedAtIso) {
  if (!updatedAtIso) {
    return 'No activity yet';
  }

  const date = new Date(updatedAtIso);
  if (Number.isNaN(date.getTime())) {
    return 'No activity yet';
  }
  return date.toLocaleString();
}

function toConversationItem(conversation, currentUserId) {
  const participantIds = conversation?.participantIds || [];
  const peerUserId =
    participantIds.find((participantId) => participantId !== currentUserId) || '';

  return {
    id: conversation?.id || '',
    conversationId: conversation?.id || '',
    peerUserId,
    title: shortUserId(peerUserId),
    direction: conversation?.createdBy === currentUserId ? 'sent' : 'received',
    status: conversation?.status || 'active',
    preview: conversation?.lastMessageText || 'Tap to start the thread',
    updatedAt: conversation?.updatedAt || null,
    createdBy: conversation?.createdBy || '',
    participantIds,
  };
}

function toStatusLabel(status) {
  if (!status) {
    return 'Unknown';
  }
  return `${status.charAt(0).toUpperCase()}${status.slice(1)}`;
}

const MessageScreen = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState('sent');
  const [currentUserId, setCurrentUserId] = useState(auth.currentUser?.uid || '');
  const [conversations, setConversations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isStartingConversation, setIsStartingConversation] = useState(false);
  const [peerUserIdInput, setPeerUserIdInput] = useState('');
  const [errorText, setErrorText] = useState('');

  const loadConversations = useCallback(async () => {
    const sessionUserId = auth.currentUser?.uid || '';

    if (!sessionUserId) {
      setCurrentUserId('');
      setConversations([]);
      setErrorText('Sign in to view Firestore conversations.');
      setIsLoading(false);
      return;
    }

    setCurrentUserId(sessionUserId);
    setErrorText('');
    setIsLoading(true);

    try {
      const response = await getConversationsEndpoint(sessionUserId, {
        direction: 'all',
      });
      setConversations(Array.isArray(response.body) ? response.body : []);
    } catch (error) {
      setConversations([]);
      setErrorText(error.message || 'Failed to load conversations.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, () => {
      loadConversations().catch(() => {
        setErrorText('Failed to refresh auth session.');
      });
    });

    return () => {
      unsubscribe();
    };
  }, [loadConversations]);

  useFocusEffect(
    useCallback(() => {
      loadConversations().catch(() => {
        setErrorText('Failed to load conversations.');
      });
    }, [loadConversations])
  );

  const items = useMemo(() => {
    return conversations
      .map((conversation) => toConversationItem(conversation, currentUserId))
      .filter((item) => item.direction === activeTab);
  }, [activeTab, conversations, currentUserId]);

  const getStatusStyle = (status) => {
    if (status === 'closed') {
      return styles.declined;
    }
    if (status === 'archived') {
      return styles.pending;
    }
    return styles.approved;
  };

  const openConversation = (conversation) => {
    const participantIds = conversation?.participantIds || [];
    const peerUserId =
      participantIds.find((participantId) => participantId !== currentUserId) || '';
    const targetScreen =
      conversation?.createdBy === currentUserId
        ? 'BuyerConversation'
        : 'SellerConversation';

    navigation.navigate(targetScreen, {
      conversationId: conversation?.id || '',
      currentUserId,
      peerUserId,
      title: shortUserId(peerUserId),
      conversationStatus: conversation?.status || 'active',
      offerStatus: 'Pending',
    });
  };

  const handleStartConversation = async () => {
    const peerUserId = peerUserIdInput.trim();

    if (!currentUserId) {
      setErrorText('Sign in first to start messaging.');
      return;
    }
    if (!peerUserId) {
      setErrorText('Enter another user Firebase UID.');
      return;
    }
    if (peerUserId === currentUserId) {
      setErrorText('You cannot create a conversation with your own UID.');
      return;
    }

    setIsStartingConversation(true);
    setErrorText('');

    try {
      const response = await postConversationEndpoint(currentUserId, {
        peerUserId,
        status: 'active',
      });
      const conversation = response?.body?.conversation;

      setPeerUserIdInput('');
      await loadConversations();

      if (conversation) {
        openConversation(conversation);
      }
    } catch (error) {
      setErrorText(error.message || 'Failed to start conversation.');
    } finally {
      setIsStartingConversation(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>{'<'}</Text>
        </TouchableOpacity>
        <Text style={styles.headerText}>Messages</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.composeCard}>
        <Text style={styles.composeTitle}>Start Conversation by Firebase UID</Text>
        <Text style={styles.composeSubTitle}>
          Signed in as: {currentUserId || 'not signed in'}
        </Text>
        <TextInput
          value={peerUserIdInput}
          onChangeText={setPeerUserIdInput}
          placeholder="Enter other user UID"
          autoCapitalize="none"
          style={styles.input}
        />
        <TouchableOpacity
          style={[
            styles.startButton,
            (!currentUserId || isStartingConversation) && styles.startButtonDisabled,
          ]}
          disabled={!currentUserId || isStartingConversation}
          onPress={handleStartConversation}
        >
          <Text style={styles.startButtonText}>
            {isStartingConversation ? 'Starting...' : 'Start or Open Conversation'}
          </Text>
        </TouchableOpacity>
      </View>

      {errorText ? <Text style={styles.errorText}>{errorText}</Text> : null}

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'sent' && styles.activeTab]}
          onPress={() => setActiveTab('sent')}
        >
          <Text style={[styles.tabText, activeTab === 'sent' && styles.activeTabText]}>
            Sent
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'received' && styles.activeTab]}
          onPress={() => setActiveTab('received')}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'received' && styles.activeTabText,
            ]}
          >
            Received
          </Text>
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator color="#173528" />
          <Text style={styles.loadingText}>Loading conversations...</Text>
        </View>
      ) : (
        <ScrollView>
          {items.length === 0 ? (
            <Text style={styles.emptyText}>No conversations in this tab yet.</Text>
          ) : (
            items.map((item) => (
              <TouchableOpacity
                key={item.conversationId}
                style={styles.messageRow}
                onPress={() => openConversation(item)}
              >
                <View style={styles.avatarPlaceholder}>
                  <Image source={require('./icons/nav-user-square.png')} style={styles.avatarIcon} />
                </View>

                <View style={styles.messageInfo}>
                  <Text style={styles.name}>{item.title}</Text>
                  <Text style={styles.time}>{formatActivityLabel(item.updatedAt)}</Text>
                  <Text style={styles.previewText}>{item.preview}</Text>
                </View>

                <View style={[styles.statusPill, getStatusStyle(item.status)]}>
                  <Text style={styles.statusText}>{toStatusLabel(item.status)}</Text>
                </View>
              </TouchableOpacity>
            ))
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF7E8',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  backText: {
    fontSize: 22,
    color: '#13281F',
  },
  headerText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#13281F',
  },
  composeCard: {
    marginHorizontal: 16,
    marginBottom: 10,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D7DDD6',
    borderRadius: 12,
    padding: 12,
  },
  composeTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#13281F',
    marginBottom: 4,
  },
  composeSubTitle: {
    color: '#6C7A74',
    fontSize: 12,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#9FB0AA',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 8,
    color: '#13281F',
    backgroundColor: '#FAF7E8',
  },
  startButton: {
    backgroundColor: '#173528',
    borderRadius: 8,
    alignItems: 'center',
    paddingVertical: 10,
  },
  startButtonDisabled: {
    opacity: 0.5,
  },
  startButtonText: {
    color: '#FAF7E8',
    fontWeight: '600',
  },
  errorText: {
    color: '#AF2D2D',
    fontSize: 12,
    marginHorizontal: 16,
    marginBottom: 8,
  },
  tabContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#173528',
    marginHorizontal: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  activeTab: {
    borderWidth: 1,
    borderBottomWidth: 0,
    borderColor: '#173528',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    backgroundColor: '#FAF7E8',
  },
  tabText: {
    fontSize: 14,
    color: '#7B8B84',
  },
  activeTabText: {
    color: '#13281F',
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 8,
    color: '#37594D',
  },
  emptyText: {
    marginHorizontal: 16,
    marginTop: 16,
    color: '#6C7A74',
  },
  messageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderColor: '#C9CEC8',
    marginHorizontal: 16,
  },
  avatarPlaceholder: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#E3E3E3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarIcon: {
    width: 22,
    height: 22,
    tintColor: '#37594D',
  },
  messageInfo: {
    flex: 1,
    marginLeft: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#13281F',
  },
  time: {
    fontSize: 13,
    color: '#6C7A74',
  },
  previewText: {
    fontSize: 12,
    color: '#8A958F',
    marginTop: 4,
  },
  statusPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#13281F',
  },
  approved: {
    backgroundColor: '#52B788',
  },
  pending: {
    backgroundColor: '#F4A261',
  },
  declined: {
    backgroundColor: '#EB5757',
  },
});

export default MessageScreen;
