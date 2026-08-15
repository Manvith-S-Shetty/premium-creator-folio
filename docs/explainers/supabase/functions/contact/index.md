# Explainer: `supabase/functions/contact/index.ts`

## What This File Is
`index.ts` is the Supabase Edge Function running on Deno serverless infrastructure that processes incoming contact form submissions.

## Why It Changed
It was modernized to use Deno's native `Deno.serve` API and fortified with multi-layered spam protection (honeypot check, disposable email blocking, IP rate limiting) and Resend HTML email notifications.

## How It Works in Plain Language
- **Preflight & Verification**: Handles CORS `OPTIONS` preflight requests and enforces HTTP POST method validation.
- **Spam Defense**: Silently drops submissions if the honeypot field is filled, rejects disposable email domains, and caps IP submissions to 5 per 10 minutes.
- **Persistence & Notification**: Stores the message in the `messages` table with status `unread` and dispatches a notification email to the admin via Resend SMTP.

## What You Can Now Do
Your backend automatically filters out spam, stores legitimate portfolio inquiries in Supabase, and notifies your email inbox instantly.
