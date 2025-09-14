"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaSave, FaTrash, FaPlus, FaEdit, FaLink, FaSignOutAlt, FaHistory, FaProjectDiagram, FaUser, FaInfoCircle, FaLightbulb, FaFilePdf } from "react-icons/fa";
import { getDatabase, ref, set, remove } from "firebase/database";
import database from "../services/firebase";
import { fetchData, saveProject, saveAbout, getCurrentUser, logout, initAuthStateListener } from "../services/firebase";
import LoginForm from "../components/LoginForm";
import ProjectManager from '../components/admin/ProjectManager';
import AboutManager from '../components/admin/AboutManager';
import ProfileManager from '../components/admin/ProfileManager';
import TimelineManager from '../components/admin/TimelineManager';
import ThoughtManager from '../components/admin/ThoughtManager';
import ResumeManager from '../components/admin/ResumeManager';

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState("timeline");
  const [projects, setProjects] = useState([]);
  const [about, setAbout] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editingProject, setEditingProject] = useState(null);
  const [editingAbout, setEditingAbout] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Load data on component mount
  useEffect(() => {
    loadData();
  }, []);

  // Handle auth state changes
  useEffect(() => {
    const unsubscribe = initAuthStateListener((user) => {
      setIsAuthenticated(!!user);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      setIsAuthenticated(false);
    } catch (error) {
      console.error("Logout error:", error);
      setError(error.message);
    }
  };

  const showError = (message) => {
    setError(message);
    setTimeout(() => setError(null), 5000);
  };

  const showSuccess = (message) => {
    setSuccess(message);
    setTimeout(() => setSuccess(null), 5000);
  };

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchData('projects');
      if (data) {
        setProjects(Object.values(data));
      }
      const aboutData = await fetchData('about');
      setAbout(aboutData);
    } catch (error) {
      console.error("Error loading data:", error);
      showError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleProjectSave = async (project) => {
    if (!isAuthenticated) {
      showError("You must be logged in to save changes");
      return;
    }

    try {
      setError(null);
      await saveProject(project);
      await loadData();
      setEditingProject(null);
      showSuccess("Project saved successfully!");
    } catch (error) {
      console.error("Error saving project:", error);
      if (error.message.includes("PERMISSION_DENIED")) {
        showError("Authentication failed. Please check your Firebase configuration and database rules.");
      } else {
        showError(error.message);
      }
    }
  };

  const handleAboutSave = async (data) => {
    if (!isAuthenticated) {
      showError("You must be logged in to save changes");
      return;
    }

    try {
      setError(null);
      await saveAbout(data);
      await loadData();
      setEditingAbout(null);
      showSuccess("About section updated successfully!");
    } catch (error) {
      console.error("Error saving about:", error);
      if (error.message.includes("PERMISSION_DENIED")) {
        showError("Authentication failed. Please check your Firebase configuration and database rules.");
      } else {
        showError(error.message);
      }
    }
  };

  const handleDeleteProject = async (projectId) => {
    if (!isAuthenticated) {
      showError("You must be logged in to delete projects");
      return;
    }

    if (window.confirm("Are you sure you want to delete this project?")) {
      try {
        const projectRef = ref(database, `projects/${projectId}`);
        await remove(projectRef);
        await loadData();
        showSuccess("Project deleted successfully!");
      } catch (error) {
        console.error("Error deleting project:", error);
        showError(error.message);
      }
    }
  };

  if (!isAuthenticated) {
    return <LoginForm onLoginSuccess={() => setIsAuthenticated(true)} />;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#121212] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const tabs = [
    { id: 'timeline', label: 'Timeline', icon: FaHistory },
    { id: 'projects', label: 'Projects', icon: FaProjectDiagram },
    { id: 'thoughts', label: 'My Thoughts', icon: FaLightbulb },
    { id: 'profile', label: 'Profile', icon: FaUser },
    { id: 'resume', label: 'Resume', icon: FaFilePdf },
    { id: 'about', label: 'About', icon: FaInfoCircle },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'timeline':
        return <TimelineManager />;
      case 'projects':
        return <ProjectManager />;
      case 'thoughts':
        return <ThoughtManager />;
      case 'profile':
        return <ProfileManager />;
      case 'resume':
        return <ResumeManager />;
      case 'about':
        return <AboutManager />;
      default:
        return <TimelineManager />;
    }
  };

  return (
    <div className="min-h-screen bg-[#121212] text-white p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto"
      >
        {error && (
          <div className="mb-4 p-4 bg-red-500/10 border border-red-500 rounded-lg">
            <p className="text-red-500">{error}</p>
          </div>
        )}
        {success && (
          <div className="mb-4 p-4 bg-green-500/10 border border-green-500 rounded-lg">
            <p className="text-green-500">{success}</p>
          </div>
        )}
        
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">
            Portfolio <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-teal-500">Admin</span>
          </h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-[#2A2A2A] rounded-full flex items-center gap-2 hover:bg-[#3A3A3A] transition-all duration-300"
          >
            <FaSignOutAlt /> Logout
          </button>
        </div>

        <div className="flex space-x-4 mb-8 overflow-x-auto pb-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  activeTab === tab.id
                    ? 'bg-blue-500 text-white'
                    : 'bg-[#2A2A2A] text-gray-300 hover:bg-[#3A3A3A]'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        <div className="bg-[#181818] rounded-lg shadow-lg">
          {renderContent()}
        </div>
      </motion.div>
    </div>
  );
};

const ProjectForm = ({ project, onSave, onCancel }) => {
  const [formData, setFormData] = useState(project);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      // Validate required fields
      if (!formData.title) {
        throw new Error("Title is required");
      }
      if (!formData.description) {
        throw new Error("Description is required");
      }
      if (!formData.imgUrl) {
        throw new Error("Image URL is required");
      }

      // Validate image URL
      try {
        new URL(formData.imgUrl);
      } catch {
        throw new Error("Please enter a valid image URL");
      }

      await onSave(formData);
    } catch (error) {
      console.error("Error in form submission:", error);
      setError(error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-[#181818] p-6 rounded-2xl space-y-4">
      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500 rounded-lg">
          <p className="text-red-500">{error}</p>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="Title"
          value={formData.title || ""}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="bg-[#2A2A2A] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <div className="space-y-2">
          <label className="block text-sm text-[#ADB7BE]">Image URL</label>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Paste image URL here"
              value={formData.imgUrl || ""}
              onChange={(e) => setFormData({ ...formData, imgUrl: e.target.value })}
              className="flex-1 bg-[#2A2A2A] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <a
              href="https://drive.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-[#2A2A2A] text-white rounded-lg hover:bg-[#3A3A3A] transition-all duration-300 flex items-center gap-2"
            >
              <FaLink /> Get URL
            </a>
          </div>
          {formData.imgUrl && (
            <div className="mt-2">
              <img
                src={formData.imgUrl}
                alt="Preview"
                className="w-full h-32 object-cover rounded-lg"
                onError={() => setError("Invalid image URL")}
              />
            </div>
          )}
        </div>
        <input
          type="text"
          placeholder="GitHub URL"
          value={formData.gitUrl || ""}
          onChange={(e) => setFormData({ ...formData, gitUrl: e.target.value })}
          className="bg-[#2A2A2A] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="text"
          placeholder="Preview URL"
          value={formData.previewUrl || ""}
          onChange={(e) => setFormData({ ...formData, previewUrl: e.target.value })}
          className="bg-[#2A2A2A] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <textarea
        placeholder="Description"
        value={formData.description || ""}
        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        className="w-full bg-[#2A2A2A] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-32"
      />
      <div className="flex gap-4">
        <button
          type="submit"
          className="px-6 py-3 bg-gradient-to-r from-blue-500 to-teal-500 rounded-full flex items-center gap-2 hover:from-blue-600 hover:to-teal-600 transition-all duration-300"
        >
          <FaSave /> Save
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-3 bg-[#2A2A2A] rounded-full hover:bg-[#3A3A3A] transition-all duration-300"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

const ProjectCard = ({ project, onEdit, onDelete }) => {
  return (
    <div className="bg-[#181818] p-6 rounded-2xl">
      <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
      <p className="text-[#ADB7BE] mb-4">{project.description}</p>
      <div className="flex flex-wrap gap-2 mb-4">
        {project.tags?.map((tag, index) => (
          <span
            key={index}
            className="px-3 py-1 bg-[#2A2A2A] text-[#ADB7BE] rounded-full text-sm"
          >
            {tag}
          </span>
        ))}
      </div>
      <div className="flex gap-4">
        <button
          onClick={onEdit}
          className="px-4 py-2 bg-gradient-to-r from-blue-500 to-teal-500 rounded-full flex items-center gap-2 hover:from-blue-600 hover:to-teal-600 transition-all duration-300"
        >
          <FaEdit /> Edit
        </button>
        <button
          onClick={onDelete}
          className="px-4 py-2 bg-red-500 rounded-full flex items-center gap-2 hover:bg-red-600 transition-all duration-300"
        >
          <FaTrash /> Delete
        </button>
      </div>
    </div>
  );
};

const AboutForm = ({ about, onSave, onCancel }) => {
  const [formData, setFormData] = useState(about);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-[#181818] p-6 rounded-2xl space-y-4">
      <textarea
        placeholder="Bio"
        value={formData.bio || ""}
        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
        className="w-full bg-[#2A2A2A] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-32"
      />
      <div className="flex gap-4">
        <button
          type="submit"
          className="px-6 py-3 bg-gradient-to-r from-blue-500 to-teal-500 rounded-full flex items-center gap-2 hover:from-blue-600 hover:to-teal-600 transition-all duration-300"
        >
          <FaSave /> Save
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-3 bg-[#2A2A2A] rounded-full hover:bg-[#3A3A3A] transition-all duration-300"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default AdminPage; 