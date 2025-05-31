'use client';

import React from 'react';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ref, onValue, get } from 'firebase/database';
import { database } from '../services/firebase';
import Link from 'next/link';
import { FaCalendarAlt, FaTag } from 'react-icons/fa';
import ChatBot from '../components/ChatBot';

const ThoughtsPage = () => {
  const [thoughts, setThoughts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    const fetchThoughts = async () => {
      try {
        console.log('Starting to fetch thoughts...');
        if (!database) {
          throw new Error('Firebase database is not initialized');
        }

        const thoughtsRef = ref(database, 'thoughts');
        
        // First, try to get the data once
        const snapshot = await get(thoughtsRef);
        console.log('Initial data fetch:', snapshot.val());

        // Then set up the real-time listener
        const unsubscribe = onValue(thoughtsRef, (snapshot) => {
          console.log('Real-time update received:', snapshot.val());
          try {
            const data = snapshot.val();
            console.log('Processing data:', data);
            
            if (!data) {
              console.log('No thoughts found in database');
              setThoughts([]);
              return;
            }

            // Convert to array and validate each thought
            const thoughtsArray = Object.entries(data)
              .map(([id, thought]) => {
                // Validate required fields
                if (!thought.title || !thought.content || !thought.date) {
                  console.warn('Invalid thought data:', { id, thought });
                  return null;
                }
                return {
                  id,
                  ...thought,
                  date: thought.date || new Date().toISOString().split('T')[0]
                };
              })
              .filter(Boolean) // Remove invalid thoughts
              .sort((a, b) => new Date(b.date) - new Date(a.date));

            console.log('Processed thoughts array:', thoughtsArray);
            setThoughts(thoughtsArray);
          } catch (err) {
            console.error('Error processing thoughts:', err);
            setError('Failed to process thoughts: ' + err.message);
          } finally {
            setLoading(false);
          }
        }, (error) => {
          console.error('Firebase listener error:', error);
          setError('Failed to load thoughts: ' + error.message);
          setLoading(false);
        });

        return () => {
          console.log('Cleaning up Firebase listener');
          unsubscribe();
        };
      } catch (err) {
        console.error('Error in fetchThoughts:', err);
        setError('Failed to fetch thoughts: ' + err.message);
        setLoading(false);
      }
    };

    fetchThoughts();
  }, []);

  const categories = ['all', 'AI', 'Software Development', 'Technology', 'Career'];

  const filteredThoughts = selectedCategory === 'all'
    ? thoughts
    : thoughts.filter(thought => thought.category === selectedCategory);

  console.log('Current thoughts state:', thoughts);
  console.log('Filtered thoughts:', filteredThoughts);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#121212] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#121212] text-white">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-2 rounded-lg">
            {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#121212] text-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-bold mb-4">
            My <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-teal-500">Thoughts</span>
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Exploring ideas, sharing insights, and documenting my journey in AI, software development, and technology.
          </p>
        </header>

        <div className="flex justify-center gap-4 mb-8 overflow-x-auto pb-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                selectedCategory === category
                  ? 'bg-blue-500 text-white'
                  : 'bg-[#2A2A2A] text-gray-300 hover:bg-[#3A3A3A]'
              }`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>

        {thoughts.length === 0 ? (
          <div className="text-center text-gray-400 py-12">
            <p className="text-xl">No thoughts found</p>
            <p className="mt-2">Start adding your thoughts in the admin panel!</p>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {filteredThoughts.map((thought) => (
              <Link
                key={thought.id}
                href={`/thoughts/${thought.id}`}
                className="group"
              >
                <motion.article
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-[#181818] rounded-lg overflow-hidden border border-gray-800 hover:border-blue-500/50 transition-colors"
                >
                  {thought.imageUrl && (
                    <div className="relative w-full h-48">
                      <img
                        src={thought.imageUrl}
                        alt={thought.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="p-6 space-y-4">
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                      <div className="flex items-center gap-2">
                        <FaCalendarAlt />
                        <span>{new Date(thought.date).toLocaleDateString()}</span>
                      </div>
                      <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded-full">
                        {thought.category}
                      </span>
                    </div>
                    <h2 className="text-xl font-semibold group-hover:text-blue-400 transition-colors">
                      {thought.title}
                    </h2>
                    <p className="text-gray-400 line-clamp-3">
                      {thought.summary}
                    </p>
                    {thought.tags?.length > 0 && (
                      <div className="flex flex-wrap gap-2 pt-4">
                        {thought.tags.slice(0, 3).map((tag, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-[#2A2A2A] text-gray-400 rounded-full text-xs"
                          >
                            {tag}
                          </span>
                        ))}
                        {thought.tags.length > 3 && (
                          <span className="px-2 py-1 text-gray-500 text-xs">
                            +{thought.tags.length - 3} more
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </motion.article>
              </Link>
            ))}
          </div>
        )}
      </div>
      <ChatBot />
    </div>
  );
};

export default ThoughtsPage; 