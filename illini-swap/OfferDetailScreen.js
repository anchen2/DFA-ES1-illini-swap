import React, { useContext } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { OffersContext } from './OffersContext';

// ── UTILS COPIED FROM AvailabilityScreen ──────────────────────────────────────
const getNextTwoWeeks = () => {
  const arr = [];
  const today = new Date();
  for (let i = 0; i < 14; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    arr.push({
      label: d.toLocaleDateString('en-US', { weekday: 'short' }),
      day:   d.getDate(),
    });
  }
  return arr;
};

const generateTimes = () => {
  const times = [];
  for (let h = 9; h < 24; h++) {
    ['00','30'].forEach(min => {
      const date = new Date();
      date.setHours(h, parseInt(min), 0);
      const hours12 = date.getHours() % 12 === 0 ? 12 : date.getHours() % 12;
      const ampm    = date.getHours() < 12 ? 'AM' : 'PM';
      times.push(`${hours12}:${min} ${ampm}`);
    });
  }
  return times;
};
// ────────────────────────────────────────────────────────────────────────────────

export default function OfferDetailScreen() {
  const { id } = useRoute().params;
  const navigation = useNavigation();
  const { offers, updateOfferStatus } = useContext(OffersContext);

  const offer = offers.find(o => o.id === id);
  if (!offer) {
    return (
      <SafeAreaView style={styles.center}>
        <Text>Offer not found.</Text>
      </SafeAreaView>
    );
  }

  // turn ["2-18","2-19"] into human strings like "Wed 25 at 6:00 PM"
  const dates = getNextTwoWeeks();
  const times = generateTimes();
  const humanAvailability = offer.availability.map(key => {
    const [dateIdx, timeIdx] = key.split('-').map(Number);
    const d = dates[dateIdx];
    return `${d.label} ${d.day} at ${times[timeIdx]}`;
  });

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
      <Text style={styles.header}>Offer Details</Text>
      <Image
        source={offer.image || require('./icons/profile.png')}
        style={styles.image}
      />
      <Text style={styles.title}>{offer.title}</Text>
      <Text style={styles.sectionTitle}>Price:</Text>
      <Text style={styles.price}>{offer.price}</Text>
      <Text style={styles.sectionTitle}>Meeting Place:</Text>
      <Text style={styles.value}>{offer.meetingPlace}</Text>
        {/* … your existing fields … */}
        <Text style={styles.sectionTitle}>Your Availability</Text>
        {humanAvailability.length
          ? humanAvailability.map((s, i) => (
              <Text key={i} style={styles.slotText}>• {s}</Text>
            ))
          : <Text style={styles.emptyText}>No slots selected.</Text>
        }

        <View style={styles.buttonsRow}>
        <TouchableOpacity
            style={[
            styles.btn,
            offer.status === 'approved' 
                ? styles.acceptActive 
                : styles.accept
            ]}
            onPress={() => {
                updateOfferStatus(id, 'approved');
                navigation.goBack();
            }}
        >
            <Text style={styles.btnText}>
            {offer.status === 'approved' ? 'Accepted ✓' : 'Accept'}
            </Text>
        </TouchableOpacity>
        <TouchableOpacity
            style={[
            styles.btn,
            offer.status === 'declined'
                ? styles.declineActive
                : styles.decline
            ]}
            onPress={() => {
                updateOfferStatus(id, 'declined');
                navigation.goBack();
            }}
        >
            <Text style={styles.btnText}>
            {offer.status === 'declined' ? 'Denied ✕' : 'Deny'}
            </Text>
        </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
    container:      { flex:1, backgroundColor:'#FAF7E8', padding:16 },
  header:         { fontSize:24, fontWeight:'600', textAlign:'center', marginVertical:12, color:'#13281F' },
  image:          { width:100, height:100, borderRadius:8, alignSelf:'center', marginBottom:16, backgroundColor:'#DDD' },
  title:          { fontSize:20, fontWeight:'600', color:'#13281F', textAlign:'center', marginBottom:8 },
  price:          { fontSize:16, color:'#13281F', marginBottom:8 },
  label:          { fontSize:14, fontWeight:'500', color:'#13281F', marginTop:8 },
  value:          { fontSize:16, color:'#13281F', marginTop:1, marginBottom: 8 },
  buttons:        { flexDirection:'row', justifyContent:'space-around', marginTop:24 },
  button:         { flex:1, marginHorizontal:8, paddingVertical:12, borderRadius:8, alignItems:'center' },
  accept:         { backgroundColor:'#A3D9A5' },
  decline:        { backgroundColor:'#F8A5A5' },
  buttonText:     { color:'#fff', fontWeight:'600' },
  errorText:      { color:'#F00', textAlign:'center', marginTop:20 },
  container:    { flex: 1, backgroundColor: '#FAF7E8' },
  center:       { flex: 1, justifyContent: 'center', alignItems: 'center' },
  sectionTitle: { fontSize: 18, fontWeight: '600', marginBottom: 4 },
  slotText:     { fontSize: 16, marginVertical: 4 },
  emptyText:    { color: '#777', fontStyle: 'italic' },
  buttonsRow:   { flexDirection: 'row', justifyContent: 'space-around', marginTop: 24 },
  btn:          { flex: 1, padding: 14, borderRadius: 10, alignItems: 'center', marginHorizontal: 8 },
  accept:      { backgroundColor: '#A3D9A5' },
  decline:     { backgroundColor: '#F8A5A5' },
  btnText:      { fontWeight: '600', color: '#13281F' },
});