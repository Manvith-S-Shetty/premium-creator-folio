# Explainer: `supabase/functions/reply-contact/index.ts`

## What This File Is
`reply-contact/index.ts` is a dedicated Supabase Edge Function that handles outbound admin email responses sent to portfolio visitors.

## Why It Changed
Created to allow admins to reply to messages directly inside the CMS without exposing Resend API keys or requiring external email client software.

## How It Works in Plain Language
- **Payload Validation**: Validates `messageId`, `recipientEmail`, `replySubject`, and `replyMessage`.
- **Outbound Email**: Connects securely to Resend API server-side and sends an HTML formatted email to the visitor's inbox.
- **Status Sync**: Automatically updates the corresponding database record in the `messages` table from `read` to `replied`.

## What You Can Now Do
You can write and send professional email replies to visitors directly from your CMS dashboard with full tracking.
