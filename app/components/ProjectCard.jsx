"use client";

import { motion } from "framer-motion";
import { FaGithub, FaExternalLinkAlt } from "react-icons/fa";
import Image from "next/image";

const ProjectCard = ({ project }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-surface rounded-2xl overflow-hidden border border-separator"
    >
      <div className="relative h-40 sm:h-48 overflow-hidden group">
        <Image
          src={project.imgUrl}
          alt={project.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-black/50 dark:bg-black/50 bg-white/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3 sm:gap-4">
          {project.gitUrl && (
            <a
              href={project.gitUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 sm:p-3 bg-black/70 dark:bg-white/10 text-white rounded-full hover:bg-black/80 dark:hover:bg-white/20 transition-colors duration-300"
            >
              <FaGithub className="text-white text-lg sm:text-xl" />
            </a>
          )}
          {project.previewUrl && (
            <a
              href={project.previewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 sm:p-3 bg-black/70 dark:bg-white/10 text-white rounded-full hover:bg-black/80 dark:hover:bg-white/20 transition-colors duration-300"
            >
              <FaExternalLinkAlt className="text-white text-lg sm:text-xl" />
            </a>
          )}
        </div>
      </div>
      <div className="p-4 sm:p-6">
        <h3 className="text-lg sm:text-xl font-semibold mb-2 text-primary">{project.title}</h3>
        <p className="text-secondary mb-4 text-sm sm:text-base">{project.description}</p>
        <div className="flex flex-wrap gap-1.5 sm:gap-2">
          {(project.tags || []).map((tag, index) => (
            <span
              key={index}
              className="px-2 sm:px-3 py-1 bg-surface-secondary text-secondary rounded-full text-xs sm:text-sm border border-separator"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default ProjectCard;