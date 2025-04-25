// GoogleSignIn.js
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import * as AuthSession from 'expo-auth-session';
import { useEffect } from 'react';
import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import { auth } from './firebaseConfig';

WebBrowser.maybeCompleteAuthSession();

export function useGoogleAuth(navigation) {
  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: '607905388393-qfpjldb1j4bmhkrikucl4koeuu9450h2.apps.googleusercontent.com', // ✅ Web client ID
    redirectUri: AuthSession.makeRedirectUri({ useProxy: true }), // ✅ Required for Expo Go
    scopes: ['profile', 'email'],
  });

  useEffect(() => {
    if (response?.type === 'success') {
      console.log('✅ Google authentication successful');

      const { id_token } = response.params;

      if (!id_token) {
        console.error('❌ No ID token returned from Google.');
        return;
      }

      const credential = GoogleAuthProvider.credential(id_token);

      signInWithCredential(auth, credential)
        .then(() => {
          console.log('🎉 Signed in with Google!');
          navigation.navigate('Home');
        })
        .catch((err) => {
          console.error('Firebase sign-in error:', err);
        });
    } else if (response?.type === 'error') {
      console.error('❌ Google auth failed:', response.error);
    }
  }, [response]);

  return { promptAsync };
}
