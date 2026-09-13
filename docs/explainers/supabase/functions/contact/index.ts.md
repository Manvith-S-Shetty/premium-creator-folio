# Contact System Edge Function Explainer

## What the file is

`supabase/functions/contact/index.ts` is a Supabase Edge Function that acts as a secure serverless backend endpoint for receiving public portfolio contact submissions.

## Why it changed

The original function was a temporary placeholder returning `"Backend Alive"`. It was overhauled to handle production security, CORS, request validation, sanitization, database persistence, and admin notification emails.

## How it works in plain language

1. When a site visitor fills out the contact form, the request arrives via `POST`. Non-POST requests are rejected with a `405 Method Not Allowed` status.
2. It verifies CORS headers so that web clients can safely communicate with it.
3. It checks that `name`, `email`, `subject`, and `message` are all present, validates that `email` follows a standard pattern, and sanitizes text inputs to prevent XSS attacks.
4. Using the secret Supabase service role key, it inserts the message into the PostgreSQL `messages` table with an initial status of `'unread'`.
5. If configured with a `RESEND_API_KEY`, it sends an automated alert email to the portfolio administrator (`manumanvith06@gmail.com`) summarizing the message details.
6. It returns a structured, predictable JSON response (`{ success: true, message: "..." }`).

## What the user can now do

Visitors can safely submit contact requests, and the admin receives immediate email alerts while messages are securely stored in the database.
