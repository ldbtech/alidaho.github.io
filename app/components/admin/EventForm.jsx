'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

const EventForm = ({ event, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    title: event.title || '',
    description: event.description || '',
    category: event.category || 'Professional',
    status: event.status || 'planned',
    date: event.date ? new Date(event.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    details: event.details || {
      technologies: [],
      achievements: [],
      notes: '',
      links: []
    }
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
          <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-4 py-2 bg-[#2A2A2A] rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none"
            rows="3"
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
              <option value="Professional">Professional</option>
              <option value="Personal">Personal</option>
              <option value="Education">Education</option>
              <option value="Project">Project</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full px-4 py-2 bg-[#2A2A2A] rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none"
            >
              <option value="planned">Planned</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>
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

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Technologies (comma-separated)</label>
          <input
            type="text"
            value={formData.details.technologies.join(', ')}
            onChange={(e) => setFormData({
              ...formData,
              details: {
                ...formData.details,
                technologies: e.target.value.split(',').map(tech => tech.trim())
              }
            })}
            className="w-full px-4 py-2 bg-[#2A2A2A] rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Notes</label>
          <textarea
            value={formData.details.notes}
            onChange={(e) => setFormData({
              ...formData,
              details: { ...formData.details, notes: e.target.value }
            })}
            className="w-full px-4 py-2 bg-[#2A2A2A] rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none"
            rows="3"
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
            Save Event
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default EventForm; 