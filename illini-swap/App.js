// App.js
import React from 'react';
import './firebaseConfig';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import EntryScreen from './EntryScreen';
import SignInScreen from './SignInScreen';
import SignUpScreen from './SignUpScreen';
import HomeScreen from './HomeScreen';

import ItemScreen from './ItemScreen';
import AvailabilityScreen from './AvailabilityScreen';
import ReviewOfferScreen from './ReviewOfferScreen';
import SearchScreen from './SearchScreen';
import FavoritesScreen from './FavoritesScreen';

import SellItem from './SellItem'


import { FavoritesProvider } from "./FavoritesContext";

const Stack = createStackNavigator();

export default function App() {
  return (
    <FavoritesProvider>
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Entry" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Entry" component={EntryScreen} />
        <Stack.Screen name="Sign In" component={SignInScreen} />
        <Stack.Screen name="Sign Up" component={SignUpScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />

        <Stack.Screen name="Item" component={ItemScreen} />
        <Stack.Screen name="Availability" component={AvailabilityScreen} />
        <Stack.Screen name="ReviewOffer" component={ReviewOfferScreen} />
        <Stack.Screen name="Search" component={SearchScreen} />
        <Stack.Screen name="Favorites" component={FavoritesScreen} />
        <Stack.Screen name="SellItem" component={SellItem} />
      </Stack.Navigator>
    </NavigationContainer>
    </FavoritesProvider>
  );
}
