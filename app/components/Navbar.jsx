"use client";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import NavLink from "./NavLink";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/solid";
import MenuOverlay from "./MenuOverlay";
import { motion } from "framer-motion";
import Image from "next/image";
import { fetchProfile } from "../services/firebase";
import ThemeToggle from "./ThemeToggle";
import LanguageSwitcher from "./LanguageSwitcher";
import { useLanguage } from "../contexts/LanguageContext";

const Navbar = () => {
    const { t } = useLanguage();
    
    const navLinks = [
        {
            title: typeof t('about', 'About') === 'string' ? t('about', 'About') : 'About',
            path: "#about",
        },
        {
            title: typeof t('projects', 'Projects') === 'string' ? t('projects', 'Projects') : 'Projects',
            path: "#projects",
        },
        {
            title: typeof t('thoughts', 'Thoughts') === 'string' ? t('thoughts', 'Thoughts') : 'Thoughts',
            path: "/thoughts",
        },
        {
            title: typeof t('contact', 'Contact') === 'string' ? t('contact', 'Contact') : 'Contact',
            path: "#contact",
        },
    ];
    const [navbarOpen, setNavbarOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
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

    useEffect(() => {
        const handleScroll = () => {
            const isScrolled = window.scrollY > 10;
            if (isScrolled !== scrolled) {
                setScrolled(isScrolled);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [scrolled]);

    const handleImageError = () => {
        console.error('Failed to load logo image');
        setImageError(true);
    };

    return (
        <motion.nav 
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className={`fixed top-0 left-0 right-0 z-50 transition-apple ${
                scrolled 
                    ? "bg-background/80 backdrop-blur-xl border-b border-separator" 
                    : "bg-transparent"
            }`}
        >
            <div className="max-w-6xl mx-auto px-6 py-4">
                <div className="flex items-center justify-between">
                    <Link
                        href={"/"}
                        className="flex items-center group"
                    >
                        {profile?.logo && !imageError ? (
                            <div className="relative w-10 h-10 rounded-apple overflow-hidden group-hover:scale-105 transition-apple">
                                <Image
                                    src={profile.logo}
                                    alt="Logo"
                                    fill
                                    className="object-cover"
                                    priority
                                    onError={handleImageError}
                                    unoptimized
                                />
                            </div>
                        ) : (
                            <div className="w-10 h-10 rounded-apple bg-gradient-theme flex items-center justify-center group-hover:scale-105 transition-apple">
                                <span className="text-lg font-semibold text-white">
                                    AD
                                </span>
                            </div>
                        )}
                    </Link>
                    {/* Mobile Menu Button */}
                    <div className="md:hidden">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setNavbarOpen(true)}
                            className="p-2 rounded-apple bg-surface-secondary hover:bg-surface-tertiary transition-apple"
                        >
                            <Bars3Icon className="h-5 w-5 text-primary" />
                        </motion.button>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-8">
                        <ul className="flex items-center space-x-8">
                            {navLinks.map((link, index) => (
                                <motion.li 
                                    key={index}
                                    initial={{ opacity: 0, y: -20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: index * 0.1 }}
                                >
                                    <NavLink href={link.path} title={link.title} />
                                </motion.li>
                            ))}
                        </ul>
                        <div className="flex items-center gap-3">
                            <motion.div
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: navLinks.length * 0.1 }}
                            >
                                <LanguageSwitcher />
                            </motion.div>
                            <motion.div
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: navLinks.length * 0.1 + 0.1 }}
                            >
                                <ThemeToggle />
                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>
            {navbarOpen ? <MenuOverlay links={navLinks} /> : null}
        </motion.nav>
    );
};

export default Navbar;