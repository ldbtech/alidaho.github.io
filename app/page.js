"use client";

import HeroSections from "./components/HeroSections";
import Navbar from "./components/Navbar";
import AchievementsSection from "./components/AchievementsSection";
import AboutSection from "./components/AboutSection";
import ProjectsSection from "./components/ProjectsSection";
import EmailSection from "./components/EmailSection";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-theme">
      <Navbar />
      <div className="w-full">
        <HeroSections />
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <AchievementsSection />
          <AboutSection />
          <ProjectsSection />
          <EmailSection />
        </div>
      </div>
      <Footer />
    </main>
  );
}
