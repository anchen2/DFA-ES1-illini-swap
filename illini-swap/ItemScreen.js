// ItemScreen.js
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const ItemScreen = ({ route, navigation }) => {
  const { image, title, price, seller } = route.params;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image
              source={require('./icons/back.png')}
              style={styles.backIcon}
            />
          </TouchableOpacity>
          <Image
            source={require('./icons/nav-heart.png')}
            style={styles.heartIcon}
          />
        </View>

        <Image source={image} style={styles.mainImage} resizeMode="cover" />

        <View style={styles.detailsContainer}>
          <View style={styles.titleRow}>
            <Text style={styles.itemTitle}>{title}</Text>
            <View style={styles.availableTag}>
              <Text style={styles.availableText}>Available</Text>
            </View>
          </View>

          <Text style={styles.price}>{price}</Text>
          <Text style={styles.offers}>10 people have sent offers</Text>

          <Text style={styles.description}>
            Lorem ipsum odor amet, consectetuer adipiscing elit.{' '}
            <Text style={styles.readMore}>Read More</Text>
          </Text>

          <View style={styles.sellerBox}>
            <Image
              source={require('./icons/profile.png')}
              style={styles.profilePic}
            />
            <View>
              <Text style={styles.sellerName}>{seller.name}</Text>
              <Text style={styles.sellerDetails}>
                ⭐️ {seller.rating} • {seller.sold} sold • {seller.active}
              </Text>
            </View>
          </View>

          {/* Pass title, price, and seller into Availability */}
          <TouchableOpacity
            style={styles.offerButton}
            onPress={() =>
              navigation.navigate('Availability', { title, price, seller })
            }
          >
            <Text style={styles.offerText}>Send Offer</Text>
          </TouchableOpacity>
        </View>
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
    justifyContent: 'space-between',
    padding: 16,
  },
  backIcon: {
    width: 32,
    height: 32,
  },
  heartIcon: {
    width: 32,
    height: 32,
  },
  mainImage: {
    width: '100%',
    height: 240,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  detailsContainer: {
    padding: 16,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#13281F',
  },
  availableTag: {
    backgroundColor: '#B6E2C6',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 20,
  },
  availableText: {
    color: '#13281F',
    fontSize: 13,
    fontWeight: '600',
  },
  price: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 6,
    color: '#000',
  },
  offers: {
    fontSize: 14,
    color: '#333',
    marginTop: 2,
  },
  description: {
    fontSize: 14,
    marginTop: 12,
    color: '#333',
  },
  readMore: {
    color: '#007BFF',
    fontWeight: '500',
  },
  sellerBox: {
    flexDirection: 'row',
    backgroundColor: '#DCE5E2',
    borderRadius: 14,
    padding: 12,
    marginTop: 20,
    alignItems: 'center',
  },
  profilePic: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  sellerName: {
    fontWeight: '600',
    fontSize: 14,
    color: '#000',
  },
  sellerDetails: {
    fontSize: 13,
    color: '#444',
    marginTop: 2,
  },
  offerButton: {
    backgroundColor: '#1F4035',
    paddingVertical: 14,
    borderRadius: 14,
    marginTop: 20,
    alignItems: 'center',
  },
  offerText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default ItemScreen;
