export const personalInfo = {
  name: "Manvith S Shetty",
  displayName: "Manvith S Shetty",
  title: "Software Engineer",
  taglineShort: "Software Engineer · AI/ML Enthusiast",
  bio: "I'm Manvith, a Computer Science student who loves building fast, reliable products end-to-end from real-time systems to AI-powered tools. Currently exploring distributed systems and AI/ML while shipping full-stack web projects.",
  careerObjective:
    "Looking to grow as a software engineer on a team that builds high-impact, real-time or AI-driven products, while deepening my skills in distributed systems and full-stack engineering.",
  techInterests: ["Distributed Systems", "AI/ML", "Full-Stack Web Development"],
  location: "Karnataka, India",
  education: {
    degree: "B.E. Computer Science and Engineering",
    institution: "SDMIT, Ujire",
    duration: "2023 – 2027",
    cgpa: "8.10 / 10",
  },
  photoUrl: "/images/me.jpeg",
} as const;

export const socialLinks = {
  github: "https://github.com/Manvith-S-Shetty?",
  linkedin: "https://linkedin.com/in/manvith-s-shetty-51b16b283",
  email: "manumanvith06@gmail.com",
  resume: "C:\Users\Manvith S shetty\Downloads\premium-creator-folio-main\premium-creator-folio-main\.output\public\resume\SWE_Backend-1 (1).pdf",
  leetcode: "https://leetcode.com/your-username",
  twitter: "",
  instagram: "https://www.instagram.com/the.day_._dreamer.____?igsh=NWh1aGQxbDYxYXR6",
  devto: "",
  hashnode: "",
  medium: "",
  youtube: "",
  hackerrank: "",
  codechef: "",
  codeforces: "",
  behance: "",
  dribbble: "",
  portfolio: "",
} as const;

export const skills: Record<string, string[]> = {
  Languages: ["Python", "TypeScript", "JavaScript"],
  Frontend: ["React.js", "Next.js", "Tailwind CSS"],
  Backend: ["Node.js", "Socket.IO", "REST APIs", "JWT Authentication"],
  Database: ["PostgreSQL", "Supabase", "Firebase"],
  "AI / ML": ["TensorFlow Lite", "XGBoost", "CNN-GRU (hybrid models)"],
  Tools: ["Docker", "Git & GitHub", "VS Code"],
  Cloud: ["Vercel", "Firebase", "Supabase"],
};

export type Project = {
  id: string;
  title: string;
  description: string;
  bullets: string[];
  techStack: string[];
  githubUrl: string;
  liveUrl: string;
};

export const projects: Project[] = [
  {
    id: "cinesync",
    title: "CineSync",
    description:
      "A real-time synchronized movie-watching platform that lets friends watch together in perfect sync, no matter where they are.",
    bullets: [
      "Built a real-time synchronized video-watching platform supporting up to 6 concurrent participants per room",
      "Implemented WebRTC for peer-to-peer audio/video and Socket.IO for real-time playback synchronization across all viewers",
      "Used Firebase for authentication and room/session management",
      "Designed and built the entire product solo — architecture, frontend, backend, and deployment",
      "Deployed live on Vercel",
    ],
    techStack: ["React.js", "Socket.IO", "WebRTC", "Firebase"],
    githubUrl: "https://github.com/Manvith-S-Shetty/CineSync",
    liveUrl: "https://cine-sync-beta.vercel.app/",
  },
  {
    id: "areca",
    title: "Areca",
    description:
      "An AI-powered plant disease detection tool built to help identify crop diseases early.",
    bullets: [
      "Built an AI-powered plant disease detection application",
      "Built the frontend with Next.js and the backend with Node.js",
      "Used Supabase for backend data storage and services",
      "Focused on a clean, simple interface for quick disease identification",
    ],
    techStack: ["Next.js", "Node.js", "Supabase"],
    githubUrl: "https://github.com/Manvith-S-Shetty/Areca-complete",
    liveUrl: "",
  },
  {
    id: "anemia-detection",
    title: "AI-Based Anemia Detection",
    description:
      "An Android application that uses an on-device machine learning model to help detect signs of anemia.",
    bullets: [
      "Built a native Android application in Java for on-device anemia detection",
      "Integrated a TensorFlow Lite model for on-device inference, keeping the app fast and offline-capable",
      "Designed a simple, accessible mobile UI for the detection workflow",
    ],
    techStack: ["Java", "TensorFlow Lite", "Android"],
    githubUrl: "https://github.com/Manvith-S-Shetty/AnimeaAPP",
    liveUrl: "",
  },
  {
    id: "heliocast",
    title: "HelioCast (SolarSentinel)",
    description:
      "An AI-based solar flare forecasting and nowcasting system built for the Bharatiya Antariksh Hackathon 2026, using ISRO's Aditya-L1 mission data.",
    bullets: [
      "Built for BAH 2026 (Problem Statement 15: Forecasting and Nowcasting Solar Flares) as part of 3-member team Olympus Nexus",
      "Fused dual-payload data from SoLEXS and HEL1OS instruments aboard Aditya-L1",
      "Designed a hybrid XGBoost + CNN-GRU model architecture with SHAP explainability for forecast interpretability",
      "Built a tiered alert system targeting 30–45 minute lead times for solar flare warnings",
    ],
    techStack: ["Python", "XGBoost", "CNN-GRU", "SHAP"],
    githubUrl: "#",
    liveUrl: "",
  },
];

export type Certificate = {
  name: string;
  issuer: string;
  date: string;
  description: string;
  viewUrl: string;
  downloadUrl: string;
};

export const certificates: Certificate[] = [];

export type ExperienceItem = {
  id: string;
  type: "education" | "hackathon" | "project" | "work";
  title: string;
  organization: string;
  duration: string;
  description: string;
};

export const experience: ExperienceItem[] = [
  {
    id: "sdmit",
    type: "education",
    title: "B.E. Computer Science and Engineering",
    organization: "SDMIT, Ujire",
    duration: "2023 – 2027",
    description: "Pursuing a degree in Computer Science, currently at a CGPA of 8.10/10.",
  },
  {
    id: "bah-2026",
    type: "hackathon",
    title: "Bharatiya Antariksh Hackathon 2026",
    organization: "Team Olympus Nexus",
    duration: "2026",
    description:
      "Building HelioCast (SolarSentinel), an AI-based solar flare forecasting system using Aditya-L1 data, as part of a 3-member team.",
  },
  {
    id: "cinesync-project",
    type: "project",
    title: "CineSync — Solo Project",
    organization: "Personal Project",
    duration: "2025",
    description:
      "Designed and built a real-time synchronized movie-watching platform end-to-end, deployed live on Vercel.",
  },
];

export const navigation = [
  { label: "Home", href: "#hero" },
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Projects", href: "#projects" },
  { label: "Certificates", href: "#certificates" },
  { label: "Experience", href: "#experience" },
  { label: "Contact", href: "#contact" },
];
