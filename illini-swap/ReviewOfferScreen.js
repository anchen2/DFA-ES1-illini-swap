// ReviewOfferScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Modal,
  FlatList,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';

/* ── common UIUC meetup locations ───────────────────────────── */
const MEETING_SPOTS = [
  'Illini Union',
  'ECEB Lobby',
  'Grainger Library',
  'Main Quad',
  'Siebel Center Atrium',
  'Krannert Turn‑around',
  'ISR Lobby',
];

export default function ReviewOfferScreen() {
  const navigation = useNavigation();
  const { title, price, seller } = useRoute().params;   // ⬅ availability removed

  /* state */
  const [meetingPlace, setMeetingPlace] = useState('Illini Union');
  const [showDropdown, setShowDropdown] = useState(false);

  /* render one row in dropdown */
  const renderSpot = ({ item }) => (
    <Pressable
      style={styles.spotRow}
      onPress={() => {
        setMeetingPlace(item);
        setShowDropdown(false);
      }}
    >
      <Text style={styles.spotText}>{item}</Text>
    </Pressable>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={navigation.goBack}>
          <Image source={require('./icons/back.png')} style={styles.backIcon} />
        </TouchableOpacity>
      </View>

      <Text style={styles.title}>{title}</Text>

      {/* seller card */}
      <View style={styles.sellerBox}>
        <Image source={require('./icons/profile.png')} style={styles.profilePic} />
        <View style={styles.sellerInfo}>
          <Text style={styles.sellerName}>{seller.name}</Text>
          <Text style={styles.sellerRating}>⭐️ {seller.rating}</Text>
        </View>
      </View>

      {/* meeting place row */}
      <View style={styles.infoBox}>
        <Text style={styles.infoLabel} numberOfLines={1}>
          Meeting Place: {meetingPlace}
        </Text>
        <TouchableOpacity
          style={styles.changeBtn}
          onPress={() => setShowDropdown(true)}
        >
          <Text style={styles.changeText}>Change</Text>
        </TouchableOpacity>
      </View>

      {/* price row */}
      <View style={styles.infoBox}>
        <Text style={styles.infoLabel}>Offer Price: ${price}</Text>
        <TouchableOpacity style={styles.changeBtn}>
          <Text style={styles.changeText}>Change</Text>
        </TouchableOpacity>
      </View>

      {/* pushes Save button to bottom */}
      <View style={{ flex: 1 }} />

      {/* save / send offer */}
      <TouchableOpacity
        style={styles.sendOfferBtn}
        onPress={() =>
          navigation.navigate('Home', { meetingPlace /* include if needed */ })
        }
      >
        <Text style={styles.sendOfferText}>Save</Text>
      </TouchableOpacity>

      {/* dropdown modal */}
      <Modal
        visible={showDropdown}
        transparent
        animationType="fade"
        onRequestClose={() => setShowDropdown(false)}
      >
        <Pressable
          style={styles.backdrop}
          onPress={() => setShowDropdown(false)}
        >
          <View style={styles.dropdown}>
            <FlatList
              data={MEETING_SPOTS}
              keyExtractor={(item) => item}
              renderItem={renderSpot}
              showsVerticalScrollIndicator={false}
            />
          </View>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAF7E8', padding: 24 },
  header: { flexDirection: 'row', alignItems: 'center' },
  backIcon: { width: 24, height: 24 },
  title: { fontSize: 24, fontWeight: '600', marginTop: 16, color: '#13281F' },

  /* seller */
  sellerBox: {
    width: '100%',
    height: 79,
    borderRadius: 20,
    backgroundColor: '#DCE5E2',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginTop: 24,
  },
  profilePic: { width: 55, height: 55, borderRadius: 27.5, backgroundColor: '#FFF' },
  sellerInfo: { marginLeft: 12 },
  sellerName: { fontSize: 18, fontWeight: '600', color: '#13281F' },
  sellerRating: { fontSize: 14, color: '#13281F', marginTop: 4 },

  /* info rows */
  infoBox: {
    width: '100%',
    minHeight: 67,
    borderRadius: 20,
    backgroundColor: '#FFF5E6',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginTop: 16,
  },
  infoLabel: { fontSize: 16, color: '#13281F', flex: 1, marginRight: 12 },
  changeBtn: {
    backgroundColor: '#FFA07A',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  changeText: { color: '#FFF', fontSize: 14 },

  /* save */
  sendOfferBtn: {
    backgroundColor: '#1F4035',
    height: 56,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendOfferText: { color: '#FFF', fontSize: 18, fontWeight: '600' },

  /* dropdown */
  backdrop: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0002',
  },
  dropdown: {
    width: '80%',
    maxHeight: 320,
    backgroundColor: '#FFF',
    borderRadius: 16,
    paddingVertical: 8,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  spotRow: { paddingVertical: 12, paddingHorizontal: 20 },
  spotText: { fontSize: 16, color: '#13281F' },
});
