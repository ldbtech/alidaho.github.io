"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { fetchProfile } from "../services/firebase";
import { FaGithub, FaLinkedin, FaEnvelope } from "react-icons/fa";

const Footer = () => {
    const [profile, setProfile] = useState(null);
    const [imageError, setImageError] = useState(false);
    const basePath = process.env.NODE_ENV === 'production' ? '/alidaho.github.io' : '';

    useEffect(() => {
        const loadProfile = async () => {
            try {
                const data = await fetchProfile();
                if (data?.logo) {
                    // Ensure the logo path is absolute
                    data.logo = data.logo.startsWith('http') ? data.logo : `${basePath}${data.logo}`;
                }
                setProfile(data);
            } catch (error) {
                console.error('Error loading profile:', error);
                setProfile(null);
            }
        };

        loadProfile();
    }, [basePath]);

    const handleImageError = () => {
        console.error('Failed to load logo image');
        setImageError(true);
    };

    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-[#0a0a0a] border-t border-[#33353F] text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Brand Section */}
                    <div className="space-y-4">
                        {profile?.logo && !imageError ? (
                            <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-gray-700 hover:border-blue-500 transition-colors duration-300">
                                <Image
                                    src={profile.logo}
                                    alt="Logo"
                                    fill
                                    className="object-cover"
                                    onError={handleImageError}
                                    unoptimized
                                />
                            </div>
                        ) : (
                            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-teal-500 flex items-center justify-center">
                                <span className="text-xl font-bold text-white">
                                    AD
                                </span>
                            </div>
                        )}
                        <p className="text-gray-400 text-sm">
                            Building the future through code and innovation.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link href="#about" className="text-gray-400 hover:text-white transition-colors">
                                    About
                                </Link>
                            </li>
                            <li>
                                <Link href="#projects" className="text-gray-400 hover:text-white transition-colors">
                                    Projects
                                </Link>
                            </li>
                            <li>
                                <Link href="#contact" className="text-gray-400 hover:text-white transition-colors">
                                    Contact
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Contact</h3>
                        <ul className="space-y-2">
                            <li className="text-gray-400">
                                <a href="mailto:ali.moh.ldb@gmail.com" className="hover:text-white transition-colors">
                                    ali.moh.ldb@gmail.com
                                </a>
                            </li>
                            <li className="text-gray-400">
                                <a href="https://github.com/ldbtech" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                                    GitHub
                                </a>
                            </li>
                            <li className="text-gray-400">
                                <a href="https://www.linkedin.com/in/alidaho/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                                    LinkedIn
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Social Links */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Connect</h3>
                        <div className="flex space-x-4">
                            <a
                                href="https://github.com/ldbtech"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-400 hover:text-white transition-colors"
                            >
                                <FaGithub className="w-6 h-6" />
                            </a>
                            <a
                                href="https://www.linkedin.com/in/alidaho/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-400 hover:text-white transition-colors"
                            >
                                <FaLinkedin className="w-6 h-6" />
                            </a>
                            <a
                                href="mailto:ali.moh.ldb@gmail.com"
                                className="text-gray-400 hover:text-white transition-colors"
                            >
                                <FaEnvelope className="w-6 h-6" />
                            </a>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="py-6 border-t border-[#33353F]">
                    <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                        <p className="text-gray-400 text-sm">
                            © 2025 Ali Daho. All rights reserved.
                        </p>
               
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;