import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import OfferCard from './OfferCard';

const BuyerConversationScreen = ({ navigation }) => {
  const [expanded, setExpanded] = useState(true);
  const [nudged, setNudged] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.icon}>←</Text>
        </TouchableOpacity>

        <Text style={styles.userName}>Arianna G</Text>

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
          availability="Dec 1 - Dec 7, 2025"
          status="Pending"
        />

        <View style={styles.messageBubbleRight}>
          <Text style={styles.messageText}>
            Great, I’ll finalize everything. Thank you so much!
          </Text>
        </View>

        <TouchableOpacity
          style={styles.nudgeButton}
          onPress={() => setNudged(true)}
        >
          <Text style={styles.nudgeText}>
            {nudged ? 'Seller Nudged' : 'Nudge Seller'}
          </Text>
        </TouchableOpacity>

        <View style={styles.waitingBox}>
          <Text style={styles.waitingText}>
            {nudged ? 'Nudge sent. Waiting for seller...' : 'Waiting for Seller...'}
          </Text>
          <Text style={styles.lockIcon}>🔒</Text>
        </View>
      </ScrollView>

      <View style={styles.inputBar}>
        <TextInput
          placeholder="Send Message"
          placeholderTextColor="#6B7280"
          style={styles.input}
        />
        <TouchableOpacity>
          <Text style={styles.sendIcon}>✈</Text>
        </TouchableOpacity>
      </View>
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
  messageBubbleRight: {
    alignSelf: 'flex-end',
    backgroundColor: '#F8F4EA',
    borderWidth: 1,
    borderColor: '#173528',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 14,
    maxWidth: '78%',
    marginBottom: 14,
  },
  messageText: {
    color: '#173528',
    fontSize: 13,
  },
  nudgeButton: {
    alignSelf: 'center',
    backgroundColor: '#F4A26A',
    borderRadius: 999,
    paddingHorizontal: 18,
    paddingVertical: 10,
    marginBottom: 18,
  },
  nudgeText: {
    color: '#173528',
    fontWeight: '600',
  },
  waitingBox: {
    borderWidth: 1,
    borderColor: '#AEB6A7',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  waitingText: {
    color: '#8B8B8B',
    fontSize: 13,
  },
  lockIcon: {
    fontSize: 16,
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

export default BuyerConversationScreen;