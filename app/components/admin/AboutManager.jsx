'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import { fetchData, saveAbout } from '../../services/firebase';

const AboutManager = () => {
    const [about, setAbout] = useState({
        bio: '',
        images: {
            profile: '',
            background: '',
            additional: []
        },
        skillGroups: [
            {
                title: 'Frontend Development',
                items: []
            },
            {
                title: 'Backend Development',
                items: []
            },
            {
                title: 'Database & Cloud',
                items: []
            },
            {
                title: 'Tools & Others',
                items: []
            }
        ],
        experience: [],
        education: [],
        tools: []
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [newSkill, setNewSkill] = useState('');
    const [newTool, setNewTool] = useState('');
    const [selectedSkillGroup, setSelectedSkillGroup] = useState(0);
    const [newImageUrl, setNewImageUrl] = useState('');
    const [selectedImageType, setSelectedImageType] = useState('profile');

    useEffect(() => {
        loadAbout();
    }, []);

    const loadAbout = async () => {
        try {
            const data = await fetchData('about');
            setAbout(data);
            setError(null);
        } catch (err) {
            console.error('Error loading about section:', err);
            setError('Failed to load about section. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(false);

        const formData = new FormData(e.target);
        const aboutData = {
            bio: formData.get('bio'),
            images: about.images,
            skillGroups: about.skillGroups,
            experience: about.experience,
            education: about.education,
            tools: about.tools
        };

        try {
            await saveAbout(aboutData);
            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
        } catch (err) {
            setError('Failed to save about section');
            console.error(err);
        }
    };

    const addSkill = () => {
        if (newSkill.trim()) {
            setAbout(prev => ({
                ...prev,
                skillGroups: prev.skillGroups.map((group, index) => 
                    index === selectedSkillGroup 
                        ? { ...group, items: [...group.items, newSkill.trim()] }
                        : group
                )
            }));
            setNewSkill('');
        }
    };

    const removeSkill = (groupIndex, skillIndex) => {
        setAbout(prev => ({
            ...prev,
            skillGroups: prev.skillGroups.map((group, index) => 
                index === groupIndex 
                    ? { ...group, items: group.items.filter((_, i) => i !== skillIndex) }
                    : group
            )
        }));
    };

    const addTool = () => {
        if (newTool.trim()) {
            setAbout(prev => ({
                ...prev,
                tools: [...prev.tools, newTool.trim()]
            }));
            setNewTool('');
        }
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
            experience: [...prev.experience, {
                title: '',
                company: '',
                period: '',
                description: ''
            }]
        }));
    };

    const updateExperience = (index, field, value) => {
        setAbout(prev => ({
            ...prev,
            experience: prev.experience.map((exp, i) => 
                i === index ? { ...exp, [field]: value } : exp
            )
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
            education: [...prev.education, {
                degree: '',
                school: '',
                period: '',
                description: ''
            }]
        }));
    };

    const updateEducation = (index, field, value) => {
        setAbout(prev => ({
            ...prev,
            education: prev.education.map((edu, i) => 
                i === index ? { ...edu, [field]: value } : edu
            )
        }));
    };

    const removeEducation = (index) => {
        setAbout(prev => ({
            ...prev,
            education: prev.education.filter((_, i) => i !== index)
        }));
    };

    const updateImage = (type) => {
        if (newImageUrl.trim()) {
            setAbout(prev => ({
                ...prev,
                images: {
                    ...prev.images,
                    [type]: newImageUrl.trim()
                }
            }));
            setNewImageUrl('');
        }
    };

    const addAdditionalImage = () => {
        if (newImageUrl.trim()) {
            setAbout(prev => ({
                ...prev,
                images: {
                    ...prev.images,
                    additional: [...prev.images.additional, newImageUrl.trim()]
                }
            }));
            setNewImageUrl('');
        }
    };

    const removeAdditionalImage = (index) => {
        setAbout(prev => ({
            ...prev,
            images: {
                ...prev.images,
                additional: prev.images.additional.filter((_, i) => i !== index)
            }
        }));
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
            <h2 className="text-2xl font-bold mb-6 text-white">About Section Management</h2>

            {error && (
                <div className="mb-4 p-4 bg-red-500/10 border border-red-500 rounded-lg">
                    <p className="text-red-500">{error}</p>
                </div>
            )}

            {success && (
                <div className="mb-4 p-4 bg-green-500/10 border border-green-500 rounded-lg">
                    <p className="text-green-500">About section updated successfully!</p>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Bio Section */}
                <div>
                    <label className="block text-sm font-medium text-gray-200 mb-2">
                        Bio
                    </label>
                    <textarea
                        name="bio"
                        value={about.bio}
                        onChange={(e) => setAbout(prev => ({ ...prev, bio: e.target.value }))}
                        rows="4"
                        className="w-full bg-[#2A2A2A] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* Images Section */}
                <div>
                    <label className="block text-sm font-medium text-gray-200 mb-2">
                        Images
                    </label>
                    <div className="space-y-4">
                        {/* Profile and Background Images */}
                        <div className="flex gap-4 items-start">
                            <div className="flex-1">
                                <select
                                    value={selectedImageType}
                                    onChange={(e) => setSelectedImageType(e.target.value)}
                                    className="w-full bg-[#2A2A2A] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
                                >
                                    <option value="profile">Profile Image</option>
                                    <option value="background">Background Image</option>
                                    <option value="additional">Additional Image</option>
                                </select>
                                <input
                                    type="text"
                                    value={newImageUrl}
                                    onChange={(e) => setNewImageUrl(e.target.value)}
                                    placeholder="Enter image URL"
                                    className="w-full bg-[#2A2A2A] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <button
                                    type="button"
                                    onClick={() => {
                                        if (selectedImageType === 'additional') {
                                            addAdditionalImage();
                                        } else {
                                            updateImage(selectedImageType);
                                        }
                                    }}
                                    className="mt-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    Update Image
                                </button>
                            </div>
                            {selectedImageType !== 'additional' && about.images[selectedImageType] && (
                                <div className="relative w-32 h-32">
                                    <img
                                        src={about.images[selectedImageType]}
                                        alt={`${selectedImageType} preview`}
                                        className="rounded-lg object-cover w-full h-full"
                                    />
                                </div>
                            )}
                        </div>

                        {/* Additional Images Grid */}
                        {about.images.additional.length > 0 && (
                            <div>
                                <h3 className="text-lg font-semibold mb-2">Additional Images</h3>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    {about.images.additional.map((url, index) => (
                                        <div key={index} className="relative group">
                                            <img
                                                src={url}
                                                alt={`Additional image ${index + 1}`}
                                                className="w-full h-32 object-cover rounded-lg"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeAdditionalImage(index)}
                                                className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <FaTrash size={12} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Skills Section */}
                <div>
                    <label className="block text-sm font-medium text-gray-200 mb-2">
                        Skills
                    </label>
                    <div className="mb-4">
                        <select
                            value={selectedSkillGroup}
                            onChange={(e) => setSelectedSkillGroup(Number(e.target.value))}
                            className="w-full bg-[#2A2A2A] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
                        >
                            {about.skillGroups.map((group, index) => (
                                <option key={index} value={index}>{group.title}</option>
                            ))}
                        </select>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={newSkill}
                                onChange={(e) => setNewSkill(e.target.value)}
                                placeholder="Add a skill"
                                className="flex-1 bg-[#2A2A2A] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <button
                                type="button"
                                onClick={addSkill}
                                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Add
                            </button>
                        </div>
                    </div>
                    {about.skillGroups.map((group, groupIndex) => (
                        <div key={groupIndex} className="mb-4">
                            <h3 className="text-lg font-semibold mb-2">{group.title}</h3>
                            <div className="flex flex-wrap gap-2">
                                {group.items.map((skill, skillIndex) => (
                                    <div
                                        key={skillIndex}
                                        className="bg-[#2A2A2A] px-3 py-1 rounded-full flex items-center gap-2"
                                    >
                                        <span>{skill}</span>
                                        <button
                                            type="button"
                                            onClick={() => removeSkill(groupIndex, skillIndex)}
                                            className="text-red-500 hover:text-red-400"
                                        >
                                            <FaTrash size={12} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Tools Section */}
                <div>
                    <label className="block text-sm font-medium text-gray-200 mb-2">
                        Tools & Technologies
                    </label>
                    <div className="flex gap-2 mb-4">
                        <input
                            type="text"
                            value={newTool}
                            onChange={(e) => setNewTool(e.target.value)}
                            placeholder="Add a tool"
                            className="flex-1 bg-[#2A2A2A] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                            type="button"
                            onClick={addTool}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Add
                        </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {about.tools.map((tool, index) => (
                            <div
                                key={index}
                                className="bg-[#2A2A2A] px-3 py-1 rounded-full flex items-center gap-2"
                            >
                                <span>{tool}</span>
                                <button
                                    type="button"
                                    onClick={() => removeTool(index)}
                                    className="text-red-500 hover:text-red-400"
                                >
                                    <FaTrash size={12} />
                                </button>
                            </div>
                        ))}
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
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                        >
                            <FaPlus /> Add Experience
                        </button>
                    </div>
                    <div className="space-y-4">
                        {about.experience.map((exp, index) => (
                            <div key={index} className="bg-[#2A2A2A] p-4 rounded-lg">
                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="text-lg font-semibold">Experience {index + 1}</h3>
                                    <button
                                        type="button"
                                        onClick={() => removeExperience(index)}
                                        className="text-red-500 hover:text-red-400"
                                    >
                                        <FaTrash />
                                    </button>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <input
                                        type="text"
                                        value={exp.title}
                                        onChange={(e) => updateExperience(index, 'title', e.target.value)}
                                        placeholder="Job Title"
                                        className="bg-[#3A3A3A] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <input
                                        type="text"
                                        value={exp.company}
                                        onChange={(e) => updateExperience(index, 'company', e.target.value)}
                                        placeholder="Company"
                                        className="bg-[#3A3A3A] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <input
                                        type="text"
                                        value={exp.period}
                                        onChange={(e) => updateExperience(index, 'period', e.target.value)}
                                        placeholder="Period"
                                        className="bg-[#3A3A3A] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <textarea
                                    value={exp.description}
                                    onChange={(e) => updateExperience(index, 'description', e.target.value)}
                                    placeholder="Description"
                                    rows="3"
                                    className="w-full mt-4 bg-[#3A3A3A] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
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
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                        >
                            <FaPlus /> Add Education
                        </button>
                    </div>
                    <div className="space-y-4">
                        {about.education.map((edu, index) => (
                            <div key={index} className="bg-[#2A2A2A] p-4 rounded-lg">
                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="text-lg font-semibold">Education {index + 1}</h3>
                                    <button
                                        type="button"
                                        onClick={() => removeEducation(index)}
                                        className="text-red-500 hover:text-red-400"
                                    >
                                        <FaTrash />
                                    </button>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <input
                                        type="text"
                                        value={edu.degree}
                                        onChange={(e) => updateEducation(index, 'degree', e.target.value)}
                                        placeholder="Degree"
                                        className="bg-[#3A3A3A] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <input
                                        type="text"
                                        value={edu.school}
                                        onChange={(e) => updateEducation(index, 'school', e.target.value)}
                                        placeholder="School"
                                        className="bg-[#3A3A3A] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <input
                                        type="text"
                                        value={edu.period}
                                        onChange={(e) => updateEducation(index, 'period', e.target.value)}
                                        placeholder="Period"
                                        className="bg-[#3A3A3A] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <textarea
                                    value={edu.description}
                                    onChange={(e) => updateEducation(index, 'description', e.target.value)}
                                    placeholder="Description"
                                    rows="3"
                                    className="w-full mt-4 bg-[#3A3A3A] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        ))}
                    </div>
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                >
                    Save Changes
                </button>
            </form>
        </motion.div>
    );
};

export default AboutManager; 