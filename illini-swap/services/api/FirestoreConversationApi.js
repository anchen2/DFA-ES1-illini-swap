import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from 'firebase/firestore';
import { auth, db } from '../../firebaseConfig';

const CONVERSATION_STATUSES = new Set(['active', 'archived', 'closed']);
const MESSAGE_STATUSES = new Set(['sent', 'delivered', 'read']);

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
  if (authUserId && userId && authUserId !== userId) {
    throw new Error('Current auth user does not match requested userId.');
  }
  return resolved;
}

function buildParticipantsKey(firstUserId, secondUserId) {
  return [firstUserId, secondUserId].sort().join(':');
}

function assertConversationStatus(status) {
  if (!CONVERSATION_STATUSES.has(status)) {
    throw new Error(`Invalid conversation status: ${status}`);
  }
}

function assertMessageStatus(status) {
  if (!MESSAGE_STATUSES.has(status)) {
    throw new Error(`Invalid message status: ${status}`);
  }
}

function mapConversation(docSnap) {
  const data = docSnap.data() || {};
  return {
    id: docSnap.id,
    participantIds: data.participantIds || [],
    participantsKey: data.participantsKey || '',
    createdBy: data.createdBy || null,
    status: data.status || 'active',
    lastMessageAt: toIso(data.lastMessageAt),
    lastMessageText: data.lastMessageText ?? null,
    createdAt: toIso(data.createdAt),
    updatedAt: toIso(data.updatedAt),
  };
}

function mapMessage(docSnap) {
  const data = docSnap.data() || {};
  return {
    id: docSnap.id,
    conversationId: data.conversationId || null,
    senderId: data.senderId || null,
    receiverId: data.receiverId || null,
    body: data.body || '',
    status: data.status || 'sent',
    createdAt: toIso(data.createdAt),
    readAt: toIso(data.readAt),
  };
}

function assertParticipant(conversation, userId) {
  if (!conversation.participantIds.includes(userId)) {
    throw new Error('User is not a participant in this conversation.');
  }
}

async function getConversationRecord(conversationId) {
  if (!conversationId) {
    throw new Error('conversationId is required.');
  }
  const conversationRef = doc(db, 'conversations', conversationId);
  const snapshot = await getDoc(conversationRef);
  if (!snapshot.exists()) {
    throw new Error('Conversation not found.');
  }
  return {
    ref: conversationRef,
    data: mapConversation(snapshot),
  };
}

function sortByUpdatedAtDesc(items) {
  return [...items].sort((left, right) => {
    const leftTime = left.updatedAt ? new Date(left.updatedAt).getTime() : 0;
    const rightTime = right.updatedAt ? new Date(right.updatedAt).getTime() : 0;
    return rightTime - leftTime;
  });
}

export async function postConversationEndpoint(userId, body) {
  const actorUserId = resolveActorUserId(userId);
  const peerUserId = (body?.peerUserId || '').trim();
  const status = body?.status || 'active';

  if (!peerUserId) {
    throw new Error('peerUserId is required.');
  }
  if (peerUserId === actorUserId) {
    throw new Error('A conversation requires two distinct users.');
  }
  assertConversationStatus(status);

  const key = buildParticipantsKey(actorUserId, peerUserId);
  const existingQuery = query(
    collection(db, 'conversations'),
    where('participantIds', 'array-contains', actorUserId)
  );
  const existingSnapshot = await getDocs(existingQuery);
  const existing = sortByUpdatedAtDesc(
    existingSnapshot.docs.map((item) => mapConversation(item))
  ).find(
    (conversation) =>
      conversation.participantsKey === key && conversation.status !== 'closed'
  );

  if (existing) {
    return response(201, {
      conversation: existing,
      created: false,
      placeholderOfferId: null,
    });
  }

  const createdRef = await addDoc(collection(db, 'conversations'), {
    participantIds: [actorUserId, peerUserId],
    participantsKey: key,
    createdBy: actorUserId,
    status,
    lastMessageAt: null,
    lastMessageText: null,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  const createdSnapshot = await getDoc(createdRef);

  return response(201, {
    conversation: mapConversation(createdSnapshot),
    created: true,
    placeholderOfferId: null,
  });
}

export async function getConversationsEndpoint(userId, inputQuery = {}) {
  const actorUserId = resolveActorUserId(userId);
  const direction = inputQuery.direction || 'all';
  const status = inputQuery.status || null;

  if (status) {
    assertConversationStatus(status);
  }

  const constraints = [
    where('participantIds', 'array-contains', actorUserId),
    orderBy('updatedAt', 'desc'),
  ];

  if (status) {
    constraints.splice(1, 0, where('status', '==', status));
  }

  const snapshot = await getDocs(
    query(collection(db, 'conversations'), ...constraints)
  );
  let items = snapshot.docs.map((item) => mapConversation(item));

  if (direction === 'sent') {
    items = items.filter((conversation) => conversation.createdBy === actorUserId);
  } else if (direction === 'received') {
    items = items.filter((conversation) => conversation.createdBy !== actorUserId);
  }

  return response(200, items);
}

export async function getConversationEndpoint(userId, conversationId) {
  const actorUserId = resolveActorUserId(userId);
  const { ref, data } = await getConversationRecord(conversationId);
  assertParticipant(data, actorUserId);

  const messagesSnapshot = await getDocs(
    query(collection(ref, 'messages'), orderBy('createdAt', 'desc'))
  );

  return response(200, {
    ...data,
    messages: messagesSnapshot.docs.map((item) => mapMessage(item)),
    offers: [],
  });
}

export async function patchConversationStatusEndpoint(userId, conversationId, body) {
  const actorUserId = resolveActorUserId(userId);
  const status = body?.status;
  assertConversationStatus(status);

  const { ref, data } = await getConversationRecord(conversationId);
  assertParticipant(data, actorUserId);

  await updateDoc(ref, {
    status,
    updatedAt: serverTimestamp(),
  });

  const updatedSnapshot = await getDoc(ref);
  return response(200, mapConversation(updatedSnapshot));
}

export async function postMessageEndpoint(userId, conversationId, body) {
  const actorUserId = resolveActorUserId(userId);
  const trimmedBody = String(body?.body || '').trim();
  const status = body?.status || 'sent';
  assertMessageStatus(status);

  if (!trimmedBody) {
    throw new Error('Message body is required.');
  }

  const { ref, data } = await getConversationRecord(conversationId);
  assertParticipant(data, actorUserId);

  const receiverId = data.participantIds.find((participantId) => participantId !== actorUserId);
  if (!receiverId) {
    throw new Error('Could not determine receiver for this conversation.');
  }

  const createdMessageRef = await addDoc(collection(ref, 'messages'), {
    conversationId: ref.id,
    senderId: actorUserId,
    receiverId,
    body: trimmedBody,
    status,
    createdAt: serverTimestamp(),
    readAt: null,
  });

  await updateDoc(ref, {
    lastMessageText: trimmedBody,
    lastMessageAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  const createdMessageSnapshot = await getDoc(createdMessageRef);
  return response(201, mapMessage(createdMessageSnapshot));
}

export async function getMessagesEndpoint(userId, conversationId) {
  const actorUserId = resolveActorUserId(userId);
  const { ref, data } = await getConversationRecord(conversationId);
  assertParticipant(data, actorUserId);

  const snapshot = await getDocs(
    query(collection(ref, 'messages'), orderBy('createdAt', 'desc'))
  );
  return response(200, snapshot.docs.map((item) => mapMessage(item)));
}

export async function patchMessageReadEndpoint(userId, conversationId, messageId) {
  const actorUserId = resolveActorUserId(userId);
  const { ref, data } = await getConversationRecord(conversationId);
  assertParticipant(data, actorUserId);

  if (!messageId) {
    throw new Error('messageId is required.');
  }

  const messageRef = doc(ref, 'messages', messageId);
  const messageSnapshot = await getDoc(messageRef);
  if (!messageSnapshot.exists()) {
    throw new Error('Message not found.');
  }

  const message = mapMessage(messageSnapshot);
  if (!data.participantIds.includes(message.senderId) || !data.participantIds.includes(message.receiverId)) {
    throw new Error('Message participants do not match conversation participants.');
  }

  await updateDoc(messageRef, {
    status: 'read',
    readAt: serverTimestamp(),
  });

  const updatedSnapshot = await getDoc(messageRef);
  return response(200, mapMessage(updatedSnapshot));
}

export function subscribeToMessagesEndpoint(
  userId,
  conversationId,
  onData,
  onError
) {
  resolveActorUserId(userId);
  if (!conversationId) {
    throw new Error('conversationId is required.');
  }

  const conversationRef = doc(db, 'conversations', conversationId);

  return onSnapshot(
    query(collection(conversationRef, 'messages'), orderBy('createdAt', 'desc')),
    (snapshot) => {
      if (typeof onData === 'function') {
        onData(snapshot.docs.map((item) => mapMessage(item)));
      }
    },
    (error) => {
      if (typeof onError === 'function') {
        onError(error);
      }
    }
  );
}
