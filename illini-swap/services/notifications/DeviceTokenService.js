import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  serverTimestamp,
  setDoc,
} from 'firebase/firestore';
import { auth, db } from '../../firebaseConfig';

function tokensCollectionRef(userId) {
  return collection(db, 'deviceTokens', userId, 'tokens');
}

function toIso(value) {
  if (!value) {
    return new Date().toISOString();
  }
  if (typeof value.toDate === 'function') {
    return value.toDate().toISOString();
  }
  if (value instanceof Date) {
    return value.toISOString();
  }
  if (typeof value === 'string') {
    return value;
  }
  return new Date().toISOString();
}

function normalizeTokenRecord(token, platform, updatedAt = null) {
  return {
    token: String(token),
    platform: platform || 'unknown',
    updatedAt: toIso(updatedAt),
  };
}

export async function listDeviceTokens(userId) {
  if (!userId) {
    throw new Error('userId is required.');
  }

  if (!auth.currentUser?.uid) {
    throw new Error('No authenticated Firebase session. Please sign in first.');
  }

  const snapshot = await getDocs(tokensCollectionRef(userId));
  return snapshot.docs
    .map((item) => {
      const data = item.data() || {};
      return normalizeTokenRecord(data.token || item.id, data.platform, data.updatedAt);
    })
    .sort((left, right) => new Date(right.updatedAt).getTime() - new Date(left.updatedAt).getTime());
}

export async function registerDeviceToken(userId, token, platform) {
  if (!userId || !token) {
    throw new Error('userId and token are required.');
  }

  const authUserId = auth.currentUser?.uid;
  if (!authUserId) {
    throw new Error('No authenticated Firebase session. Please sign in first.');
  }
  if (authUserId !== userId) {
    throw new Error('Current auth user does not match requested userId.');
  }

  const normalizedToken = String(token);
  const tokenDocId = encodeURIComponent(normalizedToken);
  await setDoc(
    doc(tokensCollectionRef(userId), tokenDocId),
    {
      token: normalizedToken,
      platform: platform || 'unknown',
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
  return listDeviceTokens(userId);
}

export async function unregisterDeviceToken(userId, token) {
  if (!userId || !token) {
    throw new Error('userId and token are required.');
  }

  const authUserId = auth.currentUser?.uid;
  if (!authUserId) {
    throw new Error('No authenticated Firebase session. Please sign in first.');
  }
  if (authUserId !== userId) {
    throw new Error('Current auth user does not match requested userId.');
  }

  const tokenDocId = encodeURIComponent(String(token));
  await deleteDoc(doc(tokensCollectionRef(userId), tokenDocId));
  return listDeviceTokens(userId);
}
