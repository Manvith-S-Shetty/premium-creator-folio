-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

--------------------------------------------------------------------------------
-- 1. ENUMS & UTILITY FUNCTIONS
--------------------------------------------------------------------------------

CREATE TYPE public.employment_type_enum AS ENUM (
    'Full-time', 'Part-time', 'Internship', 'Contract', 'Freelance'
);

CREATE TYPE public.project_status_enum AS ENUM (
    'Completed', 'In Progress', 'Archived'
);

-- Trigger function for dynamic updated_at timestamps
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

--------------------------------------------------------------------------------
-- 2. HERO, ABOUT & PERSONAL INFO TABLE
--------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.personal_info (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name VARCHAR(100) NOT NULL,
    display_name VARCHAR(100) NOT NULL,
    primary_title VARCHAR(150) NOT NULL,
    tagline_short VARCHAR(255) NOT NULL,
    bio TEXT NOT NULL,
    personal_story TEXT,
    core_principles TEXT[] DEFAULT '{}',
    highlights TEXT[] DEFAULT '{}',
    career_objective TEXT,
    tech_interests TEXT[] DEFAULT '{}',
    location VARCHAR(100),
    email VARCHAR(150) NOT NULL,
    phone VARCHAR(50),
    photo_url TEXT,
    is_available BOOLEAN DEFAULT true,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.personal_info ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public Read Personal Info" ON public.personal_info;
CREATE POLICY "Public Read Personal Info" 
ON public.personal_info FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin All Personal Info" ON public.personal_info;
CREATE POLICY "Admin All Personal Info" 
ON public.personal_info FOR ALL TO authenticated 
USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

--------------------------------------------------------------------------------
-- 3. SITE SETTINGS TABLE (SINGLE-ROW PATTERN)
--------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.site_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    default_theme VARCHAR(20) DEFAULT 'dark',
    accent_color VARCHAR(50) DEFAULT 'cyan-indigo',
    seo_meta_title VARCHAR(200) DEFAULT 'Manvith S Shetty | Software Engineer Portfolio',
    seo_meta_description TEXT DEFAULT 'Software Engineer & AI/ML Enthusiast Portfolio',
    og_image_url TEXT,
    analytics_id VARCHAR(100),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public Read Site Settings" ON public.site_settings;
CREATE POLICY "Public Read Site Settings" 
ON public.site_settings FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin All Site Settings" ON public.site_settings;
CREATE POLICY "Admin All Site Settings" 
ON public.site_settings FOR ALL TO authenticated 
USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

--------------------------------------------------------------------------------
-- 4. SOCIAL LINKS TABLE
--------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.social_links (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    platform VARCHAR(50) NOT NULL UNIQUE,
    url TEXT NOT NULL,
    icon_name VARCHAR(50),
    display_order INT DEFAULT 0,
    is_visible BOOLEAN DEFAULT true
);

ALTER TABLE public.social_links ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public Read Social Links" ON public.social_links;
CREATE POLICY "Public Read Social Links" ON public.social_links FOR SELECT USING (is_visible = true);
DROP POLICY IF EXISTS "Admin All Social Links" ON public.social_links;
CREATE POLICY "Admin All Social Links" ON public.social_links FOR ALL TO authenticated USING (auth.role() = 'authenticated');

--------------------------------------------------------------------------------
-- 5. SKILLS TABLE
--------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.skills (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL UNIQUE,
    category VARCHAR(50) NOT NULL,
    icon_name VARCHAR(50),
    proficiency_level INT CHECK (proficiency_level BETWEEN 0 AND 100),
    years_experience NUMERIC(3,1),
    display_order INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_skills_category ON public.skills(category);
CREATE INDEX IF NOT EXISTS idx_skills_order ON public.skills(display_order ASC);

ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public Read Skills" ON public.skills;
CREATE POLICY "Public Read Skills" ON public.skills FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admin All Skills" ON public.skills;
CREATE POLICY "Admin All Skills" ON public.skills FOR ALL TO authenticated USING (auth.role() = 'authenticated');

--------------------------------------------------------------------------------
-- 6. PROJECTS TABLE & JUNCTION TABLES
--------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug VARCHAR(150) NOT NULL UNIQUE,
    title VARCHAR(200) NOT NULL,
    short_description TEXT NOT NULL,
    full_description TEXT,
    bullets TEXT[] DEFAULT '{}',
    github_url TEXT,
    live_url TEXT,
    thumbnail_url TEXT,
    video_url TEXT,
    category VARCHAR(50) NOT NULL,
    difficulty VARCHAR(30),
    status public.project_status_enum DEFAULT 'Completed',
    is_featured BOOLEAN DEFAULT false,
    is_published BOOLEAN DEFAULT true,
    display_order INT DEFAULT 0,
    start_date DATE,
    end_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_projects_slug ON public.projects(slug);
CREATE INDEX IF NOT EXISTS idx_projects_published_order ON public.projects(is_published, display_order ASC);

CREATE TABLE IF NOT EXISTS public.project_screenshots (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    caption VARCHAR(255),
    display_order INT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS public.project_skills (
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
    skill_id UUID REFERENCES public.skills(id) ON DELETE CASCADE,
    PRIMARY KEY (project_id, skill_id)
);

ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_screenshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_skills ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public Read Projects" ON public.projects;
CREATE POLICY "Public Read Projects" ON public.projects FOR SELECT USING (is_published = true);
DROP POLICY IF EXISTS "Admin All Projects" ON public.projects;
CREATE POLICY "Admin All Projects" ON public.projects FOR ALL TO authenticated USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Public Read Screenshots" ON public.project_screenshots;
CREATE POLICY "Public Read Screenshots" ON public.project_screenshots FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admin All Screenshots" ON public.project_screenshots;
CREATE POLICY "Admin All Screenshots" ON public.project_screenshots FOR ALL TO authenticated USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Public Read Project Skills" ON public.project_skills;
CREATE POLICY "Public Read Project Skills" ON public.project_skills FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admin All Project Skills" ON public.project_skills;
CREATE POLICY "Admin All Project Skills" ON public.project_skills FOR ALL TO authenticated USING (auth.role() = 'authenticated');

--------------------------------------------------------------------------------
-- 7. CERTIFICATES TABLE
--------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.certificates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(200) NOT NULL,
    issuer VARCHAR(150) NOT NULL,
    issue_date DATE NOT NULL,
    expiration_date DATE,
    credential_id VARCHAR(100),
    credential_url TEXT,
    pdf_url TEXT NOT NULL,
    thumbnail_url TEXT,
    description TEXT,
    tags TEXT[] DEFAULT '{}',
    is_featured BOOLEAN DEFAULT false,
    display_order INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_certificates_order ON public.certificates(display_order ASC);

ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public Read Certificates" ON public.certificates;
CREATE POLICY "Public Read Certificates" ON public.certificates FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admin All Certificates" ON public.certificates;
CREATE POLICY "Admin All Certificates" ON public.certificates FOR ALL TO authenticated USING (auth.role() = 'authenticated');

--------------------------------------------------------------------------------
-- 8. EXPERIENCE TABLE & JUNCTION
--------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.experience (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company VARCHAR(150) NOT NULL,
    role VARCHAR(150) NOT NULL,
    location VARCHAR(100),
    employment_type public.employment_type_enum DEFAULT 'Full-time',
    start_date DATE NOT NULL,
    end_date DATE,
    is_current BOOLEAN DEFAULT false,
    description TEXT[] DEFAULT '{}',
    company_logo_url TEXT,
    display_order INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.experience_skills (
    experience_id UUID REFERENCES public.experience(id) ON DELETE CASCADE,
    skill_id UUID REFERENCES public.skills(id) ON DELETE CASCADE,
    PRIMARY KEY (experience_id, skill_id)
);

ALTER TABLE public.experience ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.experience_skills ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public Read Experience" ON public.experience;
CREATE POLICY "Public Read Experience" ON public.experience FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admin All Experience" ON public.experience;
CREATE POLICY "Admin All Experience" ON public.experience FOR ALL TO authenticated USING (auth.role() = 'authenticated');
DROP POLICY IF EXISTS "Public Read Exp Skills" ON public.experience_skills;
CREATE POLICY "Public Read Exp Skills" ON public.experience_skills FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admin All Exp Skills" ON public.experience_skills;
CREATE POLICY "Admin All Exp Skills" ON public.experience_skills FOR ALL TO authenticated USING (auth.role() = 'authenticated');

--------------------------------------------------------------------------------
-- 9. EDUCATION TABLE
--------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.education (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    institution VARCHAR(200) NOT NULL,
    degree VARCHAR(150) NOT NULL,
    field_of_study VARCHAR(150),
    duration VARCHAR(50) NOT NULL,
    cgpa VARCHAR(20),
    location VARCHAR(100),
    logo_url TEXT,
    display_order INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.education ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public Read Education" ON public.education;
CREATE POLICY "Public Read Education" ON public.education FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admin All Education" ON public.education;
CREATE POLICY "Admin All Education" ON public.education FOR ALL TO authenticated USING (auth.role() = 'authenticated');

--------------------------------------------------------------------------------
-- 10. ACHIEVEMENTS & HACKATHONS TABLES
--------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(200) NOT NULL,
    issuer VARCHAR(150),
    date_awarded DATE,
    description TEXT,
    image_url TEXT,
    link_url TEXT,
    display_order INT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS public.hackathons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(200) NOT NULL,
    organizer VARCHAR(150) NOT NULL,
    position VARCHAR(100),
    date_held DATE,
    project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL,
    certificate_url TEXT,
    images TEXT[] DEFAULT '{}',
    description TEXT,
    display_order INT DEFAULT 0
);

ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hackathons ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public Read Achievements" ON public.achievements;
CREATE POLICY "Public Read Achievements" ON public.achievements FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admin All Achievements" ON public.achievements;
CREATE POLICY "Admin All Achievements" ON public.achievements FOR ALL TO authenticated USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Public Read Hackathons" ON public.hackathons;
CREATE POLICY "Public Read Hackathons" ON public.hackathons FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admin All Hackathons" ON public.hackathons;
CREATE POLICY "Admin All Hackathons" ON public.hackathons FOR ALL TO authenticated USING (auth.role() = 'authenticated');

--------------------------------------------------------------------------------
-- 11. RESUMES TABLE (ACTIVE VERSION PATTERN)
--------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.resumes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(150) NOT NULL,
    pdf_url TEXT NOT NULL,
    version INT NOT NULL DEFAULT 1,
    is_active BOOLEAN DEFAULT false,
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE OR REPLACE FUNCTION public.set_single_active_resume()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.is_active = true THEN
        UPDATE public.resumes SET is_active = false WHERE id <> NEW.id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_single_active_resume ON public.resumes;
CREATE TRIGGER trg_single_active_resume
BEFORE INSERT OR UPDATE OF is_active ON public.resumes
FOR EACH ROW WHEN (NEW.is_active = true)
EXECUTE FUNCTION public.set_single_active_resume();

ALTER TABLE public.resumes ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public Read Active Resume" ON public.resumes;
CREATE POLICY "Public Read Active Resume" ON public.resumes FOR SELECT USING (is_active = true);
DROP POLICY IF EXISTS "Admin All Resumes" ON public.resumes;
CREATE POLICY "Admin All Resumes" ON public.resumes FOR ALL TO authenticated USING (auth.role() = 'authenticated');

--------------------------------------------------------------------------------
-- 12. MEDIA FILES AUDIT TABLE
--------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.media_files (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    file_name VARCHAR(255) NOT NULL,
    storage_path TEXT NOT NULL UNIQUE,
    bucket_name VARCHAR(100) NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    file_size_bytes BIGINT NOT NULL,
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.media_files ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Admin All Media Files" ON public.media_files;
CREATE POLICY "Admin All Media Files" ON public.media_files FOR ALL TO authenticated USING (auth.role() = 'authenticated');

--------------------------------------------------------------------------------
-- 13. STORAGE BUCKETS & STORAGE OBJECT RLS POLICIES
--------------------------------------------------------------------------------

INSERT INTO storage.buckets (id, name, public) VALUES 
('portfolio-media', 'portfolio-media', true),
('certificates', 'certificates', true),
('resumes', 'resumes', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Public Read Storage Objects" ON storage.objects;
CREATE POLICY "Public Read Storage Objects" 
ON storage.objects FOR SELECT 
USING (bucket_id IN ('portfolio-media', 'certificates', 'resumes'));

DROP POLICY IF EXISTS "Admin Storage Insert" ON storage.objects;
CREATE POLICY "Admin Storage Insert" 
ON storage.objects FOR INSERT 
TO authenticated 
WITH CHECK (
    auth.role() = 'authenticated' AND 
    bucket_id IN ('portfolio-media', 'certificates', 'resumes')
);

DROP POLICY IF EXISTS "Admin Storage Update" ON storage.objects;
CREATE POLICY "Admin Storage Update" 
ON storage.objects FOR UPDATE 
TO authenticated 
USING (
    auth.role() = 'authenticated' AND 
    bucket_id IN ('portfolio-media', 'certificates', 'resumes')
);

DROP POLICY IF EXISTS "Admin Storage Delete" ON storage.objects;
CREATE POLICY "Admin Storage Delete" 
ON storage.objects FOR DELETE 
TO authenticated 
USING (
    auth.role() = 'authenticated' AND 
    bucket_id IN ('portfolio-media', 'certificates', 'resumes')
);
