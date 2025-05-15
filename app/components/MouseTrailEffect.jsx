"use client";
import React, { useEffect, useState, useRef } from 'react';

const MouseTrailEffect = () => {
    const [columns, setColumns] = useState([]);
    const containerRef = useRef(null);
    const columnWidth = 20; // Width of each column
    const speed = 50; // Speed of falling characters

    // Generate random binary string
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
                startDelay: Math.random() * 2000, // Random start delay
                speed: Math.random() * 30 + 20, // Random speed between 20-50
                opacity: 0.5 // Increased base opacity
            }));
            
            setColumns(newColumns);
        };

        const handleMouseMove = (e) => {
            const mouseX = e.clientX;
            const mouseY = e.clientY;
            
            setColumns(prev => prev.map(column => {
                const distanceX = Math.abs(column.x - mouseX);
                const distanceY = Math.abs(mouseY - (column.startDelay % window.innerHeight));
                
                // Calculate if column should be more visible based on distance from cursor
                const shouldBeVisible = distanceX <= columnWidth * 3;
                
                return {
                    ...column,
                    opacity: shouldBeVisible ? 0.9 : 0.5 // Increased highlight opacity
                };
            }));
        };

        initializeColumns();
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('resize', initializeColumns);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('resize', initializeColumns);
        };
    }, []);

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
                    className="absolute transition-opacity duration-300"
                    style={{
                        left: column.x,
                        top: 0,
                        width: columnWidth,
                        height: '100vh',
                        opacity: column.opacity,
                        animation: `matrixRain ${column.speed / 10}s linear infinite`,
                        animationDelay: `${column.startDelay}ms`
                    }}
                >
                    <div className="text-[#00ff00] text-sm leading-tight">
                        {column.text.split('').map((char, i) => (
                            <div
                                key={i}
                                className="transition-colors duration-300"
                                style={{
                                    opacity: 0.9 - (i * 0.05), // Increased base opacity
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