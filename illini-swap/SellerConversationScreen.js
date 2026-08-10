import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute } from '@react-navigation/native';
import { onAuthStateChanged } from 'firebase/auth';
import OfferCard from './OfferCard';
import ApprovalModal from './ApprovalModal';
import { auth } from './firebaseConfig';
import {
  getConversationEndpoint,
  patchMessageReadEndpoint,
  postMessageEndpoint,
  subscribeToMessagesEndpoint,
} from './services/api/FirestoreConversationApi';

function shortUserId(userId) {
  if (!userId) {
    return 'Conversation';
  }
  if (userId.length <= 14) {
    return userId;
  }
  return `${userId.slice(0, 6)}...${userId.slice(-4)}`;
}

function sortMessagesAscending(items) {
  return [...items].sort((left, right) => {
    const leftTime = left?.createdAt ? new Date(left.createdAt).getTime() : 0;
    const rightTime = right?.createdAt ? new Date(right.createdAt).getTime() : 0;
    return leftTime - rightTime;
  });
}

function getPeerUserId(participantIds, currentUserId) {
  return (participantIds || []).find((participantId) => participantId !== currentUserId) || '';
}

const SellerConversationScreen = ({ navigation }) => {
  const route = useRoute();
  const conversationId = route.params?.conversationId || '';
  const [currentUserId, setCurrentUserId] = useState(
    auth.currentUser?.uid || route.params?.currentUserId || ''
  );
  const [peerUserId, setPeerUserId] = useState(route.params?.peerUserId || '');
  const [threadTitle, setThreadTitle] = useState(
    route.params?.title || shortUserId(route.params?.peerUserId || '')
  );
  const [expanded, setExpanded] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [offerStatus, setOfferStatus] = useState(route.params?.offerStatus || 'Pending');
  const [draft, setDraft] = useState('');
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorText, setErrorText] = useState('');
  const readInFlightRef = useRef(new Set());

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        setCurrentUserId('');
        setMessages([]);
        setIsLoading(false);
        setErrorText('Sign in to view this conversation.');
        return;
      }
      setCurrentUserId(user.uid);
      setErrorText('');
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const loadConversation = useCallback(async () => {
    if (!conversationId) {
      setIsLoading(false);
      setErrorText('Conversation id is missing.');
      return;
    }
    if (!currentUserId) {
      setIsLoading(false);
      setErrorText('Sign in to load messages.');
      return;
    }

    setIsLoading(true);
    setErrorText('');

    try {
      const response = await getConversationEndpoint(currentUserId, conversationId);
      const conversation = response.body;
      const peerFromConversation = getPeerUserId(
        conversation.participantIds,
        currentUserId
      );

      setMessages(sortMessagesAscending(conversation.messages || []));
      if (peerFromConversation) {
        setPeerUserId(peerFromConversation);
        if (!route.params?.title) {
          setThreadTitle(shortUserId(peerFromConversation));
        }
      }
    } catch (error) {
      setErrorText(error.message || 'Failed to load conversation.');
      setMessages([]);
    } finally {
      setIsLoading(false);
    }
  }, [conversationId, currentUserId, route.params?.title]);

  useEffect(() => {
    loadConversation().catch(() => {
      setErrorText('Failed to load conversation.');
    });
  }, [loadConversation]);

  useEffect(() => {
    if (!conversationId || !currentUserId) {
      return undefined;
    }

    let unsubscribe = () => {};

    try {
      unsubscribe = subscribeToMessagesEndpoint(
        currentUserId,
        conversationId,
        (nextMessages) => {
          setMessages(sortMessagesAscending(nextMessages || []));
        },
        (error) => {
          setErrorText(error.message || 'Live message stream failed.');
        }
      );
    } catch (error) {
      setErrorText(error.message || 'Failed to start live message stream.');
    }

    return () => {
      unsubscribe();
    };
  }, [conversationId, currentUserId]);

  useEffect(() => {
    if (!currentUserId || !conversationId || messages.length === 0) {
      return;
    }

    const unread = messages.filter(
      (message) =>
        message.senderId &&
        message.senderId !== currentUserId &&
        message.status !== 'read' &&
        !readInFlightRef.current.has(message.id)
    );

    if (unread.length === 0) {
      return;
    }

    unread.forEach((message) => {
      readInFlightRef.current.add(message.id);
    });

    Promise.allSettled(
      unread.map((message) =>
        patchMessageReadEndpoint(currentUserId, conversationId, message.id)
      )
    ).finally(() => {
      unread.forEach((message) => {
        readInFlightRef.current.delete(message.id);
      });
    });
  }, [conversationId, currentUserId, messages]);

  const handleSend = async () => {
    const trimmedBody = draft.trim();
    if (!trimmedBody) {
      return;
    }
    if (!currentUserId) {
      setErrorText('Sign in to send a message.');
      return;
    }
    if (!conversationId) {
      setErrorText('Conversation id is missing.');
      return;
    }
    if (!peerUserId) {
      setErrorText('Cannot determine the peer user for this conversation.');
      return;
    }

    try {
      await postMessageEndpoint(currentUserId, conversationId, {
        body: trimmedBody,
        status: 'sent',
      });
      setDraft('');
    } catch (error) {
      setErrorText(error.message || 'Failed to send message.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.icon}>{'<'}</Text>
        </TouchableOpacity>

        <Text style={styles.userName}>{threadTitle || 'Conversation'}</Text>

        <TouchableOpacity>
          <Text style={styles.icon}>...</Text>
        </TouchableOpacity>
      </View>

      {errorText ? <Text style={styles.errorText}>{errorText}</Text> : null}

      <ScrollView contentContainerStyle={styles.content}>
        <OfferCard
          expanded={expanded}
          onToggle={() => setExpanded(!expanded)}
          itemName="Item Name"
          itemImage={null}
          price="20"
          location="Illini Union"
          availability={'12/12/24 5:30 pm\n12/23/24 11:00 am'}
          status={offerStatus}
          showApproveButton={true}
          onApprove={() => setModalVisible(true)}
        />

        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator color="#173528" />
            <Text style={styles.loadingText}>Loading messages...</Text>
          </View>
        ) : messages.length === 0 ? (
          <Text style={styles.emptyText}>No messages yet. Send the first message.</Text>
        ) : (
          messages.map((message) => {
            const isMine = message.senderId === currentUserId;
            return (
              <View
                key={message.id}
                style={isMine ? styles.messageBubbleRight : styles.messageBubbleLeft}
              >
                <Text style={styles.messageText}>{message.body}</Text>
              </View>
            );
          })
        )}
      </ScrollView>

      <View style={styles.inputBar}>
        <TextInput
          placeholder="Send Message"
          placeholderTextColor="#6B7280"
          style={styles.input}
          value={draft}
          onChangeText={setDraft}
        />
        <TouchableOpacity onPress={handleSend}>
          <Text style={styles.sendAction}>Send</Text>
        </TouchableOpacity>
      </View>

      <ApprovalModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onConfirm={() => {
          setOfferStatus('Approved');
          setModalVisible(false);
          navigation.navigate('SwapConfirmation');
        }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF7E8',
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  userName: {
    fontSize: 24,
    color: '#173528',
    fontWeight: '600',
  },
  icon: {
    fontSize: 20,
    color: '#173528',
  },
  errorText: {
    color: '#AF2D2D',
    fontSize: 12,
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  loadingContainer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 8,
    color: '#37594D',
  },
  emptyText: {
    color: '#6C7A74',
    marginBottom: 12,
  },
  messageBubbleLeft: {
    alignSelf: 'flex-start',
    backgroundColor: '#F8F4EA',
    borderWidth: 1,
    borderColor: '#173528',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 14,
    maxWidth: '78%',
    marginBottom: 12,
  },
  messageText: {
    color: '#173528',
    fontSize: 13,
  },
  messageBubbleRight: {
    alignSelf: 'flex-end',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D7DDD6',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 14,
    maxWidth: '78%',
    marginBottom: 12,
  },
  inputBar: {
    margin: 16,
    borderWidth: 1,
    borderColor: '#173528',
    borderRadius: 12,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAF7E8',
  },
  input: {
    flex: 1,
    paddingVertical: 10,
    color: '#173528',
  },
  sendAction: {
    fontSize: 14,
    color: '#173528',
    fontWeight: '600',
    paddingLeft: 8,
  },
});

export default SellerConversationScreen;
