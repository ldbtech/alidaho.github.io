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
    const [showTerminal, setShowTerminal] = useState(false);

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
        <section className="min-h-screen flex items-center justify-center px-4 sm:px-6 pt-20 pb-8 relative overflow-hidden">
            {/* Modern Background Elements */}
            <div className="absolute inset-0 -z-10">
                {/* Gradient Orbs */}
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-teal-500/15 to-emerald-500/15 rounded-full blur-2xl animate-pulse"></div>
                
                {/* Grid Pattern */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
                
                {/* Floating Elements */}
                <div className="absolute top-20 left-20 w-2 h-2 bg-accent/60 rounded-full animate-bounce"></div>
                <div className="absolute top-40 right-32 w-1 h-1 bg-primary/40 rounded-full animate-bounce" style={{animationDelay: '1s'}}></div>
                <div className="absolute bottom-32 left-16 w-3 h-3 bg-secondary/50 rounded-full animate-bounce" style={{animationDelay: '2s'}}></div>
            </div>

            <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                {/* Left Content */}
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="text-center lg:text-left space-y-4 flex flex-col justify-center"
                >
                    {/* Status Badge */}
                    <motion.button
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        onClick={() => setShowTerminal(!showTerminal)}
                        className="lg:hidden inline-flex items-center gap-2 px-4 py-2 bg-surface-secondary/50 backdrop-blur-sm rounded-full border border-surface-secondary/30 mb-0 hover:bg-surface-secondary/70 transition-colors cursor-pointer"
                    >
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-sm text-secondary font-medium">Available for opportunities</span>
                        <motion.div
                            animate={{ rotate: showTerminal ? 180 : 0 }}
                            transition={{ duration: 0.3 }}
                            className="text-secondary"
                        >
                            ▼
                        </motion.div>
                    </motion.button>
                    
                    {/* Desktop Status Badge */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="hidden lg:inline-flex items-center gap-2 px-4 py-2 bg-surface-secondary/50 backdrop-blur-sm rounded-full border border-surface-secondary/30 mb-0"
                    >
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-sm text-secondary font-medium">Available for opportunities</span>
                    </motion.div>

                    {/* Mobile Terminal - Slides down when toggled */}
                    <motion.div
                        initial={false}
                        animate={{ 
                            height: showTerminal ? "auto" : 0,
                            opacity: showTerminal ? 1 : 0
                        }}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                        className="lg:hidden overflow-hidden"
                    >
                        <div className="bg-surface-secondary/30 backdrop-blur-sm rounded-2xl p-6 border border-surface-secondary/50 shadow-2xl mx-4 mb-4">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                <span className="ml-4 text-sm text-secondary font-mono">terminal</span>
                            </div>
                            <div className="space-y-2 font-mono text-sm">
                                <div className="text-accent">$ whoami</div>
                                <div className="text-primary">{profile.name || "Ali Daho Bachir"}</div>
                                <div className="text-accent">$ skills</div>
                                <div className="text-secondary">→ Full Stack Development</div>
                                <div className="text-secondary">→ AI & Machine Learning</div>
                                <div className="text-secondary">→ Problem Solving</div>
                                <div className="text-accent">$ languages</div>
                                <div className="text-secondary">→ {about?.spokenLanguages?.map(lang => lang.language).join(', ') || 'Multiple'}</div>
                                <div className="text-accent animate-pulse">█</div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Name */}
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-primary tracking-tight leading-none mb-0"
                    >
                        <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                            {profile.name || "Ali Daho Bachir"}
                        </span>
                    </motion.h1>
                    
                    {/* Type Animation */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.5 }}
                        className="h-12 sm:h-14 flex items-center justify-center lg:justify-start mb-0"
                    >
                        <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl text-secondary font-light">
                            <TypeAnimation
                                sequence={[
                                    profile.title,
                                    4000,
                                    "Software Developer",
                                    3000,
                                    "Problem Solver",
                                    3000,
                                    "Polyglot",
                                    2000,
                                    ...(about?.spokenLanguages ? about.spokenLanguages.flatMap(lang => [lang.language, 800]) : []),
                                    "Polyglot",
                                    2000,
                                ]}
                                wrapper="span"
                                speed={40}
                                repeat={Infinity}
                                className="text-accent"
                            />
                        </h2>
                    </motion.div>

                    {/* Description */}
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.7 }}
                        className="text-lg sm:text-xl text-secondary max-w-2xl mx-auto lg:mx-0 leading-relaxed mb-0"
                    >
                        Crafting digital experiences with code, creativity, and a passion for solving complex problems.
                    </motion.p>

                    {/* Action Buttons */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.9 }}
                        className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
                    >
                        <a
                            href={profile.socialLinks.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group relative flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 text-white rounded-full transition-all duration-500 hover:scale-105 shadow-2xl hover:shadow-gray-500/25"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-gray-800 to-gray-900 rounded-full blur opacity-0 group-hover:opacity-75 transition-opacity duration-500"></div>
                            <FaGithub className="w-5 h-5 relative z-10" />
                            <span className="font-semibold relative z-10">View GitHub</span>
                        </a>
                        <a
                            href={profile.socialLinks.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group relative flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-full transition-all duration-500 hover:scale-105 shadow-2xl hover:shadow-blue-500/25"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full blur opacity-0 group-hover:opacity-75 transition-opacity duration-500"></div>
                            <FaLinkedin className="w-5 h-5 relative z-10" />
                            <span className="font-semibold relative z-10">Connect</span>
                        </a>
                        <div className="mt-2 sm:mt-0">
                            <ResumePreview 
                                resumeUrl={profile.resumeUrl} 
                                resumeName={profile.resumeName || "Resume"}
                                showDownload={false}
                            />
                        </div>
                    </motion.div>
                </motion.div>

                {/* Right Visual Element - Desktop Terminal */}
                <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="relative hidden lg:block"
                >
                    {/* Code Terminal Mockup */}
                    <div className="relative bg-surface-secondary/30 backdrop-blur-sm rounded-2xl p-6 border border-surface-secondary/50 shadow-2xl">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                            <span className="ml-4 text-sm text-secondary font-mono">terminal</span>
                        </div>
                        <div className="space-y-2 font-mono text-sm">
                            <div className="text-accent">$ whoami</div>
                            <div className="text-primary">{profile.name}</div>
                            <div className="text-accent">$ skills</div>
                            <div className="text-secondary">→ Full Stack Development</div>
                            <div className="text-secondary">→ AI & Machine Learning</div>
                            <div className="text-secondary">→ Problem Solving</div>
                            <div className="text-accent">$ languages</div>
                            <div className="text-secondary">→ {about?.spokenLanguages?.map(lang => lang.language).join(', ') || 'Multiple'}</div>
                            <div className="text-accent animate-pulse">█</div>
                        </div>
                    </div>

                    {/* Floating Elements */}
                    <motion.div
                        animate={{ y: [0, -20, 0] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full blur-xl"
                    ></motion.div>
                    <motion.div
                        animate={{ y: [0, 20, 0] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                        className="absolute -bottom-4 -left-4 w-12 h-12 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-xl"
                    ></motion.div>
                </motion.div>
            </div>

            {/* Scroll Indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 1.2 }}
                className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center"
            >
                <p className="text-xs text-tertiary mb-4 tracking-wider uppercase">Scroll to explore</p>
                <motion.div
                    animate={{ y: [0, 8, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    className="w-6 h-10 border-2 border-tertiary/30 rounded-full flex justify-center"
                >
                    <motion.div
                        animate={{ y: [0, 12, 0] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        className="w-1 h-3 bg-tertiary/60 rounded-full mt-2"
                    ></motion.div>
                </motion.div>
            </motion.div>
        </section>
    );
};

export default HeroSections;