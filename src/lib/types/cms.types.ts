export type PersonalInfoDTO = {
  id: string;
  fullName: string;
  displayName: string;
  primaryTitle: string;
  taglineShort: string;
  bio: string;
  personalStory?: string;
  corePrinciples?: string[];
  highlights?: string[];
  careerObjective: string;
  techInterests: string[];
  location: string;
  email: string;
  phone?: string;
  photoUrl?: string;
  isAvailable: boolean;
  updatedAt: string;
};

export type SiteSettingsDTO = {
  id: string;
  defaultTheme: 'dark' | 'light';
  accentColor: string;
  seoMetaTitle: string;
  seoMetaDescription: string;
  ogImageUrl?: string;
  analyticsId?: string;
  updatedAt: string;
};

export type SocialLinkDTO = {
  id: string;
  platform: string;
  url: string;
  iconName?: string;
  displayOrder: number;
  isVisible: boolean;
};

export type SkillDTO = {
  id: string;
  name: string;
  category: 'Languages' | 'Frontend' | 'Backend' | 'Database' | 'AI / ML' | 'Tools' | 'Cloud';
  iconName?: string;
  proficiencyLevel: number;
  yearsExperience?: number;
  displayOrder: number;
};

export type ProjectDTO = {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  fullDescription?: string;
  bullets: string[];
  githubUrl: string;
  liveUrl: string;
  thumbnailUrl?: string;
  videoUrl?: string;
  category: string;
  difficulty?: string;
  status: 'Completed' | 'In Progress' | 'Archived';
  isFeatured: boolean;
  isPublished: boolean;
  displayOrder: number;
  startDate?: string;
  endDate?: string;
  screenshots?: string[];
  skills?: SkillDTO[];
  skillIds?: string[];
};

export type CertificateDTO = {
  id: string;
  title: string;
  issuer: string;
  issueDate: string;
  expirationDate?: string;
  credentialId?: string;
  credentialUrl?: string;
  pdfUrl: string;
  thumbnailUrl?: string;
  description?: string;
  tags: string[];
  isFeatured: boolean;
  displayOrder: number;
};

export type ExperienceDTO = {
  id: string;
  company: string;
  role: string;
  location?: string;
  employmentType: 'Full-time' | 'Part-time' | 'Internship' | 'Contract' | 'Freelance';
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
  description: string[];
  companyLogoUrl?: string;
  displayOrder: number;
  skills?: SkillDTO[];
  skillIds?: string[];
};

export type EducationDTO = {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy?: string;
  duration: string;
  cgpa?: string;
  location?: string;
  logoUrl?: string;
  displayOrder: number;
};

export type AchievementDTO = {
  id: string;
  title: string;
  issuer?: string;
  dateAwarded?: string;
  description?: string;
  imageUrl?: string;
  linkUrl?: string;
  displayOrder: number;
};

export type HackathonDTO = {
  id: string;
  name: string;
  organizer: string;
  position?: string;
  dateHeld?: string;
  projectId?: string;
  certificateUrl?: string;
  images?: string[];
  description?: string;
  displayOrder: number;
};

export type ResumeDTO = {
  id: string;
  title: string;
  pdfUrl: string;
  version: number;
  isActive: boolean;
  uploadedAt: string;
};

export type MediaFileDTO = {
  id: string;
  fileName: string;
  storagePath: string;
  bucketName: string;
  mimeType: string;
  fileSizeBytes: number;
  uploadedAt: string;
};
