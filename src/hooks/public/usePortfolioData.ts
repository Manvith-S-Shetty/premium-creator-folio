import { useQuery } from '@tanstack/react-query';
import { publicApi } from '@/lib/api/public.api';
import { personalInfo as staticPersonalInfo, projects as staticProjects } from '@/config/data';

export function usePortfolioData() {
  const personalInfoQuery = useQuery({
    queryKey: ['personalInfo'],
    queryFn: publicApi.getPersonalInfo,
    staleTime: 10 * 60 * 1000,
    placeholderData: staticPersonalInfo as any,
  });

  const siteSettingsQuery = useQuery({
    queryKey: ['siteSettings'],
    queryFn: publicApi.getSiteSettings,
    staleTime: 10 * 60 * 1000,
  });

  const socialLinksQuery = useQuery({
    queryKey: ['socialLinks'],
    queryFn: publicApi.getSocialLinks,
    staleTime: 10 * 60 * 1000,
  });

  const skillsQuery = useQuery({
    queryKey: ['skills'],
    queryFn: publicApi.getSkills,
    staleTime: 10 * 60 * 1000,
  });

  const projectsQuery = useQuery({
    queryKey: ['projects', 'published'],
    queryFn: publicApi.getPublishedProjects,
    staleTime: 10 * 60 * 1000,
    placeholderData: staticProjects as any,
  });

  const certificatesQuery = useQuery({
    queryKey: ['certificates'],
    queryFn: publicApi.getCertificates,
    staleTime: 10 * 60 * 1000,
  });

  const experienceQuery = useQuery({
    queryKey: ['experience'],
    queryFn: publicApi.getExperience,
    staleTime: 10 * 60 * 1000,
  });

  const educationQuery = useQuery({
    queryKey: ['education'],
    queryFn: publicApi.getEducation,
    staleTime: 10 * 60 * 1000,
  });

  const achievementsQuery = useQuery({
    queryKey: ['achievements'],
    queryFn: publicApi.getAchievements,
    staleTime: 10 * 60 * 1000,
  });

  const hackathonsQuery = useQuery({
    queryKey: ['hackathons'],
    queryFn: publicApi.getHackathons,
    staleTime: 10 * 60 * 1000,
  });

  const resumeQuery = useQuery({
    queryKey: ['resume', 'active'],
    queryFn: publicApi.getActiveResume,
    staleTime: 30 * 60 * 1000,
  });

  return {
    personalInfo: personalInfoQuery.data || staticPersonalInfo,
    siteSettings: siteSettingsQuery.data,
    socialLinks: socialLinksQuery.data || [],
    skills: skillsQuery.data || [],
    projects: projectsQuery.data || staticProjects,
    certificates: certificatesQuery.data || [],
    experience: experienceQuery.data || [],
    education: educationQuery.data || [],
    achievements: achievementsQuery.data || [],
    hackathons: hackathonsQuery.data || [],
    resumeUrl: resumeQuery.data?.pdfUrl || (staticPersonalInfo as any).resume || '',
    isLoading: personalInfoQuery.isLoading || projectsQuery.isLoading,
    isError: personalInfoQuery.isError || projectsQuery.isError,
  };
}
