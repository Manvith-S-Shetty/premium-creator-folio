import { motion } from "motion/react";
import { Download, ExternalLink, Award } from "lucide-react";
import { usePortfolioData } from "@/hooks/public/usePortfolioData";
import { certificates as staticCertificates } from "@/config/data";
import { Section } from "./Section";

export function Certificates() {
  const { certificates: dbCertificates } = usePortfolioData();

  const certList = Array.isArray(dbCertificates) && dbCertificates.length > 0
    ? dbCertificates.map((c) => ({
        name: c.title,
        issuer: c.issuer,
        date: c.issueDate,
        description: c.description || '',
        downloadUrl: c.pdfUrl,
        viewUrl: c.credentialUrl,
      }))
    : staticCertificates;

  return (
    <Section
      id="certificates"
      eyebrow="Certificates"
      title="Learning receipts"
      description="Coursework, credentials and things I've formally studied outside of college."
    >
      {certList.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="glass-card p-12 text-center flex flex-col items-center"
        >
          <div className="h-14 w-14 rounded-2xl border border-border grid place-items-center mb-5">
            <Award size={22} className="text-foreground/70" />
          </div>
          <div className="font-display text-2xl text-gradient">Coming soon</div>
          <p className="mt-2 max-w-md text-sm text-muted-foreground">
            Certificates will appear here as they're earned. Working on a few right now.
          </p>
        </motion.div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {certList.map((c, i) => (
            <motion.div
              key={c.name + i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              className="glass-card p-6 flex flex-col hover:-translate-y-0.5 hover:border-foreground/25 transition-all"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-xs uppercase tracking-wider text-muted-foreground">
                    {c.issuer}
                  </div>
                  <div className="font-medium mt-1">{c.name}</div>
                </div>
                <span className="text-xs text-muted-foreground">{c.date}</span>
              </div>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{c.description}</p>
              <div className="mt-6 flex items-center gap-5 text-sm">
                {c.viewUrl && (
                  <a
                    href={c.viewUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-foreground/80 hover:text-foreground"
                  >
                    <ExternalLink size={14} /> View
                  </a>
                )}
                {c.downloadUrl && (
                  <a
                    href={c.downloadUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-foreground/80 hover:text-foreground"
                  >
                    <Download size={14} /> Download
                  </a>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </Section>
  );
}

