// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import './firebaseConfig';

import EntryScreen from './EntryScreen';
import SignUpScreen from './SignUpScreen';
import SignInScreen from './SignInScreen';
import HomeScreen from './HomeScreen';

import ItemScreen from './ItemScreen';
import SearchScreen from "./SearchScreen";

import FavoritesScreen from './FavoritesScreen';
import SellItem from './SellItem'


const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Entry" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Entry" component={EntryScreen} />
        <Stack.Screen name="Sign In" component={SignInScreen} />
        <Stack.Screen name="Sign Up" component={SignUpScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />

        <Stack.Screen name="Item" component={ItemScreen} />
        <Stack.Screen name="Search" component={SearchScreen} />
        <Stack.Screen name="Favorites" component={FavoritesScreen} />
        <Stack.Screen name="SellItem" component={SellItem} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
