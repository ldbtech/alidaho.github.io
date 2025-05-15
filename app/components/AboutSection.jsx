"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { FaCode, FaServer, FaDatabase, FaTools } from "react-icons/fa";
import { fetchData } from "../services/firebase";

const defaultSkillGroups = [
  { title: 'Frontend Development', items: [] },
  { title: 'Backend Development', items: [] },
  { title: 'Database & Cloud', items: [] },
  { title: 'Tools & Others', items: [] }
];

const AboutSection = () => {
  const [activeTab, setActiveTab] = useState("skills");
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageError, setImageError] = useState(false);

  const tabs = [
    { id: "skills", label: "Skills", icon: <FaCode className="text-xl" /> },
    { id: "experience", label: "Experience", icon: <FaServer className="text-xl" /> },
    { id: "education", label: "Education", icon: <FaDatabase className="text-xl" /> },
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
              background: data.images?.background || '',
              additional: data.images?.additional || []
            },
            skillGroups: Array.isArray(data.skillGroups) ? data.skillGroups : defaultSkillGroups,
            experience: Array.isArray(data.experience) ? data.experience : [],
            education: Array.isArray(data.education) ? data.education : [],
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
              background: '',
              additional: []
            },
            skillGroups: defaultSkillGroups,
            experience: [],
            education: [],
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
    <section className="py-16" id="about">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="col-span-4"
        >
          <div className="relative w-[300px] h-[300px] lg:w-[400px] lg:h-[400px] mx-auto">
            {content.images.profile && !imageError ? (
              <Image
                src={content.images.profile}
                alt="Profile"
                className="rounded-full object-cover"
                fill
                priority
                unoptimized
                onError={handleImageError}
              />
            ) : (
              <div className="w-full h-full rounded-full bg-gradient-to-r from-blue-500 to-teal-500 flex items-center justify-center text-white text-4xl font-bold">
                AD
              </div>
            )}
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="col-span-8"
        >
          <h2 className="text-4xl font-bold text-white mb-8">
            About <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-teal-500">Me</span>
          </h2>
          <p className="text-[#ADB7BE] text-lg mb-8">
            {content.bio}
          </p>
          <div className="flex flex-wrap gap-4 mb-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-full transition-all duration-300 ${
                  activeTab === tab.id
                    ? "bg-gradient-to-r from-blue-500 to-teal-500 text-white"
                    : "bg-[#181818] text-[#ADB7BE] hover:bg-[#2A2A2A]"
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
          <div className="bg-[#181818] p-6 rounded-2xl">
            {activeTab === "skills" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {content.skillGroups.map((group, index) => (
                  <div key={index} className="space-y-2">
                    <h3 className="text-xl font-semibold text-white">{group.title}</h3>
                    <div className="flex flex-wrap gap-2">
                      {group.items.map((skill, skillIndex) => (
                        <span
                          key={skillIndex}
                          className="px-3 py-1 bg-[#2A2A2A] text-[#ADB7BE] rounded-full text-sm"
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
              <div className="space-y-6">
                {content.experience.map((exp, index) => (
                  <div key={index} className="border-l-2 border-blue-500 pl-4">
                    <h3 className="text-xl font-semibold text-white">{exp.title}</h3>
                    <p className="text-[#ADB7BE]">{exp.company}</p>
                    <p className="text-sm text-[#ADB7BE]">{exp.period}</p>
                    <p className="mt-2 text-[#ADB7BE]">{exp.description}</p>
                  </div>
                ))}
              </div>
            )}
            {activeTab === "education" && (
              <div className="space-y-6">
                {content.education.map((edu, index) => (
                  <div key={index} className="border-l-2 border-teal-500 pl-4">
                    <h3 className="text-xl font-semibold text-white">{edu.degree}</h3>
                    <p className="text-[#ADB7BE]">{edu.school}</p>
                    <p className="text-sm text-[#ADB7BE]">{edu.period}</p>
                  </div>
                ))}
              </div>
            )}
            {activeTab === "tools" && (
              <div className="flex flex-wrap gap-2">
                {content.tools.map((tool) => (
                  <span
                    key={tool}
                    className="px-3 py-1 bg-[#2A2A2A] text-[#ADB7BE] rounded-full text-sm"
                  >
                    {tool}
                  </span>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutSection;