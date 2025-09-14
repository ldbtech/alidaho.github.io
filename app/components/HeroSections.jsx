"use client";
import React, { useState, useEffect } from 'react';
import Image from "next/image";
import { TypeAnimation } from "react-type-animation";
import { motion } from "framer-motion";
import Link from "next/link";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { fetchProfile } from '../services/firebase';
import ResumePreview from './ResumePreview';

const HeroSections = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadProfile = async () => {
            try {
                console.log('HeroSections: Starting to load profile...');
                const data = await fetchProfile();
                console.log('HeroSections: Profile data loaded:', data);
                setProfile(data);
            } catch (error) {
                console.error('HeroSections: Error loading profile:', error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        loadProfile();
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
        <section className="min-h-screen flex items-center justify-center px-6">
            <div className="max-w-6xl mx-auto text-center space-y-12">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="space-y-8"
                >
                    <div className="space-y-4">
                        <h1 className="text-6xl md:text-8xl font-bold text-primary tracking-tight">
                            {profile.name}
                        </h1>
                        <h2 className="text-2xl md:text-3xl text-secondary font-medium">
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
                        className="text-xl md:text-2xl text-secondary max-w-4xl mx-auto leading-relaxed"
                    >
                        {profile.bio}
                    </motion.p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    className="flex flex-col sm:flex-row gap-6 justify-center items-center"
                >
                    <a
                        href={profile.socialLinks.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center gap-3 px-8 py-4 bg-surface-secondary hover:bg-surface-tertiary rounded-apple transition-apple shadow-apple-light"
                    >
                        <FaGithub className="w-5 h-5 text-primary group-hover:text-accent transition-apple" />
                        <span className="text-primary font-medium">GitHub</span>
                    </a>
                    <a
                        href={profile.socialLinks.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center gap-3 px-8 py-4 bg-surface-secondary hover:bg-surface-tertiary rounded-apple transition-apple shadow-apple-light"
                    >
                        <FaLinkedin className="w-5 h-5 text-primary group-hover:text-accent transition-apple" />
                        <span className="text-primary font-medium">LinkedIn</span>
                    </a>
                    
                    {/* Resume Preview */}
                    <ResumePreview 
                        resumeUrl={profile.resumeUrl} 
                        resumeName={profile.resumeName || "Resume"}
                        showDownload={false}
                    />
                </motion.div>

            </div>
        </section>
    );
};

export default HeroSections;