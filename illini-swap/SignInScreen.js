// SignInScreen.js
import React, { useState } from 'react';
import { Text, View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from './firebaseConfig';
import { useGoogleAuth } from './GoogleSignIn';
import { useNavigation } from '@react-navigation/native';

export default function SignInScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();

  const { promptAsync } = useGoogleAuth(navigation);

  const handleLogin = async () => {
    try {
      console.log("Attempting Email Sign In...");
      await signInWithEmailAndPassword(auth, email, password);
      console.log("Successfully signed in with email!");
      navigation.navigate('Home');
    } catch (error) {
      console.error('Login Error:', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Illini Swap</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Sign In</Text>
      </TouchableOpacity>

      <Text style={styles.orText}>Or sign in with</Text>

      <View style={styles.ssoContainer}>
        <TouchableOpacity
          style={styles.ssoIcon}
          onPress={() => {
            console.log("Google button pressed");
            promptAsync();
          }}
        >
          <Text style={styles.ssoText}>G</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text>Don't have an account? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Sign Up')}>
          <Text style={styles.footerLink}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 32,
    alignSelf: 'center',
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  button: {
    backgroundColor: '#3f51b5',
    paddingVertical: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    alignSelf: 'center',
    fontWeight: '600',
  },
  orText: {
    textAlign: 'center',
    marginVertical: 10,
  },
  ssoContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 30,
  },
  ssoIcon: {
    marginHorizontal: 10,
    backgroundColor: '#eee',
    padding: 12,
    borderRadius: 50,
  },
  ssoText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  footerLink: {
    color: '#3f51b5',
    fontWeight: '600',
  },
});
