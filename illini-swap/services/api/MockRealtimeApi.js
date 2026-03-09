import {
  getNotificationPreferences,
  saveNotificationPreferences,
} from '../notifications/NotificationPreferencesService';
import {
  listDeviceTokens,
  registerDeviceToken,
  unregisterDeviceToken,
} from '../notifications/DeviceTokenService';
import {
  heartbeat,
  getPresence,
} from '../realtime/RealtimeService';

function response(status, body) {
  return { status, body };
}

export async function getNotificationPreferencesEndpoint(userId) {
  const prefs = await getNotificationPreferences(userId);
  return response(200, prefs);
}

export async function putNotificationPreferencesEndpoint(userId, body) {
  const saved = await saveNotificationPreferences(userId, body);
  return response(200, saved);
}

export async function postDeviceTokenEndpoint(userId, body) {
  const tokens = await registerDeviceToken(userId, body.token, body.platform);
  return response(200, { tokens });
}

export async function deleteDeviceTokenEndpoint(userId, token) {
  const tokens = await unregisterDeviceToken(userId, token);
  return response(200, { tokens });
}

export async function postPresenceHeartbeatEndpoint(userId) {
  const state = heartbeat(userId);
  return response(200, state);
}

export async function getPresenceEndpoint(userId) {
  const state = getPresence(userId);
  return response(200, state);
}

export async function listDeviceTokensEndpoint(userId) {
  const tokens = await listDeviceTokens(userId);
  return response(200, { tokens });
}

