"use client";
import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { getVisitorCount, getProjectCount, incrementVisitorCount } from "../services/firebase";

const AnimatedNumbers = dynamic(
    () => {
        return import("react-animated-numbers");
    },
    { ssr: false }
);

const AchievementsSection = () => {
    const [achievements, setAchievements] = useState([
        {
            id: 1,
            metric: "Projects",
            value: "0",
            postfix: "+",
        },
        {
            id: 2,
            prefix: "~",
            metric: "Visitors Count",
            value: "0",
        },
        {
            id: 3,
            metric: "Years",
            value: "2",
        },
    ]);

    useEffect(() => {
        const loadCounts = async () => {
            try {
                // Increment visitor count
                await incrementVisitorCount();
                
                // Get current counts
                const [projectCount, visitorCount] = await Promise.all([
                    getProjectCount(),
                    getVisitorCount()
                ]);

                setAchievements(prev => prev.map(achievement => {
                    if (achievement.id === 1) {
                        return { ...achievement, value: projectCount.toString() };
                    }
                    if (achievement.id === 2) {
                        return { ...achievement, value: visitorCount.toString() };
                    }
                    return achievement;
                }));
            } catch (error) {
                console.error('Error loading counts:', error);
            }
        };

        loadCounts();
    }, []);

    return (
        <div className="py-8 px-4 xl:gap-16 sm:py-16 xl:px-16">
            <div className="sm:border-[#33353F] sm:border rounded-md py-8 px-16 flex flex-col sm:flex-row items-center justify-between">
                {achievements.map((achievement) => (
                    <div
                        key={achievement.id}
                        className="flex flex-col items-center justify-center mx-4 my-4 sm:my-0"
                    >
                        <h2 className="text-white text-4xl font-bold flex flex-row">
                            {achievement.prefix}
                            <AnimatedNumbers
                                includeComma
                                animateToNumber={parseInt(achievement.value)}
                                locale="en-US"
                                className="text-white text-4xl font-bold"
                                configs={(_, index) => {
                                    return {
                                        mass: 1,
                                        friction: 100,
                                        tensions: 140 * (index + 1),
                                    };
                                }}
                                key={`number-${achievement.id}`}
                            />
                            {achievement.postfix}
                        </h2>
                        <p className="text-[#ADB7BE] text-base">{achievement.metric}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AchievementsSection;