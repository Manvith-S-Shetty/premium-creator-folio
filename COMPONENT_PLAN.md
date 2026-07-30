# Portfolio CMS - Component Architecture & Plan

This document outlines the React component hierarchy, admin route components, UI controls, and state integration for Phase 1 and Phase 2.

---

## 1. Admin Layout & Routing Architecture

```
src/
├── routes/
│   ├── admin/
│   │   ├── login.tsx                 # Public Admin Login Page
│   │   └── _admin.tsx                # Protected Layout Route Wrapper
│   │       ├── index.tsx             # CMS Dashboard Overview & Quick Actions
│   │       ├── hero.tsx              # Hero Identity Manager
│   │       ├── about.tsx             # Story & Principles Manager
│   │       ├── projects.tsx          # Projects CRUD List & Modal
│   │       ├── skills.tsx            # Skills Manager
│   │       ├── experience.tsx        # Work History Manager
│   │       ├── education.tsx         # Education History Manager
│   │       ├── certificates.tsx      # Certifications CRUD
│   │       ├── achievements.tsx      # Awards CRUD
│   │       ├── hackathons.tsx        # Hackathons CRUD
│   │       ├── media.tsx             # Media Library Storage Browser
│   │       ├── resume.tsx            # Resume PDF Manager
│   │       ├── settings.tsx          # Site Settings, Feature Toggles & SEO
│   │       └── activity.tsx          # [Phase 2] Activity Log Audit Viewer
```

---

## 2. Phase 2 Component UI Additions

### 2.1 Settings Page Updates (`src/routes/admin/_admin/settings.tsx`)
* **Feature Toggles Panel**:
  - Grid of 8 interactive switch controls for `show_certificates`, `show_experience`, `show_skills`, `show_resume`, `show_education`, `show_contact`, `show_achievements`, `show_hackathons`.
  - Controlled state bound to `site_settings` state.
* **Expanded SEO Configuration Panel**:
  - `FormInput` for SEO Title (`seo_title`).
  - `FormTextArea` for Meta Description (`seo_description`).
  - `ImageUploader` for OpenGraph Share Image (`seo_og_image_url`).
  - `ImageUploader` for Favicon Icon (`seo_favicon_url`).
  - Select dropdown for Robots Directive (`seo_robots_directive` e.g., `"index, follow"`, `"noindex, nofollow"`).

### 2.2 Activity Log Route (`src/routes/admin/_admin/activity.tsx`)
* **Audit Trail Table**:
  - Table columns: Timestamp (`created_at`), Admin (`admin_user_id`), Action Badge (`action`), Entity Type (`entity_type`), Entity ID (`entity_id`), Description (`description`).
* **Filter Toolbar**:
  - Action Filter Select: `All Actions`, `CREATE`, `UPDATE`, `DELETE`, `LOGIN`, `LOGOUT`, `LOGIN_FAILED`.
  - Entity Type Filter Select: `All Entities`, `PROJECT`, `CERTIFICATE`, `SKILL`, `SETTINGS`, `AUTH`.
  - Search Input: Free-text search on description.

### 2.3 Status Filter & Badge Components
* **Status Badge (`StatusBadge.tsx`)**:
  - Visual indicator pill with color coding:
    - `published` -> Emerald pill (`bg-emerald-500/10 text-emerald-400 border-emerald-500/30`)
    - `draft` -> Amber pill (`bg-amber-500/10 text-amber-400 border-amber-500/30`)
    - `archived` -> Slate pill (`bg-slate-500/10 text-slate-400 border-slate-500/30`)
* **Status Filter Tabs**:
  - Added to list views in `projects.tsx`, `certificates.tsx`, `achievements.tsx`, and `hackathons.tsx`.
  - Tab options: `All`, `Published`, `Draft`, `Archived`.
* **Form Status Dropdown Selector**:
  - Select control added to create/edit form drawers/modals allowing status selection (`Draft`, `Published`, `Archived`).

---

## 3. Public Section Visibility Guarding
Public section components (`About.tsx`, `ProjectsSection.tsx`, `Certificates.tsx`, etc.) integrate with `usePortfolioData()`:
```tsx
const { settings, certificates } = usePortfolioData();

if (!settings?.show_certificates) {
  return null; // Section disabled by admin toggle
}
```
