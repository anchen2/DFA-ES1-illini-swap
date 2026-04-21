# Conversation, Message, and Offer API Spec (Placeholder Mode)

This contract is implemented with local dummy storage until Firebase credentials are available.

## Placeholder Mode

- Current persistence: in-memory JS store with seed records.
- Firebase credentials: not required yet.
- Migration plan: keep endpoint shapes the same and replace service implementation later.

## Models

### Conversation

```json
{
  "id": "conv-...",
  "participantIds": ["userA", "userB"],
  "createdBy": "userA",
  "status": "active",
  "lastMessageAt": "ISO string or null",
  "lastMessageText": "string or null",
  "createdAt": "ISO string",
  "updatedAt": "ISO string"
}
```

### Message

```json
{
  "id": "msg-...",
  "conversationId": "conv-...",
  "senderId": "userA",
  "receiverId": "userB",
  "body": "string",
  "status": "sent | delivered | read",
  "createdAt": "ISO string",
  "readAt": "ISO string or null"
}
```

### Offer

```json
{
  "id": "offer-...",
  "conversationId": "conv-...",
  "senderId": "userA",
  "receiverId": "userB",
  "itemId": "placeholder-item",
  "amount": 0,
  "status": "pending | accepted | declined | cancelled",
  "createdAt": "ISO string",
  "updatedAt": "ISO string"
}
```

## Relationships

- One conversation has many messages.
- One conversation has many offers.
- Messages and offers require a valid `conversationId`.

## Conversation API

- `POST /conversations`
  - body: `{ "peerUserId": "dev-user-b", "status": "active" }`
  - response: created or existing conversation + `placeholderOfferId`

- `GET /conversations?direction=all|sent|received&status=active|archived|closed`
  - response: filtered conversations for current user

- `GET /conversations/:id`
  - response: conversation with embedded `messages` and `offers`

- `PATCH /conversations/:id/status`
  - body: `{ "status": "archived" }`

## Message API

- `POST /conversations/:id/messages`
  - body: `{ "body": "Hello", "status": "sent" }`

- `GET /conversations/:id/messages`
  - response: messages in that conversation

## Offer API (Partial for now)

- Implemented: `PATCH /offers/:id/status`
- Not implemented yet by request:
  - `POST /conversations/:id/offers`
  - `GET /conversations/:id/offers`

