"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { FaCode, FaServer, FaDatabase, FaTools, FaTrophy } from "react-icons/fa";
import { fetchData } from "../services/firebase";

const defaultSkillGroups = [
  { title: 'Frontend Development', items: [] },
  { title: 'Backend Development', items: [] },
  { title: 'Database & Cloud', items: [] },
  { title: 'Tools & Others', items: [] }
];

const AboutSection = () => {
  const [activeTab, setActiveTab] = useState("experience");
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageError, setImageError] = useState(false);

  // Function to render description with bullet points
  const renderDescription = (description) => {
    if (!description) return null;
    
    // Split by lines and check for bullet points
    const lines = description.split('\n').filter(line => line.trim());
    
    // Check if any line starts with a bullet point indicator
    const hasBulletPoints = lines.some(line => 
      line.trim().startsWith('- ') || 
      line.trim().startsWith('• ') || 
      line.trim().startsWith('* ')
    );
    
    if (hasBulletPoints) {
      return (
        <ul className="mt-2 space-y-1">
          {lines.map((line, index) => {
            const trimmedLine = line.trim();
            // Remove bullet point indicators and render as list item
            const cleanLine = trimmedLine.replace(/^[-•*]\s*/, '');
            return (
              <li key={index} className="text-secondary flex items-start">
                <span className="text-accent mr-2 mt-1">•</span>
                <span>{cleanLine}</span>
              </li>
            );
          })}
        </ul>
      );
    }
    
    // If no bullet points, render as regular paragraph
    return <p className="mt-2 text-secondary">{description}</p>;
  };

  const tabs = [
    { id: "experience", label: "Experience", icon: <FaServer className="text-xl" /> },
    { id: "education", label: "Education", icon: <FaDatabase className="text-xl" /> },
    { id: "skills", label: "Skills", icon: <FaCode className="text-xl" /> },
    { id: "achievements", label: "Achievements", icon: <FaTrophy className="text-xl" /> },
    { id: "tools", label: "Tools", icon: <FaTools className="text-xl" /> },
  ];

  useEffect(() => {
    const loadContent = async () => {
      try {
        const data = await fetchData('about');
        if (data) {
          // Ensure all required data structures exist with default values
          const contentWithDefaults = {
            ...data,
            bio: data.bio || '',
            images: {
              profile: data.images?.profile || '',
              aboutMe: data.images?.aboutMe || '',
              background: data.images?.background || '',
              additional: data.images?.additional || []
            },
            skillGroups: Array.isArray(data.skillGroups) ? data.skillGroups : defaultSkillGroups,
            experience: Array.isArray(data.experience) ? data.experience : [],
            education: Array.isArray(data.education) ? data.education : [],
            achievements: Array.isArray(data.achievements) ? data.achievements : [],
            tools: Array.isArray(data.tools) ? data.tools : []
          };

          // Ensure each skill group has the required structure
          contentWithDefaults.skillGroups = contentWithDefaults.skillGroups.map(group => ({
            title: group.title || 'Unnamed Group',
            items: Array.isArray(group.items) ? group.items : []
          }));

          setContent(contentWithDefaults);
        } else {
          // If no data is returned, use default values
          setContent({
            bio: '',
            images: {
              profile: '',
              aboutMe: '',
              background: '',
              additional: []
            },
            skillGroups: defaultSkillGroups,
            experience: [],
            education: [],
            achievements: [],
            tools: []
          });
        }
      } catch (err) {
        console.error('Error loading about content:', err);
        setError('Failed to load content');
      } finally {
        setLoading(false);
      }
    };

    loadContent();
  }, []);

  const handleImageError = () => {
    console.error('Failed to load profile image');
    setImageError(true);
  };

  if (loading) {
    return (
      <section id="about" className="py-16">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="text-[#ADB7BE] mt-4">Loading content...</p>
        </div>
      </section>
    );
  }

  if (error || !content) {
    return (
      <section id="about" className="py-16">
        <div className="text-center">
          <p className="text-red-500">{error || 'Failed to load content'}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 space-y-16" id="about">
      <div className="text-center space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative w-32 h-32 mx-auto mb-8"
        >
          {content.images.aboutMe && !imageError ? (
            <Image
              src={content.images.aboutMe}
              alt="About Me"
              className="rounded-apple-xl object-cover shadow-apple"
              fill
              priority
              unoptimized
              onError={handleImageError}
            />
          ) : (
            <div className="w-full h-full rounded-apple-xl bg-gradient-theme flex items-center justify-center text-white text-2xl font-semibold shadow-apple">
              AD
            </div>
          )}
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="space-y-4"
        >
          <h2 className="text-5xl font-bold text-primary">
            About <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-teal-500">Me</span>
          </h2>
          <p className="text-secondary text-xl max-w-3xl mx-auto leading-relaxed">
            {content.bio}
          </p>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="space-y-8"
      >
        <div className="flex flex-wrap justify-center gap-3">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-3 px-6 py-3 rounded-apple transition-apple ${
                activeTab === tab.id
                  ? "bg-accent text-white shadow-apple-light"
                  : "bg-surface-secondary text-secondary hover:bg-surface-tertiary"
              }`}
            >
              {tab.icon}
              <span className="font-medium">{tab.label}</span>
            </button>
          ))}
        </div>
        
        <div className="bg-surface-secondary rounded-apple-lg p-8 shadow-apple-light">
            {activeTab === "skills" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {content.skillGroups.map((group, index) => (
                  <div key={index} className="space-y-4">
                    <h3 className="text-2xl font-semibold text-primary">{group.title}</h3>
                    <div className="flex flex-wrap gap-3">
                      {group.items.map((skill, skillIndex) => (
                        <span
                          key={skillIndex}
                          className="px-4 py-2 bg-surface-tertiary text-secondary rounded-apple text-sm font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
            {activeTab === "experience" && (
              <div className="space-y-8">
                {content.experience
                  .sort((a, b) => {
                    // Extract start date from period string with better parsing
                    const getStartDate = (period) => {
                      if (!period) return new Date(0);
                      
                      // Split by ' - ' and take the first part (start date)
                      const startDateStr = period.split(' - ')[0].trim();
                      
                      // Handle different date formats
                      // Format: "Month YYYY" (e.g., "March 2024")
                      if (/^[A-Za-z]+ \d{4}$/.test(startDateStr)) {
                        return new Date(startDateStr);
                      }
                      
                      // Format: "Month YYYY - Month YYYY" (e.g., "March 2024 - August 2024")
                      if (startDateStr.includes(' ')) {
                        return new Date(startDateStr);
                      }
                      
                      // Fallback to original parsing
                      return new Date(startDateStr);
                    };
                    
                    // Sort by start date (most recent first)
                    const dateA = getStartDate(a.period);
                    const dateB = getStartDate(b.period);
                    
                    // Handle invalid dates
                    if (isNaN(dateA.getTime()) && isNaN(dateB.getTime())) return 0;
                    if (isNaN(dateA.getTime())) return 1;
                    if (isNaN(dateB.getTime())) return -1;
                    
                    return dateB - dateA;
                  })
                  .map((exp, index) => (
                    <div key={index} className="bg-surface rounded-apple p-6 shadow-apple-light">
                      <div className="space-y-3">
                        <h3 className="text-2xl font-semibold text-primary">{exp.title}</h3>
                        <p className="text-accent font-medium text-lg">{exp.company}</p>
                        <p className="text-tertiary text-sm font-medium">{exp.period}</p>
                        <div className="pt-2">
                          {renderDescription(exp.description)}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            )}
            {activeTab === "education" && (
              <div className="space-y-6">
                {content.education
                  .sort((a, b) => {
                    // Extract start date from period string with better parsing
                    const getStartDate = (period) => {
                      if (!period) return new Date(0);
                      
                      // Split by ' - ' and take the first part (start date)
                      const startDateStr = period.split(' - ')[0].trim();
                      
                      // Handle different date formats
                      // Format: "Month YYYY" (e.g., "March 2024")
                      if (/^[A-Za-z]+ \d{4}$/.test(startDateStr)) {
                        return new Date(startDateStr);
                      }
                      
                      // Format: "Month YYYY - Month YYYY" (e.g., "March 2024 - August 2024")
                      if (startDateStr.includes(' ')) {
                        return new Date(startDateStr);
                      }
                      
                      // Fallback to original parsing
                      return new Date(startDateStr);
                    };
                    
                    // Sort by start date (most recent first)
                    const dateA = getStartDate(a.period);
                    const dateB = getStartDate(b.period);
                    
                    // Handle invalid dates
                    if (isNaN(dateA.getTime()) && isNaN(dateB.getTime())) return 0;
                    if (isNaN(dateA.getTime())) return 1;
                    if (isNaN(dateB.getTime())) return -1;
                    
                    return dateB - dateA;
                  })
                  .map((edu, index) => (
                    <div key={index} className="bg-surface rounded-apple p-6 shadow-apple-light">
                      <div className="space-y-2">
                        <h3 className="text-2xl font-semibold text-primary">{edu.degree}</h3>
                        <p className="text-accent font-medium text-lg">{edu.school}</p>
                        <p className="text-tertiary text-sm font-medium">{edu.period}</p>
                      </div>
                    </div>
                  ))}
              </div>
            )}
            {activeTab === "achievements" && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {content.achievements.map((achievement, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="bg-surface rounded-apple-lg p-6 shadow-apple-light hover:shadow-apple transition-apple group"
                  >
                    {/* Achievement Image */}
                    {achievement.image && (
                      <div className="relative w-full h-48 mb-4 rounded-apple overflow-hidden">
                        <Image
                          src={achievement.image}
                          alt={achievement.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-apple"
                          unoptimized
                        />
                      </div>
                    )}
                    
                    {/* Achievement Content */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <FaTrophy className="text-accent text-lg" />
                        <h3 className="text-xl font-semibold text-primary">{achievement.title}</h3>
                      </div>
                      
                      {achievement.category && (
                        <span className="inline-block px-3 py-1 bg-accent/10 text-accent rounded-apple text-sm font-medium">
                          {achievement.category}
                        </span>
                      )}
                      
                      {achievement.date && (
                        <p className="text-secondary text-sm">
                          {achievement.date}
                        </p>
                      )}
                      
                      {achievement.description && (
                        <p className="text-secondary text-sm leading-relaxed">
                          {achievement.description}
                        </p>
                      )}
                      
                      {achievement.organization && (
                        <p className="text-tertiary text-sm">
                          <span className="font-medium">Organization:</span> {achievement.organization}
                        </p>
                      )}
                      
                      {achievement.position && (
                        <p className="text-tertiary text-sm">
                          <span className="font-medium">Position:</span> {achievement.position}
                        </p>
                      )}
                      
                      {achievement.location && (
                        <p className="text-tertiary text-sm">
                          <span className="font-medium">Location:</span> {achievement.location}
                        </p>
                      )}
                      
                      {achievement.link && (
                        <div className="pt-2">
                          <a
                            href={achievement.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-4 py-2 bg-accent hover:bg-accent-hover text-white rounded-apple text-sm font-medium transition-apple"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                            View Details
                          </a>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
                
                {content.achievements.length === 0 && (
                  <div className="col-span-full text-center py-12">
                    <FaTrophy className="text-6xl text-tertiary mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-primary mb-2">No Achievements Yet</h3>
                    <p className="text-secondary">Add your achievements in the admin panel to showcase your accomplishments!</p>
                  </div>
                )}
              </div>
            )}
            {activeTab === "tools" && (
              <div className="flex flex-wrap gap-3">
                {content.tools.map((tool) => (
                  <span
                    key={tool}
                    className="px-4 py-2 bg-surface-tertiary text-secondary rounded-apple text-sm font-medium"
                  >
                    {tool}
                  </span>
                ))}
              </div>
            )}
        </div>
      </motion.div>
    </section>
  );
};

export default AboutSection;