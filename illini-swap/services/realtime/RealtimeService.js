import { publish, subscribe } from './EventBus';

const state = {
  currentUserId: 'dev-user-a',
  messagesById: {},
  messagesByConversation: {},
  presenceByUser: {},
  offersById: {},
};

function nowIso() {
  return new Date().toISOString();
}

function nextId(prefix) {
  const random = Math.floor(Math.random() * 1_000_000)
    .toString()
    .padStart(6, '0');
  return `${prefix}-${Date.now()}-${random}`;
}

function emit(eventType, payload) {
  const event = {
    id: nextId('evt'),
    type: eventType,
    createdAt: nowIso(),
    payload,
  };

  publish('event', event);
  publish(eventType, event);
  return event;
}

export function setCurrentUserId(userId) {
  if (!userId) {
    return;
  }
  state.currentUserId = userId;
}

export function getCurrentUserId() {
  return state.currentUserId;
}

export function sendMessage({
  conversationId,
  senderId = state.currentUserId,
  recipientId,
  body,
}) {
  const trimmedBody = (body || '').trim();
  if (!conversationId || !senderId || !recipientId || !trimmedBody) {
    throw new Error('conversationId, senderId, recipientId, and body are required.');
  }

  const message = {
    id: nextId('msg'),
    conversationId,
    senderId,
    recipientId,
    body: trimmedBody,
    createdAt: nowIso(),
    deliveredTo: [recipientId],
    readBy: [senderId],
  };

  state.messagesById[message.id] = message;
  if (!state.messagesByConversation[conversationId]) {
    state.messagesByConversation[conversationId] = [];
  }
  state.messagesByConversation[conversationId].push(message.id);

  emit('message.new', message);
  emit('message.delivered', {
    messageId: message.id,
    conversationId,
    recipientId,
  });

  return message;
}

export function markMessageRead({
  messageId,
  userId = state.currentUserId,
}) {
  const message = state.messagesById[messageId];
  if (!message) {
    throw new Error('Message not found.');
  }

  if (!message.readBy.includes(userId)) {
    message.readBy.push(userId);
  }

  emit('message.read', {
    messageId,
    conversationId: message.conversationId,
    userId,
    readBy: [...message.readBy],
  });

  return message;
}

export function listConversationMessages(conversationId) {
  const ids = state.messagesByConversation[conversationId] || [];
  return ids.map((id) => state.messagesById[id]);
}

export function updatePresence({
  userId = state.currentUserId,
  online,
}) {
  const existing = state.presenceByUser[userId] || {};
  const record = {
    userId,
    online: Boolean(online),
    lastSeenAt: nowIso(),
    heartbeatAt: nowIso(),
  };

  state.presenceByUser[userId] = {
    ...existing,
    ...record,
  };

  emit('presence.changed', state.presenceByUser[userId]);
  return state.presenceByUser[userId];
}

export function heartbeat(userId = state.currentUserId) {
  const existing = state.presenceByUser[userId] || {};
  const record = {
    userId,
    online: true,
    heartbeatAt: nowIso(),
    lastSeenAt: existing.lastSeenAt || nowIso(),
  };

  state.presenceByUser[userId] = {
    ...existing,
    ...record,
  };

  emit('presence.changed', state.presenceByUser[userId]);
  return state.presenceByUser[userId];
}

export function getPresence(userId) {
  return state.presenceByUser[userId] || {
    userId,
    online: false,
    lastSeenAt: null,
    heartbeatAt: null,
  };
}

export function createOffer({
  offerId = nextId('offer'),
  fromUserId = state.currentUserId,
  toUserId,
  itemTitle,
}) {
  if (!toUserId || !itemTitle) {
    throw new Error('toUserId and itemTitle are required.');
  }

  const offer = {
    offerId,
    fromUserId,
    toUserId,
    itemTitle,
    status: 'pending',
    createdAt: nowIso(),
  };

  state.offersById[offer.offerId] = offer;
  emit('offer.created', offer);
  return offer;
}

export function updateOfferStatus({
  offerId,
  status,
  changedByUserId = state.currentUserId,
}) {
  const offer = state.offersById[offerId];
  if (!offer) {
    throw new Error('Offer not found.');
  }
  if (!status) {
    throw new Error('status is required.');
  }

  offer.status = status;
  offer.updatedAt = nowIso();
  offer.changedByUserId = changedByUserId;

  emit('offer.statusChanged', {
    ...offer,
  });

  return offer;
}

export function onEvent(callback) {
  return subscribe('event', callback);
}

