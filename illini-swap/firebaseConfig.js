// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Your Firebase configuration (the same as your current configuration)
const firebaseConfig = {
  apiKey: 'AIzaSyBztslYW_0wNBYTwzEaf08iz2g_CZtAvmo',
  authDomain: 'illini-swap-founders.firebaseapp.com',
  projectId: 'illini-swap-founders',
  storageBucket: 'illini-swap-founders.firebasestorage.app',
  messagingSenderId: '607905388393',
  appId: '1:607905388393:web:e5350e1ea02b474abb4ff8',
  measurementId: 'G-PN4WHR58LC',
};

// Initialize Firebase only if it's not already initialized (for React Native)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize Firebase Auth with persistence in AsyncStorage
export const auth = getAuth(app);

// Initialize Firestore
export const db = getFirestore(app);
