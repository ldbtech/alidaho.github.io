"use client";
import React, { useState, useEffect } from 'react';
import Image from "next/image";
import { TypeAnimation } from "react-type-animation";
import { motion } from "framer-motion";
import Link from "next/link";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { fetchProfile, fetchData } from '../services/firebase';
import ResumePreview from './ResumePreview';

const HeroSections = () => {
    const [profile, setProfile] = useState(null);
    const [about, setAbout] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadData = async () => {
            try {
                console.log('HeroSections: Starting to load data...');
                const [profileData, aboutData] = await Promise.all([
                    fetchProfile(),
                    fetchData('about')
                ]);
                console.log('HeroSections: Profile data loaded:', profileData);
                console.log('HeroSections: About data loaded:', aboutData);
                setProfile(profileData);
                setAbout(aboutData);
            } catch (error) {
                console.error('HeroSections: Error loading data:', error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-[calc(100vh-6rem)]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-[calc(100vh-6rem)]">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-red-500 mb-4">Error Loading Profile</h2>
                    <p className="text-gray-400">{error}</p>
                </div>
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="flex justify-center items-center h-[calc(100vh-6rem)]">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-400 mb-4">No Profile Data</h2>
                    <p className="text-gray-400">Please check your Firebase configuration</p>
                </div>
            </div>
        );
    }

    return (
        <section className="min-h-screen flex items-center justify-center px-4 sm:px-6">
            <div className="max-w-6xl mx-auto text-center space-y-8 sm:space-y-12">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="space-y-6 sm:space-y-8"
                >
                    <div className="space-y-3 sm:space-y-4">
                        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-primary tracking-tight leading-tight">
                            {profile.name}
                        </h1>
                        <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-secondary font-medium">
                            <TypeAnimation
                                sequence={[
                                    profile.title,
                                    2000,
                                    "Full Stack Developer",
                                    2000,
                                    "AI Enthusiast",
                                    2000,
                                    "Problem Solver",
                                    2000,
                                ]}
                                wrapper="span"
                                speed={30}
                                repeat={Infinity}
                                className="text-accent"
                            />
                        </h2>
                    </div>
                    
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        className="text-base sm:text-lg md:text-xl lg:text-2xl text-secondary max-w-4xl mx-auto leading-relaxed px-4"
                    >
                        {profile.bio}
                    </motion.p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center px-4"
                >
                    <a
                        href={profile.socialLinks.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center gap-3 px-6 sm:px-8 py-3 sm:py-4 bg-surface-secondary hover:bg-surface-tertiary rounded-apple transition-apple shadow-apple-light w-full sm:w-auto justify-center"
                    >
                        <FaGithub className="w-5 h-5 text-primary group-hover:text-accent transition-apple" />
                        <span className="text-primary font-medium">GitHub</span>
                    </a>
                    <a
                        href={profile.socialLinks.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center gap-3 px-6 sm:px-8 py-3 sm:py-4 bg-surface-secondary hover:bg-surface-tertiary rounded-apple transition-apple shadow-apple-light w-full sm:w-auto justify-center"
                    >
                        <FaLinkedin className="w-5 h-5 text-primary group-hover:text-accent transition-apple" />
                        <span className="text-primary font-medium">LinkedIn</span>
                    </a>
                    
                    {/* Resume Preview */}
                    <div className="w-full sm:w-auto">
                        <ResumePreview 
                            resumeUrl={profile.resumeUrl} 
                            resumeName={profile.resumeName || "Resume"}
                            showDownload={false}
                        />
                    </div>
                </motion.div>

                {/* Languages I Speak */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.9 }}
                    className="mt-6 sm:mt-8 px-4"
                >
                    <div className="text-center mb-4">
                        <h3 className="text-base sm:text-lg font-semibold text-primary mb-2">Languages I Speak</h3>
                    </div>
                    <div className="flex flex-wrap gap-2 sm:gap-3 justify-center">
                        {about?.spokenLanguages && about.spokenLanguages.length > 0 ? (
                            about.spokenLanguages.map((lang, index) => (
                                <div
                                    key={index}
                                    className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-surface-secondary rounded-apple shadow-apple-light"
                                >
                                    <span className="text-sm sm:text-base text-primary font-medium">{lang.language}</span>
                                    <span className="text-xs sm:text-sm text-secondary">({lang.level})</span>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-4">
                                <p className="text-sm sm:text-base text-secondary">Add your spoken languages in the admin panel to showcase your language skills!</p>
                            </div>
                        )}
                    </div>
                </motion.div>

            </div>
        </section>
    );
};

export default HeroSections;