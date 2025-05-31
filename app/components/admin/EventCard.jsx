'use client';

import { motion } from 'framer-motion';

const EventCard = ({ event, onEdit, onDelete }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500';
      case 'in-progress':
        return 'bg-yellow-500';
      default:
        return 'bg-blue-500';
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'Professional':
        return 'bg-purple-500';
      case 'Personal':
        return 'bg-pink-500';
      case 'Education':
        return 'bg-indigo-500';
      case 'Project':
        return 'bg-orange-500';
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
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-semibold text-white mb-2">{event.title}</h3>
          <div className="flex gap-2">
            <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(event.status)}`}>
              {event.status}
            </span>
            <span className={`px-2 py-1 rounded-full text-xs ${getCategoryColor(event.category)}`}>
              {event.category}
            </span>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(event)}
            className="p-2 text-gray-400 hover:text-white transition-colors"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(event.id)}
            className="p-2 text-red-400 hover:text-red-300 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>

      <p className="text-gray-300 mb-4">{event.description}</p>

      <div className="text-sm text-gray-400">
        <p>Date: {new Date(event.date).toLocaleDateString()}</p>
        {event.details?.technologies?.length > 0 && (
          <div className="mt-2">
            <p className="text-gray-300 mb-1">Technologies:</p>
            <div className="flex flex-wrap gap-2">
              {event.details.technologies.map((tech, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-[#2A2A2A] rounded-full text-xs"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        )}
        {event.details?.notes && (
          <div className="mt-2">
            <p className="text-gray-300 mb-1">Notes:</p>
            <p className="text-gray-400">{event.details.notes}</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default EventCard; 