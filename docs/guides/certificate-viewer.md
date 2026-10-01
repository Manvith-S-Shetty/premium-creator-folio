# Certificate Viewer & Card Redesign Guide

Welcome! This guide explains the architecture, design choices, and technical implementation of the redesigned Certificate section and Fullscreen Modal Viewer.

---

## 1. End-to-End Card-to-Modal Interaction

The Certificate component follows a simple, state-driven workflow:

```
[Public Visitor] ──> Clicks Card or "View Certificate" Button
                             │
                             ▼
              setActiveCert(certificateData)
                             │
                             ▼
    ┌─────────────────────────────────────────────────┐
    │  Body Scroll Locked (document.body.style = 'hidden') │
    │  Modal AnimatePresence Fade & Scale-in (300ms)  │
    └─────────────────────────────────────────────────┘
                             │
              User Interactions in Modal:
              ├── Click Outside (Backdrop) ──> Close
              ├── Press 'Escape' Key      ──> Close
              ├── Click 'X' Close Button  ──> Close
              └── Click Download / Link   ──> Opens/Downloads File
                             │
                             ▼
              setActiveCert(null) (Scroll restored)
```

1. **Card Rendering**: Cards render in a responsive grid (`grid-cols-1 md:grid-cols-2 lg:grid-cols-3`). Each card displays a prominent visual thumbnail preview container, organization name + date, title, and a "View Certificate" button.
2. **Modal Trigger**: Clicking anywhere on the card thumbnail or the "View Certificate" button updates state (`activeCert`).
3. **Modal Mount**: React conditionally mounts the `AnimatePresence` modal container.

---

## 2. Thumbnail Resolution Strategy (Field Reuse & PDF Fallback)

To avoid breaking changes, heavy external rendering libraries, or database alterations, the component uses an elegant 3-tier fallback strategy for visual previews:

```ts
function getCertPreview(cert: CertItem): string | null {
  // 1. Explicit image thumbnail uploaded via CMS
  if (cert.thumbnailUrl) return cert.thumbnailUrl;

  // 2. Main file URL if it is an image format (.png, .jpg, .webp, .svg)
  if (isImageUrl(cert.downloadUrl)) return cert.downloadUrl!;

  // 3. Null -> Fallback to clean document-style preview badge
  return null;
}
```

### Why this approach?

- **Zero DB Migration**: The existing PostgreSQL table `certificates` already had `thumbnail_url`, and `CertificateDTO` already exposed `thumbnailUrl`.
- **Zero Third-Party PDF Overhead**: Rather than bundling heavy PDF rendering engines, PDF certificates display a clean document badge with issuer tag on cards, while the modal offers direct PDF viewing and downloading.

---

## 3. Animations, Scroll Locking & Keyboard Accessibility

### Smooth Animations (`motion/react`)

- **Card Hover**: Subtle scale (`hover:scale-105`), accent border glow (`border-cyan-500/40`), and visual cue overlay fade.
- **Modal Entry/Exit**: Backdrop fades in (`opacity: 0 -> 1`), modal content scales smoothly (`scale: 0.95 -> 1`, `ease: [0.16, 1, 0.3, 1]`) over `300ms`.

### Body Scroll Lock

When the modal opens, document scrolling is suspended to prevent background jumps:

```ts
useEffect(() => {
  if (activeCert) {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }
}, [activeCert]);
```

### Closing Interactions & Event Bubbling

- **Backdrop Click**: Clicking the overlay (`onClick={() => setActiveCert(null)}`) closes the modal.
- **Modal Content Click**: Contained elements use `e.stopPropagation()` so clicking inside the modal does not accidentally close it.
- **Escape Key**: A `keydown` listener triggers modal close when `Escape` is pressed.

---

## 4. Reusing CMS, API & Storage Without Duplication

- **Database**: Reuses existing `public.certificates` table.
- **API & Query**: Reuses `publicApi.getCertificates()` and `usePortfolioData()`.
- **Storage**: Reuses Supabase `'certificates'` storage bucket and standard `ImageUploader` component in CMS.
- **CMS Manager**: Updated `/admin/certificates` route allows uploading an optional preview thumbnail image alongside the certificate document.
