"use client";
import { useEffect } from 'react';
import { fetchProfile } from '../services/firebase';

const DynamicFavicon = () => {
    useEffect(() => {
        const updateFavicon = async () => {
            try {
                const profile = await fetchProfile();
                if (profile?.logo) {
                    // Create a link element for the favicon
                    const link = document.querySelector("link[rel*='icon']") || document.createElement('link');
                    link.type = 'image/x-icon';
                    link.rel = 'shortcut icon';
                    link.href = profile.logo;
                    document.getElementsByTagName('head')[0].appendChild(link);
                }
            } catch (error) {
                console.error('Failed to update favicon:', error);
            }
        };

        updateFavicon();
    }, []);

    return null; // This component doesn't render anything
};

export default DynamicFavicon;
