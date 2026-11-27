import { useCallback, useEffect, useRef, useState, type MouseEvent } from "react";
import { Award, Download, ExternalLink, Eye, FileText, X } from "lucide-react";
import { usePortfolioData } from "@/hooks/public/usePortfolioData";
import { certificates as staticCertificates } from "@/config/data";
import { gsap, useGSAP } from "@/lib/gsap";
import { cn } from "@/lib/utils";

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

function isValidUrl(v?: string | null): v is string {
  if (!v || typeof v !== "string") return false;
  const trimmed = v.trim();
  if (trimmed.length === 0 || trimmed === "#") return false;
  if (trimmed.startsWith("file:") || /^[a-zA-Z]:\\/.test(trimmed)) return false;
  return trimmed.startsWith("http://") || trimmed.startsWith("https://") || trimmed.startsWith("/");
}

function isImageUrl(url?: string): boolean {
  if (!url) return false;
  return /\.(png|jpe?g|webp|gif|svg)(\?.*)?$/i.test(url);
}

function getCertPreview(cert: CertItem): string | null {
  if (isValidUrl(cert.thumbnailUrl)) return cert.thumbnailUrl;
  if (isValidUrl(cert.downloadUrl) && isImageUrl(cert.downloadUrl)) return cert.downloadUrl;
  return null;
}

export function Certificates({ bg = "primary" }: { bg?: "primary" | "secondary" }) {
  const { certificates: dbCertificates } = usePortfolioData();
  const [activeCert, setActiveCert] = useState<CertItem | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  const certList: CertItem[] =
    Array.isArray(dbCertificates) && dbCertificates.length > 0
      ? dbCertificates.map((c) => ({
          id: c.id,
          name: c.title,
          issuer: c.issuer,
          date: c.issueDate,
          description: c.description || "",
          downloadUrl: isValidUrl(c.pdfUrl) ? c.pdfUrl : undefined,
          viewUrl: isValidUrl(c.credentialUrl) ? c.credentialUrl : undefined,
          thumbnailUrl: isValidUrl(c.thumbnailUrl) ? c.thumbnailUrl : undefined,
        }))
      : staticCertificates.map((c) => ({
          name: c.name,
          issuer: c.issuer,
          date: c.date,
          description: c.description || "",
          downloadUrl: isValidUrl(c.downloadUrl) ? c.downloadUrl : undefined,
          viewUrl: isValidUrl(c.viewUrl) ? c.viewUrl : undefined,
        }));

  const handleOpenCert = (cert: CertItem, e?: MouseEvent) => {
    previousFocusRef.current =
      (e?.currentTarget as HTMLElement) || (document.activeElement as HTMLElement);
    setActiveCert(cert);
  };

  const handleCloseCert = useCallback(() => {
    setActiveCert(null);
    setTimeout(() => {
      previousFocusRef.current?.focus();
    }, 50);
  }, []);

  useEffect(() => {
    if (!activeCert) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [activeCert]);

  useEffect(() => {
    if (!activeCert) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleCloseCert();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activeCert, handleCloseCert]);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(".cert-header", {
          y: 20,
          autoAlpha: 0,
          duration: 0.75,
          ease: "power3.out",
          clearProps: "transform",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            once: true,
          },
        });

        gsap.from(".cert-row", {
          y: 16,
          autoAlpha: 0,
          duration: 0.6,
          stagger: 0.06,
          ease: "power3.out",
          clearProps: "transform",
          scrollTrigger: {
            trigger: ".cert-list",
            start: "top 84%",
            once: true,
          },
        });
      });

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set([".cert-header", ".cert-row"], {
          autoAlpha: 1,
          y: 0,
          clearProps: "transform",
        });
      });
    },
    { scope: sectionRef, dependencies: [certList.length] },
  );

  useGSAP(
    () => {
      if (!activeCert || !modalRef.current) return;
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          modalRef.current,
          { scale: 0.98, autoAlpha: 0, y: 10 },
          { scale: 1, autoAlpha: 1, y: 0, duration: 0.25, ease: "power2.out" },
        );
      });

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(modalRef.current, { scale: 1, autoAlpha: 1, y: 0 });
      });
    },
    { scope: modalRef, dependencies: [activeCert] },
  );

  const activeCertPreview = activeCert ? getCertPreview(activeCert) : null;

  return (
    <section
      id="certificates"
      ref={sectionRef}
      className={cn(
        "relative py-24 md:py-32",
        bg === "secondary" ? "bg-[var(--obsidian-900)]" : "bg-[var(--obsidian-950)]",
      )}
    >
      <div className="mx-auto max-w-6xl px-6">
        <div className="cert-header grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-end mb-14 md:mb-16">
          <div className="lg:col-span-6">
            <h2 className="font-display text-4xl md:text-5xl tracking-[-0.02em] text-[var(--ivory-50)]">
              Certificates
            </h2>
          </div>
          <div className="lg:col-span-6">
            <p className="text-sm md:text-base text-[var(--stone-400)] leading-relaxed max-w-lg">
              Verified coursework, technical credentials, and formal learning milestones.
            </p>
          </div>
        </div>

        {certList.length === 0 ? (
          <div className="py-12 border-t border-b border-[var(--hairline-rule)] text-sm text-[var(--stone-400)]">
            Certificates will appear here as credentials are published.
          </div>
        ) : (
          <div className="cert-list border-t border-[var(--hairline-rule)]">
            {certList.map((cert, index) => {
              const previewUrl = getCertPreview(cert);

              return (
                <article
                  key={cert.id || `${cert.name}-${index}`}
                  className="cert-row py-8 border-b border-[var(--hairline-rule)] grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 items-center"
                >
                  <div className="md:col-span-3 space-y-1">
                    {cert.date && (
                      <p className="text-xs font-mono tracking-[0.06em] text-[var(--ivory-200)]">
                        {cert.date}
                      </p>
                    )}
                    <p className="text-xs tracking-[0.08em] uppercase text-[var(--stone-400)]">
                      {cert.issuer}
                    </p>
                  </div>

                  <div className="md:col-span-6 flex items-start gap-5">
                    {previewUrl && (
                      <button
                        type="button"
                        onClick={(e) => handleOpenCert(cert, e)}
                        aria-label={`Preview ${cert.name}`}
                        className="shrink-0 w-24 aspect-[16/10] overflow-hidden border border-[var(--hairline-rule-lit)] bg-[var(--charcoal-800)] cursor-pointer hover:border-[var(--ivory-200)] transition-colors"
                      >
                        <img
                          src={previewUrl}
                          alt={cert.name}
                          width={96}
                          height={60}
                          className="h-full w-full object-cover"
                        />
                      </button>
                    )}
                    <div>
                      <h3 className="font-display text-2xl md:text-3xl tracking-[-0.015em] text-[var(--ivory-50)]">
                        {cert.name}
                      </h3>
                      {cert.description && (
                        <p className="mt-2 text-sm text-[var(--stone-400)] leading-relaxed line-clamp-2">
                          {cert.description}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="md:col-span-3 flex flex-wrap md:justify-end items-center gap-3">
                    <button
                      type="button"
                      onClick={(e) => handleOpenCert(cert, e)}
                      className="inline-flex items-center gap-2 rounded-sm border border-[var(--hairline-rule-lit)] px-4 py-2 text-xs font-medium tracking-[0.08em] uppercase text-[var(--ivory-50)] hover:border-[var(--ivory-200)] hover:bg-[var(--charcoal-800)] transition-colors cursor-pointer"
                    >
                      <Eye size={14} aria-hidden="true" />
                      <span>Inspect</span>
                    </button>

                    {cert.downloadUrl && (
                      <a
                        href={cert.downloadUrl}
                        download
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Download ${cert.name} certificate`}
                        className="inline-flex items-center justify-center rounded-sm border border-[var(--hairline-rule)] p-2 text-[var(--stone-400)] hover:text-[var(--ivory-50)] hover:border-[var(--hairline-rule-lit)] transition-colors"
                      >
                        <Download size={14} aria-hidden="true" />
                      </a>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>

      {activeCert && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10 bg-black/90 backdrop-blur-md overflow-y-auto"
          onClick={handleCloseCert}
          role="dialog"
          aria-modal="true"
          aria-labelledby="cert-modal-title"
        >
          <div
            ref={modalRef}
            className="relative w-full max-w-4xl max-h-[90vh] flex flex-col border border-[var(--hairline-rule-lit)] bg-[var(--obsidian-950)] overflow-hidden my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[var(--hairline-rule)] px-6 py-4 bg-[var(--obsidian-900)]">
              <div className="flex items-center gap-3 text-xs">
                <span className="tracking-[0.08em] uppercase text-[var(--ivory-50)] font-medium">
                  {activeCert.issuer}
                </span>
                {activeCert.date && (
                  <span className="font-mono text-[var(--stone-400)]">{activeCert.date}</span>
                )}
              </div>
              <button
                type="button"
                onClick={handleCloseCert}
                aria-label="Close certificate viewer"
                className="p-2 rounded-sm text-[var(--stone-400)] hover:text-[var(--ivory-50)] hover:bg-[var(--charcoal-800)] transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)] flex flex-col items-center gap-6">
              {activeCertPreview ? (
                <div className="w-full flex justify-center bg-[var(--charcoal-800)]/40 p-3 sm:p-5 border border-[var(--hairline-rule)]">
                  <img
                    src={activeCertPreview}
                    alt={activeCert.name}
                    className="max-h-[60vh] w-auto max-w-full object-contain"
                  />
                </div>
              ) : activeCert.downloadUrl?.toLowerCase().endsWith(".pdf") ? (
                <div className="w-full flex flex-col items-center justify-center p-8 sm:p-12 bg-[var(--obsidian-900)] border border-[var(--hairline-rule)] text-center min-h-[260px]">
                  <FileText size={44} className="text-[var(--ivory-200)] mb-4" aria-hidden="true" />
                  <h4 className="font-display text-2xl text-[var(--ivory-50)] mb-2">
                    {activeCert.name}
                  </h4>
                  <p className="text-xs text-[var(--stone-400)] max-w-md mb-6 leading-relaxed">
                    This credential is stored as a PDF document. Open or download the document to
                    view the full certificate.
                  </p>
                  <a
                    href={activeCert.downloadUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-sm border border-[var(--hairline-rule-lit)] text-xs font-medium tracking-[0.08em] uppercase text-[var(--ivory-50)] hover:bg-[var(--charcoal-800)] transition-colors"
                  >
                    <ExternalLink size={14} aria-hidden="true" />
                    <span>Open PDF Document</span>
                  </a>
                </div>
              ) : (
                <div className="w-full flex flex-col items-center justify-center p-8 bg-[var(--obsidian-900)] border border-[var(--hairline-rule)] text-center min-h-[180px]">
                  <Award size={40} className="text-[var(--ivory-200)] mb-3" aria-hidden="true" />
                  <h4 className="font-display text-2xl text-[var(--ivory-50)]">
                    {activeCert.name}
                  </h4>
                </div>
              )}

              <div className="w-full space-y-2">
                <h3
                  id="cert-modal-title"
                  className="font-display text-2xl md:text-3xl text-[var(--ivory-50)]"
                >
                  {activeCert.name}
                </h3>
                {activeCert.description && (
                  <p className="text-sm text-[var(--stone-400)] leading-relaxed">
                    {activeCert.description}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-[var(--hairline-rule)] px-6 py-4 bg-[var(--obsidian-900)]">
              {activeCert.viewUrl ? (
                <a
                  href={activeCert.viewUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-xs tracking-[0.08em] uppercase text-[var(--ivory-200)] hover:text-[var(--ivory-50)] transition-colors"
                >
                  <ExternalLink size={14} aria-hidden="true" />
                  <span>Verify Credential</span>
                </a>
              ) : (
                <span />
              )}

              {activeCert.downloadUrl && (
                <a
                  href={activeCert.downloadUrl}
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-sm bg-[var(--ivory-50)] text-[var(--obsidian-950)] text-xs font-medium tracking-[0.08em] uppercase hover:bg-[var(--ivory-200)] transition-colors"
                >
                  <Download size={14} aria-hidden="true" />
                  <span>Download</span>
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
