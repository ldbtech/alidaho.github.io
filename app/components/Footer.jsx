"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { fetchProfile } from "../services/firebase";

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

    return (
        <footer className="footer border z-10 border-t-[#33353F] border-l-transparent border-r-transparent text-white">
            <div className="container p-12 flex justify-between items-center">
                {profile?.logo && !imageError ? (
                    <div className="relative w-12 h-12">
                        <Image
                            src={profile.logo}
                            alt="Logo"
                            fill
                            className="object-contain"
                            onError={handleImageError}
                            unoptimized
                        />
                    </div>
                ) : (
                    <span className="text-xl font-semibold text-white">AD</span>
                )}
                <p className="text-slate-600">All rights reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;