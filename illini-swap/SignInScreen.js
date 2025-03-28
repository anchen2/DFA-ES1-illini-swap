import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import * as Google from 'expo-google-app-auth';
import firebase from 'firebase/app';
import 'firebase/auth';
import logo from './logo.png'; // Adjust path to your logo

// Screen width to help with responsive layout
const { width } = Dimensions.get('window');

export default function SignInScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // Firebase Google Sign-In
  const handleGoogleLogin = async () => {
    try {
      const result = await Google.logInAsync({
        clientId: 'YOUR_WEB_CLIENT_ID', // Replace with your Web Client ID from Firebase
        scopes: ['profile', 'email'],
      });

      if (result.type === 'success') {
        const credential = firebase.auth.GoogleAuthProvider.credential(result.idToken, result.accessToken);
        await firebase.auth().signInWithCredential(credential);

        // Redirect to SignIn page or show success
        alert('Logged in with Google!');
        navigation.navigate('SignIn');
      } else {
        console.log('Google login cancelled');
      }
    } catch (error) {
      console.error('Google login error', error);
    }
  };

  const handleSignUp = () => {
    navigation.navigate('Sign Up');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topContainer}>
        <Image source={logo} style={styles.logo} resizeMode="contain" />
      </View>

      <View style={styles.formContainer}>
        <Text style={styles.title}>Illini Swap</Text>

        {/* USERNAME */}
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            placeholder="Username"
            placeholderTextColor="#999"
            onChangeText={setUsername}
            value={username}
          />
        </View>

        {/* PASSWORD */}
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#999"
            secureTextEntry
            onChangeText={setPassword}
            value={password}
          />
        </View>

        {/* LOGIN BUTTON */}
        <TouchableOpacity style={styles.loginButton}>
          <Text style={styles.loginButtonText}>Login</Text>
        </TouchableOpacity>

        {/* GOOGLE SIGN-IN BUTTON */}
        <Text style={styles.ssoLabel}>Log In with Google</Text>
        <TouchableOpacity style={styles.ssoIcon} onPress={handleGoogleLogin}>
          <Text style={styles.ssoIconText}>G</Text>
        </TouchableOpacity>

        {/* SIGN UP BUTTON */}
        <TouchableOpacity style={styles.signUpButton} onPress={handleSignUp}>
          <Text style={styles.signUpButtonText}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F2E6', // Cream background
  },
  topContainer: {
    backgroundColor: '#1F4035', // Dark green
    height: 200, // Adjust as needed for your design
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  logo: {
    width: 160,
    height: 80,
  },
  formContainer: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#324B4A',
    marginBottom: 20,
  },
  inputWrapper: {
    width: '100%',
    marginBottom: 16,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderColor: '#CCC',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: '#333',
    fontSize: 16,
  },
  loginButton: {
    width: '90%',
    maxWidth: 343,
    height: 56,
    backgroundColor: '#1F4035',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 16,
  },
  loginButtonText: {
    color: '#FAF7E8',
    fontSize: 18,
    fontWeight: '600',
  },
  ssoLabel: {
    marginTop: 10,
    marginBottom: 8,
    color: '#333',
    fontSize: 16,
  },
  ssoIcon: {
    width: 44,
    height: 44,
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#CCC',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 8,
  },
  ssoIconText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4285F4', // Google blue color
  },
  signUpButton: {
    width: '90%',
    maxWidth: 343,
    height: 56,
    borderColor: '#1F4035',
    borderWidth: 2,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  signUpButtonText: {
    color: '#1F4035',
    fontSize: 18,
    fontWeight: '600',
  },
});
