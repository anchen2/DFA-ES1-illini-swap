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

// If "logo.png" is in the same folder:
import logo from './logo.png';

export default function SignUpScreen({ navigation }) {
  const [name, setName] = useState('');
  const [year, setYear] = useState('');
  const [major, setMajor] = useState('');
  const [gender, setGender] = useState('');

  const handleContinue = () => {
    console.log({ name, year, major, gender });
    // navigation.navigate('NextScreen');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* 1) Dark Green Header with curved bottom corners */}
      <View style={styles.headerContainer}>
        {/* 2) Centered Logo */}
        <Image source={logo} style={styles.logo} resizeMode="contain" />
      </View>

      {/* 3) Main Form */}
      <View style={styles.formContainer}>
        <Text style={styles.label}>Full Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your name"
          placeholderTextColor="#999"
          value={name}
          onChangeText={setName}
        />

        {/* Year Picker */}
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

        {/* Major Picker */}
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

        {/* Gender Options */}
        <Text style={styles.label}>Gender</Text>
        <View style={styles.radioGroup}>
          {['Male', 'Female', 'Prefer not to say', 'Other'].map((option) => (
            <TouchableOpacity
              key={option}
              style={styles.radioButtonContainer}
              onPress={() => setGender(option)}
            >
              <View style={styles.radioCircle}>
                {gender === option && <View style={styles.selectedRb} />}
              </View>
              <Text style={styles.radioText}>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* 4) Bottom Button Container */}
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
    backgroundColor: '#FAF7E8', // Cream background
  },

  /* Header: 390 wide, 171 tall, dark green (#1F4035) with curved bottom corners */
  headerContainer: {
    width: '100%',
    height: 171,
    backgroundColor: '#1F4035',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  /* Adjust the logo size to your liking, ensure it's a transparent PNG. */
  logo: {
    width: 200,
    height: 80,
  },

  /* Form area, spaced below the header */
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
    fontFamily: 'Montserrat', // Ensure Montserrat is properly loaded
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

  /* Gender radio */
  radioGroup: {
    marginTop: 8,
    marginBottom: 20,
  },
  radioButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  radioCircle: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#324B4A',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  selectedRb: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#324B4A',
  },
  radioText: {
    fontSize: 16,
    color: '#333',
    fontFamily: 'Montserrat',
  },

  /* Bottom container with "Continue" button */
  bottomContainer: {
    backgroundColor: '#1F4035',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingVertical: 20,
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#567870',
    width: '80%',
    borderRadius: 30,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#FAF7E8',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Montserrat',
  },
});
