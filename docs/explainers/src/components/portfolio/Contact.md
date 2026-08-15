# Explainer: `src/components/portfolio/Contact.tsx`

## What This File Is
`Contact.tsx` is the public-facing React section component rendering the portfolio contact form, personal location details, and social links.

## Why It Changed
It was updated to integrate honeypot anti-spam protection, enforce a minimum 10-character message context requirement, and delegate submission exclusively to `contactApi.submitMessage(...)`.

## How It Works in Plain Language
- **Honeypot Trap**: Renders an invisible input field (`website`). Automated spam bots fill this field out, which triggers a silent drop at the Edge Function level.
- **Client Validation**: Validates name, valid email structure, subject line, and message length prior to sending network requests.
- **Submission**: On submit, sends data to `contactApi` and transitions to a smooth green confirmation state upon success.

## What You Can Now Do
Visitors can securely send portfolio messages without triggering mail clients or risking spam bot submissions.
