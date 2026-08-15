# Explainer: `src/lib/api/contact.api.ts`

## What This File Is
`contact.api.ts` is the frontend API client module responsible for managing contact communications and inbox messaging. It acts as the explicit interface between React components and the backend.

## Why It Changed
It was updated to support direct in-CMS email replies to portfolio visitors by adding the `replyToMessage(...)` method, which securely dispatches outbound requests to the `reply-contact` Edge Function.

## How It Works in Plain Language
- **Public Submission**: Sends visitor message payloads directly to the `/functions/v1/contact` serverless Edge Function. It never calls `supabase.from('messages')` directly from the client.
- **Admin Inbox & Reply**: Queries the `messages` table with search, pagination, and status filters, and invokes `/functions/v1/reply-contact` to dispatch email responses.

## What You Can Now Do
You can trigger visitor message submissions from the public website and initiate automated email replies directly from the CMS.
