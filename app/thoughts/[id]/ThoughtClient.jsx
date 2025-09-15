'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { FaArrowLeft, FaCalendarAlt, FaTag } from 'react-icons/fa';

const ThoughtClient = ({ thought }) => {
  return (
    <div className="min-h-screen bg-[#121212] text-white">
      {/* Navigation */}
      <div className="border-b border-gray-800">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <Link 
            href="/thoughts"
            className="inline-flex items-center text-gray-400 hover:text-white transition-colors"
          >
            <FaArrowLeft className="mr-2" />
            Back to Thoughts
          </Link>
        </div>
      </div>

      {/* Article Header */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="prose prose-invert prose-lg max-w-none"
        >
          {/* Article Title */}
          <header className="mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
              {thought.title}
            </h1>
            
            {/* Article Meta */}
            <div className="flex flex-wrap items-center gap-6 text-gray-400 mb-8">
              <div className="flex items-center">
                <FaCalendarAlt className="mr-2" />
                <time>{new Date(thought.date).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}</time>
              </div>
              <div className="flex items-center">
                <FaTag className="mr-2" />
                <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm">
                  {thought.category}
                </span>
              </div>
            </div>

            {/* Featured Image */}
            {thought.image && (
              <div className="relative w-full h-64 md:h-96 mb-12 rounded-lg overflow-hidden">
                <img
                  src={thought.image}
                  alt={thought.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </header>

          {/* Article Content */}
          <div className="article-content">
            <div 
              className="prose prose-invert prose-lg max-w-none leading-relaxed"
              style={{
                fontSize: '1.125rem',
                lineHeight: '1.75',
                color: '#e5e7eb'
              }}
            >
              {thought.content.split('\n').map((paragraph, index) => {
                if (paragraph.trim() === '') return <br key={index} />;
                
                // Check if it's a heading (starts with I., II., III., etc. or is all caps)
                if (paragraph.match(/^[IVX]+\./) || paragraph.match(/^[A-Z\s]+:$/)) {
                  return (
                    <h2 key={index} className="text-2xl font-bold text-white mt-8 mb-4 first:mt-0">
                      {paragraph}
                    </h2>
                  );
                }
                
                // Check if it's a subheading (starts with specific patterns)
                if (paragraph.match(/^[A-Z][a-z\s]+:$/) && paragraph.length < 50) {
                  return (
                    <h3 key={index} className="text-xl font-semibold text-blue-400 mt-6 mb-3">
                      {paragraph}
                    </h3>
                  );
                }
                
                // Regular paragraph
                return (
                  <p key={index} className="mb-6 text-gray-300">
                    {paragraph}
                  </p>
                );
              })}
            </div>
          </div>

          {/* Tags */}
          {thought.tags && thought.tags.length > 0 && (
            <footer className="mt-16 pt-8 border-t border-gray-800">
              <h3 className="text-lg font-semibold text-white mb-4">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {thought.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 bg-gray-800 text-gray-300 rounded-full text-sm hover:bg-gray-700 transition-colors"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </footer>
          )}
        </motion.article>
      </div>
    </div>
  );
};

export default ThoughtClient;
