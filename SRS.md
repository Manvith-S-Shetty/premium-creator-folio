# Portfolio CMS - Software Requirements Specification (SRS)

## 1. Introduction & Project Scope
The Portfolio CMS is a full-stack content management system designed for a developer/creator portfolio. It enables real-time administration of personal identity, projects, work experience, skills, certificates, hackathons, and media assets via a secure dashboard.

- **Phase 1 Foundation**: Single-admin auth, Hero/About, Projects, Certificates, Skills, Experience, Education, Achievements, Hackathons, Resume PDF, Contact form capture, and Storage media library.
- **Phase 2 Additions**: Feature toggles for section visibility, audit activity log, content lifecycle status (`draft`, `published`, `archived`), and expanded SEO controls.

---

## 2. System Features & Functional Requirements

### 2.1 Section Visibility Feature Toggles (Phase 2)
* **FR-TOGGLE-01**: The system shall store 8 section visibility boolean flags in `site_settings`: `show_certificates`, `show_experience`, `show_skills`, `show_resume`, `show_education`, `show_contact`, `show_achievements`, `show_hackathons`.
* **FR-TOGGLE-02**: The admin interface at `/admin/settings` shall provide interactive toggle switches to enable or disable each portfolio section.
* **FR-TOGGLE-03**: Public portfolio components shall read `site_settings` and conditionally hide or display respective UI sections based on flag states.

### 2.2 Activity Log & Audit Trail (Phase 2)
* **FR-ACT-01**: The system shall record an immutable entry in the `activity_log` table whenever an administrative action occurs (CREATE, UPDATE, DELETE, PUBLISH, UNPUBLISH, LOGIN, LOGOUT, LOGIN_FAILED).
* **FR-ACT-02**: Activity log records shall store `admin_user_id`, `action`, `entity_type`, `entity_id`, human-readable `description`, and `created_at` timestamp.
* **FR-ACT-03**: The admin interface shall provide a read-only page at `/admin/activity` displaying recent audit logs with filter controls by action type and date range.
* **FR-ACT-04**: Activity log access shall be strictly guarded by RLS policies permitting only authenticated administrators.

### 2.3 Content Lifecycle Status (Phase 2)
* **FR-STATUS-01**: The system shall support a `content_status` enum with values `'draft'`, `'published'`, and `'archived'`.
* **FR-STATUS-02**: Content status shall apply to Projects, Certificates, Achievements, and Hackathons (migrating legacy `is_published` boolean fields).
* **FR-STATUS-03**: Admin list views for Projects, Certificates, Achievements, and Hackathons shall provide filtering tabs/dropdowns for `'All'`, `'Published'`, `'Draft'`, and `'Archived'`.
* **FR-STATUS-04**: Public database queries and RLS SELECT policies shall strictly filter and return records where `status = 'published'`.
* **FR-STATUS-05**: Status transitions shall be set directly by admin users upon saving content (no scheduled/cron publishing logic).

### 2.4 Expanded SEO & Favicon Management (Phase 2)
* **FR-SEO-01**: The system shall store expanded SEO metadata in `site_settings`: `seo_title`, `seo_description`, `seo_og_image_url`, `seo_favicon_url`, and `seo_robots_directive` (defaulting to `"index, follow"`).
* **FR-SEO-02**: The admin settings page at `/admin/settings` shall provide form fields to manage these SEO parameters.
* **FR-SEO-03**: The public application header shall dynamically update `<title>`, `<meta name="description">`, `<meta property="og:image">`, `<link rel="icon">`, and `<meta name="robots">` tags based on `site_settings`.

---

## 3. Non-Functional Requirements
* **Security**: RLS enforced across all Supabase tables; admin routes protected via JWT verification.
* **Performance**: Asset uploads processed asynchronously; media URLs fetched from Supabase CDN.
* **Usability**: Responsive dark-mode UI with immediate visual feedback and error notifications.
