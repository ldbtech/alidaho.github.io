'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaUpload, FaEye, FaDownload, FaTrash, FaCheck } from 'react-icons/fa';
import { fetchData, saveProfile } from '../../services/firebase';

const ResumeManager = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [resumeUrl, setResumeUrl] = useState('');
    const [resumeName, setResumeName] = useState('');
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        try {
            const data = await fetchData('profile');
            if (data) {
                setProfile(data);
                setResumeUrl(data.resumeUrl || '');
                setResumeName(data.resumeName || '');
            }
        } catch (err) {
            console.error('Error loading profile:', err);
            setError('Failed to load profile data');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        try {
            setError(null);
            setSuccess(false);

            const updatedProfile = {
                ...profile,
                resumeUrl: resumeUrl.trim(),
                resumeName: resumeName.trim()
            };

            await saveProfile(updatedProfile);
            setProfile(updatedProfile);
            setSuccess(true);
            
            // Hide success message after 3 seconds
            setTimeout(() => setSuccess(false), 3000);
        } catch (err) {
            console.error('Error saving resume:', err);
            setError('Failed to save resume data');
        }
    };

    const handlePreview = () => {
        if (resumeUrl) {
            setIsPreviewOpen(true);
        }
    };

    const handleDownload = () => {
        if (resumeUrl) {
            const link = document.createElement('a');
            link.href = resumeUrl;
            link.download = resumeName || 'Resume';
            link.target = '_blank';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="text-center space-y-4">
                <h2 className="text-3xl font-bold text-primary">
                    Resume <span className="text-accent">Management</span>
                </h2>
                <p className="text-secondary max-w-2xl mx-auto">
                    Upload and manage your resume. Visitors can view and download it directly from your portfolio.
                </p>
            </div>

            <div className="bg-surface-secondary rounded-apple-lg p-8 space-y-6">
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-primary mb-2">
                            Resume URL
                        </label>
                        <input
                            type="url"
                            value={resumeUrl}
                            onChange={(e) => setResumeUrl(e.target.value)}
                            placeholder="https://example.com/resume.pdf"
                            className="w-full bg-surface px-4 py-3 rounded-apple border border-separator text-primary placeholder-text-tertiary focus:outline-none focus:ring-2 focus:ring-accent transition-apple"
                        />
                        <p className="text-sm text-tertiary mt-1">
                            Upload your resume to a file hosting service (Google Drive, Dropbox, etc.) and paste the direct link here.
                        </p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-primary mb-2">
                            Resume Name
                        </label>
                        <input
                            type="text"
                            value={resumeName}
                            onChange={(e) => setResumeName(e.target.value)}
                            placeholder="Ali Daho - Software Engineer Resume"
                            className="w-full bg-surface px-4 py-3 rounded-apple border border-separator text-primary placeholder-text-tertiary focus:outline-none focus:ring-2 focus:ring-accent transition-apple"
                        />
                    </div>
                </div>

                <div className="flex flex-wrap gap-4">
                    <button
                        onClick={handleSave}
                        className="flex items-center gap-2 px-6 py-3 bg-accent hover:bg-accent-hover text-white rounded-apple transition-apple font-medium"
                    >
                        <FaCheck className="w-4 h-4" />
                        Save Resume
                    </button>

                    {resumeUrl && (
                        <>
                            <button
                                onClick={handlePreview}
                                className="flex items-center gap-2 px-6 py-3 bg-surface-tertiary hover:bg-surface text-primary rounded-apple transition-apple font-medium"
                            >
                                <FaEye className="w-4 h-4" />
                                Preview
                            </button>

                            <button
                                onClick={handleDownload}
                                className="flex items-center gap-2 px-6 py-3 bg-surface-tertiary hover:bg-surface text-primary rounded-apple transition-apple font-medium"
                            >
                                <FaDownload className="w-4 h-4" />
                                Download
                            </button>
                        </>
                    )}
                </div>

                {error && (
                    <div className="p-4 bg-error/10 border border-error/20 rounded-apple">
                        <p className="text-error text-sm">{error}</p>
                    </div>
                )}

                {success && (
                    <div className="p-4 bg-success/10 border border-success/20 rounded-apple">
                        <p className="text-success text-sm font-medium">Resume saved successfully!</p>
                    </div>
                )}
            </div>

            {/* Resume Preview Modal */}
            {isPreviewOpen && resumeUrl && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="relative w-full max-w-4xl h-[90vh] bg-surface-secondary rounded-apple-lg shadow-apple overflow-hidden"
                    >
                        <div className="flex items-center justify-between p-4 border-b border-separator">
                            <h3 className="text-xl font-semibold text-primary">
                                {resumeName || 'Resume Preview'}
                            </h3>
                            <button
                                onClick={() => setIsPreviewOpen(false)}
                                className="p-2 rounded-apple hover:bg-surface-tertiary transition-apple"
                            >
                                <FaTrash className="w-5 h-5 text-secondary" />
                            </button>
                        </div>
                        <div className="h-full overflow-hidden">
                            <iframe
                                src={resumeUrl}
                                className="w-full h-full border-0"
                                title="Resume Preview"
                            />
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default ResumeManager;
