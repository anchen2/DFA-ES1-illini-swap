import { subscribe } from '../realtime/EventBus';
import { getNotificationPreferences } from './NotificationPreferencesService';
import { listDeviceTokens } from './DeviceTokenService';

const notificationFeed = [];
let bridgeUnsubscribe = null;

function nextId(prefix) {
  const random = Math.floor(Math.random() * 1_000_000)
    .toString()
    .padStart(6, '0');
  return `${prefix}-${Date.now()}-${random}`;
}

function parseClockTime(value) {
  const [hours, minutes] = String(value || '').split(':').map(Number);
  if (Number.isNaN(hours) || Number.isNaN(minutes)) {
    return null;
  }
  return (hours * 60) + minutes;
}

function isInQuietHours(quietHours) {
  if (!quietHours?.enabled) {
    return false;
  }

  const start = parseClockTime(quietHours.start);
  const end = parseClockTime(quietHours.end);
  if (start === null || end === null) {
    return false;
  }

  const now = new Date();
  const minutes = (now.getHours() * 60) + now.getMinutes();

  if (start === end) {
    return true;
  }
  if (start < end) {
    return minutes >= start && minutes < end;
  }
  return minutes >= start || minutes < end;
}

function preferenceEnabled(preferences, category) {
  if (category === 'messages') {
    return Boolean(preferences.messages);
  }
  if (category === 'offers') {
    return Boolean(preferences.offers);
  }
  if (category === 'approvals') {
    return Boolean(preferences.approvals);
  }
  return false;
}

function createFeedEntry({
  userId,
  category,
  title,
  body,
  data,
  sourceEventId,
  delivered,
  reason,
  tokens,
}) {
  const entry = {
    id: nextId('notif'),
    createdAt: new Date().toISOString(),
    userId,
    category,
    title,
    body,
    data: data || {},
    sourceEventId: sourceEventId || null,
    delivered,
    reason: reason || null,
    tokens: tokens || [],
  };
  notificationFeed.unshift(entry);
  return entry;
}

async function queueNotification({
  userId,
  category,
  title,
  body,
  data,
  sourceEventId,
}) {
  const preferences = await getNotificationPreferences(userId);
  if (!preferenceEnabled(preferences, category)) {
    return createFeedEntry({
      userId,
      category,
      title,
      body,
      data,
      sourceEventId,
      delivered: false,
      reason: 'disabled_by_preferences',
    });
  }

  if (isInQuietHours(preferences.quietHours)) {
    return createFeedEntry({
      userId,
      category,
      title,
      body,
      data,
      sourceEventId,
      delivered: false,
      reason: 'quiet_hours',
    });
  }

  const tokens = await listDeviceTokens(userId);
  if (tokens.length === 0) {
    return createFeedEntry({
      userId,
      category,
      title,
      body,
      data,
      sourceEventId,
      delivered: false,
      reason: 'no_device_tokens',
    });
  }

  return createFeedEntry({
    userId,
    category,
    title,
    body,
    data,
    sourceEventId,
    delivered: true,
    reason: null,
    tokens: tokens.map((token) => token.token),
  });
}

async function handleRealtimeEvent(event) {
  try {
    if (event.type === 'message.new') {
      const payload = event.payload;
      await queueNotification({
        userId: payload.recipientId,
        category: 'messages',
        title: 'New message',
        body: payload.body,
        sourceEventId: event.id,
        data: {
          conversationId: payload.conversationId,
          messageId: payload.id,
          senderId: payload.senderId,
        },
      });
    }

    if (event.type === 'offer.created') {
      const payload = event.payload;
      await queueNotification({
        userId: payload.toUserId,
        category: 'offers',
        title: 'New offer',
        body: `${payload.fromUserId} sent an offer for ${payload.itemTitle}.`,
        sourceEventId: event.id,
        data: {
          offerId: payload.offerId,
          fromUserId: payload.fromUserId,
        },
      });
    }

    if (event.type === 'offer.statusChanged') {
      const payload = event.payload;
      const recipientId =
        payload.changedByUserId === payload.fromUserId
          ? payload.toUserId
          : payload.fromUserId;

      await queueNotification({
        userId: recipientId,
        category: 'approvals',
        title: 'Offer updated',
        body: `Offer ${payload.offerId} is now ${payload.status}.`,
        sourceEventId: event.id,
        data: {
          offerId: payload.offerId,
          status: payload.status,
        },
      });
    }
  } catch (error) {
    createFeedEntry({
      userId: 'system',
      category: 'errors',
      title: 'Notification engine error',
      body: String(error.message || error),
      data: {},
      sourceEventId: event?.id || null,
      delivered: false,
      reason: 'engine_error',
    });
  }
}

export function initializeNotificationBridge() {
  if (bridgeUnsubscribe) {
    return bridgeUnsubscribe;
  }

  bridgeUnsubscribe = subscribe('event', (event) => {
    handleRealtimeEvent(event);
  });

  return bridgeUnsubscribe;
}

export function stopNotificationBridge() {
  if (bridgeUnsubscribe) {
    bridgeUnsubscribe();
    bridgeUnsubscribe = null;
  }
}

export function getNotificationFeed() {
  return [...notificationFeed];
}

export function clearNotificationFeed() {
  notificationFeed.length = 0;
}

export async function queueManualNotification(input) {
  return queueNotification(input);
}

