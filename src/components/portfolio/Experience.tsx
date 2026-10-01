import { motion } from "motion/react";
import { GraduationCap, Rocket, Trophy, Briefcase } from "lucide-react";
import type { ComponentType } from "react";
import { usePortfolioData } from "@/hooks/public/usePortfolioData";
import { experience as staticExperience, type ExperienceItem } from "@/config/data";
import { Section } from "./Section";

const iconFor: Record<string, ComponentType<{ size?: number; className?: string }>> = {
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
        duration: `${e.startDate} – ${e.endDate || "Present"}`,
        type: "work",
        title: e.role,
        organization: e.company,
        description: Array.isArray(e.description) ? e.description.join(" ") : e.description,
      });
    });
  }

  if (Array.isArray(dbEdu) && dbEdu.length > 0) {
    dbEdu.forEach((ed) => {
      formattedItems.push({
        id: ed.id,
        duration: ed.duration,
        type: "education",
        title: ed.degree,
        organization: ed.institution,
        description: `CGPA: ${ed.cgpa || "N/A"}. ${ed.fieldOfStudy || ""}`,
      });
    });
  }

  if (Array.isArray(dbHack) && dbHack.length > 0) {
    dbHack.forEach((h) => {
      formattedItems.push({
        id: h.id,
        duration: h.dateHeld || "2024",
        type: "hackathon",
        title: `${h.name} (${h.position || "Participant"})`,
        organization: h.organizer,
        description: h.description || "",
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
        <div
          className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-border to-transparent"
          aria-hidden="true"
        />
        <div className="space-y-8">
          {itemsToRender.map((item, i) => {
            const Icon = iconFor[item.type] || Briefcase;
            const align = i % 2 === 0;
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: i * 0.06 }}
                className="relative grid md:grid-cols-2 md:gap-10 items-center"
              >
                {/* Timeline Card Column */}
                <div
                  className={`glass-card p-6 ml-12 md:ml-0 ${
                    align ? "md:col-start-1 md:mr-8 md:text-right" : "md:col-start-2 md:ml-8"
                  }`}
                >
                  <div className="text-xs uppercase tracking-wider text-muted-foreground font-medium">
                    {item.duration} · {item.type}
                  </div>
                  <div className="mt-1 font-medium text-lg text-foreground">{item.title}</div>
                  <div className="text-sm text-cyan-400/90 font-medium">{item.organization}</div>
                  <p className="mt-3 text-sm text-foreground/80 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {/* Opposite Side Date Indicator (Desktop) */}
                <div
                  className={`hidden md:flex items-center ${
                    align
                      ? "md:col-start-2 md:justify-start md:pl-8"
                      : "md:col-start-1 md:row-start-1 md:justify-end md:pr-8"
                  }`}
                >
                  <span className="inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3.5 py-1.5 text-xs font-semibold text-cyan-300 backdrop-blur-sm">
                    {item.duration}
                  </span>
                </div>

                {/* Timeline Center Node */}
                <div className="absolute left-0 md:left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 z-10">
                  <div className="relative">
                    <div className="absolute inset-0 rounded-full accent-gradient blur-md opacity-60" />
                    <div className="relative h-9 w-9 rounded-full grid place-items-center bg-background border border-border shadow-md">
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
