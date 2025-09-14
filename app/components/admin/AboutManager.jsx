'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import { fetchData, saveAbout } from '../../services/firebase';

const defaultAboutState = {
    bio: '',
    images: {
        profile: '',
        aboutMe: '',
        background: '',
        additional: []
    },
    skillGroups: [
        { title: 'Frontend Development', items: [] },
        { title: 'Backend Development', items: [] },
        { title: 'Database & Cloud', items: [] },
        { title: 'Tools & Others', items: [] }
    ],
    experience: [],
    education: [],
    tools: []
};

const AboutManager = () => {
    const [about, setAbout] = useState(defaultAboutState);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [selectedSkillGroup, setSelectedSkillGroup] = useState('Frontend Development');
    const [newSkill, setNewSkill] = useState('');
    const [newTool, setNewTool] = useState('');
    const [selectedImageType, setSelectedImageType] = useState('profile');
    const [newImageUrl, setNewImageUrl] = useState('');

    useEffect(() => {
        loadAbout();
    }, []);

    const loadAbout = async () => {
        try {
            const data = await fetchData('about');
            if (data) {
                // Ensure all required fields exist with default values
                const formattedData = {
                    ...defaultAboutState,
                    ...data,
                    bio: data.bio || defaultAboutState.bio,
                    images: {
                        ...defaultAboutState.images,
                        ...(data.images || {}),
                        profile: data.images?.profile || defaultAboutState.images.profile,
                        aboutMe: data.images?.aboutMe || defaultAboutState.images.aboutMe,
                        background: data.images?.background || defaultAboutState.images.background,
                        additional: data.images?.additional || defaultAboutState.images.additional
                    },
                    skillGroups: Array.isArray(data.skillGroups) ? data.skillGroups : defaultAboutState.skillGroups,
                    experience: Array.isArray(data.experience) ? data.experience : defaultAboutState.experience,
                    education: Array.isArray(data.education) ? data.education : defaultAboutState.education,
                    tools: Array.isArray(data.tools) ? data.tools : defaultAboutState.tools
                };
                setAbout(formattedData);
            }
        } catch (err) {
            console.error('Error loading about section:', err);
            setError('Failed to load content');
            // Set default state on error
            setAbout(defaultAboutState);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(false);

        try {
            // Ensure data is properly formatted before saving
            const dataToSave = {
                ...about,
                images: {
                    ...defaultAboutState.images,
                    ...about.images
                }
            };
            await saveAbout(dataToSave);
            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
        } catch (err) {
            console.error('Error saving about section:', err);
            setError('Failed to save content');
        }
    };

    const addSkill = () => {
        if (!newSkill.trim()) return;

        setAbout(prev => ({
            ...prev,
            skillGroups: prev.skillGroups.map(group => {
                if (group.title === selectedSkillGroup) {
                    return {
                        ...group,
                        items: [...group.items, newSkill.trim()]
                    };
                }
                return group;
            })
        }));
        setNewSkill('');
    };

    const removeSkill = (groupIndex, skillIndex) => {
        setAbout(prev => ({
            ...prev,
            skillGroups: prev.skillGroups.map((group, idx) => {
                if (idx === groupIndex) {
                    return {
                        ...group,
                        items: group.items.filter((_, i) => i !== skillIndex)
                    };
                }
                return group;
            })
        }));
    };

    const addTool = () => {
        if (!newTool.trim()) return;
        setAbout(prev => ({
            ...prev,
            tools: [...prev.tools, newTool.trim()]
        }));
        setNewTool('');
    };

    const removeTool = (index) => {
        setAbout(prev => ({
            ...prev,
            tools: prev.tools.filter((_, i) => i !== index)
        }));
    };

    const addExperience = () => {
        setAbout(prev => ({
            ...prev,
            experience: [
                ...prev.experience,
                { title: '', company: '', period: '', description: '' }
            ]
        }));
    };

    const updateExperience = (index, field, value) => {
        setAbout(prev => ({
            ...prev,
            experience: prev.experience.map((exp, i) => {
                if (i === index) {
                    return { ...exp, [field]: value };
                }
                return exp;
            })
        }));
    };

    const removeExperience = (index) => {
        setAbout(prev => ({
            ...prev,
            experience: prev.experience.filter((_, i) => i !== index)
        }));
    };

    const addEducation = () => {
        setAbout(prev => ({
            ...prev,
            education: [
                ...prev.education,
                { degree: '', school: '', period: '', description: '' }
            ]
        }));
    };

    const updateEducation = (index, field, value) => {
        setAbout(prev => ({
            ...prev,
            education: prev.education.map((edu, i) => {
                if (i === index) {
                    return { ...edu, [field]: value };
                }
                return edu;
            })
        }));
    };

    const removeEducation = (index) => {
        setAbout(prev => ({
            ...prev,
            education: prev.education.filter((_, i) => i !== index)
        }));
    };

    const updateImage = () => {
        if (!newImageUrl.trim()) return;

        setAbout(prev => ({
            ...prev,
            images: {
                ...prev.images,
                [selectedImageType]: newImageUrl.trim()
            }
        }));
        setNewImageUrl('');
    };

    const removeImage = () => {
        setAbout(prev => ({
            ...prev,
            images: {
                ...prev.images,
                [selectedImageType]: ''
            }
        }));
    };

    const hasImage = (type) => {
        return about?.images?.[type] && about.images[type].trim() !== '';
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#121212] p-8">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
                    <p className="text-[#ADB7BE] mt-4">Loading content...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#121212] p-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-white mb-8">
                    Manage <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-teal-500">About</span> Section
                </h1>

                {error && (
                    <div className="mb-4 p-4 bg-red-500/10 border border-red-500 rounded-lg">
                        <p className="text-red-500">{error}</p>
                    </div>
                )}

                {success && (
                    <div className="mb-4 p-4 bg-green-500/10 border border-green-500 rounded-lg">
                        <p className="text-green-500">Content saved successfully!</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Bio Section */}
                    <div>
                        <label className="block text-sm font-medium text-gray-200 mb-2">
                            Bio
                        </label>
                        <textarea
                            value={about.bio || ''}
                            onChange={(e) => setAbout(prev => ({ ...prev, bio: e.target.value }))}
                            className="w-full bg-[#2A2A2A] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            rows={4}
                        />
                    </div>

                    {/* Images Section */}
                    <div>
                        <label className="block text-sm font-medium text-gray-200 mb-2">
                            Images
                        </label>
                        <div className="space-y-4">
                            <div className="flex gap-4">
                                <select
                                    value={selectedImageType}
                                    onChange={(e) => setSelectedImageType(e.target.value)}
                                    className="bg-[#2A2A2A] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="profile">Profile Image</option>
                                    <option value="aboutMe">About Me Image</option>
                                    <option value="background">Background Image</option>
                                </select>
                                <input
                                    type="text"
                                    value={newImageUrl}
                                    onChange={(e) => setNewImageUrl(e.target.value)}
                                    placeholder="Enter image URL"
                                    className="flex-1 bg-[#2A2A2A] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <button
                                    type="button"
                                    onClick={updateImage}
                                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                                >
                                    Update Image
                                </button>
                                {hasImage(selectedImageType) && (
                                    <button
                                        type="button"
                                        onClick={removeImage}
                                        className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
                                    >
                                        Remove
                                    </button>
                                )}
                            </div>
                            {hasImage(selectedImageType) && (
                                <div className="relative w-32 h-32">
                                    <img
                                        src={about.images[selectedImageType]}
                                        alt={`${selectedImageType} preview`}
                                        className="object-contain w-full h-full"
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = '';
                                            removeImage();
                                        }}
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Skills Section */}
                    <div>
                        <label className="block text-sm font-medium text-gray-200 mb-2">
                            Skills
                        </label>
                        <div className="space-y-4">
                            <div className="flex gap-4">
                                <select
                                    value={selectedSkillGroup}
                                    onChange={(e) => setSelectedSkillGroup(e.target.value)}
                                    className="bg-[#2A2A2A] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    {about.skillGroups.map((group) => (
                                        <option key={group.title} value={group.title}>
                                            {group.title}
                                        </option>
                                    ))}
                                </select>
                                <input
                                    type="text"
                                    value={newSkill}
                                    onChange={(e) => setNewSkill(e.target.value)}
                                    placeholder="Enter skill"
                                    className="flex-1 bg-[#2A2A2A] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <button
                                    type="button"
                                    onClick={addSkill}
                                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                                >
                                    Add Skill
                                </button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {about.skillGroups.map((group, groupIndex) => (
                                    <div key={group.title} className="space-y-2">
                                        <h3 className="text-lg font-semibold text-white">{group.title}</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {group.items.map((skill, skillIndex) => (
                                                <div
                                                    key={skillIndex}
                                                    className="flex items-center gap-2 bg-[#2A2A2A] text-white px-3 py-1 rounded-full"
                                                >
                                                    <span>{skill}</span>
                                                    <button
                                                        type="button"
                                                        onClick={() => removeSkill(groupIndex, skillIndex)}
                                                        className="text-red-500 hover:text-red-400"
                                                    >
                                                        ×
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Tools Section */}
                    <div>
                        <label className="block text-sm font-medium text-gray-200 mb-2">
                            Tools & Technologies
                        </label>
                        <div className="space-y-4">
                            <div className="flex gap-4">
                                <input
                                    type="text"
                                    value={newTool}
                                    onChange={(e) => setNewTool(e.target.value)}
                                    placeholder="Enter tool"
                                    className="flex-1 bg-[#2A2A2A] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <button
                                    type="button"
                                    onClick={addTool}
                                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                                >
                                    Add Tool
                                </button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {about.tools.map((tool, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center gap-2 bg-[#2A2A2A] text-white px-3 py-1 rounded-full"
                                    >
                                        <span>{tool}</span>
                                        <button
                                            type="button"
                                            onClick={() => removeTool(index)}
                                            className="text-red-500 hover:text-red-400"
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Experience Section */}
                    <div>
                        <div className="flex justify-between items-center mb-4">
                            <label className="block text-sm font-medium text-gray-200">
                                Experience
                            </label>
                            <button
                                type="button"
                                onClick={addExperience}
                                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                            >
                                Add Experience
                            </button>
                        </div>
                        <div className="space-y-4">
                            {about.experience.map((exp, index) => (
                                <div key={index} className="bg-[#2A2A2A] p-4 rounded-lg space-y-4">
                                    <div className="flex justify-between">
                                        <h3 className="text-lg font-semibold text-white">Experience {index + 1}</h3>
                                        <button
                                            type="button"
                                            onClick={() => removeExperience(index)}
                                            className="text-red-500 hover:text-red-400"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <input
                                            type="text"
                                            value={exp.title}
                                            onChange={(e) => updateExperience(index, 'title', e.target.value)}
                                            placeholder="Job Title"
                                            className="bg-[#181818] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                        <input
                                            type="text"
                                            value={exp.company}
                                            onChange={(e) => updateExperience(index, 'company', e.target.value)}
                                            placeholder="Company"
                                            className="bg-[#181818] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                        <input
                                            type="text"
                                            value={exp.period}
                                            onChange={(e) => updateExperience(index, 'period', e.target.value)}
                                            placeholder="Period"
                                            className="bg-[#181818] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                        <textarea
                                            value={exp.description}
                                            onChange={(e) => updateExperience(index, 'description', e.target.value)}
                                            placeholder="Description"
                                            className="bg-[#181818] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            rows={3}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Education Section */}
                    <div>
                        <div className="flex justify-between items-center mb-4">
                            <label className="block text-sm font-medium text-gray-200">
                                Education
                            </label>
                            <button
                                type="button"
                                onClick={addEducation}
                                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                            >
                                Add Education
                            </button>
                        </div>
                        <div className="space-y-4">
                            {about.education.map((edu, index) => (
                                <div key={index} className="bg-[#2A2A2A] p-4 rounded-lg space-y-4">
                                    <div className="flex justify-between">
                                        <h3 className="text-lg font-semibold text-white">Education {index + 1}</h3>
                                        <button
                                            type="button"
                                            onClick={() => removeEducation(index)}
                                            className="text-red-500 hover:text-red-400"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <input
                                            type="text"
                                            value={edu.degree}
                                            onChange={(e) => updateEducation(index, 'degree', e.target.value)}
                                            placeholder="Degree"
                                            className="bg-[#181818] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                        <input
                                            type="text"
                                            value={edu.school}
                                            onChange={(e) => updateEducation(index, 'school', e.target.value)}
                                            placeholder="School"
                                            className="bg-[#181818] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                        <input
                                            type="text"
                                            value={edu.period}
                                            onChange={(e) => updateEducation(index, 'period', e.target.value)}
                                            placeholder="Period"
                                            className="bg-[#181818] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                        <textarea
                                            value={edu.description}
                                            onChange={(e) => updateEducation(index, 'description', e.target.value)}
                                            placeholder="Description"
                                            className="bg-[#181818] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            rows={3}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-blue-500 to-teal-500 text-white py-3 rounded-lg hover:from-blue-600 hover:to-teal-600 transition-all duration-300"
                    >
                        Save Changes
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AboutManager; 