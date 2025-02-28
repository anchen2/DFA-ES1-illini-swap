// SignUpScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Platform,
} from 'react-native';

// Import Picker from the correct package
import { Picker } from '@react-native-picker/picker';

export default function SignUpScreen({ navigation }) {
  // Form states
  const [year, setYear] = useState('');
  const [major, setMajor] = useState('');
  const [gender, setGender] = useState('');

  // This function would handle form submission or navigation
  const handleContinue = () => {
    // Validate or do something with the form data
    console.log({ year, major, gender });
    // e.g., navigation.navigate('NextScreen');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header / Title */}
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Illini Swap</Text>
      </View>

      {/* Form Container */}
      <View style={styles.formContainer}>
        {/* Year Picker */}
        <Text style={styles.label}>Year</Text>
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={year}
            style={styles.picker}
            onValueChange={(itemValue) => setYear(itemValue)}
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
            onValueChange={(itemValue) => setMajor(itemValue)}
          >
            <Picker.Item label="Select your major" value="" />
            <Picker.Item label="Computer Science" value="CS" />
            <Picker.Item label="Engineering" value="Engineering" />
            <Picker.Item label="Business" value="Business" />
            <Picker.Item label="Biology" value="Biology" />
            <Picker.Item label="Other" value="Other" />
          </Picker>
        </View>

        {/* Gender Radio Buttons */}
        <Text style={styles.label}>Gender</Text>
        <View style={styles.radioGroup}>
          <TouchableOpacity
            style={styles.radioButtonContainer}
            onPress={() => setGender('Male')}
          >
            <View style={styles.radioCircle}>
              {gender === 'Male' && <View style={styles.selectedRb} />}
            </View>
            <Text style={styles.radioText}>Male</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.radioButtonContainer}
            onPress={() => setGender('Female')}
          >
            <View style={styles.radioCircle}>
              {gender === 'Female' && <View style={styles.selectedRb} />}
            </View>
            <Text style={styles.radioText}>Female</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.radioButtonContainer}
            onPress={() => setGender('Prefer not to say')}
          >
            <View style={styles.radioCircle}>
              {gender === 'Prefer not to say' && <View style={styles.selectedRb} />}
            </View>
            <Text style={styles.radioText}>Prefer not to say</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.radioButtonContainer}
            onPress={() => setGender('Other')}
          >
            <View style={styles.radioCircle}>
              {gender === 'Other' && <View style={styles.selectedRb} />}
            </View>
            <Text style={styles.radioText}>Other</Text>
          </TouchableOpacity>
        </View>

        {/* Continue Button */}
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
    backgroundColor: '#ffffff',
  },
  headerContainer: {
    backgroundColor: '#324B4A',
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 24,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  formContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'flex-start',
  },
  label: {
    marginTop: 16,
    marginBottom: 8,
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    marginBottom: 10,
    overflow: 'hidden',
  },
  picker: {
    height: Platform.OS === 'ios' ? 200 : 50,
    width: '100%',
  },
  radioGroup: {
    marginTop: 10,
    marginBottom: 20,
  },
  radioButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
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
  },
  button: {
    backgroundColor: '#324B4A',
    padding: 15,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 30,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});
