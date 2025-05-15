"use client";

import HeroSections from "./components/HeroSections";
import Navbar from "./components/Navbar";
import AchievementsSection from "./components/AchievementsSection";
import AboutSection from "./components/AboutSection";
import ProjectsSection from "./components/ProjectsSection";
import EmailSection from "./components/EmailSection";
import Footer from "./components/Footer";
import MouseTrailEffect from "./components/MouseTrailEffect";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col bg-[#121212]">
      <MouseTrailEffect />
      <Navbar />
      <div className="container mt-24 mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <HeroSections />
        <AchievementsSection />
        <AboutSection />
        <ProjectsSection />
        <EmailSection />
      </div>
      <Footer />
    </main>
  );
}
