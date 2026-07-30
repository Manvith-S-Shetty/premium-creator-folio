# Portfolio CMS - Future Roadmap (Deferred Features)

This document lists intentionally deferred features for future phases, along with the technical architectural reasoning for postponing each item.

---

### 1. Analytics Dashboard
* **Reasoning**: We recommend using established external providers such as Vercel Analytics or Plausible instead of spending engineering effort building a custom visitor-tracking ingestion pipeline in Supabase.

### 2. Contact Message Center with Reply-from-CMS
* **Reasoning**: Replying directly to messages within the CMS requires integration with a dedicated transactional email service provider (e.g., Resend or SendGrid), which warrants a separate scoping effort.

### 3. AI Assistant (Content Generation inside CMS)
* **Reasoning**: Implementing AI content assistance is its own standalone project, requiring secure API key management, per-token cost controls, prompt engineering, and UI streaming integrations.

### 4. Scheduled Publishing
* **Reasoning**: Scheduled publishing requires external cron workers or Supabase Edge Functions, and is only worth introducing once manual draft/published status management proves insufficient.

### 5. Backup & Restore with Rollback UI
* **Reasoning**: Supabase provides automated point-in-time recovery (PITR) on paid tiers; developing a custom client-side snapshot rollback engine is unnecessary for this project.

### 6. Multi-Admin Support
* **Reasoning**: While the database schema does not block adding a `role` column in the future, user invitation and role-based access management (RBAC) UI are intentionally deferred while single-admin auth suffices.
