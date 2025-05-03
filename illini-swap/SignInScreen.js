import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc, enableNetwork } from 'firebase/firestore';
import { auth, db } from './firebaseConfig'; // Make sure db is exported in firebaseConfig
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FontAwesome } from '@expo/vector-icons';

export default function SignInScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigation = useNavigation();

  const handleLogin = async () => {
    try {
      setErrorMessage('');

      // Sign in the user
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Ensure Firestore network is enabled if it was offline
      await enableNetwork(db);

      // Fetch user data from Firestore
      const userDocRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const data = userDoc.data();
        if (data.firstLogin === true) {
          navigation.replace('Preferences'); // Show Preferences screen if it's the first login
        } else {
          navigation.replace('Home'); // Go straight to Home for subsequent logins
        }
      } else {
        setErrorMessage('User data not found.');
      }
    } catch (error) {
      console.error('Login Error:', error.message);
      setErrorMessage('Incorrect email or password.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Illini</Text>
        <Text style={styles.title}>Swap</Text>
      </View>

      <View style={styles.inputContainer}>
        {errorMessage !== '' && (
          <Text style={styles.errorText}>{errorMessage}</Text>
        )}

        <View style={styles.inputWrapper}>
          <FontAwesome name="user-o" size={18} color="#567870" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Username"
            placeholderTextColor="#567870"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />
        </View>
        <Text style={styles.forgotText}>Forgot Username?</Text>

        <View style={styles.inputWrapper}>
          <FontAwesome name="lock" size={18} color="#567870" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#567870"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>
        <Text style={styles.forgotText}>Forgot Password?</Text>
      </View>

      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginButtonText}>Login</Text>
      </TouchableOpacity>

      <Text style={styles.ssoLabel}>Log In with SSO</Text>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.signUpButton} onPress={() => navigation.navigate('Sign Up')}>
          <Text style={styles.signUpText}>Sign up</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF7E8',
    justifyContent: 'center',
    paddingHorizontal: 5,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 48,
    fontWeight: '800',
    color: '#1F4035',
    fontFamily: 'Georgia',
  },
  inputContainer: {
    marginHorizontal: 14,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAF7E8',
    borderColor: '#567870',
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 12,
    marginBottom: 4,
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    height: 50,
    color: '#000',
  },
  forgotText: {
    color: '#EC8C5D',
    fontSize: 12,
    marginBottom: 12,
    marginLeft: 8,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 10,
    fontSize: 14,
  },
  loginButton: {
    backgroundColor: '#1F4035',
    paddingVertical: 16,
    borderRadius: 20,
    alignItems: 'center',
    marginVertical: 10,
    marginHorizontal: 14,
  },
  loginButtonText: {
    color: '#FAF7E8',
    fontSize: 18,
    fontWeight: '600',
  },
  ssoLabel: {
    textAlign: 'center',
    fontSize: 14,
    color: '#1F4035',
    marginVertical: 10,
  },
  footer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  signUpButton: {
    backgroundColor: '#EC8C5D',
    paddingVertical: 12,
    paddingHorizontal: 60,
    borderRadius: 30,
  },
  signUpText: {
    color: '#1F4035',
    fontWeight: '600',
    fontSize: 16,
  },
});
