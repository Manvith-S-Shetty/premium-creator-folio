# Teaching Guide: The Portfolio Contact & Messaging System

Welcome! This guide explains how your portfolio's contact form, email notifications, spam protection, and CMS inbox reply system work together. It is written step-by-step so you can understand both the architecture and day-to-day operation.

---

## 1. The Complete End-to-End Flow

Here is the exact journey of a message from the moment a visitor hits **Send**:

1. **Visitor Action**: A visitor fills out the contact form on your portfolio (`Contact.tsx`).
2. **Frontend Validation**: React checks that fields aren't empty, the email looks valid, and the message contains at least 10 characters.
3. **API Layer Dispatch**: `Contact.tsx` calls `contactApi.submitMessage()`. The component **never** talks to the database directly.
4. **Serverless Edge Function**: The request reaches the Supabase Edge Function (`supabase/functions/contact/index.ts`).
5. **Spam Defense**:
   - **Honeypot Trap**: Checks if the hidden `website` field was filled (bots fill hidden fields; humans don't). If filled, it silently drops the submission.
   - **Disposable Email Check**: Rejects temporary email services like `mailinator.com`.
   - **Rate Limiting**: Enforces a limit of 5 submissions per IP every 10 minutes.
6. **Database Persistence**: Legitimate messages are saved to the `messages` table in Supabase Postgres with initial status `unread`.
7. **Email Notification**: The Edge Function calls the Resend API to deliver a rich HTML notification email directly to your Gmail inbox.
8. **CMS Inbox**: When you log into your Admin CMS (`/admin/contact`), the inbox displays the new message with an **Unread** badge.
9. **Admin Reply**: Click **Reply in CMS**, type your response, and hit **Send Reply via Resend**.
10. **Delivery & Status Update**: The `reply-contact` Edge Function sends your reply to the visitor's email address and updates the database message status to `replied`.

---

## 2. Why Architectural Layers Matter

Why not let the React component write directly to the database or send emails directly?

### Security & Secret Protection

- Email delivery services like **Resend** require secret API keys. If you put API keys in React client code, anyone inspecting the browser source code could steal your key and send emails from your domain!
- By keeping logic inside Supabase Edge Functions, secrets remain 100% server-side in encrypted environment variables (`RESEND_API_KEY`).

### Clean Separation of Concerns

- **UI Components** (`Contact.tsx`): Focus strictly on rendering inputs, animations, and user feedback.
- **API Client** (`contact.api.ts`): Handles network requests and data transformation.
- **Edge Functions** (`supabase/functions/`): Handle business rules, security, rate limiting, and third-party integrations.

---

## 3. Security, CORS & Spam Protection Explained

- **CORS (Cross-Origin Resource Sharing)**: Edge Functions use CORS headers (`Access-Control-Allow-Origin: *`) and handle HTTP `OPTIONS` preflight requests so your web application can talk to serverless endpoints smoothly without browser security blocks.
- **Input Sanitization**: Prevents HTML/Script injection attacks by escaping characters (`<`, `>`, `&`, `"`) before saving text to the database.
- **Honeypot Trap**: Invisible field `website` embedded in the form. Since human users cannot see it, only automated spam bots fill it in.
- **Disposable Email Blocking**: Blocks known throwaway email domain providers to ensure high inbox quality.
- **Rate Limiting**: Prevents denial-of-service or spam floods by capping requests per IP address.

---

## 4. Day-to-Day Admin Inbox Management

From your CMS Admin Panel (`/admin/contact`):

- **Filter Messages**: Switch between **All**, **Unread**, **Read**, **Replied**, and **Archived** filters.
- **Search**: Search by sender name, email address, subject line, or message content.
- **Auto-Read**: Clicking any unread message automatically marks it as `read`.
- **Reply**: Click **Reply in CMS** to compose and send an instant email response via Resend.
- **Archive / Delete**: Archive messages to clean up your active inbox or permanently delete unwanted items.
