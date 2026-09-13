# Explainer: `src/components/portfolio/Certificates.tsx`

## What is this file?

This component renders the public **Certificates** section on the portfolio website, displaying earned credentials, course completions, and formal certifications.

## Why did it change?

The previous card design relied on text descriptions with small link buttons. The redesign transforms this into a modern, visual-first grid featuring dominant thumbnail previews, aligned cards, and a Netflix-style fullscreen viewer modal.

## How does it work?

- **Visual Grid**: Renders responsive cards (3 per row on desktop, 2 on tablet, 1 on mobile). Each card prioritizes visual thumbnail previews over raw text descriptions.
- **Preview Resolution**: Reuses existing certificate data (`thumbnailUrl` or image-formatted `pdfUrl`). For PDF documents without explicit image previews, it gracefully renders an honest, document-style preview badge.
- **Fullscreen Modal**: Clicking "View Certificate" or the card thumbnail opens a translucent backdrop modal powered by `motion/react`.
- **Accessibility & UX**: Locks `document.body` scroll during open state, supports `Escape` key close, backdrop clicks, and prevents accidental closing when interacting with modal content.

## What can users do now?

Visitors can inspect high-resolution certificate images in a distraction-free fullscreen viewer modal and download or verify credentials without losing their position on the page.
