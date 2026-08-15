# Contact Types Explainer

## What the file is
`src/lib/types/contact.types.ts` provides TypeScript type definitions for contact submissions, inbox message objects, and API response structures.

## Why it changed
This file was created to provide strict typing across `contact.api.ts`, the frontend `Contact` component, and the CMS Inbox module.

## How it works in plain language
It defines the precise shape of data moving through the contact system:
- `ContactSubmissionPayload`: `name`, `email`, `subject`, and `message`.
- `ContactMessageDTO`: Represents a stored database message, including its `id`, `status` (`'unread'`, `'read'`, `'replied'`, `'archived'`), and timestamps.
- `ContactMessagesResponse`: Paginated array of DTOs with `totalCount`.

## What the user can now do
Developers benefit from autocompletion and compile-time type safety across all contact features.
