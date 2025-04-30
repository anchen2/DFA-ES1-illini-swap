// ReviewOfferScreen.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';

const ReviewOfferScreen = () => {
  const navigation = useNavigation();
  const { title, price, seller, availability } = useRoute().params;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image source={require('./icons/back.png')} style={styles.backIcon} />
        </TouchableOpacity>
      </View>

      <Text style={styles.title}>{title}</Text>

      <View style={styles.sellerBox}>
        <Image source={require('./icons/profile.png')} style={styles.profilePic} />
        <View style={styles.sellerInfo}>
          <Text style={styles.sellerName}>{seller.name}</Text>
          <Text style={styles.sellerRating}>⭐️ {seller.rating}</Text>
        </View>
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.infoLabel}>Meeting Place: Illini Union</Text>
        <TouchableOpacity style={styles.changeBtn}>
          <Text style={styles.changeText}>Change</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.infoLabel}>Offer Price: {price}</Text>
        <TouchableOpacity style={styles.changeBtn}>
          <Text style={styles.changeText}>Change</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.infoLabel}>Upcoming Availability</Text>
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => navigation.navigate('Availability', { title, price, seller, availability })}
        >
          <Text style={styles.addText}>+ Add</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.sendOfferBtn} onPress={() => navigation.navigate('Home')}>
        <Text style={styles.sendOfferText}>Send Offer</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAF7E8', padding: 24 },
  header: { flexDirection: 'row', alignItems: 'center' },
  backIcon: { width: 24, height: 24 },
  title: { fontSize: 24, fontWeight: '600', marginTop: 16, color: '#13281F' },
  sellerBox: {
    width: 342,
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
  infoBox: {
    width: 297,
    height: 67,
    borderRadius: 20,
    backgroundColor: '#FFF5E6',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginTop: 16,
  },
  infoLabel: { fontSize: 16, color: '#13281F' },
  changeBtn: { backgroundColor: '#FFA07A', borderRadius: 12, paddingHorizontal: 12, paddingVertical: 6 },
  changeText: { color: '#FFF', fontSize: 14 },
  addBtn: { backgroundColor: '#FFA07A', borderRadius: 12, paddingHorizontal: 12, paddingVertical: 6 },
  addText: { color: '#FFF', fontSize: 14 },
  sendOfferBtn: {
    marginTop: 32,
    backgroundColor: '#1F4035',
    height: 56,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendOfferText: { color: '#FFF', fontSize: 18, fontWeight: '600' },
});

export default ReviewOfferScreen;
