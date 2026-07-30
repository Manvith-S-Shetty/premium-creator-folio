# Portfolio CMS - Antigravity Implementation Guide

This guide outlines the milestone roadmap, execution steps, and developer standing rules for implementing the Portfolio CMS.

---

## 1. Standing Rule: Beginner-Friendly Per-File Explainers

> [!IMPORTANT]
> **MANDATORY STANDING RULE FOR ALL IMPLEMENTATION MILESTONES**
> Whenever a code file is created or meaningfully modified during implementation, you MUST also create or update a companion file at `docs/explainers/<same-path-with-.md>.md` (mirroring the source path, e.g. `src/hooks/admin/useAuth.ts` → `docs/explainers/src/hooks/admin/useAuth.md`).
> 
> Each explainer must be written for a beginner — no jargon without a one-line definition — and cover exactly four things briefly:
> 1. **What this file is** — one or two plain-English sentences.
> 2. **Why it changed** — what problem or requirement this file addresses.
> 3. **How it works** — a short walkthrough of the logic, in plain language, not a line-by-line code dump.
> 4. **What difference it makes** — what the user can now do or see in the app because of this file that they couldn't before.
> 
> Keep each explainer short (under ~200 words) for fast learning. This applies to every milestone from here forward, including Phase 1 files already built (backfill explainers as time allows, but do not block new milestones on backfilling).

---

## 2. Milestone Roadmap Sequence

### Phase 1 Milestones (Baseline Core CMS)
- **Milestone 1: Database Setup & RLS Initialization**
  - Execute `supabase/schema.sql` and `seed.sql`. Set up single-admin auth and storage buckets.
- **Milestone 2: Auth Context & Protected Routing**
  - Wire `useAuth`, `ProtectedRoute`, `AdminLogin`, and `_admin.tsx` layout.
- **Milestone 3: Core Personal Info & Settings CRUD**
  - Build `hero.tsx`, `about.tsx`, and basic `settings.tsx`.
- **Milestone 4: Dynamic Portfolio Sections CRUD**
  - Implement `projects.tsx`, `skills.tsx`, `experience.tsx`, `education.tsx`, `certificates.tsx`, `achievements.tsx`, `hackathons.tsx`.
- **Milestone 5: Media Storage Library & Resumes**
  - Implement `media.tsx`, `ImageUploader.tsx`, and `resume.tsx`.
- **Milestone 6: Public Portfolio Data Integration**
  - Connect public pages (`usePortfolioData.ts`) to Supabase queries.

---

### Phase 2 Milestones (Value Extensions)

#### Milestone 7: Database Migration & Schema Extensions
* **Tasks**:
  1. Add `content_status` enum (`'draft'`, `'published'`, `'archived'`).
  2. Alter `projects`, `certificates`, `achievements`, and `hackathons` tables to add `status content_status DEFAULT 'published'`.
  3. Add 8 boolean feature toggle columns (`show_certificates`, `show_experience`, etc.) and 5 SEO fields (`seo_title`, `seo_description`, etc.) to `site_settings`.
  4. Create `activity_log` table and RLS policies.
  5. Update `src/lib/types/cms.types.ts` with Phase 2 DTOs.
* **Explainers to create/update**:
  - `docs/explainers/src/lib/types/cms.types.md`

#### Milestone 8: Activity Logger Service & Audit Middleware Integration
* **Tasks**:
  1. Create `src/lib/api/activity.api.ts` module with `logActivity()` and `getActivityLogs()`.
  2. Instrument `adminApi` CRUD methods and `useAuth` login/logout handlers to automatically record audit log rows.
  3. Create read-only `/admin/activity` page with action and date filters.
* **Explainers to create/update**:
  - `docs/explainers/src/lib/api/activity.api.md`
  - `docs/explainers/src/routes/admin/_admin/activity.md`

#### Milestone 9: Admin Settings UI & Public Feature Toggle Guarding
* **Tasks**:
  1. Add feature toggle switches and expanded SEO fields in `/admin/settings.tsx`.
  2. Add status filter tabs (`All`, `Published`, `Draft`, `Archived`) and status selector dropdowns to Projects, Certificates, Achievements, and Hackathons admin pages.
  3. Update public components (`usePortfolioData.ts`) to verify section visibility flags and restrict public data fetching to `status = 'published'`.
* **Explainers to create/update**:
  - `docs/explainers/src/routes/admin/_admin/settings.md`
  - `docs/explainers/src/routes/admin/_admin/projects.md`
  - `docs/explainers/src/hooks/public/usePortfolioData.md`
