const CONVERSATION_STATUSES = new Set(['active', 'archived', 'closed']);
const MESSAGE_STATUSES = new Set(['sent', 'delivered', 'read']);
const OFFER_STATUSES = new Set(['pending', 'accepted', 'declined', 'cancelled']);

const store = {
  seeded: false,
  conversationsById: {},
  conversationIds: [],
  messagesById: {},
  messageIdsByConversation: {},
  offersById: {},
  offerIdsByConversation: {},
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

function participantsKey(a, b) {
  return [a, b].sort().join(':');
}

function ensureParticipant(conversation, userId) {
  if (!conversation.participantIds.includes(userId)) {
    throw new Error('User is not a participant in this conversation.');
  }
}

function ensureConversationStatus(status) {
  if (!CONVERSATION_STATUSES.has(status)) {
    throw new Error(`Invalid conversation status: ${status}`);
  }
}

function ensureMessageStatus(status) {
  if (!MESSAGE_STATUSES.has(status)) {
    throw new Error(`Invalid message status: ${status}`);
  }
}

function ensureOfferStatus(status) {
  if (!OFFER_STATUSES.has(status)) {
    throw new Error(`Invalid offer status: ${status}`);
  }
}

function getMessagesForConversation(conversationId) {
  const ids = store.messageIdsByConversation[conversationId] || [];
  return ids.map((id) => store.messagesById[id]);
}

function getOffersForConversation(conversationId) {
  const ids = store.offerIdsByConversation[conversationId] || [];
  return ids.map((id) => store.offersById[id]);
}

function ensureSeedData() {
  if (store.seeded) {
    return;
  }

  const seedConversation = {
    id: 'conv-seed-1',
    participantIds: ['dev-user-a', 'dev-user-b'],
    participantsKey: participantsKey('dev-user-a', 'dev-user-b'),
    createdBy: 'dev-user-a',
    status: 'active',
    lastMessageAt: nowIso(),
    lastMessageText: 'Welcome to the conversation demo.',
    createdAt: nowIso(),
    updatedAt: nowIso(),
  };
  store.conversationsById[seedConversation.id] = seedConversation;
  store.conversationIds.push(seedConversation.id);

  const seedMessage = {
    id: 'msg-seed-1',
    conversationId: seedConversation.id,
    senderId: 'dev-user-a',
    receiverId: 'dev-user-b',
    body: 'Welcome to the conversation demo.',
    status: 'sent',
    createdAt: nowIso(),
    readAt: null,
  };
  store.messagesById[seedMessage.id] = seedMessage;
  store.messageIdsByConversation[seedConversation.id] = [seedMessage.id];

  const seedOffer = {
    id: 'offer-seed-1',
    conversationId: seedConversation.id,
    senderId: 'dev-user-a',
    receiverId: 'dev-user-b',
    itemId: 'item-seed-1',
    amount: 15,
    status: 'pending',
    createdAt: nowIso(),
    updatedAt: nowIso(),
  };
  store.offersById[seedOffer.id] = seedOffer;
  store.offerIdsByConversation[seedConversation.id] = [seedOffer.id];

  store.seeded = true;
}

export function createConversation({ actorUserId, peerUserId, status = 'active' }) {
  ensureSeedData();
  if (!actorUserId || !peerUserId) {
    throw new Error('actorUserId and peerUserId are required.');
  }
  if (actorUserId === peerUserId) {
    throw new Error('A conversation requires two distinct users.');
  }
  ensureConversationStatus(status);

  const key = participantsKey(actorUserId, peerUserId);
  const existing = store.conversationIds
    .map((id) => store.conversationsById[id])
    .find((conversation) => conversation.participantsKey === key && conversation.status !== 'closed');

  if (existing) {
    return {
      conversation: existing,
      created: false,
      placeholderOfferId: (store.offerIdsByConversation[existing.id] || [])[0] || null,
    };
  }

  const conversation = {
    id: nextId('conv'),
    participantIds: [actorUserId, peerUserId],
    participantsKey: key,
    createdBy: actorUserId,
    status,
    lastMessageAt: null,
    lastMessageText: null,
    createdAt: nowIso(),
    updatedAt: nowIso(),
  };

  store.conversationsById[conversation.id] = conversation;
  store.conversationIds.unshift(conversation.id);
  store.messageIdsByConversation[conversation.id] = [];
  store.offerIdsByConversation[conversation.id] = [];

  // Create one placeholder offer so status update demo works without offer POST/GET endpoints.
  const offer = {
    id: nextId('offer'),
    conversationId: conversation.id,
    senderId: actorUserId,
    receiverId: peerUserId,
    itemId: 'placeholder-item',
    amount: 0,
    status: 'pending',
    createdAt: nowIso(),
    updatedAt: nowIso(),
  };
  store.offersById[offer.id] = offer;
  store.offerIdsByConversation[conversation.id].push(offer.id);

  return {
    conversation,
    created: true,
    placeholderOfferId: offer.id,
  };
}

export function listConversations({ userId, direction = 'all', status = null }) {
  ensureSeedData();
  if (!userId) {
    throw new Error('userId is required.');
  }

  let items = store.conversationIds
    .map((id) => store.conversationsById[id])
    .filter((conversation) => conversation.participantIds.includes(userId));

  if (direction === 'sent') {
    items = items.filter((conversation) => conversation.createdBy === userId);
  } else if (direction === 'received') {
    items = items.filter((conversation) => conversation.createdBy !== userId);
  }

  if (status) {
    items = items.filter((conversation) => conversation.status === status);
  }

  items.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  return items;
}

export function getConversationById({ userId, conversationId }) {
  ensureSeedData();
  const conversation = store.conversationsById[conversationId];
  if (!conversation) {
    throw new Error('Conversation not found.');
  }
  ensureParticipant(conversation, userId);

  return {
    ...conversation,
    messages: getMessagesForConversation(conversationId),
    offers: getOffersForConversation(conversationId),
  };
}

export function updateConversationStatus({ userId, conversationId, status }) {
  ensureSeedData();
  ensureConversationStatus(status);

  const conversation = store.conversationsById[conversationId];
  if (!conversation) {
    throw new Error('Conversation not found.');
  }
  ensureParticipant(conversation, userId);

  conversation.status = status;
  conversation.updatedAt = nowIso();
  return conversation;
}

export function createMessage({ userId, conversationId, body, status = 'sent' }) {
  ensureSeedData();
  ensureMessageStatus(status);

  const conversation = store.conversationsById[conversationId];
  if (!conversation) {
    throw new Error('Conversation not found.');
  }
  ensureParticipant(conversation, userId);

  const trimmedBody = (body || '').trim();
  if (!trimmedBody) {
    throw new Error('Message body is required.');
  }

  const receiverId = conversation.participantIds.find((participantId) => participantId !== userId);
  const message = {
    id: nextId('msg'),
    conversationId,
    senderId: userId,
    receiverId,
    body: trimmedBody,
    status,
    createdAt: nowIso(),
    readAt: null,
  };

  store.messagesById[message.id] = message;
  store.messageIdsByConversation[conversationId] = [
    message.id,
    ...(store.messageIdsByConversation[conversationId] || []),
  ];

  conversation.lastMessageAt = message.createdAt;
  conversation.lastMessageText = message.body;
  conversation.updatedAt = nowIso();

  return message;
}

export function listMessages({ userId, conversationId }) {
  ensureSeedData();
  const conversation = store.conversationsById[conversationId];
  if (!conversation) {
    throw new Error('Conversation not found.');
  }
  ensureParticipant(conversation, userId);
  return getMessagesForConversation(conversationId);
}

export function updateOfferStatus({ userId, offerId, status }) {
  ensureSeedData();
  ensureOfferStatus(status);

  const offer = store.offersById[offerId];
  if (!offer) {
    throw new Error('Offer not found.');
  }

  const conversation = store.conversationsById[offer.conversationId];
  ensureParticipant(conversation, userId);

  offer.status = status;
  offer.updatedAt = nowIso();
  return offer;
}

