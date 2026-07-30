import { motion } from "motion/react";
import { GraduationCap, MapPin, Sparkles, Target } from "lucide-react";
import { usePortfolioData } from "@/hooks/public/usePortfolioData";
import { Section } from "./Section";

export function About() {
  const { personalInfo, education } = usePortfolioData();

  const primaryEdu = Array.isArray(education) && education.length > 0 
    ? education[0] 
    : { degree: "B.E. Computer Science and Engineering", institution: "SDMIT, Ujire", duration: "2023 – 2027", cgpa: "8.10 / 10" };

  return (
    <Section
      id="about"
      eyebrow="About"
      title="A little bit about me"
      description={personalInfo.careerObjective}
    >
      <div className="grid md:grid-cols-5 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6 }}
          className="glass-card p-8 md:col-span-3"
        >
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <Sparkles size={14} />
            The short version
          </div>
          <p className="text-lg leading-relaxed text-foreground/85">{personalInfo.bio}</p>
          <div className="mt-6 flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin size={14} />
            {personalInfo.location}
          </div>
        </motion.div>

        <div className="md:col-span-2 grid gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="glass-card p-6"
          >
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
              <GraduationCap size={14} />
              Education
            </div>
            <div className="font-medium">{primaryEdu.degree}</div>
            <div className="text-sm text-muted-foreground mt-1">
              {primaryEdu.institution}
            </div>
            <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
              <span>{primaryEdu.duration}</span>
              <span className="rounded-full border border-border px-2 py-0.5">
                CGPA {primaryEdu.cgpa}
              </span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="glass-card p-6"
          >
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
              <Target size={14} />
              Focus areas
            </div>
            <div className="flex flex-wrap gap-2">
              {(personalInfo.techInterests || []).map((t) => (
                <span
                  key={t}
                  className="text-xs rounded-full border border-border bg-white/[0.03] px-3 py-1 text-foreground/80"
                >
                  {t}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </Section>
  );
}

