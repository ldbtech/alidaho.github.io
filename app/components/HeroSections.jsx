"use client";
import React, { useState, useEffect, useRef } from 'react';
import Image from "next/image";
import { TypeAnimation } from "react-type-animation";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { fetchProfile, fetchData } from '../services/firebase';
import ResumePreview from './ResumePreview';
import ProjectCard from './ProjectCard';
import Modal from './Modal';

const HeroSections = () => {
    const [profile, setProfile] = useState(null);
    const [about, setAbout] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showTerminal, setShowTerminal] = useState(false);
    const [showExperienceModal, setShowExperienceModal] = useState(false);
    const [showProjectsModal, setShowProjectsModal] = useState(false);
    const [projects, setProjects] = useState([]);
    // Terminal persistence
    const [terminalLines, setTerminalLines] = useState(() => {
        if (typeof window !== 'undefined') {
            try {
                const saved = localStorage.getItem('terminal_lines');
                if (saved) return JSON.parse(saved);
            } catch {}
        }
        return [
            { type: "out", text: "terminal" },
            { type: "prompt", text: "$ type 'help' to get started" },
        ];
    });
    const [terminalInput, setTerminalInput] = useState("");

    // Simple interactive terminal component
    const Terminal = ({ profileData, aboutData, onShowExperience, onShowProjects, lines, setLines, input, setInput }) => {
        const scrollRef = useRef(null);

        const appendLine = (newLine) => setLines((prev) => [...prev, newLine]);

        const commands = {
            help: () => {
                return [
                    "Available commands:",
                    "help - Show available commands",
                    "whoami - Show name",
                    "skills - List core skills",
                    "languages - List spoken languages",
                    "socials - Show social links",
                    "show experience - Open experience modal",
                    "show projects - Open projects modal",
                    "clear - Clear the terminal",
                ];
            },
            whoami: () => [profileData?.name || "Unknown"],
            skills: () => ["→ Full Stack Development", "→ AI & Machine Learning", "→ Best Striker ⚽️"],
            languages: () => [
                `→ ${aboutData?.spokenLanguages?.map(l => l.language).join(', ') || 'Multiple'}`,
            ],
            socials: () => [
                profileData?.socialLinks?.github ? `GitHub: ${profileData.socialLinks.github}` : null,
                profileData?.socialLinks?.linkedin ? `LinkedIn: ${profileData.socialLinks.linkedin}` : null,
            ].filter(Boolean),
            clear: () => { setLines([]); return []; },
        };

        const handleSubmit = (e) => {
            e.preventDefault();
            const cmd = input.trim();
            if (!cmd) return;
            appendLine({ type: "in", text: `$ ${cmd}` });
            const parts = cmd.split(/\s+/);
            const base = parts[0]?.toLowerCase();
            // Handle compound commands like "show projects"
            if (base === 'show') {
                const target = parts[1]?.toLowerCase();
                if (target === 'experience' && typeof onShowExperience === 'function') {
                    onShowExperience();
                    setInput("");
                    return;
                }
                if (target === 'projects' && typeof onShowProjects === 'function') {
                    onShowProjects();
                    setInput("");
                    return;
                }
            }
            const handler = commands[base];
            if (handler) {
                const result = handler();
                result.forEach((t) => t && appendLine({ type: "out", text: t }));
            } else {
                appendLine({ type: "out", text: `Command not found: ${cmd}. Try 'help'.` });
            }
            setInput("");
        };

        useEffect(() => {
            if (scrollRef.current) {
                scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
            }
        }, [lines]);

        return (
            <div className="font-mono text-sm text-left flex flex-col max-h-[60vh] sm:max-h-72 overflow-hidden">
                <div className="space-y-1 overflow-y-auto pr-1 flex-1" ref={scrollRef}>
                    {lines.map((l, idx) => (
                        <div key={idx} className={l.type === 'in' ? 'text-accent' : 'text-secondary'}>{l.text}</div>
                    ))}
                </div>
                <form onSubmit={handleSubmit} className="flex items-center gap-2 mt-2 shrink-0 sticky bottom-0 bg-surface/80 backdrop-blur supports-[padding:max(0px)]:pb-[env(safe-area-inset-bottom)]">
                    <span className="text-accent select-none">$</span>
                    <input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        className="flex-1 bg-transparent border-b border-separator focus:outline-none focus:border-accent text-primary placeholder:text-tertiary"
                        placeholder="Type a command... (help)"
                        aria-label="terminal input"
                        autoComplete="off"
                        autoCorrect="off"
                        spellCheck={false}
                        autoFocus
                    />
                </form>
            </div>
        );
    };

    useEffect(() => {
        const loadData = async () => {
            try {
                console.log('HeroSections: Starting to load data...');
                const [profileData, aboutData, projectsData] = await Promise.all([
                    fetchProfile(),
                    fetchData('about'),
                    fetchData('projects')
                ]);
                console.log('HeroSections: Profile data loaded:', profileData);
                console.log('HeroSections: About data loaded:', aboutData);
                setProfile(profileData);
                setAbout(aboutData);
                if (projectsData) {
                    const arr = Object.values(projectsData).map(p => ({
                        ...p,
                        tags: p.tags || [],
                    }));
                    setProjects(arr);
                }
            } catch (error) {
                console.error('HeroSections: Error loading data:', error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    // Persist terminal lines
    useEffect(() => {
        try {
            localStorage.setItem('terminal_lines', JSON.stringify(terminalLines));
        } catch {}
    }, [terminalLines]);

    // Lock body scroll when mobile terminal is open to avoid layout bounce
    useEffect(() => {
        const body = document.body;
        const prev = body.style.overflow;
        if (showTerminal) {
            body.style.overflow = 'hidden';
        } else {
            body.style.overflow = prev || '';
        }
        return () => {
            body.style.overflow = prev || '';
        };
    }, [showTerminal]);

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
        <section className="min-h-screen flex items-center justify-center px-4 sm:px-6 pt-20 pb-8 relative overflow-hidden">
            {/* Modern Background Elements */}
            <div className="absolute inset-0 -z-10">
                {/* Gradient Orbs */}
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-teal-500/15 to-emerald-500/15 rounded-full blur-2xl animate-pulse"></div>
                
                {/* Grid Pattern */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
                
                {/* Floating Elements */}
                <div className="absolute top-20 left-20 w-2 h-2 bg-accent/60 rounded-full animate-bounce"></div>
                <div className="absolute top-40 right-32 w-1 h-1 bg-primary/40 rounded-full animate-bounce" style={{animationDelay: '1s'}}></div>
                <div className="absolute bottom-32 left-16 w-3 h-3 bg-secondary/50 rounded-full animate-bounce" style={{animationDelay: '2s'}}></div>
            </div>

            <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                {/* Left Content */}
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="text-center lg:text-left space-y-4 flex flex-col justify-center"
                >
                    {/* Status Badge */}
                    <motion.button
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        onClick={() => setShowTerminal(!showTerminal)}
                        className="lg:hidden inline-flex items-center gap-2 px-4 py-2 bg-surface-secondary/50 backdrop-blur-sm rounded-full border border-surface-secondary/30 mb-0 hover:bg-surface-secondary/70 transition-colors cursor-pointer"
                    >
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-sm text-secondary font-medium">Available for opportunities</span>
                        <motion.div
                            animate={{ rotate: showTerminal ? 180 : 0 }}
                            transition={{ duration: 0.3 }}
                            className="text-secondary"
                        >
                            ▼
                        </motion.div>
                    </motion.button>
                    
                    {/* Desktop Status Badge */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="hidden lg:inline-flex items-center gap-2 px-4 py-2 bg-surface-secondary/50 backdrop-blur-sm rounded-full border border-surface-secondary/30 mb-0"
                    >
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-sm text-secondary font-medium">Available for opportunities</span>
                    </motion.div>

                    {/* Mobile Terminal - Full-screen drawer */}
                    <AnimatePresence>
                        {showTerminal && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="lg:hidden fixed inset-0 z-[9998] h-[100svh] overscroll-contain"
                            >
                                {/* Backdrop */}
                                <div
                                    className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                                    onClick={() => setShowTerminal(false)}
                                ></div>
                                {/* Drawer */}
                                <motion.div
                                    initial={{ y: '100%', scale: 0.98 }}
                                    animate={{ y: 0, scale: 1 }}
                                    exit={{ y: '100%', scale: 0.98 }}
                                    transition={{ type: 'spring', stiffness: 260, damping: 28 }}
                                    className="absolute bottom-0 left-0 right-0 mx-auto w-[86%] max-w-sm rounded-3xl border border-gray-200 dark:border-surface-secondary/50 shadow-2xl overflow-hidden will-change-transform"
                                >
                                    <div className="bg-white/90 dark:bg-surface-secondary/80 backdrop-blur-md px-4 py-3 border-b border-gray-200 dark:border-surface-secondary/50 flex items-center justify-between">
                                        <span className="text-sm text-gray-600 dark:text-secondary font-mono">terminal</span>
                                        <button
                                            onClick={() => setShowTerminal(false)}
                                            className="text-gray-500 dark:text-secondary hover:text-primary px-2 py-1 rounded-md"
                                            aria-label="Close terminal"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                    <div className="bg-white dark:bg-surface p-4 max-h-[70svh] overflow-y-auto">
                                        <Terminal
                                            profileData={profile}
                                            aboutData={about}
                                            onShowExperience={() => setShowExperienceModal(true)}
                                            onShowProjects={() => setShowProjectsModal(true)}
                                            lines={terminalLines}
                                            setLines={setTerminalLines}
                                            input={terminalInput}
                                            setInput={setTerminalInput}
                                        />
                                    </div>
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Name */}
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-primary tracking-tight leading-none mb-0"
                    >
                        <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                            {profile.name || "Ali Daho Bachir"}
                        </span>
                    </motion.h1>
                    
                    {/* Type Animation */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.5 }}
                        className="h-12 sm:h-14 flex items-center justify-center lg:justify-start mb-0"
                    >
                        <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl text-secondary font-light">
                            <TypeAnimation
                                sequence={[
                                    profile.title,
                                    4000,
                                    "Software Developer",
                                    3000,
                                    "Best Striker ⚽️",
                                    3000,
                                    "Polyglot",
                                    2000,
                                    ...(about?.spokenLanguages ? about.spokenLanguages.flatMap(lang => [lang.language, 800]) : []),
                                    "Polyglot",
                                    2000,
                                ]}
                                wrapper="span"
                                speed={40}
                                repeat={Infinity}
                                className="text-accent"
                            />
                        </h2>
                    </motion.div>

                    {/* Description */}
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.7 }}
                        className="text-lg sm:text-xl text-secondary max-w-2xl mx-auto lg:mx-0 leading-relaxed mb-0"
                    >
                        Crafting digital experiences with code, creativity, and a passion for solving complex problems.
                    </motion.p>

                    {/* Action Buttons */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.9 }}
                        className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
                    >
                        <a
                            href={profile.socialLinks.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group relative flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 text-white rounded-full transition-all duration-500 hover:scale-105 shadow-2xl hover:shadow-gray-500/25"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-gray-800 to-gray-900 rounded-full blur opacity-0 group-hover:opacity-75 transition-opacity duration-500"></div>
                            <FaGithub className="w-5 h-5 relative z-10" />
                            <span className="font-semibold relative z-10">View GitHub</span>
                        </a>
                        <a
                            href={profile.socialLinks.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group relative flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-full transition-all duration-500 hover:scale-105 shadow-2xl hover:shadow-blue-500/25"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full blur opacity-0 group-hover:opacity-75 transition-opacity duration-500"></div>
                            <FaLinkedin className="w-5 h-5 relative z-10" />
                            <span className="font-semibold relative z-10">Connect</span>
                        </a>
                        <div className="mt-2 sm:mt-0">
                            <ResumePreview 
                                resumeUrl={profile.resumeUrl} 
                                resumeName={profile.resumeName || "Resume"}
                                showDownload={false}
                            />
                        </div>
                    </motion.div>
                </motion.div>

                {/* Right Visual Element - Desktop Terminal */}
                <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="relative hidden lg:block"
                >
                    {/* Code Terminal Mockup */}
                    <div className="relative bg-surface-secondary/30 backdrop-blur-sm rounded-2xl p-6 border border-surface-secondary/50 shadow-2xl">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                            <span className="ml-4 text-sm text-secondary font-mono">terminal</span>
                        </div>
                        <Terminal
                            profileData={profile}
                            aboutData={about}
                            onShowExperience={() => setShowExperienceModal(true)}
                            onShowProjects={() => setShowProjectsModal(true)}
                            lines={terminalLines}
                            setLines={setTerminalLines}
                            input={terminalInput}
                            setInput={setTerminalInput}
                        />
                    </div>

                    {/* Floating Elements */}
                    <motion.div
                        animate={{ y: [0, -20, 0] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full blur-xl"
                    ></motion.div>
                    <motion.div
                        animate={{ y: [0, 20, 0] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                        className="absolute -bottom-4 -left-4 w-12 h-12 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-xl"
                    ></motion.div>
                </motion.div>
            </div>

            {/* Scroll Indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 1.2 }}
                className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center"
            >
                <p className="text-xs text-tertiary mb-4 tracking-wider uppercase">Scroll to explore</p>
                <motion.div
                    animate={{ y: [0, 8, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    className="w-6 h-10 border-2 border-tertiary/30 rounded-full flex justify-center"
                >
                    <motion.div
                        animate={{ y: [0, 12, 0] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        className="w-1 h-3 bg-tertiary/60 rounded-full mt-2"
                    ></motion.div>
                </motion.div>
            </motion.div>

            {/* Experience Modal */}
            <Modal
                isOpen={showExperienceModal}
                onClose={() => setShowExperienceModal(false)}
                title="Work Experience"
                maxWidth="max-w-4xl"
            >
                <ExperienceModalContent about={about} />
            </Modal>

            {/* Projects Modal */}
            <Modal
                isOpen={showProjectsModal}
                onClose={() => setShowProjectsModal(false)}
                title="Projects"
                maxWidth="max-w-5xl"
            >
                {projects && projects.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {projects.map((project) => (
                            <ProjectCard key={project.id || project.title} project={project} />
                        ))}
                    </div>
                ) : (
                    <p className="text-secondary">No projects available.</p>
                )}
            </Modal>
        </section>
    );
};

export default HeroSections;

// Modals
// Experience Modal
/** Rendered below to keep file self-contained */
export const ExperienceModalContent = ({ about }) => {
    if (!about?.experience || about.experience.length === 0) {
        return <p className="text-secondary">No experience added yet.</p>;
    }
    const sorted = [...about.experience].sort((a, b) => {
        const getStartDate = (period) => {
            if (!period) return new Date(0);
            const start = period.split(' - ')[0]?.trim();
            return new Date(start);
        };
        return getStartDate(b.period) - getStartDate(a.period);
    });

    const renderDescription = (description) => {
        if (!description) return null;
        const lines = description.split('\n').filter(Boolean);
        const hasBullets = lines.some(l => /^(?:[-•*])\s+/.test(l.trim()));
        if (hasBullets) {
            return (
                <ul className="mt-2 space-y-1">
                    {lines.map((line, i) => (
                        <li key={i} className="text-secondary flex items-start">
                            <span className="text-accent mr-2 mt-1">•</span>
                            <span>{line.replace(/^[-•*]\s*/, '')}</span>
                        </li>
                    ))}
                </ul>
            );
        }
        return <p className="mt-2 text-secondary">{description}</p>;
    };

    return (
        <div className="space-y-4">
            {sorted.map((exp, idx) => (
                <div key={idx} className="bg-surface rounded-apple p-4 sm:p-6 border border-separator shadow-apple-light">
                    <div className="flex items-start gap-3 sm:gap-4">
                        {exp.logo && (
                            <div className="flex-shrink-0">
                                <Image
                                    src={exp.logo}
                                    alt={`${exp.company} logo`}
                                    width={48}
                                    height={48}
                                    className="rounded-lg object-contain"
                                    unoptimized
                                    onError={(e) => { e.target.style.display = 'none'; }}
                                />
                            </div>
                        )}
                        <div className="flex-1 min-w-0">
                            <h4 className="text-lg sm:text-xl font-semibold text-primary">{exp.title}</h4>
                            <p className="text-accent font-medium text-sm sm:text-base">{exp.company}</p>
                            <p className="text-tertiary text-xs sm:text-sm font-medium">{exp.period}</p>
                            <div className="pt-2">
                                {renderDescription(exp.description)}
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export const ProjectsModalContent = ({ projects }) => {
    if (!projects || projects.length === 0) {
        return <p className="text-secondary">No projects available.</p>;
    }
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map((project) => (
                <ProjectCard key={project.id || project.title} project={project} />
            ))}
        </div>
    );
};

const ProjectsPlaceholder = () => (
    <p className="text-secondary">Coming soon: Projects list in modal.</p>
);