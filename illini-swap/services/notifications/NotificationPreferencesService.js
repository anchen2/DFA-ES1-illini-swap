import {
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
} from 'firebase/firestore';
import { auth, db } from '../../firebaseConfig';

export const DEFAULT_NOTIFICATION_PREFERENCES = {
  messages: true,
  offers: true,
  approvals: true,
  quietHours: {
    enabled: false,
    start: '22:00',
    end: '07:00',
  },
};

function preferencesRef(userId) {
  return doc(db, 'notificationPreferences', userId);
}

function normalizePreferences(input) {
  const inputQuiet = input?.quietHours || {};
  return {
    messages: input?.messages ?? DEFAULT_NOTIFICATION_PREFERENCES.messages,
    offers: input?.offers ?? DEFAULT_NOTIFICATION_PREFERENCES.offers,
    approvals: input?.approvals ?? DEFAULT_NOTIFICATION_PREFERENCES.approvals,
    quietHours: {
      enabled: inputQuiet.enabled ?? DEFAULT_NOTIFICATION_PREFERENCES.quietHours.enabled,
      start: inputQuiet.start ?? DEFAULT_NOTIFICATION_PREFERENCES.quietHours.start,
      end: inputQuiet.end ?? DEFAULT_NOTIFICATION_PREFERENCES.quietHours.end,
    },
  };
}

export async function getNotificationPreferences(userId) {
  if (!userId) {
    throw new Error('userId is required.');
  }

  if (!auth.currentUser?.uid) {
    throw new Error('No authenticated Firebase session. Please sign in first.');
  }

  const snapshot = await getDoc(preferencesRef(userId));
  if (!snapshot.exists()) {
    return { ...DEFAULT_NOTIFICATION_PREFERENCES };
  }

  return normalizePreferences(snapshot.data());
}

export async function saveNotificationPreferences(userId, prefs) {
  if (!userId) {
    throw new Error('userId is required.');
  }

  const authUserId = auth.currentUser?.uid;
  if (!authUserId) {
    throw new Error('No authenticated Firebase session. Please sign in first.');
  }
  if (authUserId !== userId) {
    throw new Error('Current auth user does not match requested userId.');
  }

  const normalized = normalizePreferences(prefs);
  await setDoc(
    preferencesRef(userId),
    {
      ...normalized,
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
  return normalized;
}
