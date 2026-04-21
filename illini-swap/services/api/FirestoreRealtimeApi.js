import {
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
} from 'firebase/firestore';
import { auth, db } from '../../firebaseConfig';
import {
  getNotificationPreferences,
  saveNotificationPreferences,
} from '../notifications/NotificationPreferencesService';
import {
  listDeviceTokens,
  registerDeviceToken,
  unregisterDeviceToken,
} from '../notifications/DeviceTokenService';

function response(status, body) {
  return { status, body };
}

function toIso(value) {
  if (!value) {
    return null;
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
  return null;
}

function resolveActorUserId(userId) {
  const authUserId = auth.currentUser?.uid || null;
  if (!authUserId) {
    throw new Error('No authenticated Firebase session. Please sign in first.');
  }

  const resolved = userId || authUserId;
  if (resolved !== authUserId) {
    throw new Error('Current auth user does not match requested userId.');
  }

  return resolved;
}

function presenceRef(userId) {
  return doc(db, 'presence', userId);
}

function mapPresence(userId, data = null) {
  if (!data) {
    return {
      userId,
      online: false,
      lastSeenAt: null,
      heartbeatAt: null,
    };
  }

  return {
    userId,
    online: Boolean(data.online),
    lastSeenAt: toIso(data.lastSeenAt),
    heartbeatAt: toIso(data.heartbeatAt),
  };
}

export async function getNotificationPreferencesEndpoint(userId) {
  const actorUserId = resolveActorUserId(userId);
  const prefs = await getNotificationPreferences(actorUserId);
  return response(200, prefs);
}

export async function putNotificationPreferencesEndpoint(userId, body) {
  const actorUserId = resolveActorUserId(userId);
  const saved = await saveNotificationPreferences(actorUserId, body);
  return response(200, saved);
}

export async function postDeviceTokenEndpoint(userId, body) {
  const actorUserId = resolveActorUserId(userId);
  const tokens = await registerDeviceToken(actorUserId, body.token, body.platform);
  return response(200, { tokens });
}

export async function deleteDeviceTokenEndpoint(userId, token) {
  const actorUserId = resolveActorUserId(userId);
  const tokens = await unregisterDeviceToken(actorUserId, token);
  return response(200, { tokens });
}

export async function listDeviceTokensEndpoint(userId) {
  const actorUserId = resolveActorUserId(userId);
  const tokens = await listDeviceTokens(actorUserId);
  return response(200, { tokens });
}

export async function postPresenceHeartbeatEndpoint(userId) {
  const actorUserId = resolveActorUserId(userId);
  const ref = presenceRef(actorUserId);
  const existing = await getDoc(ref);
  const existingData = existing.exists() ? existing.data() : {};

  await setDoc(
    ref,
    {
      userId: actorUserId,
      online: true,
      heartbeatAt: serverTimestamp(),
      lastSeenAt: existingData.lastSeenAt ?? serverTimestamp(),
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );

  const saved = await getDoc(ref);
  return response(200, mapPresence(actorUserId, saved.data()));
}

export async function putPresenceOnlineStateEndpoint(userId, online) {
  const actorUserId = resolveActorUserId(userId);
  const ref = presenceRef(actorUserId);

  await setDoc(
    ref,
    {
      userId: actorUserId,
      online: Boolean(online),
      lastSeenAt: serverTimestamp(),
      heartbeatAt: Boolean(online) ? serverTimestamp() : null,
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );

  const saved = await getDoc(ref);
  return response(200, mapPresence(actorUserId, saved.data()));
}

export async function getPresenceEndpoint(userId) {
  const actorUserId = resolveActorUserId(userId);
  const snapshot = await getDoc(presenceRef(actorUserId));
  return response(200, mapPresence(actorUserId, snapshot.exists() ? snapshot.data() : null));
}
