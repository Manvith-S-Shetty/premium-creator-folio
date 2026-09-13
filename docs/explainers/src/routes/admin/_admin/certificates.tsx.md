# Explainer: `src/routes/admin/_admin/certificates.tsx`

## What is this file?

This file defines the CMS Admin route for managing portfolio certificates (`/admin/certificates`). It allows authorized administrators to create, edit, reorder, preview, and delete certificate records stored in Supabase.

## Why did it change?

To support the redesigned public Certificate section with visual thumbnail cards, the CMS form was updated to include an optional `Certificate Preview Thumbnail` uploader alongside the primary document file uploader.

## How does it work?

- **Form Inputs**: Provides fields for Title, Issuer, Issue Date, Verification URL, Description, Document File (`pdfUrl`), and Preview Thumbnail (`thumbnailUrl`).
- **File Upload**: Reuses the project's standard `ImageUploader` component, uploading images directly to the `'certificates'` Supabase storage bucket via `mediaApi.uploadMedia`.
- **Database Upsert**: Passes `thumbnailUrl` to `adminApi.upsertCertificate`, which saves `thumbnail_url` into the `certificates` database table.

## What can users do now?

Admins can easily upload custom high-resolution image thumbnails for certificates (including PDF documents) directly from the CMS manager, ensuring the public portfolio displays crisp card previews.
