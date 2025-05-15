"use client";
import React, { useEffect, useState, useRef } from 'react';

const MouseTrailEffect = () => {
    const [columns, setColumns] = useState([]);
    const containerRef = useRef(null);
    const columnWidth = 20;
    const lastScrollY = useRef(0);
    const lastScrollTime = useRef(Date.now());
    const [scrollSpeed, setScrollSpeed] = useState(0);

    const generateBinaryString = (length) => {
        return Array.from({ length }, () => Math.random() > 0.5 ? '1' : '0').join('');
    };

    useEffect(() => {
        const initializeColumns = () => {
            if (!containerRef.current) return;
            
            const width = window.innerWidth;
            const height = window.innerHeight;
            const numColumns = Math.ceil(width / columnWidth);
            
            const newColumns = Array.from({ length: numColumns }, (_, i) => ({
                id: i,
                x: i * columnWidth,
                text: generateBinaryString(Math.floor(Math.random() * 20) + 10),
                startDelay: Math.random() * 2000,
                baseSpeed: Math.random() * 30 + 20, // Base speed for each column
                opacity: 0.5
            }));
            
            setColumns(newColumns);
        };

        const handleScroll = () => {
            const currentTime = Date.now();
            const currentScrollY = window.scrollY;
            const timeDiff = currentTime - lastScrollTime.current;
            const scrollDiff = Math.abs(currentScrollY - lastScrollY.current);
            
            // Calculate scroll speed (pixels per millisecond)
            const speed = scrollDiff / timeDiff;
            
            // Update scroll speed state with some smoothing
            setScrollSpeed(prev => prev * 0.7 + speed * 0.3);
            
            // Update last scroll position and time
            lastScrollY.current = currentScrollY;
            lastScrollTime.current = currentTime;
        };

        initializeColumns();
        window.addEventListener('scroll', handleScroll);
        window.addEventListener('resize', initializeColumns);

        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('resize', initializeColumns);
        };
    }, []);

    // Update column speeds based on scroll speed
    useEffect(() => {
        setColumns(prev => prev.map(column => ({
            ...column,
            currentSpeed: column.baseSpeed * (1 + scrollSpeed * 100) // Scale the speed based on scroll velocity
        })));
    }, [scrollSpeed]);

    return (
        <div 
            ref={containerRef}
            className="fixed inset-0 pointer-events-none z-[1] font-mono"
            style={{
                background: 'rgba(0, 0, 0, 0.5)',
                mixBlendMode: 'screen'
            }}
        >
            {columns.map((column) => (
                <div
                    key={column.id}
                    className="absolute transition-all duration-300"
                    style={{
                        left: column.x,
                        top: 0,
                        width: columnWidth,
                        height: '100vh',
                        opacity: column.opacity,
                        animation: `matrixRain ${column.currentSpeed ? column.currentSpeed / 10 : column.baseSpeed / 10}s linear infinite`,
                        animationDelay: `${column.startDelay}ms`
                    }}
                >
                    <div className="text-[#00ff00] text-sm leading-tight">
                        {column.text.split('').map((char, i) => (
                            <div
                                key={i}
                                className="transition-colors duration-300"
                                style={{
                                    opacity: 0.9 - (i * 0.05),
                                    color: i === 0 ? 'rgba(255, 255, 255, 1)' : 'rgba(0, 255, 0, 0.8)'
                                }}
                            >
                                {char}
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default MouseTrailEffect; 