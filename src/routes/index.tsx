import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/portfolio/Navbar";
import { Hero } from "@/components/portfolio/Hero";
import { About } from "@/components/portfolio/About";
import { Skills } from "@/components/portfolio/Skills";
import { Projects } from "@/components/portfolio/Projects";
import { Experience } from "@/components/portfolio/Experience";
import { Education } from "@/components/portfolio/Education";
import { Hackathons } from "@/components/portfolio/Hackathons";
import { Achievements } from "@/components/portfolio/Achievements";
import { Certificates } from "@/components/portfolio/Certificates";
import { Contact } from "@/components/portfolio/Contact";
import { Footer } from "@/components/portfolio/Footer";
import { HairlineDivider } from "@/components/ui/HairlineDivider";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Manvith S Shetty — Software Engineer & AI/ML Enthusiast" },
      {
        name: "description",
        content:
          "Manvith S Shetty is a Software Engineer building real-time systems, AI-powered tools and full-stack products. Explore featured projects, skills and experience.",
      },
      { property: "og:title", content: "Manvith S Shetty — Software Engineer & AI/ML Enthusiast" },
      {
        property: "og:description",
        content:
          "Portfolio of Manvith S Shetty — real-time systems, AI-powered tools, and full-stack products.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="relative min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] overflow-x-clip">
      <Navbar />
      <main>
        <Hero />
        <HairlineDivider />
        <About bg="secondary" />
        <HairlineDivider />
        <Skills bg="primary" />
        <HairlineDivider />
        <Projects bg="secondary" />
        <HairlineDivider />
        <Experience bg="primary" />
        <HairlineDivider />
        <Education bg="secondary" />
        <HairlineDivider />
        <Hackathons bg="primary" />
        <HairlineDivider />
        <Achievements bg="secondary" />
        <HairlineDivider />
        <Certificates bg="primary" />
        <HairlineDivider />
        <Contact bg="secondary" />
      </main>
      <Footer />
    </div>
  );
}
