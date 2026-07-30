# Portfolio CMS - API Design & DTO Specifications

This document defines TypeScript Data Transfer Objects (DTOs), database client methods, and Phase 2 API extensions.

---

## 1. Type Definitions & DTOs (`src/lib/types/cms.types.ts`)

```typescript
// Phase 2: Content Lifecycle Status
export type ContentStatus = 'draft' | 'published' | 'archived';

// Phase 2: Extended Site Settings DTO
export interface SiteSettingsDTO {
  id?: string;
  defaultTheme: string;
  accentColor: string;
  analyticsId?: string;

  // Feature Toggles
  showCertificates: boolean;
  showExperience: boolean;
  showSkills: boolean;
  showResume: boolean;
  showEducation: boolean;
  showContact: boolean;
  showAchievements: boolean;
  showHackathons: boolean;

  // Expanded SEO Fields
  seoTitle?: string;
  seoDescription?: string;
  seoOgImageUrl?: string;
  seoFaviconUrl?: string;
  seoRobotsDirective: string;
}

// Phase 2: Activity Log DTO
export interface ActivityLogDTO {
  id: string;
  adminUserId?: string;
  action: string;
  entityType: string;
  entityId?: string;
  description: string;
  createdAt: string;
}

export interface ActivityLogFilterDTO {
  action?: string;
  entityType?: string;
  startDate?: string;
  endDate?: string;
  limit?: number;
  offset?: number;
}

// Updated Status-Managed DTOs
export interface ProjectDTO {
  id?: string;
  title: string;
  slug: string;
  shortDescription: string;
  fullDescription?: string;
  bullets?: string[];
  githubUrl?: string;
  liveUrl?: string;
  thumbnailUrl?: string;
  category: string;
  isFeatured: boolean;
  status: ContentStatus; // Phase 2
  displayOrder?: number;
  skillIds?: string[];
  screenshots?: string[];
}

export interface CertificateDTO {
  id?: string;
  title: string;
  issuer: string;
  issueDate: string;
  expirationDate?: string;
  credentialId?: string;
  credentialUrl?: string;
  pdfUrl?: string;
  thumbnailUrl?: string;
  description?: string;
  tags?: string[];
  isFeatured: boolean;
  status: ContentStatus; // Phase 2
  displayOrder?: number;
}

export interface AchievementDTO {
  id?: string;
  title: string;
  issuer: string;
  dateAwarded: string;
  description?: string;
  imageUrl?: string;
  linkUrl?: string;
  status: ContentStatus; // Phase 2
  displayOrder?: number;
}

export interface HackathonDTO {
  id?: string;
  name: string;
  organizer: string;
  position: string;
  dateHeld: string;
  projectId?: string;
  certificateUrl?: string;
  images?: string[];
  description?: string;
  status: ContentStatus; // Phase 2
  displayOrder?: number;
}
```

---

## 2. API Repositories & Service Modules

### 2.1 Activity Log API (`src/lib/api/activity.api.ts`)

```typescript
import { supabase } from '@/config/supabase';
import { ActivityLogDTO, ActivityLogFilterDTO } from '../types/cms.types';

export const activityApi = {
  // Record a new audit log entry
  async logActivity(
    action: string,
    entityType: string,
    entityId?: string,
    description?: string
  ): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    await supabase.from('activity_log').insert({
      admin_user_id: user?.id || null,
      action,
      entity_type: entityType,
      entity_id: entityId || null,
      description,
    });
  },

  // Fetch audit logs with filtering
  async getActivityLogs(filters?: ActivityLogFilterDTO): Promise<ActivityLogDTO[]> {
    let query = supabase.from('activity_log').select('*').order('created_at', { ascending: false });

    if (filters?.action) query = query.eq('action', filters.action);
    if (filters?.entityType) query = query.eq('entity_type', filters.entityType);
    if (filters?.limit) query = query.limit(filters.limit);

    const { data, error } = await query;
    if (error) throw error;

    return data.map((item: any) => ({
      id: item.id,
      adminUserId: item.admin_user_id,
      action: item.action,
      entityType: item.entity_type,
      entityId: item.entity_id,
      description: item.description,
      createdAt: item.created_at,
    }));
  }
};
```

### 2.2 Site Settings & Feature Toggles API Updates (`src/lib/api/admin.api.ts`)

```typescript
async upsertSiteSettings(settings: Partial<SiteSettingsDTO>): Promise<void> {
  const payload = {
    ...(settings.id ? { id: settings.id } : {}),
    default_theme: settings.defaultTheme,
    accent_color: settings.accentColor,
    analytics_id: settings.analyticsId,
    show_certificates: settings.showCertificates,
    show_experience: settings.showExperience,
    show_skills: settings.showSkills,
    show_resume: settings.showResume,
    show_education: settings.showEducation,
    show_contact: settings.showContact,
    show_achievements: settings.showAchievements,
    show_hackathons: settings.showHackathons,
    seo_title: settings.seoTitle,
    seo_description: settings.seoDescription,
    seo_og_image_url: settings.seoOgImageUrl,
    seo_favicon_url: settings.seoFaviconUrl,
    seo_robots_directive: settings.seoRobotsDirective,
  };

  const { error } = await supabase.from('site_settings').upsert(payload);
  if (error) throw error;

  await activityApi.logActivity('UPDATE', 'SETTINGS', settings.id, 'Updated site settings & feature toggles');
}
```

### 2.3 Public API Status Filtering (`src/lib/api/public.api.ts`)
```typescript
async getProjects(): Promise<ProjectDTO[]> {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('status', 'published') // Phase 2 Status Filter
    .order('display_order', { ascending: true });

  if (error) throw error;
  return data.map(mapProjectRowToDTO);
}
```
