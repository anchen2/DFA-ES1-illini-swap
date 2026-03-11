# Realtime Lab Test Guide

This guide shows how to validate your deliverable in the app today.

## Open the Lab

Use either path:

- Sign up screen -> `Dev: Open Realtime Lab`
- Home screen top-right message icon -> `RealtimeLab`

## Quick Start Test Flow

Run this sequence to demonstrate all requirements.

1. Apply user context
   - In `Identity`, set:
     - `Current user id`: `dev-user-a`
     - `Peer user id`: `dev-user-b`
   - Tap `Apply User Context`.

2. Register a device token
   - In `Device Token Endpoints`, keep token `dev-token-001`.
   - Tap `Register Token`.
   - Confirm token appears in registered token list.

3. Verify real-time message delivery
   - In `Messaging + Read Receipts`, set:
     - `Conversation id`: `conv-1`
     - message body: any text
   - Tap `Send Message Event`.
   - Confirm `message.new` and `message.delivered` appear in event log.
   - Confirm `Notification Feed` gets `New message` (delivered).

4. Verify read receipts
   - Tap `Emit message.read` (uses latest message id).
   - Confirm `message.read` appears in event log.

5. Verify online status + heartbeat
   - In `Presence`, tap `Set Online`, then `Set Offline`.
   - Tap `POST /presence/heartbeat`.
   - Tap `GET /presence/:userId`.
   - Confirm presence updates in event log and state label.

6. Verify offer and approval notifications
   - In `Offer + Approval Notifications`, tap `Create Offer Event`.
   - Confirm `offer.created` event and notification.
   - Tap `Approve` or `Decline`.
   - Confirm `offer.statusChanged` event and approval notification.

7. Verify notification preferences
   - Disable `Messages`.
   - Tap `PUT preferences`.
   - Send another message.
   - Confirm feed entry is `SUPPRESSED` with `disabled_by_preferences`.

8. Verify quiet hours logic
   - Enable `Quiet Hours`.
   - Set a range that includes current local time.
   - Tap `PUT preferences`.
   - Send message or create offer.
   - Confirm feed entry is `SUPPRESSED` with `quiet_hours`.

9. Verify missing token suppression
   - Delete the registered token.
   - Send message.
   - Confirm feed entry is `SUPPRESSED` with `no_device_tokens`.

## Notes

- Notification feed stores both delivered and suppressed outcomes for debugging.
- Preferences and tokens are persisted per user in `AsyncStorage`.
- Event log shows realtime event stream from the in-app bus.

## What to Demo in Class

- Real-time message event (`message.new`) and read receipt (`message.read`).
- Presence updates and heartbeat endpoint behavior.
- Notifications for message, offer, approval.
- Preference filtering and quiet-hours suppression.

