import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute } from '@react-navigation/native';
import OfferCard from './OfferCard';
import ApprovalModal from './ApprovalModal';
import {
  listConversationMessages,
  markMessageRead,
  onEvent,
  sendMessage,
} from './services/realtime/RealtimeService';

const SellerConversationScreen = ({ navigation }) => {
  const route = useRoute();
  const conversationId = route.params?.conversationId || 'seller-thread-1';
  const currentUserId = route.params?.currentUserId || 'dev-user-b';
  const peerUserId = route.params?.peerUserId || 'dev-user-a';
  const threadTitle = route.params?.title || route.params?.user?.name || 'Conversation';
  const [expanded, setExpanded] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [offerStatus, setOfferStatus] = useState('Pending');
  const [draft, setDraft] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const syncMessages = () => {
      setMessages(listConversationMessages(conversationId));
    };

    syncMessages();

    const unsubscribe = onEvent((event) => {
      if (event.payload?.conversationId === conversationId) {
        syncMessages();
      }
    });

    return unsubscribe;
  }, [conversationId]);

  useEffect(() => {
    const unreadMessage = [...messages]
      .reverse()
      .find((message) => message.senderId !== currentUserId && !message.readBy.includes(currentUserId));

    if (unreadMessage) {
      markMessageRead({ messageId: unreadMessage.id, userId: currentUserId });
    }
  }, [messages, currentUserId]);

  const sortedMessages = useMemo(() => messages, [messages]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.icon}>←</Text>
        </TouchableOpacity>

        <Text style={styles.userName}>{threadTitle}</Text>

        <TouchableOpacity>
          <Text style={styles.icon}>⋮</Text>
        </TouchableOpacity>
      </View>

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

        {sortedMessages.map((message) => {
          const isMine = message.senderId === currentUserId;
          return (
            <View
              key={message.id}
              style={isMine ? styles.messageBubbleRight : styles.messageBubbleLeft}
            >
              <Text style={styles.messageText}>{message.body}</Text>
            </View>
          );
        })}
      </ScrollView>

      <View style={styles.inputBar}>
        <TextInput
          placeholder="Send Message"
          placeholderTextColor="#6B7280"
          style={styles.input}
          value={draft}
          onChangeText={setDraft}
        />
        <TouchableOpacity
          onPress={() => {
            const trimmed = draft.trim();
            if (!trimmed) {
              return;
            }

            sendMessage({
              conversationId,
              senderId: currentUserId,
              recipientId: peerUserId,
              body: trimmed,
            });
            setDraft('');
            setMessages(listConversationMessages(conversationId));
          }}
        >
          <Text style={styles.sendIcon}>✈</Text>
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
    fontSize: 22,
    color: '#173528',
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 20,
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
  sendIcon: {
    fontSize: 18,
    color: '#173528',
    paddingLeft: 8,
  },
});

export default SellerConversationScreen;