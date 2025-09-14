'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaGripVertical, 
  FaChevronDown, 
  FaChevronUp,
  FaImage,
  FaUser,
  FaGraduationCap,
  FaBriefcase,
  FaTrophy,
  FaCog,
  FaRobot,
  FaCode,
  FaLanguage,
  FaGlobe
} from 'react-icons/fa';
import { fetchData, saveAbout } from '../../services/firebase';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

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
        { title: 'Artificial Intelligence', items: [] },
        { title: 'Tools & Others', items: [] }
    ],
    programmingLanguages: [],
    spokenLanguages: [],
    experience: [],
    education: [],
    achievements: [],
    aiTools: [],
    languages: [
        { code: 'en', name: 'English', flag: '🇺🇸', isActive: true, isDefault: true },
        { code: 'es', name: 'Español', flag: '🇪🇸', isActive: true, isDefault: false },
        { code: 'fr', name: 'Français', flag: '🇫🇷', isActive: true, isDefault: false }
    ]
};

// Collapsible Section Component
const CollapsibleSection = ({ 
    title, 
    icon: Icon, 
    children, 
    isOpen, 
    onToggle, 
    count = null,
    className = ""
}) => (
    <motion.div 
        className={`bg-white/80 dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 ${className}`}
        initial={false}
        animate={{ height: 'auto' }}
    >
        <button
            onClick={onToggle}
            className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-slate-50/50 dark:hover:bg-slate-700/30 transition-all duration-200 group"
        >
            <div className="flex items-center gap-3">
                <Icon className="text-slate-600 dark:text-slate-400 text-lg" />
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{title}</h3>
                {count !== null && (
                    <span className="bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs px-2 py-1 rounded-full">
                        {count}
                    </span>
                )}
            </div>
            <motion.div
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: 0.2 }}
                className="text-slate-500 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200 transition-colors"
            >
                <FaChevronDown />
            </motion.div>
        </button>
        
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className="overflow-hidden"
                >
                    <div className="px-6 pb-6 pt-2">
                        {children}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    </motion.div>
);

// Apple-style Input Component
const AppleInput = ({ label, value, onChange, placeholder, type = "text", rows = 1, className = "" }) => (
    <div className={`space-y-2 ${className}`}>
        {label && (
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                {label}
            </label>
        )}
        {rows > 1 ? (
            <textarea
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                rows={rows}
                className="w-full bg-white/80 dark:bg-slate-800/50 border border-slate-200/50 dark:border-slate-700/50 rounded-xl px-4 py-3 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400/50 dark:focus:ring-slate-500/50 focus:border-slate-400 dark:focus:border-slate-500 transition-all duration-200 resize-none"
            />
        ) : (
            <input
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className="w-full bg-white/80 dark:bg-slate-800/50 border border-slate-200/50 dark:border-slate-700/50 rounded-xl px-4 py-3 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400/50 dark:focus:ring-slate-500/50 focus:border-slate-400 dark:focus:border-slate-500 transition-all duration-200"
            />
        )}
    </div>
);

// Apple-style Button Component
const AppleButton = ({ 
    children, 
    onClick, 
    variant = "primary", 
    size = "md", 
    className = "",
    type = "button"
}) => {
    const baseClasses = "font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-50 dark:focus:ring-offset-slate-900";
    
    const variants = {
        primary: "bg-slate-700 hover:bg-slate-800 dark:bg-slate-600 dark:hover:bg-slate-700 text-white focus:ring-slate-500/50",
        secondary: "bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-600 focus:ring-slate-400/50",
        danger: "bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/30 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800 focus:ring-red-400/50",
        success: "bg-green-50 hover:bg-green-100 dark:bg-green-900/20 dark:hover:bg-green-900/30 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800 focus:ring-green-400/50"
    };
    
    const sizes = {
        sm: "px-3 py-2 text-sm",
        md: "px-4 py-2.5 text-sm",
        lg: "px-6 py-3 text-base"
    };
    
    return (
        <button
            type={type}
            onClick={onClick}
            className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
        >
            {children}
        </button>
    );
};

// Sortable Experience Item Component
const SortableExperienceItem = ({ exp, index, updateExperience, removeExperience }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: index });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <motion.div
            ref={setNodeRef}
            style={style}
            className={`bg-white/80 dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 rounded-xl p-6 space-y-4 shadow-sm hover:shadow-md ${isDragging ? 'shadow-2xl shadow-slate-400/20 dark:shadow-slate-600/20' : ''}`}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
        >
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <div
                        {...attributes}
                        {...listeners}
                        className="cursor-grab hover:cursor-grabbing p-2 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700/50"
                    >
                        <FaGripVertical />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Experience {index + 1}</h3>
                </div>
                <AppleButton
                    onClick={() => removeExperience(index)}
                    variant="danger"
                    size="sm"
                >
                    <FaTrash />
                </AppleButton>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <AppleInput
                    label="Job Title"
                        value={exp.title}
                        onChange={(e) => updateExperience(index, 'title', e.target.value)}
                    placeholder="e.g., Software Engineer"
                />
                <AppleInput
                    label="Company"
                        value={exp.company}
                        onChange={(e) => updateExperience(index, 'company', e.target.value)}
                    placeholder="e.g., Apple Inc."
                />
                <AppleInput
                    label="Period"
                        value={exp.period}
                        onChange={(e) => updateExperience(index, 'period', e.target.value)}
                        placeholder="e.g., March 2024 - August 2024"
                    />
                <AppleInput
                    label="Company Logo URL"
                        value={exp.logo || ''}
                        onChange={(e) => updateExperience(index, 'logo', e.target.value)}
                        placeholder="e.g., https://example.com/logo.png"
                />
            </div>
            
            <AppleInput
                label="Description"
                    value={exp.description}
                    onChange={(e) => updateExperience(index, 'description', e.target.value)}
                placeholder="Describe your role and achievements..."
                    rows={3}
                />
        </motion.div>
    );
};

// Sortable Achievement Item Component
const SortableAchievementItem = ({ achievement, index, updateAchievement, removeAchievement }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: `achievement-${index}` });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <motion.div
            ref={setNodeRef}
            style={style}
            className={`bg-white/80 dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 rounded-xl p-6 space-y-4 shadow-sm hover:shadow-md ${isDragging ? 'shadow-2xl shadow-slate-400/20 dark:shadow-slate-600/20' : ''}`}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
        >
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <div
                        {...attributes}
                        {...listeners}
                        className="cursor-grab hover:cursor-grabbing p-2 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700/50"
                    >
                        <FaGripVertical />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Achievement {index + 1}</h3>
                </div>
                <AppleButton
                    onClick={() => removeAchievement(index)}
                    variant="danger"
                    size="sm"
                >
                    <FaTrash />
                </AppleButton>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <AppleInput
                    label="Title"
                    value={achievement.title}
                    onChange={(e) => updateAchievement(index, 'title', e.target.value)}
                    placeholder="Achievement Title"
                />
                <AppleInput
                    label="Category"
                    value={achievement.category}
                    onChange={(e) => updateAchievement(index, 'category', e.target.value)}
                    placeholder="e.g., Hackathon, Sports, Organization"
                />
                <AppleInput
                    label="Date"
                    value={achievement.date}
                    onChange={(e) => updateAchievement(index, 'date', e.target.value)}
                    placeholder="e.g., March 2024"
                />
                <AppleInput
                    label="Organization"
                    value={achievement.organization}
                    onChange={(e) => updateAchievement(index, 'organization', e.target.value)}
                    placeholder="Organization"
                />
                <AppleInput
                    label="Position/Role"
                    value={achievement.position}
                    onChange={(e) => updateAchievement(index, 'position', e.target.value)}
                    placeholder="Position/Role"
                />
                <AppleInput
                    label="Location"
                    value={achievement.location}
                    onChange={(e) => updateAchievement(index, 'location', e.target.value)}
                    placeholder="Location"
                />
                <AppleInput
                    label="Image URL"
                    value={achievement.image}
                    onChange={(e) => updateAchievement(index, 'image', e.target.value)}
                    placeholder="Image URL"
                    type="url"
                />
                <AppleInput
                    label="Link URL"
                    value={achievement.link}
                    onChange={(e) => updateAchievement(index, 'link', e.target.value)}
                    placeholder="Link URL (optional)"
                    type="url"
                />
            </div>
            
            <AppleInput
                label="Description"
                value={achievement.description}
                onChange={(e) => updateAchievement(index, 'description', e.target.value)}
                placeholder="Describe the achievement..."
                rows={3}
            />
        </motion.div>
    );
};

const AboutManager = () => {
    const [about, setAbout] = useState(defaultAboutState);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [selectedSkillGroup, setSelectedSkillGroup] = useState('Frontend Development');
    const [newSkill, setNewSkill] = useState('');
    const [newAiTool, setNewAiTool] = useState('');
    const [newProgrammingLanguage, setNewProgrammingLanguage] = useState('');
    const [newProgrammingLevel, setNewProgrammingLevel] = useState('');
    const [newSpokenLanguage, setNewSpokenLanguage] = useState('');
    const [newSpokenLevel, setNewSpokenLevel] = useState('');
    const [selectedImageType, setSelectedImageType] = useState('profile');
    const [newImageUrl, setNewImageUrl] = useState('');
    
    // Collapsible sections state
    const [openSections, setOpenSections] = useState({
        bio: true,
        images: false,
        skills: false,
        programmingLanguages: false,
        spokenLanguages: false,
        aiTools: false,
        experience: false,
        education: false,
        achievements: false,
        languages: false
    });

    // Drag and drop sensors
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    // Toggle section function
    const toggleSection = (section) => {
        setOpenSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

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
                    programmingLanguages: Array.isArray(data.programmingLanguages) ? data.programmingLanguages : defaultAboutState.programmingLanguages,
                    spokenLanguages: Array.isArray(data.spokenLanguages) ? data.spokenLanguages : defaultAboutState.spokenLanguages,
                    experience: Array.isArray(data.experience) ? data.experience : defaultAboutState.experience,
                    education: Array.isArray(data.education) ? data.education : defaultAboutState.education,
                    aiTools: Array.isArray(data.aiTools) ? data.aiTools : defaultAboutState.aiTools
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


    const addAiTool = () => {
        if (!newAiTool.trim()) return;
        setAbout(prev => ({
            ...prev,
            aiTools: [...prev.aiTools, newAiTool.trim()]
        }));
        setNewAiTool('');
    };

    const removeAiTool = (index) => {
        setAbout(prev => ({
            ...prev,
            aiTools: prev.aiTools.filter((_, i) => i !== index)
        }));
    };

    const addProgrammingLanguage = () => {
        if (!newProgrammingLanguage.trim() || !newProgrammingLevel.trim()) return;
        setAbout(prev => ({
            ...prev,
            programmingLanguages: [...prev.programmingLanguages, {
                language: newProgrammingLanguage.trim(),
                level: newProgrammingLevel.trim()
            }]
        }));
        setNewProgrammingLanguage('');
        setNewProgrammingLevel('');
    };

    const removeProgrammingLanguage = (index) => {
        setAbout(prev => ({
            ...prev,
            programmingLanguages: prev.programmingLanguages.filter((_, i) => i !== index)
        }));
    };

    const addSpokenLanguage = () => {
        if (!newSpokenLanguage.trim() || !newSpokenLevel.trim()) return;
        setAbout(prev => ({
            ...prev,
            spokenLanguages: [...prev.spokenLanguages, {
                language: newSpokenLanguage.trim(),
                level: newSpokenLevel.trim()
            }]
        }));
        setNewSpokenLanguage('');
        setNewSpokenLevel('');
    };

    const removeSpokenLanguage = (index) => {
        setAbout(prev => ({
            ...prev,
            spokenLanguages: prev.spokenLanguages.filter((_, i) => i !== index)
        }));
    };

    const addExperience = () => {
        setAbout(prev => ({
            ...prev,
            experience: [
                ...prev.experience,
                { title: '', company: '', period: '', description: '', logo: '' }
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
                { degree: '', school: '', period: '', description: '', courses: [] }
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

    const addCourse = (eduIndex) => {
        setAbout(prev => ({
            ...prev,
            education: prev.education.map((edu, i) => {
                if (i === eduIndex) {
                    return {
                        ...edu,
                        courses: [...(edu.courses || []), '']
                    };
                }
                return edu;
            })
        }));
    };

    const updateCourse = (eduIndex, courseIndex, value) => {
        setAbout(prev => ({
            ...prev,
            education: prev.education.map((edu, i) => {
                if (i === eduIndex) {
                    const updatedCourses = [...(edu.courses || [])];
                    updatedCourses[courseIndex] = value;
                    return {
                        ...edu,
                        courses: updatedCourses
                    };
                }
                return edu;
            })
        }));
    };

    const removeCourse = (eduIndex, courseIndex) => {
        setAbout(prev => ({
            ...prev,
            education: prev.education.map((edu, i) => {
                if (i === eduIndex) {
                    return {
                        ...edu,
                        courses: (edu.courses || []).filter((_, j) => j !== courseIndex)
                    };
                }
                return edu;
            })
        }));
    };

    // Language management functions
    const addLanguage = () => {
        setAbout(prev => ({
            ...prev,
            languages: [
                ...prev.languages,
                { code: '', name: '', flag: '', isActive: true, isDefault: false }
            ]
        }));
    };

    const updateLanguage = (index, field, value) => {
        setAbout(prev => ({
            ...prev,
            languages: prev.languages.map((lang, i) => {
                if (i === index) {
                    return { ...lang, [field]: value };
                }
                return lang;
            })
        }));
    };

    const removeLanguage = (index) => {
        setAbout(prev => ({
            ...prev,
            languages: prev.languages.filter((_, i) => i !== index)
        }));
    };

    const setDefaultLanguage = (index) => {
        setAbout(prev => ({
            ...prev,
            languages: prev.languages.map((lang, i) => ({
                ...lang,
                isDefault: i === index
            }))
        }));
    };

    const addAchievement = () => {
        setAbout(prev => ({
            ...prev,
            achievements: [
                ...prev.achievements,
                { 
                    title: '', 
                    category: '', 
                    date: '', 
                    description: '', 
                    organization: '', 
                    position: '', 
                    location: '', 
                    image: '', 
                    link: '' 
                }
            ]
        }));
    };

    const updateAchievement = (index, field, value) => {
        setAbout(prev => ({
            ...prev,
            achievements: prev.achievements.map((achievement, i) => {
                if (i === index) {
                    return { ...achievement, [field]: value };
                }
                return achievement;
            })
        }));
    };

    const removeAchievement = (index) => {
        setAbout(prev => ({
            ...prev,
            achievements: prev.achievements.filter((_, i) => i !== index)
        }));
    };

    // Drag and drop handlers
    const handleDragEnd = (event) => {
        const { active, over } = event;

        if (active.id !== over.id) {
            // Check if it's an achievement drag
            if (typeof active.id === 'string' && active.id.startsWith('achievement-')) {
                const activeIndex = parseInt(active.id.replace('achievement-', ''));
                const overIndex = parseInt(over.id.replace('achievement-', ''));
                setAbout(prev => ({
                    ...prev,
                    achievements: arrayMove(prev.achievements, activeIndex, overIndex)
                }));
            } else {
                // Experience drag
                setAbout(prev => ({
                    ...prev,
                    experience: arrayMove(prev.experience, active.id, over.id)
                }));
            }
        }
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
        return about?.images?.[type] && typeof about.images[type] === 'string' && about.images[type].trim() !== '';
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
                    <p className="text-gray-300 mt-4 text-lg">Loading content...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
            <div className="max-w-6xl mx-auto p-6">
                {/* Header */}
                <motion.div 
                    className="text-center mb-12"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
                        Manage <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-600 to-slate-800 dark:from-slate-300 dark:to-slate-100">About</span> Section
                </h1>
                    <p className="text-slate-600 dark:text-slate-400 text-lg">Organize your professional information with elegance</p>
                </motion.div>

                {/* Status Messages */}
                {error && (
                    <motion.div 
                        className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 rounded-2xl backdrop-blur-sm"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3 }}
                    >
                        <p className="text-red-700 dark:text-red-300 text-center">{error}</p>
                    </motion.div>
                )}

                {success && (
                    <motion.div 
                        className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800/50 rounded-2xl backdrop-blur-sm"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3 }}
                    >
                        <p className="text-green-700 dark:text-green-300 text-center">Content saved successfully!</p>
                    </motion.div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Bio Section */}
                    <CollapsibleSection
                        title="Personal Bio"
                        icon={FaUser}
                        isOpen={openSections.bio}
                        onToggle={() => toggleSection('bio')}
                    >
                        <AppleInput
                            label="Bio"
                            value={about.bio || ''}
                            onChange={(e) => setAbout(prev => ({ ...prev, bio: e.target.value }))}
                            placeholder="Tell your story in a few sentences..."
                            rows={4}
                        />
                    </CollapsibleSection>

                    {/* Images Section */}
                    <CollapsibleSection
                        title="Images"
                        icon={FaImage}
                        isOpen={openSections.images}
                        onToggle={() => toggleSection('images')}
                        count={Object.values(about.images).filter(img => img && typeof img === 'string' && img.trim() !== '').length}
                    >
                        <div className="space-y-6">
                            <div className="flex gap-4">
                                <select
                                    value={selectedImageType}
                                    onChange={(e) => setSelectedImageType(e.target.value)}
                                    className="bg-white/80 dark:bg-slate-800/50 border border-slate-200/50 dark:border-slate-700/50 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-slate-400/50 dark:focus:ring-slate-500/50 focus:border-slate-400 dark:focus:border-slate-500 transition-all duration-200"
                                >
                                    <option value="profile">Profile Image</option>
                                    <option value="aboutMe">About Me Image</option>
                                    <option value="background">Background Image</option>
                                </select>
                                <AppleInput
                                    value={newImageUrl}
                                    onChange={(e) => setNewImageUrl(e.target.value)}
                                    placeholder="Enter image URL"
                                    className="flex-1"
                                />
                                <AppleButton onClick={updateImage}>
                                    Update Image
                                </AppleButton>
                                {hasImage(selectedImageType) && (
                                    <AppleButton onClick={removeImage} variant="danger">
                                        Remove
                                    </AppleButton>
                                )}
                            </div>
                            {hasImage(selectedImageType) && (
                                <div className="relative w-32 h-32 rounded-xl overflow-hidden border border-white/10">
                                    <img
                                        src={about.images[selectedImageType]}
                                        alt={`${selectedImageType} preview`}
                                        className="object-cover w-full h-full"
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = '';
                                            removeImage();
                                        }}
                                    />
                                </div>
                            )}
                        </div>
                    </CollapsibleSection>

                    {/* Skills Section */}
                    <CollapsibleSection
                        title="Skills"
                        icon={FaCog}
                        isOpen={openSections.skills}
                        onToggle={() => toggleSection('skills')}
                        count={about.skillGroups.reduce((total, group) => total + group.items.length, 0)}
                    >
                        <div className="space-y-6">
                            <div className="flex gap-4">
                                <select
                                    value={selectedSkillGroup}
                                    onChange={(e) => setSelectedSkillGroup(e.target.value)}
                                    className="bg-white/80 dark:bg-slate-800/50 border border-slate-200/50 dark:border-slate-700/50 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-slate-400/50 dark:focus:ring-slate-500/50 focus:border-slate-400 dark:focus:border-slate-500 transition-all duration-200"
                                >
                                    {about.skillGroups.map((group) => (
                                        <option key={group.title} value={group.title}>
                                            {group.title}
                                        </option>
                                    ))}
                                </select>
                                <AppleInput
                                    value={newSkill}
                                    onChange={(e) => setNewSkill(e.target.value)}
                                    placeholder="Enter skill"
                                    className="flex-1"
                                />
                                <AppleButton onClick={addSkill}>
                                    Add Skill
                                </AppleButton>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {about.skillGroups.map((group, groupIndex) => (
                                    <div key={group.title} className="space-y-3">
                                        <h4 className="text-lg font-semibold text-slate-900 dark:text-white">{group.title}</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {group.items.map((skill, skillIndex) => (
                                                <motion.div
                                                    key={skillIndex}
                                                    className="flex items-center gap-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 px-3 py-2 rounded-full border border-slate-200 dark:border-slate-600"
                                                    whileHover={{ scale: 1.05 }}
                                                    transition={{ duration: 0.2 }}
                                                >
                                                    <span className="text-sm">{skill}</span>
                                                    <button
                                                        type="button"
                                                        onClick={() => removeSkill(groupIndex, skillIndex)}
                                                        className="text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 transition-colors ml-1"
                                                    >
                                                        ×
                                                    </button>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </CollapsibleSection>

                    {/* Programming Languages Section */}
                    <CollapsibleSection
                        title="Programming Languages"
                        icon={FaCode}
                        isOpen={openSections.programmingLanguages}
                        onToggle={() => toggleSection('programmingLanguages')}
                        count={about.programmingLanguages.length}
                    >
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <AppleInput
                                    label="Language"
                                    value={newProgrammingLanguage}
                                    onChange={(e) => setNewProgrammingLanguage(e.target.value)}
                                    placeholder="e.g., JavaScript, Python, C++"
                                />
                                <AppleInput
                                    label="Proficiency Level"
                                    value={newProgrammingLevel}
                                    onChange={(e) => setNewProgrammingLevel(e.target.value)}
                                    placeholder="e.g., Expert, Advanced, Intermediate"
                                />
                            </div>
                            <div className="flex justify-end">
                                <AppleButton onClick={addProgrammingLanguage}>
                                    <FaPlus className="mr-2" />
                                    Add Programming Language
                                </AppleButton>
                            </div>
                            <div className="space-y-3">
                                {about.programmingLanguages.map((lang, index) => (
                                    <motion.div
                                        key={index}
                                        className="flex items-center justify-between bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600"
                                        whileHover={{ scale: 1.02 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className="font-medium">{lang.language}</span>
                                            <span className="text-sm bg-slate-200 dark:bg-slate-600 text-slate-600 dark:text-slate-300 px-2 py-1 rounded-full">
                                                {lang.level}
                                            </span>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => removeProgrammingLanguage(index)}
                                            className="text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                                        >
                                            <FaTrash />
                                        </button>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </CollapsibleSection>

                    {/* Spoken Languages Section */}
                    <CollapsibleSection
                        title="Languages I Speak"
                        icon={FaLanguage}
                        isOpen={openSections.spokenLanguages}
                        onToggle={() => toggleSection('spokenLanguages')}
                        count={about.spokenLanguages.length}
                    >
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <AppleInput
                                    label="Language"
                                    value={newSpokenLanguage}
                                    onChange={(e) => setNewSpokenLanguage(e.target.value)}
                                    placeholder="e.g., English, Spanish, French"
                                />
                                <AppleInput
                                    label="Proficiency Level"
                                    value={newSpokenLevel}
                                    onChange={(e) => setNewSpokenLevel(e.target.value)}
                                    placeholder="e.g., Native, Fluent, Intermediate"
                                />
                            </div>
                            <div className="flex justify-end">
                                <AppleButton onClick={addSpokenLanguage}>
                                    <FaPlus className="mr-2" />
                                    Add Spoken Language
                                </AppleButton>
                            </div>
                            <div className="space-y-3">
                                {about.spokenLanguages.map((lang, index) => (
                                    <motion.div
                                        key={index}
                                        className="flex items-center justify-between bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600"
                                        whileHover={{ scale: 1.02 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className="font-medium">{lang.language}</span>
                                            <span className="text-sm bg-slate-200 dark:bg-slate-600 text-slate-600 dark:text-slate-300 px-2 py-1 rounded-full">
                                                {lang.level}
                                            </span>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => removeSpokenLanguage(index)}
                                            className="text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                                        >
                                            <FaTrash />
                                        </button>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </CollapsibleSection>

                    {/* AI Tools Section */}
                    <CollapsibleSection
                        title="AI Tools & Technologies"
                        icon={FaRobot}
                        isOpen={openSections.aiTools}
                        onToggle={() => toggleSection('aiTools')}
                        count={about.aiTools.length}
                    >
                        <div className="space-y-6">
                            <div className="flex gap-4">
                                <AppleInput
                                    value={newAiTool}
                                    onChange={(e) => setNewAiTool(e.target.value)}
                                    placeholder="Enter AI tool or technology"
                                    className="flex-1"
                                />
                                <AppleButton onClick={addAiTool}>
                                    Add AI Tool
                                </AppleButton>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {about.aiTools.map((aiTool, index) => (
                                    <motion.div
                                        key={index}
                                        className="flex items-center gap-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 px-3 py-2 rounded-full border border-slate-200 dark:border-slate-600"
                                        whileHover={{ scale: 1.05 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <span className="text-sm">{aiTool}</span>
                                        <button
                                            type="button"
                                            onClick={() => removeAiTool(index)}
                                            className="text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 transition-colors ml-1"
                                        >
                                            ×
                                        </button>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </CollapsibleSection>

                    {/* Experience Section */}
                    <CollapsibleSection
                        title="Work Experience"
                        icon={FaBriefcase}
                        isOpen={openSections.experience}
                        onToggle={() => toggleSection('experience')}
                        count={about.experience.length}
                    >
                        <div className="space-y-4">
                            <div className="flex justify-end">
                                <AppleButton onClick={addExperience}>
                                    <FaPlus className="mr-2" />
                                Add Experience
                                </AppleButton>
                        </div>
                        <DndContext
                            sensors={sensors}
                            collisionDetection={closestCenter}
                            onDragEnd={handleDragEnd}
                        >
                            <SortableContext
                                items={about.experience.map((_, index) => index)}
                                strategy={verticalListSortingStrategy}
                            >
                                <div className="space-y-4">
                                    {about.experience.map((exp, index) => (
                                        <SortableExperienceItem
                                            key={index}
                                            exp={exp}
                                            index={index}
                                            updateExperience={updateExperience}
                                            removeExperience={removeExperience}
                                        />
                                    ))}
                                </div>
                            </SortableContext>
                        </DndContext>
                    </div>
                    </CollapsibleSection>

                    {/* Education Section */}
                    <CollapsibleSection
                        title="Education"
                        icon={FaGraduationCap}
                        isOpen={openSections.education}
                        onToggle={() => toggleSection('education')}
                        count={about.education.length}
                    >
                        <div className="space-y-4">
                            <div className="flex justify-end">
                                <AppleButton onClick={addEducation}>
                                    <FaPlus className="mr-2" />
                                Add Education
                                </AppleButton>
                        </div>
                        <div className="space-y-4">
                            {about.education.map((edu, index) => (
                                    <motion.div 
                                        key={index} 
                                        className="bg-white/80 dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 rounded-xl p-6 space-y-4 shadow-sm hover:shadow-md"
                                        whileHover={{ scale: 1.02 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <div className="flex justify-between items-center">
                                            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Education {index + 1}</h3>
                                            <AppleButton
                                            onClick={() => removeEducation(index)}
                                                variant="danger"
                                                size="sm"
                                        >
                                                <FaTrash />
                                            </AppleButton>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <AppleInput
                                                label="Degree"
                                            value={edu.degree}
                                            onChange={(e) => updateEducation(index, 'degree', e.target.value)}
                                                placeholder="e.g., Bachelor of Science"
                                        />
                                            <AppleInput
                                                label="School"
                                            value={edu.school}
                                            onChange={(e) => updateEducation(index, 'school', e.target.value)}
                                                placeholder="e.g., Stanford University"
                                        />
                                            <AppleInput
                                                label="Period"
                                            value={edu.period}
                                            onChange={(e) => updateEducation(index, 'period', e.target.value)}
                                                placeholder="e.g., 2020 - 2024"
                                        />
                                        </div>
                                        <AppleInput
                                            label="Description"
                                            value={edu.description}
                                            onChange={(e) => updateEducation(index, 'description', e.target.value)}
                                            placeholder="Additional details about your education..."
                                            rows={3}
                                        />
                                        
                                        {/* Courses Section */}
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between">
                                                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                                    Relevant Courses
                                                </label>
                                                <AppleButton
                                                    onClick={() => addCourse(index)}
                                                    size="sm"
                                                    variant="secondary"
                                                >
                                                    <FaPlus className="mr-1" />
                                                    Add Course
                                                </AppleButton>
                                            </div>
                                            <div className="space-y-2">
                                                {(edu.courses || []).map((course, courseIndex) => (
                                                    <div key={courseIndex} className="flex items-center gap-2">
                                                        <AppleInput
                                                            value={course}
                                                            onChange={(e) => updateCourse(index, courseIndex, e.target.value)}
                                                            placeholder="e.g., Data Structures & Algorithms"
                                                            className="flex-1"
                                                        />
                                                        <AppleButton
                                                            onClick={() => removeCourse(index, courseIndex)}
                                                            variant="danger"
                                                            size="sm"
                                                        >
                                                            <FaTrash />
                                                        </AppleButton>
                                                    </div>
                                                ))}
                                                {(!edu.courses || edu.courses.length === 0) && (
                                                    <p className="text-sm text-slate-500 dark:text-slate-400 italic">
                                                        No courses added yet. Click "Add Course" to add relevant coursework.
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </motion.div>
                            ))}
                        </div>
                    </div>
                    </CollapsibleSection>

                    {/* Achievements Section */}
                    <CollapsibleSection
                        title="Extracurricular and Achievement"
                        icon={FaTrophy}
                        isOpen={openSections.achievements}
                        onToggle={() => toggleSection('achievements')}
                        count={about.achievements.length}
                    >
                        <div className="space-y-4">
                            <div className="flex justify-end">
                                <AppleButton onClick={addAchievement}>
                                    <FaPlus className="mr-2" />
                                Add Achievement
                                </AppleButton>
                        </div>
                        <DndContext
                            sensors={sensors}
                            collisionDetection={closestCenter}
                            onDragEnd={handleDragEnd}
                        >
                            <SortableContext
                                items={about.achievements.map((_, index) => `achievement-${index}`)}
                                strategy={verticalListSortingStrategy}
                            >
                                <div className="space-y-4">
                                    {about.achievements.map((achievement, index) => (
                                        <SortableAchievementItem
                                            key={`achievement-${index}`}
                                            achievement={achievement}
                                            index={index}
                                            updateAchievement={updateAchievement}
                                            removeAchievement={removeAchievement}
                                        />
                                    ))}
                                </div>
                            </SortableContext>
                        </DndContext>
                    </div>
                    </CollapsibleSection>

                    {/* Languages Section */}
                    <CollapsibleSection
                        title="Website Languages"
                        icon={FaGlobe}
                        isOpen={openSections.languages}
                        onToggle={() => toggleSection('languages')}
                        count={about.languages.length}
                    >
                        <div className="space-y-4">
                            <div className="flex justify-end">
                                <AppleButton onClick={addLanguage}>
                                    <FaPlus className="mr-2" />
                                    Add Language
                                </AppleButton>
                            </div>
                            <div className="space-y-4">
                                {about.languages.map((lang, index) => (
                                    <motion.div 
                                        key={index} 
                                        className="bg-white/80 dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 rounded-xl p-6 space-y-4 shadow-sm hover:shadow-md"
                                        whileHover={{ scale: 1.02 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <div className="flex justify-between items-center">
                                            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Language {index + 1}</h3>
                                            <div className="flex gap-2">
                                                {!lang.isDefault && (
                                                    <AppleButton
                                                        onClick={() => setDefaultLanguage(index)}
                                                        size="sm"
                                                        variant="secondary"
                                                    >
                                                        Set Default
                                                    </AppleButton>
                                                )}
                                                <AppleButton
                                                    onClick={() => removeLanguage(index)}
                                                    variant="danger"
                                                    size="sm"
                                                >
                                                    <FaTrash />
                                                </AppleButton>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <AppleInput
                                                label="Language Code"
                                                value={lang.code}
                                                onChange={(e) => updateLanguage(index, 'code', e.target.value)}
                                                placeholder="e.g., en, es, fr"
                                            />
                                            <AppleInput
                                                label="Language Name"
                                                value={lang.name}
                                                onChange={(e) => updateLanguage(index, 'name', e.target.value)}
                                                placeholder="e.g., English, Español"
                                            />
                                            <AppleInput
                                                label="Flag Emoji"
                                                value={lang.flag}
                                                onChange={(e) => updateLanguage(index, 'flag', e.target.value)}
                                                placeholder="e.g., 🇺🇸, 🇪🇸"
                                            />
                                            <div className="flex items-center gap-4">
                                                <label className="flex items-center gap-2">
                                                    <input
                                                        type="checkbox"
                                                        checked={lang.isActive}
                                                        onChange={(e) => updateLanguage(index, 'isActive', e.target.checked)}
                                                        className="rounded"
                                                    />
                                                    <span className="text-sm text-slate-700 dark:text-slate-300">Active</span>
                                                </label>
                                                <label className="flex items-center gap-2">
                                                    <input
                                                        type="checkbox"
                                                        checked={lang.isDefault}
                                                        onChange={(e) => setDefaultLanguage(index)}
                                                        className="rounded"
                                                    />
                                                    <span className="text-sm text-slate-700 dark:text-slate-300">Default</span>
                                                </label>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </CollapsibleSection>

                    {/* Save Button */}
                    <motion.div 
                        className="pt-8"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        <AppleButton
                        type="submit"
                            size="lg"
                            className="w-full bg-gradient-to-r from-slate-700 to-slate-800 dark:from-slate-600 dark:to-slate-700 hover:from-slate-800 hover:to-slate-900 dark:hover:from-slate-700 dark:hover:to-slate-800 text-white font-semibold py-4 text-lg"
                    >
                            Save All Changes
                        </AppleButton>
                    </motion.div>
                </form>
            </div>
        </div>
    );
};

export default AboutManager; 