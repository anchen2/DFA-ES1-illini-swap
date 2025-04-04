// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// Import the Firebase config (this initializes Firebase once).
import './firebaseConfig';

import EntryScreen from './EntryScreen';
import SignUpScreen from './SignUpScreen';
import SignInScreen from './SignInScreen';
import HomeScreen from './HomeScreen';

// Or if you prefer older React Navigation 4 syntax: createAppContainer, etc.
const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Entry" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Entry" component={EntryScreen} />
        <Stack.Screen name="Sign In" component={SignInScreen} />
        {/* Notice the name is “SignUp” rather than “Sign Up” to avoid spacing issues */}
        <Stack.Screen name="Sign Up" component={SignUpScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}