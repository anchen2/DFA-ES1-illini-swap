# Realtime Messaging + Notifications Spec

This document defines the contracts implemented for your deliverable in this repo.

## Scope

Implemented in this project:

- Real-time message event delivery.
- Message read receipts (`message.read`).
- Presence state (`online/offline`, heartbeat, last seen).
- Notification preference endpoints.
- Device token endpoints.
- Notification routing for:
  - new messages
  - new offers
  - offer approvals/declines
- Push decision engine (delivered vs suppressed with reason).

Current implementation mode:

- Uses in-app mock services and local persistence (`AsyncStorage`).
- No external backend required for testing.
- API and event contracts are backend-ready and can be mapped to real endpoints later.

## File Map

- `services/realtime/EventBus.js`
  - Event subscription and publishing utility.
- `services/realtime/RealtimeService.js`
  - Message send/read, presence updates, offer events.
- `services/notifications/NotificationPreferencesService.js`
  - Preference persistence and defaults.
- `services/notifications/DeviceTokenService.js`
  - Device token persistence and CRUD behavior.
- `services/notifications/NotificationService.js`
  - Notification routing + quiet-hour and preference filtering.
- `services/api/MockRealtimeApi.js`
  - Endpoint-style wrappers matching backend contract.
- `RealtimeLabScreen.js`
  - Minimal test UI for end-to-end validation.

## Event Contract

All emitted events share this envelope:

```json
{
  "id": "evt-...",
  "type": "message.new",
  "createdAt": "2026-02-16T20:00:00.000Z",
  "payload": {}
}
```

### `message.new`

Payload:

```json
{
  "id": "msg-...",
  "conversationId": "conv-1",
  "senderId": "dev-user-a",
  "recipientId": "dev-user-b",
  "body": "hello",
  "createdAt": "ISO string",
  "deliveredTo": ["dev-user-b"],
  "readBy": ["dev-user-a"]
}
```

### `message.delivered`

Payload:

```json
{
  "messageId": "msg-...",
  "conversationId": "conv-1",
  "recipientId": "dev-user-b"
}
```

### `message.read`

Payload:

```json
{
  "messageId": "msg-...",
  "conversationId": "conv-1",
  "userId": "dev-user-b",
  "readBy": ["dev-user-a", "dev-user-b"]
}
```

### `presence.changed`

Payload:

```json
{
  "userId": "dev-user-a",
  "online": true,
  "lastSeenAt": "ISO string",
  "heartbeatAt": "ISO string"
}
```

### `offer.created`

Payload:

```json
{
  "offerId": "offer-...",
  "fromUserId": "dev-user-a",
  "toUserId": "dev-user-b",
  "itemTitle": "Desk lamp",
  "status": "pending",
  "createdAt": "ISO string"
}
```

### `offer.statusChanged`

Payload:

```json
{
  "offerId": "offer-...",
  "fromUserId": "dev-user-a",
  "toUserId": "dev-user-b",
  "status": "approved",
  "changedByUserId": "dev-user-b",
  "updatedAt": "ISO string"
}
```

## Endpoint Contract (Mock API)

These are implemented as functions in `services/api/MockRealtimeApi.js`.

### Preferences

- `GET /notifications/preferences`
  - Input: `userId`
  - Output: `{ messages, offers, approvals, quietHours }`

- `PUT /notifications/preferences`
  - Input: `userId`, body:
    ```json
    {
      "messages": true,
      "offers": true,
      "approvals": true,
      "quietHours": {
        "enabled": false,
        "start": "22:00",
        "end": "07:00"
      }
    }
    ```
  - Output: saved preferences object

### Device Tokens

- `POST /notifications/device-token`
  - Input: `userId`, body `{ "token": "dev-token-001", "platform": "expo" }`
  - Output: `{ tokens: [...] }`

- `DELETE /notifications/device-token/:token`
  - Input: `userId`, `token`
  - Output: `{ tokens: [...] }`

- `GET /notifications/device-token`
  - Input: `userId`
  - Output: `{ tokens: [...] }`

### Presence

- `POST /presence/heartbeat`
  - Input: `userId`
  - Output: `{ userId, online, lastSeenAt, heartbeatAt }`

- `GET /presence/:userId`
  - Input: `userId`
  - Output: `{ userId, online, lastSeenAt, heartbeatAt }`

## Notification Decision Rules

A notification is marked `delivered` only when all are true:

1. Preference category is enabled.
2. User is not inside enabled quiet hours.
3. User has at least one device token.

Otherwise it is stored as `suppressed` with reason:

- `disabled_by_preferences`
- `quiet_hours`
- `no_device_tokens`

## Integration Handoff for Teammates

When the DB/API deliverable is ready:

1. Keep event names and payload shapes stable.
2. Replace `MockRealtimeApi` implementations with real network calls.
3. Keep notification routing logic in `NotificationService` or migrate it server-side.
4. Frontend team can consume this exact contract from `RealtimeLabScreen` examples.

