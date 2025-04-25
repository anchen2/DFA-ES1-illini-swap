import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { auth, db } from './firebaseConfig';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import logo from './logo.png';

export default function SignUpScreen({ navigation }) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSignUp = () => {
    setError(''); // Clear existing error

    if (!email.endsWith('@illinois.edu')) {
      setError('Please use your @illinois.edu email address.');
      return;
    }

    navigation.navigate('Sign In'); // Navigate immediately

    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        return setDoc(doc(db, 'users', user.uid), {
          fullName,
          email,
          createdAt: new Date(),
        });
      })
      .catch((err) => {
        if (err.code === 'auth/email-already-in-use') {
          setError('User already exists with this email.');
        } else {
          console.error('Sign up error:', err);
          setError('Sign up failed. Try again.');
        }
      });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <Image source={logo} style={styles.logo} resizeMode="contain" />
      </View>

      <View style={styles.formContainer}>
        <Text style={styles.label}>Full Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your full name"
          value={fullName}
          onChangeText={setFullName}
        />

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        {error && <Text style={styles.error}>{error}</Text>}

        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
      </View>

      <View style={styles.bottomContainer}>
        <TouchableOpacity style={styles.button} onPress={handleSignUp}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

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
  error: {
    color: 'red',
    fontSize: 14,
    marginTop: 4,
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
