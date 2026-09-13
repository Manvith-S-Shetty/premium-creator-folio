import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Download, ExternalLink, Award, Eye, FileText, X } from "lucide-react";
import { usePortfolioData } from "@/hooks/public/usePortfolioData";
import { certificates as staticCertificates } from "@/config/data";
import { Section } from "./Section";

interface CertItem {
  id?: string;
  name: string;
  issuer: string;
  date: string;
  description: string;
  downloadUrl?: string;
  viewUrl?: string;
  thumbnailUrl?: string;
}

// Helper to determine if a URL points to an image file
function isImageUrl(url?: string): boolean {
  if (!url) return false;
  return /\.(png|jpe?g|webp|gif|svg)(\?.*)?$/i.test(url);
}

// Helper to get effective thumbnail image for a certificate
function getCertPreview(cert: CertItem): string | null {
  if (cert.thumbnailUrl) return cert.thumbnailUrl;
  if (isImageUrl(cert.downloadUrl)) return cert.downloadUrl!;
  return null;
}

export function Certificates() {
  const { certificates: dbCertificates } = usePortfolioData();
  const [activeCert, setActiveCert] = useState<CertItem | null>(null);

  const certList: CertItem[] =
    Array.isArray(dbCertificates) && dbCertificates.length > 0
      ? dbCertificates.map((c) => ({
          id: c.id,
          name: c.title,
          issuer: c.issuer,
          date: c.issueDate,
          description: c.description || "",
          downloadUrl: c.pdfUrl,
          viewUrl: c.credentialUrl,
          thumbnailUrl: c.thumbnailUrl,
        }))
      : staticCertificates;

  const triggerRef = useState<HTMLElement | null>(null)[1];
  const lastActiveElement = useState<HTMLElement | null>(null);
  const activeElementRef = useState<{ current: HTMLElement | null }>({ current: null })[0];

  const handleOpenCert = (c: CertItem, e?: React.MouseEvent) => {
    activeElementRef.current =
      (e?.currentTarget as HTMLElement) || (document.activeElement as HTMLElement);
    setActiveCert(c);
  };

  const handleCloseCert = () => {
    setActiveCert(null);
    setTimeout(() => {
      activeElementRef.current?.focus();
    }, 50);
  };

  // Lock body scroll while modal is open and clean up on unmount
  useEffect(() => {
    if (activeCert) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [activeCert]);

  // Handle Escape key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleCloseCert();
      }
    };
    if (activeCert) {
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }
  }, [activeCert]);

  const activeCertPreview = activeCert ? getCertPreview(activeCert) : null;

  return (
    <Section
      id="certificates"
      eyebrow="Certificates"
      title="Learning milestones"
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
          {certList.map((c, i) => {
            const previewUrl = getCertPreview(c);

            return (
              <motion.div
                key={c.id || c.name + i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                className="glass-card group flex flex-col justify-between overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl hover:border-cyan-500/40 hover:shadow-xl hover:shadow-cyan-500/10 transition-all duration-300 h-full"
              >
                <div className="flex-1 flex flex-col">
                  {/* Dominant Thumbnail Container */}
                  <div
                    onClick={(e) => handleOpenCert(c, e)}
                    className="relative aspect-[16/10] w-full overflow-hidden bg-slate-900/80 cursor-pointer group/thumb border-b border-white/10"
                  >
                    {previewUrl ? (
                      <img
                        src={previewUrl}
                        alt={c.name}
                        className="h-full w-full object-cover object-center transition-transform duration-500 group-hover/thumb:scale-105 group-hover/thumb:brightness-110"
                      />
                    ) : (
                      <div className="flex h-full w-full flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-slate-900 via-slate-800 to-cyan-950/40">
                        <FileText
                          size={40}
                          className="text-cyan-400/80 mb-2 transition-transform group-hover/thumb:scale-110"
                        />
                        <span className="text-xs font-semibold text-cyan-400/90 leading-tight line-clamp-1">
                          {c.issuer}
                        </span>
                        <span className="text-xs text-slate-400 mt-1 line-clamp-1">{c.name}</span>
                        <span className="mt-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 px-2.5 py-0.5 text-[10px] text-cyan-300 font-medium">
                          PDF Document
                        </span>
                      </div>
                    )}
                    {/* Hover Visual Cue Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/30 to-transparent opacity-0 group-hover/thumb:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <span className="inline-flex items-center gap-2 rounded-full bg-cyan-500/90 px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-cyan-500/30 backdrop-blur-sm transform translate-y-2 group-hover/thumb:translate-y-0 transition-transform duration-300">
                        <Eye size={14} />
                        View Certificate
                      </span>
                    </div>
                  </div>

                  {/* Card Info Section */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    {/* Organization + Date */}
                    <div className="flex items-start justify-between gap-3 text-xs mb-2">
                      <span className="font-semibold text-cyan-400 leading-snug line-clamp-2">
                        {c.issuer}
                      </span>
                      <span className="text-muted-foreground whitespace-nowrap shrink-0">
                        {c.date}
                      </span>
                    </div>

                    {/* Certificate Title */}
                    <h3 className="text-base font-bold tracking-tight text-slate-100 line-clamp-2 leading-snug">
                      {c.name}
                    </h3>
                  </div>
                </div>

                {/* Card Action Buttons */}
                <div className="px-5 pb-5 pt-2 flex items-center gap-3 mt-auto">
                  <button
                    type="button"
                    onClick={(e) => handleOpenCert(c, e)}
                    className="flex-1 inline-flex items-center justify-center gap-2 min-h-[44px] rounded-xl bg-cyan-500/10 border border-cyan-500/30 px-4 py-2.5 text-xs font-semibold text-cyan-300 hover:bg-cyan-500 hover:text-white hover:border-cyan-400 transition-all duration-200 shadow-sm cursor-pointer"
                  >
                    <Eye size={15} />
                    <span>View Certificate</span>
                  </button>

                  {c.downloadUrl && (
                    <a
                      href={c.downloadUrl}
                      download
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`Download ${c.name} certificate`}
                      className="inline-flex items-center justify-center min-h-[44px] min-w-[44px] p-2.5 rounded-xl border border-white/10 bg-white/[0.03] text-slate-400 hover:text-white hover:border-white/25 hover:bg-white/[0.08] transition-all cursor-pointer"
                    >
                      <Download size={15} />
                    </a>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Fullscreen Certificate Viewer Modal (Netflix-Style) */}
      <AnimatePresence>
        {activeCert && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10 bg-black/85 backdrop-blur-md overflow-y-auto"
            onClick={handleCloseCert}
            role="dialog"
            aria-modal="true"
            aria-labelledby="cert-modal-title"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-4xl max-h-[90vh] flex flex-col glass-card border border-white/15 bg-slate-950/90 shadow-2xl rounded-2xl overflow-hidden my-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-white/10 px-6 py-4 bg-white/[0.02]">
                <div className="flex items-center gap-3">
                  <span className="text-xs text-cyan-400 font-semibold px-2.5 py-1 rounded-md bg-cyan-500/10 border border-cyan-500/20">
                    {activeCert.issuer}
                  </span>
                  <span className="text-xs text-slate-400">{activeCert.date}</span>
                </div>
                <button
                  type="button"
                  onClick={handleCloseCert}
                  aria-label="Close certificate viewer"
                  className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)] flex flex-col items-center gap-6">
                {/* Visual Certificate Display */}
                {activeCertPreview ? (
                  <div className="w-full flex justify-center bg-black/50 p-2 sm:p-4 rounded-xl border border-white/10">
                    <img
                      src={activeCertPreview}
                      alt={activeCert.name}
                      className="max-h-[60vh] w-auto max-w-full object-contain rounded-lg shadow-2xl"
                    />
                  </div>
                ) : activeCert.downloadUrl?.toLowerCase().endsWith(".pdf") ? (
                  <div className="w-full flex flex-col items-center justify-center p-8 sm:p-12 bg-slate-900/60 rounded-xl border border-white/10 text-center min-h-[280px]">
                    <FileText size={56} className="text-cyan-400 mb-4 animate-pulse" />
                    <h4 className="text-lg font-semibold text-white mb-1">{activeCert.name}</h4>
                    <p className="text-xs text-slate-400 max-w-md mb-5">
                      This certificate is stored as a PDF document. You can open or download the
                      full document directly.
                    </p>
                    <a
                      href={activeCert.downloadUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 text-xs font-semibold hover:bg-cyan-500/30 transition-all"
                    >
                      <ExternalLink size={14} /> Open PDF Document
                    </a>
                  </div>
                ) : (
                  <div className="w-full flex flex-col items-center justify-center p-8 bg-slate-900/60 rounded-xl border border-white/10 text-center min-h-[200px]">
                    <Award size={48} className="text-cyan-400 mb-3" />
                    <h4 className="text-lg font-semibold text-white mb-1">{activeCert.name}</h4>
                  </div>
                )}

                {/* Details */}
                <div className="w-full space-y-3">
                  <h3 id="cert-modal-title" className="text-xl font-bold text-slate-100">
                    {activeCert.name}
                  </h3>
                  {activeCert.description && (
                    <p className="text-sm text-slate-300 leading-relaxed bg-white/[0.02] p-4 rounded-xl border border-white/5">
                      {activeCert.description}
                    </p>
                  )}
                </div>
              </div>

              {/* Modal Footer Actions */}
              <div className="flex items-center justify-between border-t border-white/10 px-6 py-4 bg-white/[0.02]">
                {activeCert.viewUrl ? (
                  <a
                    href={activeCert.viewUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-cyan-400 transition-colors"
                  >
                    <ExternalLink size={14} /> Verify Credential
                  </a>
                ) : (
                  <span />
                )}
                {activeCert.downloadUrl && (
                  <a
                    href={activeCert.downloadUrl}
                    download
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white text-xs font-semibold shadow-lg shadow-cyan-500/20 transition-all cursor-pointer"
                  >
                    <Download size={15} /> Download Certificate
                  </a>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Section>
  );
}
