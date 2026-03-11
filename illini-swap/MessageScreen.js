import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const sentOffers = [
  {
    id: 1,
    name: 'Lucas N.',
    time: 'sent 1 hr ago',
    status: 'Approved',
    //avatar: 'https://i.pravatar.cc/100?img=1',
  },
  {
    id: 2,
    name: 'Arianna G.',
    time: 'sent 1 hr ago',
    status: 'Pending',
    //avatar: 'https://i.pravatar.cc/100?img=2',
  },
  {
    id: 3,
    name: 'Cynthia E.',
    time: 'sent 1 hr ago',
    status: 'Declined',
    //avatar: 'https://i.pravatar.cc/100?img=3',
  },
];

const receivedOffers = [
  {
    id: 1,
    name: 'Johnny B.',
    time: 'received 1 hr ago',
    status: 'Pending',
  },
  {
    id: 2,
    name: 'Monty M.',
    time: 'received 1 hr ago',
    status: 'Pending',
  },
];

const MessageScreen = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState('sent');
  const data = activeTab === 'sent' ? sentOffers : receivedOffers;

  const getStatusStyle = (status) => {
    if (status === 'Approved') return styles.approved;
    if (status === 'Declined') return styles.declined;
    return styles.pending;
  };

  const handlePress = (item) => {
    if (activeTab === 'sent') {
      navigation.navigate('BuyerConversation', { user: item });
    } else {
      navigation.navigate('SellerConversation', { user: item });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerText}>Messages</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'sent' && styles.activeTab]}
          onPress={() => setActiveTab('sent')}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'sent' && styles.activeTabText,
            ]}
          >
            Sent Offers
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
            Received Offers
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView>
        {data.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.messageRow}
            onPress={() => handlePress(item)}
          >
            {item.avatar ? (
              <Image source={{ uri: item.avatar }} style={styles.avatar} />
            ) : (
              <View style={styles.avatarPlaceholder} />
            )}

            <View style={styles.messageInfo}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.time}>{item.time}</Text>
            </View>

            <View style={[styles.statusPill, getStatusStyle(item.status)]}>
              <Text style={styles.statusText}>{item.status}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
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
  messageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderColor: '#C9CEC8',
    marginHorizontal: 16,
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
  },
  avatarPlaceholder: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#E3E3E3',
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