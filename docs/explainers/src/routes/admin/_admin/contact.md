# Explainer: `src/routes/admin/_admin/contact.tsx`

## What This File Is
`contact.tsx` is the TanStack Router CMS admin page component for managing inbox messages and updating public contact details.

## Why It Changed
It was upgraded from a static placeholder page to an interactive messaging hub with an embedded in-CMS reply modal and real-time status banner.

## How It Works in Plain Language
- **Inbox Management**: Displays messages with status filters (`all`, `unread`, `read`, `replied`, `archived`), search, and pagination.
- **Auto-Read & Reply Modal**: Automatically marks unread messages as `read` when opened and provides an in-CMS modal to compose and send direct email replies.

## What You Can Now Do
You can search, read, archive, delete, and reply to all portfolio messages directly within your admin panel.
