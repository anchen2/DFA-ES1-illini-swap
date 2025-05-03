import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Dimensions,
  PixelRatio,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

const { width } = Dimensions.get('window');
const scale = width / 375;

const normalize = (size) => {
  const newSize = size * scale;
  return Math.round(PixelRatio.roundToNearestPixel(newSize));
};

const categories = [
  'Clothes', 'Books', 'Tech',
  'Shoes', 'Accessories', 'Decor',
  'Appliances', 'Tickets', 'Furniture',
  'Events',
];

export default function PreferencesScreen() {
  const [selected, setSelected] = useState([]);
  const navigation = useNavigation();

  const toggleCategory = (item) => {
    setSelected((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  const handleContinue = async () => {
    const auth = getAuth();
    const db = getFirestore();
    const user = auth.currentUser;

    if (user) {
      const userRef = doc(db, 'users', user.uid);
      await setDoc(userRef, {
        preferences: selected,
        firstLogin: false,
      }, { merge: true });

      navigation.replace('Home');
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.item, selected.includes(item) && styles.selectedItem]}
      onPress={() => toggleCategory(item)}
    >
      <Text style={[styles.text, selected.includes(item) && styles.selectedText]}>{item}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Preferences</Text>
      <Text style={styles.subtitle}>What are you looking to find on Illini Swap?</Text>
      <FlatList
        data={categories}
        renderItem={renderItem}
        keyExtractor={(item) => item}
        numColumns={2}
        contentContainerStyle={styles.grid}
      />
      <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
        <Text style={styles.continueText}>Continue</Text>
      </TouchableOpacity>
    </View>
  );
}

// Adjusted: 0.1 inch smaller (~10 px)
const buttonWidth = width * 0.43 - 10;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: normalize(20),
    backgroundColor: '#FDF8EF',
  },
  title: {
    fontSize: normalize(34),
    fontWeight: 'bold',
    color: '#193F2D',
    alignSelf: 'center',
    marginTop: '20%',
    marginBottom: normalize(10),
  },
  subtitle: {
    fontSize: normalize(16),
    marginBottom: normalize(20),
    textAlign: 'center',
  },
  grid: {
    alignItems: 'center',
  },
  item: {
    backgroundColor: '#193F2D',
    width: buttonWidth,
    height: normalize(70),
    margin: normalize(10),
    borderRadius: normalize(16),
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedItem: {
    backgroundColor: '#FF8243',
  },
  text: {
    color: '#FF8243',
    fontWeight: '600',
    fontSize: normalize(16),
  },
  selectedText: {
    color: '#FDF8EF',
  },
  continueButton: {
    backgroundColor: '#193F2D',
    padding: normalize(15),
    borderRadius: normalize(20),
    marginTop: normalize(20),
    alignItems: 'center',
    width: '100%',
  },
  continueText: {
    color: '#FDF8EF',
    fontSize: normalize(18),
    fontWeight: '600',
  },
});
