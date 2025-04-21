import React from 'react';
import { View, Image, TouchableOpacity, Text, StyleSheet, Dimensions } from 'react-native';
import logo from './logo.png';

const { width, height } = Dimensions.get('window');

const EntryScreen = ({ navigation }) => {
  const handleLoginPress = () => {
    // Navigate to the Sign In screen where the user can log in
    navigation.navigate('Sign In');
  };

  return (
    <View style={styles.container}>
      {/* Replace text with the Illini Swap logo */}
      <Image source={logo} style={styles.logo} resizeMode="contain" />

      <TouchableOpacity style={styles.loginButton} onPress={handleLoginPress}>
        <Text style={styles.loginText}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.signUpButton}
        onPress={() => navigation.navigate('Sign Up')}
      >
        <Text style={styles.signUpText}>Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
};

export default EntryScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1F4035', // Green background
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 200,
    height: 80,
    marginBottom: 40, // spacing above the buttons
  },
  loginButton: {
    backgroundColor: '#FCA26E',
    width: 168,
    height: 46,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
  },
  loginText: {
    color: '#FAF7E8',
    fontSize: 22,
    fontWeight: '600',
  },
  signUpButton: {
    backgroundColor: '#FAF7E8',
    width: 168,
    height: 46,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FCA26E',
    marginVertical: 10,
  },
  signUpText: {
    color: '#F5751C',
    fontSize: 22,
    fontWeight: '600',
  },
});
