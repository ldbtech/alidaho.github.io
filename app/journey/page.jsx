// JourneyPage.jsx
'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { FaRunning, FaCode, FaEnvelope } from 'react-icons/fa';
import { MdAdd } from 'react-icons/md';
import emailjs from '@emailjs/browser';
import { fetchData, saveJourneyEvent } from '../services/firebase';
import DayCircle from '../components/journey/DayCircle';

// Utility function (keep this)
const getStatusColor = (status) => {
  switch (status) {
    case 'completed':
      return 'bg-green-500';
    case 'in-progress':
      return 'bg-blue-500 animate-pulse';
    case 'planned':
      return 'bg-yellow-500';
    default:
      return 'bg-gray-500';
  }
};

const JourneyPage = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [timelineEvents, setTimelineEvents] = useState([]);
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    category: 'Professional',
    status: 'in-progress',
    date: new Date().toISOString().split('T')[0],
    details: {
      technologies: [],
      achievements: [],
      notes: '',
      links: []
    }
  });

  // Generate dates for the next 7 days
  const generateWeekDates = () => {
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      // Set time to midnight to avoid timezone issues
      date.setHours(0, 0, 0, 0);
      dates.push(date);
    }
    return dates;
  };

  const weekDates = generateWeekDates();

  // Update getEventsForDate to handle date string comparison
  const getEventsForDate = (date) => {
    const dateString = date.toISOString().split('T')[0]; // Convert to YYYY-MM-DD format
    return timelineEvents.filter(event => {
      // Convert event date to YYYY-MM-DD format for comparison
      const eventDate = new Date(event.date).toISOString().split('T')[0];
      return eventDate === dateString;
    });
  };

  // Update loadEvents to properly handle dates
  useEffect(() => {
    const loadEvents = async () => {
      try {
        const data = await fetchData('journey');
        if (data) {
          const events = Object.entries(data).map(([id, event]) => ({
            ...event,
            id,
            // Ensure date is in the correct format
            date: event.date,
            icon: event.category === 'Professional' ? <FaCode className="w-6 h-6" /> : <FaRunning className="w-6 h-6" />
          }));
          console.log('Loaded events:', events); // Debug log
          setTimelineEvents(events);
        }
      } catch (error) {
        console.error('Error loading journey events:', error);
      }
    };

    loadEvents();
  }, []);

  // Update handleAddEvent to ensure date is properly formatted
  const handleAddEvent = async (e) => {
    e.preventDefault();
    try {
      const newId = Date.now().toString();
      
      const eventToAdd = {
        id: newId,
        ...newEvent,
        // Keep the date as is from the input
        date: newEvent.date,
        icon: newEvent.category === 'Professional' ? <FaCode className="w-6 h-6" /> : <FaRunning className="w-6 h-6" />
      };

      // Save to Firebase
      await saveJourneyEvent(eventToAdd);
      
      // Update local state with the same date format
      setTimelineEvents(prev => [...prev, eventToAdd]);
      
      setShowAddEvent(false);
      setNewEvent({
        title: '',
        description: '',
        category: 'Professional',
        status: 'in-progress',
        date: new Date().toISOString().split('T')[0],
        details: {
          technologies: [],
          achievements: [],
          notes: '',
          links: []
        }
      });
    } catch (error) {
      console.error('Failed to add event:', error);
      alert('Failed to add event. Please try again.');
    }
  };

  const handleSubscribe = async (e) => {
    e.preventDefault();
    try {
      await emailjs.send(
        'YOUR_SERVICE_ID',
        'YOUR_TEMPLATE_ID',
        { email },
        'YOUR_PUBLIC_KEY'
      );
      setSubscribed(true);
      setEmail('');
    } catch (error) {
      console.error('Failed to subscribe:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 text-white py-10 md:py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8 md:mb-16"
        >
          <h1 className="text-3xl md:text-6xl font-bold mb-2 md:mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500">
            My Journey
          </h1>
          <p className="text-lg md:text-xl text-gray-300">
            Tracking my progress day by day
          </p>
        </motion.div>

        {/* Timeline Container */}
        <div className="relative h-48 md:h-64 mb-12 md:mb-20">
          {/* Main Timeline Line */}
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-800 transform -translate-y-1/2"></div>

          {/* Timeline Events */}
          <div className="relative flex items-center h-full overflow-x-auto md:overflow-x-visible px-4 md:px-0">
            <div className="flex space-x-8 md:space-x-0 md:justify-between min-w-full md:min-w-0">
              {weekDates.map((date, index) => (
                <DayCircle
                  key={index}
                  date={date}
                  events={getEventsForDate(date)}
                />
              ))}
            </div>
          </div>
        </div>

  

        {/* Add Event Modal */}
        <AnimatePresence>
          {showAddEvent && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50 overflow-y-auto"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-gray-900 rounded-lg p-4 md:p-6 w-full max-w-md border border-gray-800 my-4 md:my-8"
              >
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl md:text-2xl font-bold text-blue-400">Add New Event</h2>
                  <button
                    onClick={() => setShowAddEvent(false)}
                    className="text-gray-400 hover:text-white"
                  >
                    <FaTimes className="w-5 h-5" />
                  </button>
                </div>
                <form onSubmit={handleAddEvent} className="space-y-4">
                  <div>
                    <label className="block text-gray-300 mb-2 text-sm md:text-base">Title</label>
                    <input
                      type="text"
                      value={newEvent.title}
                      onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                      className="w-full px-3 md:px-4 py-2 rounded-lg bg-gray-800 text-white text-sm md:text-base border border-gray-700 focus:outline-none focus:border-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-2 text-sm md:text-base">Description</label>
                    <textarea
                      value={newEvent.description}
                      onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                      className="w-full px-3 md:px-4 py-2 rounded-lg bg-gray-800 text-white text-sm md:text-base border border-gray-700 focus:outline-none focus:border-blue-500 min-h-[150px] md:min-h-[200px] resize-y"
                      placeholder="Write your event description here..."
                      required
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-300 mb-2 text-sm md:text-base">Date</label>
                      <input
                        type="date"
                        value={newEvent.date}
                        onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                        className="w-full px-3 md:px-4 py-2 rounded-lg bg-gray-800 text-white text-sm md:text-base border border-gray-700 focus:outline-none focus:border-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-gray-300 mb-2 text-sm md:text-base">Category</label>
                      <select
                        value={newEvent.category}
                        onChange={(e) => setNewEvent({ ...newEvent, category: e.target.value })}
                        className="w-full px-3 md:px-4 py-2 rounded-lg bg-gray-800 text-white text-sm md:text-base border border-gray-700 focus:outline-none focus:border-blue-500"
                      >
                        <option value="Professional">Professional</option>
                        <option value="Personal">Personal</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-2 text-sm md:text-base">Status</label>
                    <select
                      value={newEvent.status}
                      onChange={(e) => setNewEvent({ ...newEvent, status: e.target.value })}
                      className="w-full px-3 md:px-4 py-2 rounded-lg bg-gray-800 text-white text-sm md:text-base border border-gray-700 focus:outline-none focus:border-blue-500"
                    >
                      <option value="planned">Planned</option>
                      <option value="in-progress">In Progress</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-2 text-sm md:text-base">Technologies (comma-separated)</label>
                    <input
                      type="text"
                      value={newEvent.details.technologies.join(', ')}
                      onChange={(e) => setNewEvent({
                        ...newEvent,
                        details: {
                          ...newEvent.details,
                          technologies: e.target.value.split(',').map(tech => tech.trim())
                        }
                      })}
                      className="w-full px-3 md:px-4 py-2 rounded-lg bg-gray-800 text-white text-sm md:text-base border border-gray-700 focus:outline-none focus:border-blue-500"
                      placeholder="e.g., React, Node.js, Python"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-2 text-sm md:text-base">Notes</label>
                    <textarea
                      value={newEvent.details.notes}
                      onChange={(e) => setNewEvent({
                        ...newEvent,
                        details: { ...newEvent.details, notes: e.target.value }
                      })}
                      className="w-full px-3 md:px-4 py-2 rounded-lg bg-gray-800 text-white text-sm md:text-base border border-gray-700 focus:outline-none focus:border-blue-500 min-h-[100px] resize-y"
                      placeholder="Add any additional notes..."
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full px-4 md:px-6 py-2 md:py-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg text-white text-sm md:text-base font-semibold hover:from-blue-600 hover:to-purple-600 transition-colors"
                  >
                    Add Event
                  </button>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Newsletter Section */}
        <section className="bg-gray-900 p-4 md:p-8 rounded-lg border border-gray-800 backdrop-blur-lg bg-opacity-50">
          <div className="text-center mb-6 md:mb-8">
            <FaEnvelope className="w-8 h-8 md:w-12 md:h-12 mx-auto text-blue-400 mb-3 md:mb-4" />
            <h2 className="text-2xl md:text-3xl font-bold mb-2 md:mb-4">Stay Updated</h2>
            <p className="text-gray-300 text-sm md:text-base">
              Subscribe to my newsletter to get daily updates on my journey
            </p>
          </div>

          {!subscribed ? (
            <form onSubmit={handleSubscribe} className="max-w-md mx-auto">
              <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="flex-1 px-3 md:px-4 py-2 rounded-lg bg-gray-800 text-white text-sm md:text-base border border-gray-700 focus:outline-none focus:border-blue-500"
                  required
                />
                <button
                  type="submit"
                  className="px-4 md:px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-sm md:text-base rounded-lg hover:from-blue-600 hover:to-purple-600 transition-colors"
                >
                  Subscribe
                </button>
              </div>
            </form>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center text-green-400 text-sm md:text-base"
            >
              <p>Thank you for subscribing! You'll receive updates soon.</p>
            </motion.div>
          )}
        </section>
      </div>
    </div>
  );
};

export default JourneyPage;