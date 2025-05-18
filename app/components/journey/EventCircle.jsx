// EventCircle.jsx
import { motion } from 'framer-motion';
import { useState } from 'react';
import { FaTimes } from 'react-icons/fa';

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

const EventCircle = ({ event, onClose }) => {
  return (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-gray-900 rounded-lg p-6 w-full max-w-md border border-gray-800"
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.8 }}
      >
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-3">
            <div className={`w-12 h-12 rounded-full ${getStatusColor(event.status)} flex items-center justify-center`}>
              {event.icon}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-blue-400">{event.title}</h2>
              <p className="text-gray-400">{event.category}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <FaTimes className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <p className="text-gray-300">{event.description}</p>

          {Object.entries(event.details).map(([key, value]) => (
            <div key={key} className="border-t border-gray-800 pt-4">
              <h3 className="text-blue-400 font-semibold capitalize mb-2">
                {key.replace(/([A-Z])/g, ' $1')}
              </h3>
              {Array.isArray(value) ? (
                <ul className="list-disc list-inside text-gray-300">
                  {value.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-300">{value}</p>
              )}
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default EventCircle;