// GoogleSignIn.js
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { useEffect } from 'react';
import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import { auth } from './firebaseConfig';

WebBrowser.maybeCompleteAuthSession();

export function useGoogleAuth(navigation) {
  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId: '607905388393-qfpjldb1j4bmhkrikucl4koeuu9450h2.apps.googleusercontent.com',
    androidClientId: '607905388393-ljpblg3jpigtt5789svhlsfko4vlkqvg.apps.googleusercontent.com',
    iosClientId: '607905388393-2mb8955j845kjlvlpq73ldet4l6126s8.apps.googleusercontent.com',
  });

  useEffect(() => {
    if (response?.type === 'success') {
      console.log("Google authentication successful");
      const { id_token } = response.params;
      const credential = GoogleAuthProvider.credential(id_token);

      signInWithCredential(auth, credential)
        .then(() => {
          console.log("Successfully signed in with Google!");
          navigation.navigate('Home');
        })
        .catch((err) => {
          console.error('Google Sign In Error:', err);
        });
    } else if (response?.type === 'error') {
      console.error('Google authentication failed:', response.error);
    }
  }, [response]);

  return { promptAsync };
}
