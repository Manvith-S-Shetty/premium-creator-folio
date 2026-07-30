# Portfolio CMS - Database Design & Schema Specification

This document contains the complete relational database schema for the Portfolio CMS built on **Supabase (PostgreSQL)**, including Row Level Security (RLS) policies, indexes, custom types, Phase 1 core tables, and Phase 2 extensions.

---

## 1. Custom Enums & Types

```sql
-- Phase 2: Content Lifecycle Status Enum
CREATE TYPE content_status AS ENUM ('draft', 'published', 'archived');
```

---

## 2. Table Specifications

### 2.1 `site_settings` (Extended Phase 1 + Phase 2)
Stores global site metadata, styling options, feature toggles, and SEO configurations. Single-row table.

```sql
CREATE TABLE site_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    default_theme VARCHAR(50) DEFAULT 'dark',
    accent_color VARCHAR(50) DEFAULT 'cyan',
    analytics_id VARCHAR(100),
    
    -- Phase 2: Feature Toggles (Section Visibility)
    show_certificates BOOLEAN NOT NULL DEFAULT true,
    show_experience BOOLEAN NOT NULL DEFAULT true,
    show_skills BOOLEAN NOT NULL DEFAULT true,
    show_resume BOOLEAN NOT NULL DEFAULT true,
    show_education BOOLEAN NOT NULL DEFAULT true,
    show_contact BOOLEAN NOT NULL DEFAULT true,
    show_achievements BOOLEAN NOT NULL DEFAULT true,
    show_hackathons BOOLEAN NOT NULL DEFAULT true,

    -- Phase 2: Expanded SEO Fields
    seo_title TEXT,
    seo_description TEXT,
    seo_og_image_url TEXT,
    seo_favicon_url TEXT,
    seo_robots_directive TEXT NOT NULL DEFAULT 'index, follow',

    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);
```

### 2.2 `personal_info`
Hero identity and About section text. Single-row table.

```sql
CREATE TABLE personal_info (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name VARCHAR(255) NOT NULL,
    display_name VARCHAR(255) NOT NULL,
    primary_title VARCHAR(255) NOT NULL,
    tagline_short TEXT,
    bio TEXT NOT NULL,
    personal_story TEXT,
    core_principles TEXT[],
    highlights TEXT[],
    career_objective TEXT,
    tech_interests TEXT[],
    location VARCHAR(255),
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    photo_url TEXT,
    is_available BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);
```

### 2.3 `social_links`
External social profile links.

```sql
CREATE TABLE social_links (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    platform VARCHAR(100) NOT NULL,
    url TEXT NOT NULL,
    icon_name VARCHAR(100),
    display_order INT DEFAULT 0,
    is_visible BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now()
);
```

### 2.4 `skills`
Skill items categorized by domain.

```sql
CREATE TABLE skills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    category VARCHAR(100) NOT NULL, -- e.g., Frontend, Backend, DevOps, AI
    icon_name VARCHAR(100),
    proficiency_level INT CHECK (proficiency_level BETWEEN 1 AND 100),
    years_experience INT DEFAULT 0,
    display_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now()
);
```

### 2.5 `projects` (Phase 2 Updated with `content_status`)
Portfolio project entries with status lifecycle.

```sql
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    short_description TEXT NOT NULL,
    full_description TEXT,
    bullets TEXT[],
    github_url TEXT,
    live_url TEXT,
    thumbnail_url TEXT,
    category VARCHAR(100) NOT NULL,
    is_featured BOOLEAN DEFAULT false,
    status content_status NOT NULL DEFAULT 'published', -- Phase 2: replaces is_published boolean
    display_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);
```

### 2.6 `project_skills` (Junction Table)
Many-to-many join between projects and skills.

```sql
CREATE TABLE project_skills (
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    skill_id UUID REFERENCES skills(id) ON DELETE CASCADE,
    PRIMARY KEY (project_id, skill_id)
);
```

### 2.7 `project_screenshots`
Project gallery images.

```sql
CREATE TABLE project_screenshots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    caption TEXT,
    display_order INT DEFAULT 0
);
```

### 2.8 `certificates` (Phase 2 Updated)
Credentials and certifications.

```sql
CREATE TABLE certificates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    issuer VARCHAR(255) NOT NULL,
    issue_date DATE NOT NULL,
    expiration_date DATE,
    credential_id VARCHAR(255),
    credential_url TEXT,
    pdf_url TEXT,
    thumbnail_url TEXT,
    description TEXT,
    tags TEXT[],
    is_featured BOOLEAN DEFAULT false,
    status content_status NOT NULL DEFAULT 'published', -- Phase 2
    display_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now()
);
```

### 2.9 `experience`
Work history and career milestones.

```sql
CREATE TABLE experience (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company VARCHAR(255) NOT NULL,
    role VARCHAR(255) NOT NULL,
    location VARCHAR(255),
    employment_type VARCHAR(100),
    start_date DATE NOT NULL,
    end_date DATE,
    is_current BOOLEAN DEFAULT false,
    description TEXT NOT NULL,
    company_logo_url TEXT,
    display_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now()
);
```

### 2.10 `experience_skills` (Junction Table)
Many-to-many join between experience and skills.

```sql
CREATE TABLE experience_skills (
    experience_id UUID REFERENCES experience(id) ON DELETE CASCADE,
    skill_id UUID REFERENCES skills(id) ON DELETE CASCADE,
    PRIMARY KEY (experience_id, skill_id)
);
```

### 2.11 `education`
Academic history records.

```sql
CREATE TABLE education (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    institution VARCHAR(255) NOT NULL,
    degree VARCHAR(255) NOT NULL,
    field_of_study VARCHAR(255),
    duration VARCHAR(100) NOT NULL,
    cgpa VARCHAR(50),
    location VARCHAR(255),
    logo_url TEXT,
    display_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now()
);
```

### 2.12 `achievements` (Phase 2 Updated)
Awards and recognitions.

```sql
CREATE TABLE achievements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    issuer VARCHAR(255) NOT NULL,
    date_awarded DATE NOT NULL,
    description TEXT,
    image_url TEXT,
    link_url TEXT,
    status content_status NOT NULL DEFAULT 'published', -- Phase 2
    display_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now()
);
```

### 2.13 `hackathons` (Phase 2 Updated)
Hackathon wins and projects.

```sql
CREATE TABLE hackathons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    organizer VARCHAR(255) NOT NULL,
    position VARCHAR(100) NOT NULL, -- e.g., 1st Place, Finalist
    date_held DATE NOT NULL,
    project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
    certificate_url TEXT,
    images TEXT[],
    description TEXT,
    status content_status NOT NULL DEFAULT 'published', -- Phase 2
    display_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now()
);
```

### 2.14 `resumes`
Uploaded resume PDF records.

```sql
CREATE TABLE resumes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    pdf_url TEXT NOT NULL,
    is_active BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now()
);
```

### 2.15 `contact_submissions`
Form submissions from public portfolio visitors.

```sql
CREATE TABLE contact_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sender_name VARCHAR(255) NOT NULL,
    sender_email VARCHAR(255) NOT NULL,
    subject VARCHAR(255),
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now()
);
```

### 2.16 `media_files`
Metadata audit logs for files in Storage Buckets.

```sql
CREATE TABLE media_files (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    file_name VARCHAR(255) NOT NULL,
    storage_path TEXT NOT NULL,
    bucket_name VARCHAR(100) NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    file_size_bytes BIGINT NOT NULL,
    uploaded_at TIMESTAMPTZ DEFAULT now()
);
```

### 2.17 `activity_log` (Phase 2 New Table)
Audit log recording every CMS administrative action.

```sql
CREATE TABLE activity_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL, -- e.g., 'CREATE', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT', 'LOGIN_FAILED'
    entity_type VARCHAR(100) NOT NULL, -- e.g., 'PROJECT', 'CERTIFICATE', 'SETTINGS', 'AUTH'
    entity_id UUID,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);
```

---

## 3. Row Level Security (RLS) Policies

### 3.1 Public Read Policies (Phase 2 Updated with Status & Toggles)
Public unauthenticated users (`anon`) can read content **only if** `status = 'published'` for status-managed tables.

```sql
-- Projects: Public only reads published projects
CREATE POLICY "Public Read Published Projects"
ON projects FOR SELECT
TO anon, authenticated
USING (status = 'published');

-- Certificates: Public only reads published certificates
CREATE POLICY "Public Read Published Certificates"
ON certificates FOR SELECT
TO anon, authenticated
USING (status = 'published');

-- Achievements: Public only reads published achievements
CREATE POLICY "Public Read Published Achievements"
ON achievements FOR SELECT
TO anon, authenticated
USING (status = 'published');

-- Hackathons: Public only reads published hackathons
CREATE POLICY "Public Read Published Hackathons"
ON hackathons FOR SELECT
TO anon, authenticated
USING (status = 'published');

-- General Public Read for standard tables
CREATE POLICY "Public Read Personal Info" ON personal_info FOR SELECT USING (true);
CREATE POLICY "Public Read Site Settings" ON site_settings FOR SELECT USING (true);
CREATE POLICY "Public Read Social Links" ON social_links FOR SELECT USING (true);
CREATE POLICY "Public Read Skills" ON skills FOR SELECT USING (true);
CREATE POLICY "Public Read Experience" ON experience FOR SELECT USING (true);
CREATE POLICY "Public Read Education" ON education FOR SELECT USING (true);
CREATE POLICY "Public Read Active Resumes" ON resumes FOR SELECT USING (is_active = true);
CREATE POLICY "Public Insert Contact" ON contact_submissions FOR INSERT WITH CHECK (true);
```

### 3.2 Admin Full Access Policies
Authenticated admins (`authenticated` role) have full access to read (including drafts/archived), insert, update, and delete all tables.

```sql
CREATE POLICY "Admin Full Access Projects" ON projects FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin Full Access Certificates" ON certificates FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin Full Access Achievements" ON achievements FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin Full Access Hackathons" ON hackathons FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin Full Access Settings" ON site_settings FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin Full Access Personal Info" ON personal_info FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin Full Access Skills" ON skills FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin Full Access Experience" ON experience FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin Full Access Education" ON education FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin Full Access Resumes" ON resumes FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin Full Access Contact" ON contact_submissions FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin Full Access Media" ON media_files FOR ALL TO authenticated USING (true);

-- Phase 2: Activity Log RLS (Admin Only Read/Write)
ALTER TABLE activity_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admin Full Access Activity Log" ON activity_log FOR ALL TO authenticated USING (true);
```
