import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  SafeAreaView,
  Platform,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import logo from './logo.png';

// 1) Import Firestore helpers
import { db } from './firebaseConfig';            // <-- your config file
import { collection, addDoc } from 'firebase/firestore';

export default function SignUpScreen({ navigation }) {
  const [name, setName] = useState('');
  const [year, setYear] = useState('');
  const [major, setMajor] = useState('');
  const [genderOptions, setGenderOptions] = useState({
    Male: false,
    Female: false,
    'Prefer not to say': false,
    Other: false,
  });

  // Toggle a checkbox-like selection for each gender option
  const toggleGenderOption = (option) => {
    setGenderOptions((prev) => ({
      ...prev,
      [option]: !prev[option],
    }));
  };

  // 2) Handle "Continue" to store data in Firestore
  const handleContinue = async () => {
    const selectedGenders = Object.keys(genderOptions).filter(
      (opt) => genderOptions[opt]
    );

    // Save to Firestore (example: "users" collection)
    try {
      const docRef = await addDoc(collection(db, 'users'), {
        name,
        year,
        major,
        gender: selectedGenders,
        createdAt: new Date(), // or serverTimestamp() if using from firebase.firestore
      });
      console.log('Document written with ID: ', docRef.id);

      // Optionally navigate to next screen
      // navigation.navigate('NextScreen');

    } catch (error) {
      console.error('Error adding document: ', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Dark Green Header */}
      <View style={styles.headerContainer}>
        <Image source={logo} style={styles.logo} resizeMode="contain" />
      </View>

      {/* Main Form */}
      <View style={styles.formContainer}>
        <Text style={styles.label}>Full Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your name"
          placeholderTextColor="#999"
          value={name}
          onChangeText={setName}
        />

        <Text style={styles.label}>Year</Text>
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={year}
            style={styles.picker}
            onValueChange={(val) => setYear(val)}
          >
            <Picker.Item label="Select your year" value="" />
            <Picker.Item label="Freshman" value="Freshman" />
            <Picker.Item label="Sophomore" value="Sophomore" />
            <Picker.Item label="Junior" value="Junior" />
            <Picker.Item label="Senior" value="Senior" />
            <Picker.Item label="Graduate" value="Graduate" />
          </Picker>
        </View>

        <Text style={styles.label}>Major</Text>
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={major}
            style={styles.picker}
            onValueChange={(val) => setMajor(val)}
          >
            <Picker.Item label="Select your major" value="" />
            <Picker.Item label="Computer Science" value="CS" />
            <Picker.Item label="Engineering" value="Engineering" />
            <Picker.Item label="Business" value="Business" />
            <Picker.Item label="Biology" value="Biology" />
            <Picker.Item label="Other" value="Other" />
          </Picker>
        </View>

        <Text style={styles.label}>Gender</Text>
        <View style={styles.checkboxGroup}>
          {Object.keys(genderOptions).map((option) => (
            <TouchableOpacity
              key={option}
              style={styles.checkboxRow}
              onPress={() => toggleGenderOption(option)}
              activeOpacity={0.7}
            >
              <View style={styles.checkboxOuter}>
                {genderOptions[option] && <View style={styles.checkboxInner} />}
              </View>
              <Text style={styles.checkboxLabel}>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Bottom Container with centered button */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity style={styles.button} onPress={handleContinue}>
          <Text style={styles.buttonText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// STYLES
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF7E8',
  },
  headerContainer: {
    width: '100%',
    height: 171,
    backgroundColor: '#1F4035',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 200,
    height: 80,
  },
  formContainer: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  label: {
    marginTop: 12,
    marginBottom: 6,
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    fontFamily: 'Montserrat',
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: '#FFF',
    fontFamily: 'Montserrat',
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 8,
  },
  picker: {
    height: Platform.OS === 'ios' ? 180 : 50,
    width: '100%',
    fontFamily: 'Montserrat',
  },
  checkboxGroup: {
    marginTop: 8,
    marginBottom: 20,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  checkboxOuter: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#324B4A',
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxInner: {
    width: 12,
    height: 12,
    backgroundColor: '#324B4A',
  },
  checkboxLabel: {
    fontSize: 16,
    color: '#333',
    fontFamily: 'Montserrat',
  },
  bottomContainer: {
    backgroundColor: '#1F4035',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    backgroundColor: '#567870',
    borderRadius: 30,
    height: 50,
    width: '80%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#FAF7E8',
    fontSize: 18,
    fontWeight: '600',
    fontFamily: 'Montserrat',
    textAlign: 'center',
  },
});
