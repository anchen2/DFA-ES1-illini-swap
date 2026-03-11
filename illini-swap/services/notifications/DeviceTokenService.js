import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKENS_KEY_PREFIX = 'notif-tokens:';

function keyForUser(userId) {
  return `${TOKENS_KEY_PREFIX}${userId}`;
}

function normalizeToken(token, platform) {
  return {
    token: String(token),
    platform: platform || 'unknown',
    updatedAt: new Date().toISOString(),
  };
}

export async function listDeviceTokens(userId) {
  if (!userId) {
    throw new Error('userId is required.');
  }

  const raw = await AsyncStorage.getItem(keyForUser(userId));
  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }
    return parsed;
  } catch (error) {
    return [];
  }
}

export async function registerDeviceToken(userId, token, platform) {
  if (!userId || !token) {
    throw new Error('userId and token are required.');
  }

  const existing = await listDeviceTokens(userId);
  const deduped = existing.filter((entry) => entry.token !== token);
  const next = [normalizeToken(token, platform), ...deduped];
  await AsyncStorage.setItem(keyForUser(userId), JSON.stringify(next));
  return next;
}

export async function unregisterDeviceToken(userId, token) {
  if (!userId || !token) {
    throw new Error('userId and token are required.');
  }

  const existing = await listDeviceTokens(userId);
  const next = existing.filter((entry) => entry.token !== token);
  await AsyncStorage.setItem(keyForUser(userId), JSON.stringify(next));
  return next;
}

