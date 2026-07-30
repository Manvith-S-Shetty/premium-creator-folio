import { supabase } from '@/config/supabase';
import { 
  PersonalInfoDTO, SiteSettingsDTO, SocialLinkDTO, ProjectDTO, CertificateDTO, 
  SkillDTO, ExperienceDTO, EducationDTO, AchievementDTO, HackathonDTO, ResumeDTO 
} from '../types/cms.types';

export const publicApi = {
  // Fetch Personal Info for Hero & About
  async getPersonalInfo(): Promise<PersonalInfoDTO> {
    const { data, error } = await supabase
      .from('personal_info')
      .select('*')
      .limit(1)
      .single();

    if (error) throw error;
    return {
      id: data.id,
      fullName: data.full_name,
      displayName: data.display_name,
      primaryTitle: data.primary_title,
      taglineShort: data.tagline_short,
      bio: data.bio,
      personalStory: data.personal_story,
      corePrinciples: data.core_principles || [],
      highlights: data.highlights || [],
      careerObjective: data.career_objective,
      techInterests: data.tech_interests || [],
      location: data.location,
      email: data.email,
      phone: data.phone,
      photoUrl: data.photo_url,
      isAvailable: data.is_available,
      updatedAt: data.updated_at,
    };
  },

  // Fetch Site Settings
  async getSiteSettings(): Promise<SiteSettingsDTO> {
    const { data, error } = await supabase
      .from('site_settings')
      .select('*')
      .limit(1)
      .single();

    if (error) throw error;
    return {
      id: data.id,
      defaultTheme: data.default_theme,
      accentColor: data.accent_color,
      seoMetaTitle: data.seo_meta_title,
      seoMetaDescription: data.seo_meta_description,
      ogImageUrl: data.og_image_url,
      analyticsId: data.analytics_id,
      updatedAt: data.updated_at,
    };
  },

  // Fetch Social Links
  async getSocialLinks(): Promise<SocialLinkDTO[]> {
    const { data, error } = await supabase
      .from('social_links')
      .select('*')
      .eq('is_visible', true)
      .order('display_order', { ascending: true });

    if (error) throw error;
    return data.map((sl: any) => ({
      id: sl.id,
      platform: sl.platform,
      url: sl.url,
      iconName: sl.icon_name,
      displayOrder: sl.display_order,
      isVisible: sl.is_visible,
    }));
  },

  // Fetch Skills Matrix
  async getSkills(): Promise<SkillDTO[]> {
    const { data, error } = await supabase
      .from('skills')
      .select('*')
      .order('display_order', { ascending: true });

    if (error) throw error;
    return data.map((s: any) => ({
      id: s.id,
      name: s.name,
      category: s.category,
      iconName: s.icon_name,
      proficiencyLevel: s.proficiency_level,
      yearsExperience: s.years_experience,
      displayOrder: s.display_order,
    }));
  },

  // Fetch Published Projects with Skills & Screenshots
  async getPublishedProjects(): Promise<ProjectDTO[]> {
    const { data, error } = await supabase
      .from('projects')
      .select(`
        *,
        project_screenshots(image_url, display_order),
        project_skills(skills(*))
      `)
      .eq('is_published', true)
      .order('display_order', { ascending: true });

    if (error) throw error;
    return data.map((item: any) => ({
      id: item.id,
      slug: item.slug,
      title: item.title,
      shortDescription: item.short_description,
      fullDescription: item.full_description,
      bullets: item.bullets || [],
      githubUrl: item.github_url,
      liveUrl: item.live_url,
      thumbnailUrl: item.thumbnail_url,
      videoUrl: item.video_url,
      category: item.category,
      difficulty: item.difficulty,
      status: item.status,
      isFeatured: item.is_featured,
      isPublished: item.is_published,
      displayOrder: item.display_order,
      startDate: item.start_date,
      endDate: item.end_date,
      screenshots: item.project_screenshots?.map((s: any) => s.image_url) || [],
      skills: item.project_skills?.map((ps: any) => ps.skills) || [],
    }));
  },

  // Fetch Certificates
  async getCertificates(): Promise<CertificateDTO[]> {
    const { data, error } = await supabase
      .from('certificates')
      .select('*')
      .order('display_order', { ascending: true });

    if (error) throw error;
    return data.map((c: any) => ({
      id: c.id,
      title: c.title,
      issuer: c.issuer,
      issueDate: c.issue_date,
      expirationDate: c.expiration_date,
      credentialId: c.credential_id,
      credentialUrl: c.credential_url,
      pdfUrl: c.pdf_url,
      thumbnailUrl: c.thumbnail_url,
      description: c.description,
      tags: c.tags || [],
      isFeatured: c.is_featured,
      displayOrder: c.display_order,
    }));
  },

  // Fetch Work Experience with Skills
  async getExperience(): Promise<ExperienceDTO[]> {
    const { data, error } = await supabase
      .from('experience')
      .select(`
        *,
        experience_skills(skills(*))
      `)
      .order('display_order', { ascending: true });

    if (error) throw error;
    return data.map((e: any) => ({
      id: e.id,
      company: e.company,
      role: e.role,
      location: e.location,
      employmentType: e.employment_type,
      startDate: e.start_date,
      endDate: e.end_date,
      isCurrent: e.is_current,
      description: e.description || [],
      companyLogoUrl: e.company_logo_url,
      displayOrder: e.display_order,
      skills: e.experience_skills?.map((es: any) => es.skills) || [],
    }));
  },

  // Fetch Education History
  async getEducation(): Promise<EducationDTO[]> {
    const { data, error } = await supabase
      .from('education')
      .select('*')
      .order('display_order', { ascending: true });

    if (error) throw error;
    return data.map((ed: any) => ({
      id: ed.id,
      institution: ed.institution,
      degree: ed.degree,
      fieldOfStudy: ed.field_of_study,
      duration: ed.duration,
      cgpa: ed.cgpa,
      location: ed.location,
      logoUrl: ed.logo_url,
      displayOrder: ed.display_order,
    }));
  },

  // Fetch Achievements
  async getAchievements(): Promise<AchievementDTO[]> {
    const { data, error } = await supabase
      .from('achievements')
      .select('*')
      .order('display_order', { ascending: true });

    if (error) throw error;
    return data.map((a: any) => ({
      id: a.id,
      title: a.title,
      issuer: a.issuer,
      dateAwarded: a.date_awarded,
      description: a.description,
      imageUrl: a.image_url,
      linkUrl: a.link_url,
      displayOrder: a.display_order,
    }));
  },

  // Fetch Hackathons
  async getHackathons(): Promise<HackathonDTO[]> {
    const { data, error } = await supabase
      .from('hackathons')
      .select('*')
      .order('display_order', { ascending: true });

    if (error) throw error;
    return data.map((h: any) => ({
      id: h.id,
      name: h.name,
      organizer: h.organizer,
      position: h.position,
      dateHeld: h.date_held,
      projectId: h.project_id,
      certificateUrl: h.certificate_url,
      images: h.images || [],
      description: h.description,
      displayOrder: h.display_order,
    }));
  },

  // Fetch Active Resume URL
  async getActiveResume(): Promise<ResumeDTO | null> {
    const { data, error } = await supabase
      .from('resumes')
      .select('*')
      .eq('is_active', true)
      .limit(1)
      .maybeSingle();

    if (error) throw error;
    if (!data) return null;
    return {
      id: data.id,
      title: data.title,
      pdfUrl: data.pdf_url,
      version: data.version,
      isActive: data.is_active,
      uploadedAt: data.uploaded_at,
    };
  }
};
