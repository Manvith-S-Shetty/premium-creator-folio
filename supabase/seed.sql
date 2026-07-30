-- Seed Personal Info & About Content
INSERT INTO public.personal_info (full_name, display_name, primary_title, tagline_short, bio, personal_story, core_principles, highlights, career_objective, tech_interests, location, email, photo_url)
VALUES (
    'Manvith S Shetty',
    'Manvith S Shetty',
    'Software Engineer',
    'Software Engineer · AI/ML Enthusiast',
    'I''m Manvith, a Computer Science student who loves building fast, reliable products end-to-end from real-time systems to AI-powered tools.',
    'Computer Science student with a passion for software engineering, real-time distributed systems, and on-device AI.',
    ARRAY['Clean Architecture', 'Zero-Regression Code', 'High Performance'],
    ARRAY['Built CineSync solo supporting WebRTC video sync', 'Developed AI-powered plant disease detection tool', 'Built native Android app with TensorFlow Lite'],
    'Looking to grow as a software engineer on a team that builds high-impact, real-time or AI-driven products.',
    ARRAY['Distributed Systems', 'AI/ML', 'Full-Stack Web Development'],
    'Karnataka, India',
    'manumanvith06@gmail.com',
    '/images/me.jpeg'
) ON CONFLICT DO NOTHING;

-- Seed Site Settings
INSERT INTO public.site_settings (default_theme, accent_color, seo_meta_title, seo_meta_description)
VALUES ('dark', 'cyan-indigo', 'Manvith S Shetty | Software Engineer', 'Portfolio of Manvith S Shetty - Software Engineer and AI/ML Enthusiast')
ON CONFLICT DO NOTHING;

-- Seed Social Links
INSERT INTO public.social_links (platform, url, display_order) VALUES
('github', 'https://github.com/Manvith-S-Shetty', 1),
('linkedin', 'https://linkedin.com/in/manvith-s-shetty-51b16b283', 2),
('instagram', 'https://www.instagram.com/the.day_._dreamer.____', 3)
ON CONFLICT (platform) DO NOTHING;

-- Seed Skills
INSERT INTO public.skills (name, category, display_order) VALUES
('Python', 'Languages', 1), ('TypeScript', 'Languages', 2), ('JavaScript', 'Languages', 3),
('React.js', 'Frontend', 4), ('Next.js', 'Frontend', 5), ('Tailwind CSS', 'Frontend', 6),
('Node.js', 'Backend', 7), ('Socket.IO', 'Backend', 8), ('REST APIs', 'Backend', 9), ('JWT Authentication', 'Backend', 10),
('PostgreSQL', 'Database', 11), ('Supabase', 'Database', 12), ('Firebase', 'Database', 13),
('TensorFlow Lite', 'AI / ML', 14), ('XGBoost', 'AI / ML', 15), ('Docker', 'Tools', 16)
ON CONFLICT (name) DO NOTHING;

-- Seed Projects
INSERT INTO public.projects (slug, title, short_description, bullets, category, github_url, live_url, display_order) VALUES
('cinesync', 'CineSync', 'A real-time synchronized movie-watching platform that lets friends watch together in perfect sync.', 
 ARRAY['Built a real-time synchronized video-watching platform supporting up to 6 concurrent participants', 'Implemented WebRTC for peer-to-peer audio/video and Socket.IO for real-time synchronization', 'Designed and built the entire product solo — architecture, frontend, backend, and deployment'],
 'Real-time Systems', 'https://github.com/Manvith-S-Shetty/CineSync', 'https://cine-sync-beta.vercel.app/', 1),

('areca', 'Areca', 'An AI-powered plant disease detection tool built to help identify crop diseases early.',
 ARRAY['Built an AI-powered plant disease detection application', 'Built frontend with Next.js and backend with Node.js', 'Used Supabase for backend data storage and services'],
 'AI/ML', 'https://github.com/Manvith-S-Shetty/Areca-complete', '', 2),

('anemia-detection', 'AI-Based Anemia Detection', 'An Android application that uses an on-device machine learning model to help detect signs of anemia.',
 ARRAY['Built a native Android application in Java for on-device anemia detection', 'Integrated a TensorFlow Lite model for on-device inference, keeping the app fast and offline-capable'],
 'Mobile / AI', 'https://github.com/Manvith-S-Shetty', '', 3)
ON CONFLICT (slug) DO NOTHING;

-- Seed Education
INSERT INTO public.education (institution, degree, duration, cgpa, location, display_order) VALUES
('SDMIT, Ujire', 'B.E. Computer Science and Engineering', '2023 – 2027', '8.10 / 10', 'Karnataka, India', 1)
ON CONFLICT DO NOTHING;
