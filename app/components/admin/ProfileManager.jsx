'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { fetchProfile, saveProfile } from '../../services/firebase';
import Image from 'next/image';

const ProfileManager = () => {
    const [profile, setProfile] = useState({
        name: '',
        title: '',
        bio: '',
        profileImage: '',
        logo: '',
        socialLinks: {
            github: '',
            linkedin: ''
        }
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        try {
            const data = await fetchProfile();
            setProfile(data);
        } catch (err) {
            setError('Failed to load profile data');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name.startsWith('social.')) {
            const platform = name.split('.')[1];
            setProfile(prev => ({
                ...prev,
                socialLinks: {
                    ...prev.socialLinks,
                    [platform]: value
                }
            }));
        } else {
            setProfile(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(false);

        try {
            await saveProfile(profile);
            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
        } catch (err) {
            setError('Failed to save profile');
            console.error(err);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#181818] p-6 rounded-lg shadow-lg"
        >
            <h2 className="text-2xl font-bold mb-6 text-white">Profile Management</h2>

            {error && (
                <div className="mb-4 p-4 bg-red-500/10 border border-red-500 rounded-lg">
                    <p className="text-red-500">{error}</p>
                </div>
            )}

            {success && (
                <div className="mb-4 p-4 bg-green-500/10 border border-green-500 rounded-lg">
                    <p className="text-green-500">Profile updated successfully!</p>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-200 mb-2">
                            Name
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={profile.name}
                            onChange={handleChange}
                            className="w-full bg-[#2A2A2A] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-200 mb-2">
                            Title
                        </label>
                        <input
                            type="text"
                            name="title"
                            value={profile.title}
                            onChange={handleChange}
                            className="w-full bg-[#2A2A2A] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-200 mb-2">
                        Bio
                    </label>
                    <textarea
                        name="bio"
                        value={profile.bio}
                        onChange={handleChange}
                        rows="4"
                        className="w-full bg-[#2A2A2A] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-200 mb-2">
                            Profile Image URL
                        </label>
                        <input
                            type="text"
                            name="profileImage"
                            value={profile.profileImage}
                            onChange={handleChange}
                            className="w-full bg-[#2A2A2A] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {profile.profileImage && (
                            <div className="mt-2 relative w-32 h-32">
                                <Image
                                    src={profile.profileImage}
                                    alt="Profile Preview"
                                    fill
                                    className="rounded-lg object-cover"
                                />
                            </div>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-200 mb-2">
                            Logo URL
                        </label>
                        <input
                            type="text"
                            name="logo"
                            value={profile.logo}
                            onChange={handleChange}
                            className="w-full bg-[#2A2A2A] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {profile.logo && (
                            <div className="mt-2 relative w-32 h-32">
                                <Image
                                    src={profile.logo}
                                    alt="Logo Preview"
                                    fill
                                    className="object-contain"
                                />
                            </div>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-200 mb-2">
                            GitHub URL
                        </label>
                        <input
                            type="url"
                            name="social.github"
                            value={profile.socialLinks.github}
                            onChange={handleChange}
                            className="w-full bg-[#2A2A2A] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-200 mb-2">
                            LinkedIn URL
                        </label>
                        <input
                            type="url"
                            name="social.linkedin"
                            value={profile.socialLinks.linkedin}
                            onChange={handleChange}
                            className="w-full bg-[#2A2A2A] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                >
                    Save Profile
                </button>
            </form>
        </motion.div>
    );
};

export default ProfileManager; 