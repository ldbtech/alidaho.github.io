"use client";
import React, { useState, useEffect } from 'react';
import Image from "next/image";
import { TypeAnimation } from "react-type-animation";
import { motion } from "framer-motion";
import Link from "next/link";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { fetchProfile } from '../services/firebase';

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
        <section className="grid md:grid-cols-2 gap-4 items-center py-24">
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col gap-4"
            >
                <h1 className="text-4xl sm:text-5xl font-bold text-white">
                    Hi, I&apos;m{" "}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-teal-500">
                        {profile.name}
                    </span>
                </h1>
                <h2 className="text-2xl sm:text-3xl font-bold text-[#ADB7BE]">
                    <TypeAnimation
                        sequence={[
                            profile.title,
                            1000,
                            "Full Stack Developer",
                            1000,
                            "AI Enthusiast",
                            1000,
                        ]}
                        wrapper="span"
                        speed={50}
                        repeat={Infinity}
                    />
                </h2>
                <p className="text-[#ADB7BE] text-base sm:text-lg">
                    {profile.bio}
                </p>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="flex gap-4"
                >
                    <a
                        href={profile.socialLinks.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-primary-500 hover:bg-primary-600 text-white font-bold py-2 px-4 rounded-full transition-colors"
                    >
                        GitHub
                    </a>
                    <a
                        href={profile.socialLinks.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-secondary-500 hover:bg-secondary-600 text-white font-bold py-2 px-4 rounded-full transition-colors"
                    >
                        LinkedIn
                    </a>
                </motion.div>
            </motion.div>
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.8 }}
                className="flex justify-center items-center"
            >
                <div className="relative w-64 h-64 md:w-80 md:h-80">
                    <Image
                        src={profile.profileImage}
                        alt="Profile"
                        fill
                        className="rounded-full object-cover"
                        priority
                    />
                </div>
            </motion.div>
        </section>
    );
};

export default HeroSections;