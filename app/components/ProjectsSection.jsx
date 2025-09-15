"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import ProjectCard from "./ProjectCard";
import { fetchData } from "../services/firebase";

const ProjectsSection = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadProjects = async () => {
      try {
        setLoading(true);
        const data = await fetchData('projects');
        if (data) {
          // Convert object to array and ensure each project has required fields
          const projectsArray = Object.values(data).map(project => ({
            ...project,
            tags: project.tags || [],
            imgUrl: project.imgUrl || '/placeholder.jpg',
            gitUrl: project.gitUrl || '',
            previewUrl: project.previewUrl || ''
          }));
          setProjects(projectsArray);
        }
      } catch (error) {
        console.error("Error loading projects:", error);
        setError("Failed to load projects");
      } finally {
        setLoading(false);
      }
    };

    loadProjects();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <section id="projects" className="py-12 sm:py-16 lg:py-20 bg-theme">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8 sm:mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-primary">
            My <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-teal-500">Projects</span>
          </h2>
          <p className="text-secondary max-w-2xl mx-auto text-sm sm:text-base px-4">
            Here are some of my recent projects. Each project is a unique piece of development, showcasing different skills and technologies.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;