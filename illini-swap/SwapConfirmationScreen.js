import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const SwapConfirmationScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topCard}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.back}>←</Text>
        </TouchableOpacity>

        <Text style={styles.brand}>Illini{'\n'}Swap</Text>
        <Text style={styles.topText}>
          Your swap is confirmed. Thank you for making the eco-friendly choice.
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Image
          source={{
            uri: 'https://maps.googleapis.com/maps/api/staticmap?center=40.1097,-88.2272&zoom=15&size=600x300&markers=color:red%7C40.1097,-88.2272'
          }}
          style={styles.map}
          resizeMode="cover"
        />

        <Text style={styles.sectionTitle}>Swap Details</Text>

        <View style={styles.detailRow}>
          <Text style={styles.detailIcon}>📍</Text>
          <Text style={styles.detailText}>1401 W Green St, Urbana, IL 61801</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailIcon}>📅</Text>
          <Text style={styles.detailText}>December 5, 2024</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailIcon}>🕔</Text>
          <Text style={styles.detailText}>5:45 pm</Text>
        </View>

        <Text style={styles.sectionTitle}>Summary</Text>
        <Text style={styles.summaryText}>Order #: 123456</Text>
        <Text style={styles.summaryText}>Order Date: 11/14/2024</Text>
        <Text style={styles.summaryText}>Order Total: $75.15</Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF7E8',
  },
  topCard: {
    backgroundColor: '#173528',
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 22,
  },
  back: {
    color: '#FAF7E8',
    fontSize: 22,
    marginBottom: 10,
  },
  brand: {
    color: '#FAF7E8',
    fontSize: 34,
    fontWeight: '700',
    lineHeight: 34,
    marginBottom: 12,
  },
  topText: {
    color: '#FAF7E8',
    fontSize: 13,
    maxWidth: '85%',
  },
  content: {
    padding: 16,
  },
  map: {
    width: '100%',
    height: 170,
    borderRadius: 16,
    marginBottom: 18,
    backgroundColor: '#D9D9D9',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#173528',
    marginBottom: 10,
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 8,
    alignItems: 'center',
  },
  detailIcon: {
    width: 24,
    fontSize: 16,
  },
  detailText: {
    color: '#173528',
    fontSize: 14,
    flex: 1,
  },
  summaryText: {
    color: '#173528',
    fontSize: 14,
    marginBottom: 4,
  },
});

export default SwapConfirmationScreen;