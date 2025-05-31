'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaSave, FaTrash, FaPlus, FaEdit, FaCode, FaRunning, FaGraduationCap, FaBriefcase } from 'react-icons/fa';
import { getDatabase, ref, set, remove, get } from 'firebase/database';
import database from '../../services/firebase';

const TimelineManager = () => {
  const [events, setEvents] = useState([]);
  const [editingEvent, setEditingEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      setLoading(true);
      const eventsRef = ref(database, 'timeline');
      const snapshot = await get(eventsRef);
      if (snapshot.exists()) {
        const eventsData = snapshot.val();
        setEvents(Object.values(eventsData));
      }
    } catch (error) {
      console.error('Error loading events:', error);
      setError('Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (event) => {
    try {
      const eventsRef = ref(database, 'timeline');
      const newEvent = {
        ...event,
        id: event.id || Date.now().toString(),
        date: new Date(event.date).toISOString(),
      };

      if (editingEvent) {
        // Update existing event
        await set(ref(database, `timeline/${newEvent.id}`), newEvent);
      } else {
        // Add new event
        await set(ref(database, `timeline/${newEvent.id}`), newEvent);
      }

      await loadEvents();
      setEditingEvent(null);
      setSuccess('Event saved successfully!');
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      console.error('Error saving event:', error);
      setError('Failed to save event');
      setTimeout(() => setError(null), 3000);
    }
  };

  const handleDelete = async (eventId) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await remove(ref(database, `timeline/${eventId}`));
        await loadEvents();
        setSuccess('Event deleted successfully!');
        setTimeout(() => setSuccess(null), 3000);
      } catch (error) {
        console.error('Error deleting event:', error);
        setError('Failed to delete event');
        setTimeout(() => setError(null), 3000);
      }
    }
  };

  const getIconForCategory = (category) => {
    switch (category) {
      case 'Professional':
        return <FaBriefcase className="w-6 h-6" />;
      case 'Personal':
        return <FaRunning className="w-6 h-6" />;
      case 'Education':
        return <FaGraduationCap className="w-6 h-6" />;
      case 'Project':
        return <FaCode className="w-6 h-6" />;
      default:
        return <FaBriefcase className="w-6 h-6" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500 rounded-lg">
          <p className="text-red-500">{error}</p>
        </div>
      )}
      {success && (
        <div className="p-4 bg-green-500/10 border border-green-500 rounded-lg">
          <p className="text-green-500">{success}</p>
        </div>
      )}

      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Timeline Events</h2>
        <button
          onClick={() => setEditingEvent({})}
          className="px-4 py-2 bg-blue-500 rounded-lg flex items-center gap-2 hover:bg-blue-600 transition-colors"
        >
          <FaPlus /> Add Event
        </button>
      </div>

      {editingEvent && (
        <EventForm
          event={editingEvent}
          onSave={handleSave}
          onCancel={() => setEditingEvent(null)}
        />
      )}

      <div className="grid gap-4">
        {events.map((event) => (
          <EventCard
            key={event.id}
            event={event}
            onEdit={() => setEditingEvent(event)}
            onDelete={() => handleDelete(event.id)}
          />
        ))}
      </div>
    </div>
  );
};

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

const EventCard = ({ event, onEdit, onDelete }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500';
      case 'in-progress':
        return 'bg-blue-500';
      case 'planned':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[#181818] p-6 rounded-lg border border-gray-800"
    >
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-full ${getStatusColor(event.status)} flex items-center justify-center`}>
            {getIconForCategory(event.category)}
          </div>
          <div>
            <h3 className="text-xl font-bold text-blue-400">{event.title}</h3>
            <p className="text-gray-400">{new Date(event.date).toLocaleDateString()}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onEdit}
            className="p-2 bg-[#2A2A2A] rounded-lg hover:bg-[#3A3A3A] transition-colors"
          >
            <FaEdit className="w-5 h-5" />
          </button>
          <button
            onClick={onDelete}
            className="p-2 bg-red-500/10 rounded-lg hover:bg-red-500/20 transition-colors"
          >
            <FaTrash className="w-5 h-5 text-red-500" />
          </button>
        </div>
      </div>

      <p className="mt-4 text-gray-300">{event.description}</p>

      {event.details && (
        <div className="mt-4 space-y-2">
          {event.details.technologies?.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-400">Technologies</h4>
              <div className="flex flex-wrap gap-2 mt-1">
                {event.details.technologies.map((tech, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-[#2A2A2A] rounded-full text-sm text-gray-300"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}

          {event.details.notes && (
            <div>
              <h4 className="text-sm font-medium text-gray-400">Notes</h4>
              <p className="mt-1 text-gray-300">{event.details.notes}</p>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default TimelineManager; 