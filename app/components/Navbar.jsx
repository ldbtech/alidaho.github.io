"use client";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import NavLink from "./NavLink";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/solid";
import MenuOverlay from "./MenuOverlay";
import { motion } from "framer-motion";
import Image from "next/image";
import { fetchProfile } from "../services/firebase";

const navLinks = [
    {
        title: "About",
        path: "#about",
    },
    {
        title: "Projects",
        path: "#projects",
    },
    {
        title: "Contact",
        path: "#contact",
    },
];

const Navbar = () => {
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
            transition={{ duration: 0.5 }}
            className={`fixed mx-auto top-0 left-0 right-0 z-50 transition-all duration-300 ${
                scrolled 
                    ? "bg-[#121212] bg-opacity-95 backdrop-blur-sm border-b border-[#33353F]" 
                    : "bg-transparent"
            }`}
        >
            <div className="flex container lg:py-4 flex-wrap items-center justify-between mx-auto px-4 py-2">
                <Link
                    href={"/"}
                    className="flex items-center"
                >
                    {profile?.logo && !imageError ? (
                        <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-gray-700 hover:border-blue-500 transition-colors duration-300">
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
                        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-teal-500 flex items-center justify-center">
                            <span className="text-xl font-bold text-white">
                                AD
                            </span>
                        </div>
                    )}
                </Link>
                <div className="mobile-menu block md:hidden">
                    {!navbarOpen ? (
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setNavbarOpen(true)}
                            className="flex items-center px-3 py-2 border rounded border-slate-200 text-slate-200 hover:text-white hover:border-white transition-colors duration-300"
                        >
                            <Bars3Icon className="h-5 w-5" />
                        </motion.button>
                    ) : (
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setNavbarOpen(false)}
                            className="flex items-center px-3 py-2 border rounded border-slate-200 text-slate-200 hover:text-white hover:border-white transition-colors duration-300"
                        >
                            <XMarkIcon className="h-5 w-5" />
                        </motion.button>
                    )}
                </div>
                <div className="menu hidden md:block md:w-auto" id="navbar">
                    <ul className="flex p-4 md:p-0 md:flex-row md:space-x-8 mt-0">
                        {navLinks.map((link, index) => (
                            <motion.li 
                                key={index}
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                            >
                                <NavLink href={link.path} title={link.title} />
                            </motion.li>
                        ))}
                    </ul>
                </div>
            </div>
            {navbarOpen ? <MenuOverlay links={navLinks} /> : null}
        </motion.nav>
    );
};

export default Navbar;