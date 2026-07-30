import { supabase } from '@/config/supabase';
import { 
  PersonalInfoDTO, SiteSettingsDTO, SocialLinkDTO, ProjectDTO, CertificateDTO, 
  SkillDTO, ExperienceDTO, EducationDTO, AchievementDTO, HackathonDTO 
} from '../types/cms.types';

export const adminApi = {
  // Upsert Personal Info (Hero & About)
  async upsertPersonalInfo(info: Partial<PersonalInfoDTO>): Promise<void> {
    const payload = {
      ...(info.id ? { id: info.id } : {}),
      full_name: info.fullName,
      display_name: info.displayName,
      primary_title: info.primaryTitle,
      tagline_short: info.taglineShort,
      bio: info.bio,
      personal_story: info.personalStory,
      core_principles: info.corePrinciples,
      highlights: info.highlights,
      career_objective: info.careerObjective,
      tech_interests: info.techInterests,
      location: info.location,
      email: info.email,
      phone: info.phone,
      photo_url: info.photoUrl,
      is_available: info.isAvailable,
    };

    const { error } = await supabase.from('personal_info').upsert(payload);
    if (error) throw error;
  },

  // Upsert Site Settings
  async upsertSiteSettings(settings: Partial<SiteSettingsDTO>): Promise<void> {
    const payload = {
      ...(settings.id ? { id: settings.id } : {}),
      default_theme: settings.defaultTheme,
      accent_color: settings.accentColor,
      seo_meta_title: settings.seoMetaTitle,
      seo_meta_description: settings.seoMetaDescription,
      og_image_url: settings.ogImageUrl,
      analytics_id: settings.analyticsId,
    };

    const { error } = await supabase.from('site_settings').upsert(payload);
    if (error) throw error;
  },

  // Upsert Social Link
  async upsertSocialLink(link: Partial<SocialLinkDTO>): Promise<void> {
    const payload = {
      ...(link.id ? { id: link.id } : {}),
      platform: link.platform,
      url: link.url,
      icon_name: link.iconName,
      display_order: link.displayOrder,
      is_visible: link.isVisible,
    };

    const { error } = await supabase.from('social_links').upsert(payload);
    if (error) throw error;
  },

  // Upsert Skill
  async upsertSkill(skill: Partial<SkillDTO>): Promise<void> {
    const payload = {
      ...(skill.id ? { id: skill.id } : {}),
      name: skill.name,
      category: skill.category,
      icon_name: skill.iconName,
      proficiency_level: skill.proficiencyLevel,
      years_experience: skill.yearsExperience,
      display_order: skill.displayOrder,
    };

    const { error } = await supabase.from('skills').upsert(payload);
    if (error) throw error;
  },

  // Delete Skill
  async deleteSkill(id: string): Promise<void> {
    const { error } = await supabase.from('skills').delete().eq('id', id);
    if (error) throw error;
  },

  // Upsert Project with explicit Junction Table & Screenshot Sync
  async upsertProject(project: Partial<ProjectDTO>): Promise<void> {
    const payload = {
      ...(project.id ? { id: project.id } : {}),
      title: project.title,
      slug: project.slug,
      short_description: project.shortDescription,
      full_description: project.fullDescription,
      bullets: project.bullets,
      github_url: project.githubUrl,
      live_url: project.liveUrl,
      thumbnail_url: project.thumbnailUrl,
      category: project.category,
      is_featured: project.isFeatured,
      is_published: project.isPublished,
      display_order: project.displayOrder,
    };

    const { data: projectRow, error: projectError } = await supabase
      .from('projects')
      .upsert(payload)
      .select('id')
      .single();

    if (projectError) throw projectError;
    const projectId = projectRow.id;

    // Sync project_skills Junction Table (Delete-then-Insert)
    if (project.skillIds !== undefined) {
      await supabase.from('project_skills').delete().eq('project_id', projectId);

      if (project.skillIds.length > 0) {
        const skillRows = project.skillIds.map((skillId) => ({
          project_id: projectId,
          skill_id: skillId,
        }));
        const { error: skillSyncError } = await supabase.from('project_skills').insert(skillRows);
        if (skillSyncError) throw skillSyncError;
      }
    }

    // Sync project_screenshots (Delete-then-Insert)
    if (project.screenshots !== undefined) {
      await supabase.from('project_screenshots').delete().eq('project_id', projectId);

      if (project.screenshots.length > 0) {
        const screenshotRows = project.screenshots.map((url, idx) => ({
          project_id: projectId,
          image_url: url,
          display_order: idx,
        }));
        const { error: screenshotError } = await supabase.from('project_screenshots').insert(screenshotRows);
        if (screenshotError) throw screenshotError;
      }
    }
  },

  // Delete Project
  async deleteProject(id: string): Promise<void> {
    const { error } = await supabase.from('projects').delete().eq('id', id);
    if (error) throw error;
  },

  // Upsert Certificate
  async upsertCertificate(cert: Partial<CertificateDTO>): Promise<void> {
    const payload = {
      ...(cert.id ? { id: cert.id } : {}),
      title: cert.title,
      issuer: cert.issuer,
      issue_date: cert.issueDate,
      expiration_date: cert.expirationDate,
      credential_id: cert.credentialId,
      credential_url: cert.credentialUrl,
      pdf_url: cert.pdfUrl,
      thumbnail_url: cert.thumbnailUrl,
      description: cert.description,
      tags: cert.tags,
      is_featured: cert.isFeatured,
      display_order: cert.displayOrder,
    };

    const { error } = await supabase.from('certificates').upsert(payload);
    if (error) throw error;
  },

  // Delete Certificate
  async deleteCertificate(id: string): Promise<void> {
    const { error } = await supabase.from('certificates').delete().eq('id', id);
    if (error) throw error;
  },

  // Upsert Experience with explicit Junction Table Sync
  async upsertExperience(experience: Partial<ExperienceDTO>): Promise<void> {
    const payload = {
      ...(experience.id ? { id: experience.id } : {}),
      company: experience.company,
      role: experience.role,
      location: experience.location,
      employment_type: experience.employmentType,
      start_date: experience.startDate,
      end_date: experience.endDate,
      is_current: experience.isCurrent,
      description: experience.description,
      company_logo_url: experience.companyLogoUrl,
      display_order: experience.displayOrder,
    };

    const { data: expRow, error: expError } = await supabase
      .from('experience')
      .upsert(payload)
      .select('id')
      .single();

    if (expError) throw expError;
    const expId = expRow.id;

    // Sync experience_skills Junction Table (Delete-then-Insert)
    if (experience.skillIds !== undefined) {
      await supabase.from('experience_skills').delete().eq('experience_id', expId);

      if (experience.skillIds.length > 0) {
        const skillRows = experience.skillIds.map((skillId) => ({
          experience_id: expId,
          skill_id: skillId,
        }));
        const { error: expSkillError } = await supabase.from('experience_skills').insert(skillRows);
        if (expSkillError) throw expSkillError;
      }
    }
  },

  // Delete Experience
  async deleteExperience(id: string): Promise<void> {
    const { error } = await supabase.from('experience').delete().eq('id', id);
    if (error) throw error;
  },

  // Upsert Education
  async upsertEducation(edu: Partial<EducationDTO>): Promise<void> {
    const payload = {
      ...(edu.id ? { id: edu.id } : {}),
      institution: edu.institution,
      degree: edu.degree,
      field_of_study: edu.fieldOfStudy,
      duration: edu.duration,
      cgpa: edu.cgpa,
      location: edu.location,
      logo_url: edu.logoUrl,
      display_order: edu.displayOrder,
    };

    const { error } = await supabase.from('education').upsert(payload);
    if (error) throw error;
  },

  // Delete Education
  async deleteEducation(id: string): Promise<void> {
    const { error } = await supabase.from('education').delete().eq('id', id);
    if (error) throw error;
  },

  // Upsert Achievement
  async upsertAchievement(achievement: Partial<AchievementDTO>): Promise<void> {
    const payload = {
      ...(achievement.id ? { id: achievement.id } : {}),
      title: achievement.title,
      issuer: achievement.issuer,
      date_awarded: achievement.dateAwarded,
      description: achievement.description,
      image_url: achievement.imageUrl,
      link_url: achievement.linkUrl,
      display_order: achievement.displayOrder,
    };

    const { error } = await supabase.from('achievements').upsert(payload);
    if (error) throw error;
  },

  // Delete Achievement
  async deleteAchievement(id: string): Promise<void> {
    const { error } = await supabase.from('achievements').delete().eq('id', id);
    if (error) throw error;
  },

  // Upsert Hackathon
  async upsertHackathon(hack: Partial<HackathonDTO>): Promise<void> {
    const payload = {
      ...(hack.id ? { id: hack.id } : {}),
      name: hack.name,
      organizer: hack.organizer,
      position: hack.position,
      date_held: hack.dateHeld,
      project_id: hack.projectId,
      certificate_url: hack.certificateUrl,
      images: hack.images,
      description: hack.description,
      display_order: hack.displayOrder,
    };

    const { error } = await supabase.from('hackathons').upsert(payload);
    if (error) throw error;
  },

  // Delete Hackathon
  async deleteHackathon(id: string): Promise<void> {
    const { error } = await supabase.from('hackathons').delete().eq('id', id);
    if (error) throw error;
  },

  // Upload Resume PDF and set as Active
  async uploadActiveResume(file: File, title: string): Promise<string> {
    const fileExt = file.name.split('.').pop();
    const fileName = `resume_${Date.now()}.${fileExt}`;
    const filePath = `resumes/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('resumes')
      .upload(filePath, file, { upsert: true });

    if (uploadError) throw uploadError;

    const { data: urlData } = supabase.storage.from('resumes').getPublicUrl(filePath);
    const pdfUrl = urlData.publicUrl;

    const { error: dbError } = await supabase.from('resumes').insert({
      title,
      pdf_url: pdfUrl,
      is_active: true,
    });

    if (dbError) throw dbError;
    return pdfUrl;
  }
};
