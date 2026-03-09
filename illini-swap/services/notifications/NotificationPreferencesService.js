import AsyncStorage from '@react-native-async-storage/async-storage';

const PREFS_KEY_PREFIX = 'notif-prefs:';

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

function keyForUser(userId) {
  return `${PREFS_KEY_PREFIX}${userId}`;
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

  const raw = await AsyncStorage.getItem(keyForUser(userId));
  if (!raw) {
    return { ...DEFAULT_NOTIFICATION_PREFERENCES };
  }

  try {
    const parsed = JSON.parse(raw);
    return normalizePreferences(parsed);
  } catch (error) {
    return { ...DEFAULT_NOTIFICATION_PREFERENCES };
  }
}

export async function saveNotificationPreferences(userId, prefs) {
  if (!userId) {
    throw new Error('userId is required.');
  }

  const normalized = normalizePreferences(prefs);
  await AsyncStorage.setItem(keyForUser(userId), JSON.stringify(normalized));
  return normalized;
}

