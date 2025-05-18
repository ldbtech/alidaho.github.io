// DayCircle.jsx
'use client';

import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { useState, useEffect } from 'react';
import { FaAtom, FaPlus, FaTimes } from 'react-icons/fa';
import EventCircle from './EventCircle'; // Import the new component

const EventOrbit = ({ event, index, totalEvents, isExpanded, onEventClick }) => {
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0, y: 0 }}
      animate={{ 
        scale: isExpanded ? 1 : 0,
        opacity: isExpanded ? 1 : 0,
        y: isExpanded ? 40 + (index * 40) : 0, // Stack events vertically below
      }}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 20,
        delay: index * 0.1
      }}
      className="absolute z-20"
      style={{
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
      }}
    >
      <motion.div
        whileHover={{ scale: 1.2 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => onEventClick(event)}
        className={`w-8 h-8 rounded-full ${event.status === 'completed' ? 'bg-green-500' : 
          event.status === 'in-progress' ? 'bg-blue-500 animate-pulse' : 
          event.status === 'planned' ? 'bg-yellow-500' : 'bg-gray-500'} 
          flex items-center justify-center cursor-pointer
          shadow-lg hover:shadow-xl transition-shadow
          ${isExpanded ? 'hover:ring-4 hover:ring-blue-500/50' : ''}`}
      >
        {event.icon}
      </motion.div>
    </motion.div>
  );
};

const DayCircle = ({ date, events, onDateClick }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const controls = useAnimation();

  useEffect(() => {
    if (isExpanded) {
      controls.start({
        scale: [1, 1.2, 1],
        transition: { duration: 0.5 }
      });
    }
  }, [isExpanded, controls]);

  const handleCircleClick = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="relative flex flex-col items-center">
      {/* Date Label */}
      <div className="text-xs md:text-sm text-gray-400 mb-2 md:mb-4">
        {date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
      </div>

      {/* Main Circle Container */}
      <div className="relative w-16 h-16 md:w-24 md:h-24">
        {/* Main Circle */}
        <motion.div
          animate={controls}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleCircleClick}
          onHoverStart={() => setIsHovered(true)}
          onHoverEnd={() => setIsHovered(false)}
          className={`w-12 h-12 md:w-16 md:h-16 rounded-full ${events.length > 0 ? 'bg-blue-500' : 'bg-gray-700'} 
            flex items-center justify-center cursor-pointer relative z-30
            ${events.length > 0 ? 'hover:ring-4 hover:ring-blue-500/50' : ''}
            shadow-lg hover:shadow-xl transition-all duration-300`}
        >
          {events.length > 0 ? (
            <motion.div
              animate={{ rotate: isHovered ? 360 : 0 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <FaAtom className="w-6 h-6 md:w-8 md:h-8 text-white" />
            </motion.div>
          ) : (
            <FaPlus className="w-4 h-4 md:w-6 md:h-6 text-gray-400" />
          )}
        </motion.div>

        {/* Event Orbits */}
        {events.map((event, index) => (
          <EventOrbit
            key={event.id}
            event={event}
            index={index}
            totalEvents={events.length}
            isExpanded={isExpanded}
            onEventClick={setSelectedEvent}
          />
        ))}
      </div>

      {/* Event Details Modal */}
      <AnimatePresence>
        {selectedEvent && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50 overflow-y-auto"
          >
            <motion.div
              initial={{ y: 50 }}
              animate={{ y: 0 }}
              exit={{ y: 50 }}
              className="bg-gray-900 rounded-lg p-4 md:p-6 w-full max-w-md border border-gray-800 my-4 md:my-8"
            >
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full ${
                    selectedEvent.status === 'completed' ? 'bg-green-500' : 
                    selectedEvent.status === 'in-progress' ? 'bg-blue-500 animate-pulse' : 
                    selectedEvent.status === 'planned' ? 'bg-yellow-500' : 'bg-gray-500'
                  } flex items-center justify-center`}>
                    {selectedEvent.icon}
                  </div>
                  <div>
                    <h2 className="text-xl md:text-2xl font-bold text-blue-400">{selectedEvent.title}</h2>
                    <p className="text-sm md:text-base text-gray-400">{selectedEvent.category}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedEvent(null)}
                  className="text-gray-400 hover:text-white"
                >
                  <FaTimes className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4 overflow-y-auto max-h-[60vh]">
                <div className="prose prose-invert max-w-none">
                  <p className="text-sm md:text-base text-gray-300 leading-relaxed">{selectedEvent.description}</p>
                </div>
                
                {Object.entries(selectedEvent.details).map(([key, value]) => (
                  <div key={key} className="border-t border-gray-800 pt-4">
                    <h3 className="text-sm md:text-base text-blue-400 font-semibold capitalize mb-2 flex items-center gap-2">
                      {key === 'technologies' && '🛠️'}
                      {key === 'achievements' && '🏆'}
                      {key === 'notes' && '📝'}
                      {key === 'links' && '🔗'}
                      {key.replace(/([A-Z])/g, ' $1')}
                    </h3>
                    {Array.isArray(value) ? (
                      <ul className="list-none space-y-2">
                        {value.map((item, index) => (
                          <li key={index} className="flex items-center gap-2 text-sm md:text-base text-gray-300">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
                            {key === 'links' ? (
                              <a 
                                href={item} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-blue-400 hover:text-blue-300 underline transition-colors"
                              >
                                {item}
                              </a>
                            ) : (
                              item
                            )}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm md:text-base text-gray-300 leading-relaxed">{value}</p>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DayCircle;