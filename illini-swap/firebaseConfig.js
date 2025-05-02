// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { initializeAuth } from 'firebase/auth';
import { getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

// If you're using other services (like Storage or Realtime Database), import them as needed

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyBztslYW_0wNBYTwzEaf08iz2g_CZtAvmo',
  authDomain: 'illini-swap-founders.firebaseapp.com',
  projectId: 'illini-swap-founders',
  storageBucket: 'illini-swap-founders.firebasestorage.app',
  messagingSenderId: '607905388393',
  appId: '1:607905388393:web:e5350e1ea02b474abb4ff8', // Keep this for the web
  measurementId: 'G-PN4WHR58LC' // Optional, only if you plan to use analytics
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// Export the Firebase services you're using
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});
export const db = getFirestore(app);
// Add exports for other Firebase services you may be using (e.g., Storage, Realtime Database)
