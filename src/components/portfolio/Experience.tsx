import { motion } from "motion/react";
import { GraduationCap, Rocket, Trophy, Briefcase } from "lucide-react";
import type { ComponentType } from "react";
import { usePortfolioData } from "@/hooks/public/usePortfolioData";
import { experience as staticExperience, type ExperienceItem } from "@/config/data";
import { Section } from "./Section";

const iconFor: Record<
  string,
  ComponentType<{ size?: number; className?: string }>
> = {
  education: GraduationCap,
  hackathon: Trophy,
  project: Rocket,
  work: Briefcase,
};

export function Experience() {
  const { experience: dbExp, education: dbEdu, hackathons: dbHack } = usePortfolioData();

  const formattedItems: ExperienceItem[] = [];

  if (Array.isArray(dbExp) && dbExp.length > 0) {
    dbExp.forEach((e) => {
      formattedItems.push({
        id: e.id,
        duration: `${e.startDate} – ${e.endDate || 'Present'}`,
        type: 'work',
        title: e.role,
        organization: e.company,
        description: Array.isArray(e.description) ? e.description.join(' ') : e.description,
      });
    });
  }

  if (Array.isArray(dbEdu) && dbEdu.length > 0) {
    dbEdu.forEach((ed) => {
      formattedItems.push({
        id: ed.id,
        duration: ed.duration,
        type: 'education',
        title: ed.degree,
        organization: ed.institution,
        description: `CGPA: ${ed.cgpa || 'N/A'}. ${ed.fieldOfStudy || ''}`,
      });
    });
  }

  if (Array.isArray(dbHack) && dbHack.length > 0) {
    dbHack.forEach((h) => {
      formattedItems.push({
        id: h.id,
        duration: h.dateHeld || '2024',
        type: 'hackathon',
        title: `${h.name} (${h.position || 'Participant'})`,
        organization: h.organizer,
        description: h.description || '',
      });
    });
  }

  const itemsToRender = formattedItems.length > 0 ? formattedItems : staticExperience;

  return (
    <Section
      id="experience"
      eyebrow="Journey"
      title="How I got here"
      description="A working timeline of the education, hackathons and projects that shape what I build."
    >
      <div className="relative">
        <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-border to-transparent" />
        <div className="space-y-10">
          {itemsToRender.map((item, i) => {
            const Icon = iconFor[item.type] || Briefcase;
            const align = i % 2 === 0;
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6, delay: i * 0.05 }}
                className={`relative md:grid md:grid-cols-2 md:gap-10 ${align ? "" : "md:[&>*:first-child]:col-start-2"}`}
              >
                <div
                  className={`glass-card p-6 ml-12 md:ml-0 ${align ? "md:mr-8 md:text-right" : "md:ml-8"}`}
                >
                  <div className="text-xs uppercase tracking-wider text-muted-foreground">
                    {item.duration} · {item.type}
                  </div>
                  <div className="mt-1 font-medium text-lg">{item.title}</div>
                  <div className="text-sm text-muted-foreground">{item.organization}</div>
                  <p className="mt-3 text-sm text-foreground/80 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="absolute left-0 md:left-1/2 top-6 -translate-x-1/2 md:-translate-x-1/2">
                  <div className="relative">
                    <div className="absolute inset-0 rounded-full accent-gradient blur-md opacity-60" />
                    <div className="relative h-9 w-9 rounded-full grid place-items-center bg-background border border-border">
                      <Icon size={15} className="text-foreground/85" />
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </Section>
  );
}

