"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { FaCode, FaServer, FaDatabase, FaTools } from "react-icons/fa";
import { fetchData } from "../services/firebase";

const AboutSection = () => {
  const basePath = process.env.NODE_ENV === 'production' ? '/alidaho.github.io' : '';
  const [activeTab, setActiveTab] = useState("skills");
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
          setContent(data);
        }
      } catch (err) {
        setError('Failed to load content');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadContent();
  }, []);

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
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-teal-500 rounded-2xl transform rotate-6"></div>
            <Image
              src={`${basePath}/public/images/profile-portfolio.jpg`}
              alt="about image"
              className="absolute inset-0 rounded-2xl object-cover"
              width={400}
              height={400}
            />
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
                {content.skills.map((skillGroup) => (
                  <div key={skillGroup.name} className="space-y-2">
                    <h3 className="text-xl font-semibold text-white">{skillGroup.name}</h3>
                    <div className="flex flex-wrap gap-2">
                      {skillGroup.items.map((skill) => (
                        <span
                          key={skill}
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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {content.tools.map((toolGroup) => (
                  <div key={toolGroup.category} className="space-y-2">
                    <h3 className="text-xl font-semibold text-white">{toolGroup.category}</h3>
                    <div className="flex flex-wrap gap-2">
                      {toolGroup.items.map((tool) => (
                        <span
                          key={tool}
                          className="px-3 py-1 bg-[#2A2A2A] text-[#ADB7BE] rounded-full text-sm"
                        >
                          {tool}
                        </span>
                      ))}
                    </div>
                  </div>
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