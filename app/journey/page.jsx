// JourneyPage.jsx
'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { FaRunning, FaCode, FaEnvelope } from 'react-icons/fa';
import { MdAdd } from 'react-icons/md';
import emailjs from '@emailjs/browser';
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
      dates.push(date);
    }
    return dates;
  };

  const weekDates = generateWeekDates();

  // Sample events - replace with your actual events
  useEffect(() => {
    const events = [
      {
        id: 1,
        date: new Date(),
        title: 'Portfolio Launch',
        description: 'Deployed my portfolio website',
        category: 'Professional',
        status: 'completed',
        icon: <FaCode className="w-6 h-6" />,
        details: {
          technologies: ['Next.js', 'React', 'Tailwind CSS'],
          achievements: ['Responsive Design', 'Dark Mode'],
          notes: 'Successfully deployed with Vercel'
        }
      },
      {
        id: 2,
        date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
        title: 'AI Project Milestone',
        description: 'Complete neural network implementation',
        category: 'Professional',
        status: 'in-progress',
        icon: <FaCode className="w-6 h-6" />,
        details: {
          technologies: ['Python', 'TensorFlow'],
          currentProgress: '70% complete',
          notes: 'Working on optimization'
        }
      },
      {
        id: 3,
        date: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000), // 4 days from now
        title: 'Marathon Training',
        description: 'Long distance run',
        category: 'Personal',
        status: 'planned',
        icon: <FaRunning className="w-6 h-6" />,
        details: {
          distance: '15km',
          goals: ['Maintain pace', 'Hydration'],
          notes: 'Morning run planned'
        }
      },
      {
        id: 4,
        date: new Date(), // Today
        title: 'Another Event Today',
        description: 'Something else happened today',
        category: 'Personal',
        status: 'completed',
        icon: <FaRunning className="w-6 h-6" />,
        details: { notes: 'Just a note.' }
      }
    ];
    setTimelineEvents(events);
  }, []);

  const getEventsForDate = (date) => {
    return timelineEvents.filter(event => 
      new Date(event.date).toDateString() === date.toDateString()
    );
  };

  const handleAddEvent = (e) => {
    e.preventDefault();
    const newId = Date.now();
    const eventToAdd = {
      id: newId,
      ...newEvent,
      icon: newEvent.category === 'Professional' ? <FaCode className="w-6 h-6" /> : <FaRunning className="w-6 h-6" />
    };

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
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 text-white py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500">
            My Journey
          </h1>
          <p className="text-xl text-gray-300">
            Tracking my progress day by day
          </p>
        </motion.div>

        {/* Timeline Container */}
        <div className="relative h-64 mb-20">
          {/* Main Timeline Line */}
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-800 transform -translate-y-1/2"></div>

          {/* Timeline Events */}
          <div className="relative flex justify-between items-center h-full">
            {weekDates.map((date, index) => (
              <DayCircle
                key={index}
                date={date}
                events={getEventsForDate(date)}
              />
            ))}
          </div>
        </div>

        {/* Add Event Button */}
        <div className="flex justify-center mb-12">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowAddEvent(true)}
            className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg text-white font-semibold shadow-lg hover:from-blue-600 hover:to-purple-600 transition-colors"
          >
            <MdAdd className="w-5 h-5" />
            <span>Add New Event</span>
          </motion.button>
        </div>

        {/* Add Event Modal */}
        <AnimatePresence>
          {
            showAddEvent && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50"
                >
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="bg-gray-900 rounded-lg p-6 w-full max-w-md border border-gray-800"
                  >
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-2xl font-bold text-blue-400">Add New Event</h2>
                      <button
                        onClick={() => setShowAddEvent(false)}
                        className="text-gray-400 hover:text-white"
                      >
                        <FaTimes className="w-5 h-5" />
                      </button>
                    </div>
                    <form onSubmit={handleAddEvent} className="space-y-4">
                      <div>
                        <label className="block text-gray-300 mb-2">Title</label>
                        <input
                          type="text"
                          value={newEvent.title}
                          onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                          className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-blue-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-gray-300 mb-2">Description</label>
                        <textarea
                          value={newEvent.description}
                          onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                          className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-blue-500"
                          rows="3"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-gray-300 mb-2">Date</label>
                        <input
                          type="date"
                          value={newEvent.date}
                          onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                          className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-blue-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-gray-300 mb-2">Category</label>
                        <select
                          value={newEvent.category}
                          onChange={(e) => setNewEvent({ ...newEvent, category: e.target.value })}
                          className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-blue-500"
                        >
                          <option value="Professional">Professional</option>
                          <option value="Personal">Personal</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-gray-300 mb-2">Status</label>
                        <select
                          value={newEvent.status}
                          onChange={(e) => setNewEvent({ ...newEvent, status: e.target.value })}
                          className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-blue-500"
                        >
                          <option value="planned">Planned</option>
                          <option value="in-progress">In Progress</option>
                          <option value="completed">Completed</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-gray-300 mb-2">Technologies (comma-separated)</label>
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
                          className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-300 mb-2">Notes</label>
                        <textarea
                          value={newEvent.details.notes}
                          onChange={(e) => setNewEvent({
                            ...newEvent,
                            details: { ...newEvent.details, notes: e.target.value }
                          })}
                          className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-blue-500"
                          rows="3"
                        />
                      </div>
                      <button
                        type="submit"
                        className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg text-white font-semibold hover:from-blue-600 hover:to-purple-600 transition-colors"
                      >
                        Add Event
                      </button>
                    </form>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
    
            {/* Newsletter Section */}
            <section className="bg-gray-900 p-8 rounded-lg border border-gray-800 backdrop-blur-lg bg-opacity-50">
              <div className="text-center mb-8">
                <FaEnvelope className="w-12 h-12 mx-auto text-blue-400 mb-4" />
                <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
                <p className="text-gray-300">
                  Subscribe to my newsletter to get daily updates on my journey
                </p>
              </div>
    
              {!subscribed ? (
                <form onSubmit={handleSubscribe} className="max-w-md mx-auto">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="flex-1 px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-blue-500"
                      required
                    />
                    <button
                      type="submit"
                      className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-colors"
                    >
                      Subscribe
                    </button>
                  </div>
                </form>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center text-green-400"
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