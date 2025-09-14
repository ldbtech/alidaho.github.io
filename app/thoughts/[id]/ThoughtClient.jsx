'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { FaArrowLeft, FaCalendarAlt, FaTag } from 'react-icons/fa';

const ThoughtClient = ({ thought }) => {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden"
        >
          {/* Header with back button */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <Link 
              href="/thoughts"
              className="inline-flex items-center text-blue-500 hover:text-blue-600 mb-4"
            >
              <FaArrowLeft className="mr-2" />
              Back to Thoughts
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {thought.title}
            </h1>
            <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center">
                <FaCalendarAlt className="mr-2" />
                {new Date(thought.date).toLocaleDateString()}
              </div>
              <div className="flex items-center">
                <FaTag className="mr-2" />
                {thought.category}
              </div>
            </div>
          </div>

          {/* Featured Image */}
          {thought.image && (
            <div className="relative h-64 sm:h-96">
              <img
                src={thought.image}
                alt={thought.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Content */}
          <div className="p-6">
            <div className="prose dark:prose-invert max-w-none">
              {thought.content}
            </div>

            {/* Tags */}
            {thought.tags && thought.tags.length > 0 && (
              <div className="mt-8">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {thought.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ThoughtClient;
