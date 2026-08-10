import {
  createConversation,
  createMessage,
  getConversationById,
  listConversations,
  listMessages,
  updateConversationStatus,
  updateOfferStatus,
} from '../conversations/ConversationService';

function response(status, body) {
  return { status, body };
}

export async function postConversationEndpoint(userId, body) {
  const data = createConversation({
    actorUserId: userId,
    peerUserId: body.peerUserId,
    status: body.status || 'active',
  });
  return response(201, data);
}

export async function getConversationsEndpoint(userId, query = {}) {
  const data = listConversations({
    userId,
    direction: query.direction || 'all',
    status: query.status || null,
  });
  return response(200, data);
}

export async function getConversationEndpoint(userId, conversationId) {
  const data = getConversationById({ userId, conversationId });
  return response(200, data);
}

export async function patchConversationStatusEndpoint(userId, conversationId, body) {
  const data = updateConversationStatus({
    userId,
    conversationId,
    status: body.status,
  });
  return response(200, data);
}

export async function postMessageEndpoint(userId, conversationId, body) {
  const data = createMessage({
    userId,
    conversationId,
    body: body.body,
    status: body.status || 'sent',
  });
  return response(201, data);
}

export async function getMessagesEndpoint(userId, conversationId) {
  const data = listMessages({ userId, conversationId });
  return response(200, data);
}

// Intentionally only status update for offers (no offer POST/GET yet).
export async function patchOfferStatusEndpoint(userId, offerId, body) {
  const data = updateOfferStatus({
    userId,
    offerId,
    status: body.status,
  });
  return response(200, data);
}

