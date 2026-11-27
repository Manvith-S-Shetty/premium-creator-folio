import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

/**
 * Centralized GSAP initialization.
 *
 * Requirements:
 * - ScrollTrigger registered once safely in client/browser environments.
 * - Guarded against SSR evaluation issues (Nitro / TanStack Start).
 * - useGSAP exported for scoped, leak-free React hook usage.
 * - useGSAP is intentionally NOT registered as a GSAP plugin.
 */
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export { gsap, ScrollTrigger, useGSAP };
