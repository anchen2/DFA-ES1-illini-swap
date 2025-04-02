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
  Platform,
} from 'react-native';
import logo from './logo.png'; // Adjust path to your logo

// Screen width to help with responsive layout
const { width } = Dimensions.get('window');

export default function SignInScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    // TODO: Replace this with real authentication logic if needed.
    // For now, we simulate a successful login by navigating to the Home screen.
    console.log('Login Pressed');
    navigation.navigate('Home');
  };

  const handleSignUp = () => {
    navigation.navigate('Sign Up');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Green header with logo */}
      <View style={styles.topContainer}>
        <Image source={logo} style={styles.logo} resizeMode="contain" />
      </View>

      {/* Main form area */}
      <View style={styles.formContainer}>
        {/* Optional heading if your logo doesn't include text */}
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
          <TouchableOpacity>
            <Text style={styles.forgotText}>Forgot Username?</Text>
          </TouchableOpacity>
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
          <TouchableOpacity>
            <Text style={styles.forgotText}>Forgot Password?</Text>
          </TouchableOpacity>
        </View>

        {/* LOGIN BUTTON */}
        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>Login</Text>
        </TouchableOpacity>

        {/* SSO LABEL */}
        <Text style={styles.ssoLabel}>Log In with SSO</Text>

        {/* SSO ICONS (placeholders here) */}
        <View style={styles.ssoIconsContainer}>
          <TouchableOpacity style={styles.ssoIcon}>
            <Text>G</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.ssoIcon}>
            <Text>I</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.ssoIcon}>
            <Text></Text>
          </TouchableOpacity>
        </View>

        {/* SIGN UP BUTTON */}
        <TouchableOpacity style={styles.signUpButton} onPress={handleSignUp}>
          <Text style={styles.signUpButtonText}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// ---- STYLES ----
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
    // On some Android devices, you might want a bit more spacing if you have a notch:
    // paddingTop: Platform.OS === 'android' ? 10 : 0,
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
  forgotText: {
    marginTop: 4,
    color: '#FA8351', // Orange
    fontSize: 14,
  },
  // LOGIN BUTTON (responsive approach: up to 343×56)
  loginButton: {
    width: '90%', // Use most of the screen width
    maxWidth: 343, // Don’t exceed 343px
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
  ssoIconsContainer: {
    flexDirection: 'row',
    marginBottom: 20,
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
  // SIGN UP BUTTON (bordered style)
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
