'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaEdit, FaTrash, FaPlus, FaImage, FaExternalLinkAlt } from 'react-icons/fa';
import { ref, onValue } from 'firebase/database';
import { database, saveThought, deleteThought } from '../../services/firebase';
import Link from 'next/link';

const ThoughtManager = () => {
  const [thoughts, setThoughts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingThought, setEditingThought] = useState(null);
  const [isAddingThought, setIsAddingThought] = useState(false);

  useEffect(() => {
    console.log('Initializing ThoughtManager...');
    if (!database) {
      console.error('Firebase database is not initialized');
      setError('Database connection error');
      setLoading(false);
      return;
    }

    const thoughtsRef = ref(database, 'thoughts');
    console.log('Setting up Firebase listener for thoughts...');

    const unsubscribe = onValue(thoughtsRef, (snapshot) => {
      console.log('Received data from Firebase:', snapshot.val());
      try {
        const data = snapshot.val();
        if (data) {
          const thoughtsArray = Object.entries(data).map(([id, thought]) => ({
            id,
            ...thought
          }));
          console.log('Processed thoughts array:', thoughtsArray);
          setThoughts(thoughtsArray);
        } else {
          console.log('No thoughts found in database');
          setThoughts([]);
        }
        setError(null);
      } catch (err) {
        console.error('Error processing thoughts:', err);
        setError('Failed to load thoughts: ' + err.message);
      } finally {
        setLoading(false);
      }
    }, (error) => {
      console.error('Firebase error:', error);
      setError('Failed to load thoughts: ' + error.message);
      setLoading(false);
    });

    return () => {
      console.log('Cleaning up Firebase listener');
      unsubscribe();
    };
  }, []);

  const handleSaveThought = async (thoughtData) => {
    try {
      const thoughtId = editingThought ? editingThought.id : Date.now().toString();
      const thought = {
        ...thoughtData,
        id: thoughtId,
        createdAt: editingThought ? editingThought.createdAt : new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      await saveThought(thought);
      setEditingThought(null);
      setIsAddingThought(false);
      setError(null);
    } catch (err) {
      console.error('Error saving thought:', err);
      setError('Failed to save thought: ' + err.message);
    }
  };

  const handleDeleteThought = async (thoughtId) => {
    try {
      await deleteThought(thoughtId);
      setError(null);
    } catch (err) {
      console.error('Error deleting thought:', err);
      setError('Failed to delete thought: ' + err.message);
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
    <div className="space-y-6">
      {error && (
        <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-2 rounded-lg">
          {error}
        </div>
      )}

      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">My Thoughts</h2>
        <button
          onClick={() => setIsAddingThought(true)}
          className="px-4 py-2 bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
        >
          <FaPlus /> Add New Thought
        </button>
      </div>

      {(isAddingThought || editingThought) && (
        <ThoughtForm
          thought={editingThought || {}}
          onSave={handleSaveThought}
          onCancel={() => {
            setEditingThought(null);
            setIsAddingThought(false);
          }}
        />
      )}

      <div className="grid gap-6">
        {thoughts.map((thought) => (
          <ThoughtCard
            key={thought.id}
            thought={thought}
            onEdit={setEditingThought}
            onDelete={handleDeleteThought}
          />
        ))}
      </div>
    </div>
  );
};

const ThoughtForm = ({ thought, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    title: thought.title || '',
    content: thought.content || '',
    category: thought.category || 'AI',
    imageUrl: thought.imageUrl || '',
    tags: thought.tags || [],
    summary: thought.summary || '',
    date: thought.date ? new Date(thought.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[#181818] p-6 rounded-lg border border-gray-800"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Title</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-4 py-2 bg-[#2A2A2A] rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Summary</label>
          <textarea
            value={formData.summary}
            onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
            className="w-full px-4 py-2 bg-[#2A2A2A] rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none"
            rows="2"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Content</label>
          <textarea
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            className="w-full px-4 py-2 bg-[#2A2A2A] rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none"
            rows="6"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Category</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-4 py-2 bg-[#2A2A2A] rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none"
            >
              <option value="AI">AI</option>
              <option value="Software Development">Software Development</option>
              <option value="Technology">Technology</option>
              <option value="Career">Career</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Date</label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full px-4 py-2 bg-[#2A2A2A] rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Image URL</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={formData.imageUrl}
              onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
              className="flex-1 px-4 py-2 bg-[#2A2A2A] rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none"
              placeholder="Enter image URL"
            />
            <button
              type="button"
              className="px-4 py-2 bg-[#2A2A2A] rounded-lg border border-gray-700 hover:bg-[#3A3A3A] transition-colors flex items-center gap-2"
            >
              <FaImage /> Upload
            </button>
          </div>
          {formData.imageUrl && (
            <div className="mt-2">
              <img
                src={formData.imageUrl}
                alt="Preview"
                className="w-full h-48 object-cover rounded-lg"
                onError={() => setFormData({ ...formData, imageUrl: '' })}
              />
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Tags (comma-separated)</label>
          <input
            type="text"
            value={formData.tags.join(', ')}
            onChange={(e) => setFormData({
              ...formData,
              tags: e.target.value.split(',').map(tag => tag.trim())
            })}
            className="w-full px-4 py-2 bg-[#2A2A2A] rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none"
            placeholder="e.g., AI, Machine Learning, Web Development"
          />
        </div>

        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Save Thought
          </button>
        </div>
      </form>
    </motion.div>
  );
};

const ThoughtCard = ({ thought, onEdit, onDelete }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[#181818] p-6 rounded-lg border border-gray-800 hover:border-blue-500/50 transition-colors group"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <Link
            href={`/thoughts/${thought.id}`}
            target="_blank"
            className="block"
          >
            <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-blue-400 transition-colors">
              {thought.title}
            </h3>
          </Link>
          <div className="flex gap-2">
            <span className="px-2 py-1 bg-blue-500 rounded-full text-xs">
              {thought.category}
            </span>
            <span className="px-2 py-1 bg-gray-700 rounded-full text-xs">
              {new Date(thought.date).toLocaleDateString()}
            </span>
          </div>
        </div>
        <div className="flex gap-2">
          <Link
            href={`/thoughts/${thought.id}`}
            target="_blank"
            className="p-2 text-gray-400 hover:text-white transition-colors"
            title="View public page"
          >
            <FaExternalLinkAlt />
          </Link>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(thought);
            }}
            className="p-2 text-gray-400 hover:text-white transition-colors"
          >
            <FaEdit />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(thought.id);
            }}
            className="p-2 text-red-400 hover:text-red-300 transition-colors"
          >
            <FaTrash />
          </button>
        </div>
      </div>

      <Link
        href={`/thoughts/${thought.id}`}
        target="_blank"
        className="block"
      >
        {thought.imageUrl && (
          <img
            src={thought.imageUrl}
            alt={thought.title}
            className="w-full h-48 object-cover rounded-lg mb-4"
          />
        )}

        <p className="text-gray-300 mb-4">{thought.summary}</p>

        <div className="flex flex-wrap gap-2">
          {thought.tags?.map((tag, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-[#2A2A2A] rounded-full text-xs text-gray-300"
            >
              {tag}
            </span>
          ))}
        </div>
      </Link>
    </motion.div>
  );
};

export default ThoughtManager; 