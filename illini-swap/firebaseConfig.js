// firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
// or import { getDatabase } from 'firebase/database'; if using Realtime DB

const firebaseConfig = {
  apiKey: 'YOUR_API_KEY',
  authDomain: 'illini-swap-founders.firebaseapp.com',
  projectId: 'illini-swap-founders',
  storageBucket: 'illini-swap-founders.appspot.com',
  messagingSenderId: '607905388393',
  appId: '1:607905388393:android:b163aad1427841d8bb4ff8',
};

// Initialize the Firebase app
const app = initializeApp(firebaseConfig);

// Export Firebase services you plan to use
export const auth = getAuth(app);
export const db = getFirestore(app);
