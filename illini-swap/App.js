// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import SignUpScreen from './SignUpScreen'; // <-- import the SignUp screen
//import HomeScreen from './HomeScreen';     // or whatever other screens you have

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="SignUp">
        <Stack.Screen
          name="SignUp"
          component={SignUpScreen}
          options={{ headerShown: false }} // hide the default header if you like
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
