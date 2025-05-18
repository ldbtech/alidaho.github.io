'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaPlus, FaEdit, FaTrash, FaCode, FaRunning } from 'react-icons/fa';
import { fetchData, saveJourneyEvent } from '../../services/firebase';
import { ref, remove } from 'firebase/database';
import database from '../../services/firebase';

const JourneyManager = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [editingEvent, setEditingEvent] = useState(null);
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        loadEvents();
    }, []);

    const loadEvents = async () => {
        try {
            const data = await fetchData('journey');
            if (data) {
                setEvents(Object.values(data));
            }
        } catch (err) {
            setError('Failed to load journey events');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(false);

        try {
            const formData = new FormData(e.target);
            const eventData = {
                id: editingEvent?.id || Date.now().toString(),
                title: formData.get('title'),
                description: formData.get('description'),
                category: formData.get('category'),
                status: formData.get('status'),
                date: formData.get('date'),
                details: {
                    technologies: formData.get('technologies')?.split(',').map(tech => tech.trim()) || [],
                    achievements: formData.get('achievements')?.split(',').map(achievement => achievement.trim()) || [],
                    notes: formData.get('notes') || '',
                    links: formData.get('links')?.split(',').map(link => link.trim()) || []
                }
            };

            // Validate required fields
            if (!eventData.title) {
                throw new Error("Title is required");
            }
            if (!eventData.description) {
                throw new Error("Description is required");
            }
            if (!eventData.date) {
                throw new Error("Date is required");
            }

            await saveJourneyEvent(eventData);
            await loadEvents();
            setEditingEvent(null);
            setShowForm(false);
            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
            e.target.reset();
        } catch (err) {
            console.error("Error saving event:", err);
            if (err.message.includes("Authentication required")) {
                setError("Please log in to save events");
            } else {
                setError(err.message || "Failed to save event");
            }
        }
    };

    const handleDelete = async (eventId) => {
        if (window.confirm('Are you sure you want to delete this event?')) {
            try {
                const eventRef = ref(database, `journey/${eventId}`);
                await remove(eventRef);
                await loadEvents();
                setSuccess(true);
                setTimeout(() => setSuccess(false), 3000);
            } catch (err) {
                setError('Failed to delete event');
                console.error(err);
            }
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
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">Journey Management</h2>
                <button
                    onClick={() => {
                        setEditingEvent(null);
                        setShowForm(true);
                    }}
                    className="px-4 py-2 bg-gradient-to-r from-blue-500 to-teal-500 rounded-full flex items-center gap-2 hover:from-blue-600 hover:to-teal-600 transition-all duration-300"
                >
                    <FaPlus /> Add Event
                </button>
            </div>

            {error && (
                <div className="mb-4 p-4 bg-red-500/10 border border-red-500 rounded-lg">
                    <p className="text-red-500">{error}</p>
                </div>
            )}

            {success && (
                <div className="mb-4 p-4 bg-green-500/10 border border-green-500 rounded-lg">
                    <p className="text-green-500">Event {editingEvent ? 'updated' : 'added'} successfully!</p>
                </div>
            )}

            {showForm && (
                <form onSubmit={handleSubmit} className="space-y-6 mb-8 bg-[#2A2A2A] p-6 rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-200 mb-2">
                                Title
                            </label>
                            <input
                                type="text"
                                name="title"
                                defaultValue={editingEvent?.title}
                                required
                                className="w-full bg-[#181818] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-200 mb-2">
                                Date
                            </label>
                            <input
                                type="date"
                                name="date"
                                defaultValue={editingEvent?.date}
                                required
                                className="w-full bg-[#181818] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-200 mb-2">
                                Category
                            </label>
                            <select
                                name="category"
                                defaultValue={editingEvent?.category || 'Professional'}
                                required
                                className="w-full bg-[#181818] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="Professional">Professional</option>
                                <option value="Personal">Personal</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-200 mb-2">
                                Status
                            </label>
                            <select
                                name="status"
                                defaultValue={editingEvent?.status || 'in-progress'}
                                required
                                className="w-full bg-[#181818] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="completed">Completed</option>
                                <option value="in-progress">In Progress</option>
                                <option value="planned">Planned</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-200 mb-2">
                            Description
                        </label>
                        <textarea
                            name="description"
                            defaultValue={editingEvent?.description}
                            required
                            className="w-full bg-[#181818] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-32"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-200 mb-2">
                            Technologies (comma-separated)
                        </label>
                        <input
                            type="text"
                            name="technologies"
                            defaultValue={editingEvent?.details?.technologies?.join(', ')}
                            className="w-full bg-[#181818] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-200 mb-2">
                            Achievements (comma-separated)
                        </label>
                        <input
                            type="text"
                            name="achievements"
                            defaultValue={editingEvent?.details?.achievements?.join(', ')}
                            className="w-full bg-[#181818] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-200 mb-2">
                            Notes
                        </label>
                        <textarea
                            name="notes"
                            defaultValue={editingEvent?.details?.notes}
                            className="w-full bg-[#181818] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-32"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-200 mb-2">
                            Links (comma-separated)
                        </label>
                        <input
                            type="text"
                            name="links"
                            defaultValue={editingEvent?.details?.links?.join(', ')}
                            className="w-full bg-[#181818] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="flex gap-4">
                        <button
                            type="submit"
                            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-teal-500 rounded-full flex items-center gap-2 hover:from-blue-600 hover:to-teal-600 transition-all duration-300"
                        >
                            {editingEvent ? 'Update Event' : 'Add Event'}
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                setShowForm(false);
                                setEditingEvent(null);
                            }}
                            className="px-6 py-3 bg-[#2A2A2A] rounded-full hover:bg-[#3A3A3A] transition-all duration-300"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {events.map((event) => (
                    <div key={event.id} className="bg-[#2A2A2A] p-4 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                            {event.category === 'Professional' ? (
                                <FaCode className="w-5 h-5 text-blue-500" />
                            ) : (
                                <FaRunning className="w-5 h-5 text-green-500" />
                            )}
                            <h3 className="text-xl font-semibold">{event.title}</h3>
                        </div>
                        <p className="text-gray-300 mb-2">{event.description}</p>
                        <div className="flex flex-wrap gap-2 mb-4">
                            <span className={`px-2 py-1 rounded-full text-sm ${
                                event.status === 'completed' ? 'bg-green-500/20 text-green-500' :
                                event.status === 'in-progress' ? 'bg-blue-500/20 text-blue-500' :
                                'bg-yellow-500/20 text-yellow-500'
                            }`}>
                                {event.status}
                            </span>
                            <span className="px-2 py-1 bg-[#3A3A3A] rounded-full text-sm">
                                {new Date(event.date).toLocaleDateString()}
                            </span>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => {
                                    setEditingEvent(event);
                                    setShowForm(true);
                                }}
                                className="bg-blue-600 text-white py-1 px-3 rounded hover:bg-blue-700 transition-colors flex items-center gap-1"
                            >
                                <FaEdit /> Edit
                            </button>
                            <button
                                onClick={() => handleDelete(event.id)}
                                className="bg-red-600 text-white py-1 px-3 rounded hover:bg-red-700 transition-colors flex items-center gap-1"
                            >
                                <FaTrash /> Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </motion.div>
    );
};

export default JourneyManager; 