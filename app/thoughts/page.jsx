'use client';

import React from 'react';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ref, onValue, get } from 'firebase/database';
import { database } from '../services/firebase';
import Link from 'next/link';
import { FaCalendarAlt, FaTag, FaArrowLeft } from 'react-icons/fa';
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
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#121212] to-[#1a1a1a] text-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-transparent to-teal-500/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 py-16 md:py-24">
          <header className="text-center">
            <div className="flex justify-center mb-8">
              <Link 
                href="/"
                className="inline-flex items-center text-gray-400 hover:text-white transition-all duration-300 px-6 py-3 rounded-full border border-gray-700 hover:border-gray-500 hover:bg-gray-800/50 backdrop-blur-sm"
              >
                <FaArrowLeft className="mr-2" />
                Back to Home
              </Link>
            </div>
            <h1 className="text-6xl md:text-7xl font-bold mb-8 leading-tight">
              My <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-blue-500 to-teal-400">Thoughts</span>
            </h1>
            <p className="text-gray-300 max-w-4xl mx-auto text-xl leading-relaxed mb-4">
              Exploring ideas, sharing insights, and documenting my journey in AI, software development, and technology.
            </p>
            <div className="flex justify-center items-center gap-4 text-gray-400 text-sm">
              <span className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                {thoughts.length} Articles
              </span>
              <span className="flex items-center gap-2">
                <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                {categories.length} Categories
              </span>
            </div>
          </header>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 pb-16">
        {/* Category Filter */}
        <div className="flex justify-center gap-3 mb-16 overflow-x-auto pb-4">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-8 py-4 rounded-full transition-all duration-300 font-medium whitespace-nowrap ${
                selectedCategory === category
                  ? 'bg-gradient-to-r from-blue-500 to-teal-500 text-white shadow-2xl shadow-blue-500/25 transform scale-105'
                  : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 hover:text-white border border-gray-700 hover:border-gray-600 backdrop-blur-sm'
              }`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>

        {/* Thoughts Grid */}
        {thoughts.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-24 h-24 mx-auto mb-6 bg-gray-800 rounded-full flex items-center justify-center">
              <FaTag className="text-3xl text-gray-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-300 mb-4">No thoughts found</h3>
            <p className="text-gray-500 max-w-md mx-auto">
              {selectedCategory === 'all' 
                ? "Start adding your thoughts in the admin panel to see them here!"
                : `No thoughts found in the "${selectedCategory}" category. Try selecting a different category.`
              }
            </p>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {filteredThoughts.map((thought, index) => (
              <motion.div
                key={thought.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link href={`/thoughts/${thought.id}`} className="group block">
                  <article className="bg-gray-900/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-gray-800 hover:border-blue-500/30 transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/10 group-hover:scale-[1.02] h-full">
                    {/* Image */}
                    {thought.imageUrl && (
                      <div className="relative w-full h-56 overflow-hidden">
                        <img
                          src={thought.imageUrl}
                          alt={thought.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </div>
                    )}
                    
                    {/* Content */}
                    <div className="p-8 space-y-6">
                      {/* Meta Info */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 text-sm text-gray-400">
                          <div className="flex items-center gap-2">
                            <FaCalendarAlt className="text-blue-400" />
                            <span>{new Date(thought.date).toLocaleDateString('en-US', { 
                              year: 'numeric', 
                              month: 'short', 
                              day: 'numeric' 
                            })}</span>
                          </div>
                        </div>
                        <span className="px-4 py-2 bg-gradient-to-r from-blue-500/20 to-teal-500/20 text-blue-400 rounded-full text-xs font-semibold border border-blue-500/30">
                          {thought.category}
                        </span>
                      </div>

                      {/* Title */}
                      <h2 className="text-2xl font-bold group-hover:text-blue-400 transition-colors leading-tight line-clamp-2">
                        {thought.title}
                      </h2>

                      {/* Summary */}
                      <p className="text-gray-400 line-clamp-3 leading-relaxed text-base">
                        {thought.summary || thought.content?.substring(0, 200) + '...'}
                      </p>

                      {/* Tags */}
                      {thought.tags?.length > 0 && (
                        <div className="flex flex-wrap gap-2 pt-2">
                          {thought.tags.slice(0, 3).map((tag, tagIndex) => (
                            <span
                              key={tagIndex}
                              className="px-3 py-1 bg-gray-800/50 text-gray-400 rounded-full text-xs font-medium hover:bg-gray-700/50 transition-colors"
                            >
                              {tag}
                            </span>
                          ))}
                          {thought.tags.length > 3 && (
                            <span className="px-3 py-1 text-gray-500 text-xs">
                              +{thought.tags.length - 3} more
                            </span>
                          )}
                        </div>
                      )}

                      {/* Read More Indicator */}
                      <div className="flex items-center text-blue-400 text-sm font-medium group-hover:text-blue-300 transition-colors">
                            Read Article
                            <svg className="ml-2 w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                      </div>
                    </div>
                  </article>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
      <ChatBot />
    </div>
  );
};

export default ThoughtsPage; 