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

const ExtracurricularAndAchievementSection = () => {
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
            metric: "Years of Experience",
            value: "1",
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
        <div className="py-6 sm:py-8 lg:py-16 px-4 sm:px-6 lg:px-8 xl:px-16">
            <div className="border-[#33353F] border rounded-md py-6 sm:py-8 px-4 sm:px-8 lg:px-16 flex flex-col sm:flex-row items-center justify-between gap-6 sm:gap-4">
                {achievements.map((achievement) => (
                    <div
                        key={achievement.id}
                        className="flex flex-col items-center justify-center text-center"
                    >
                        <h2 className="text-white text-2xl sm:text-3xl lg:text-4xl font-bold flex flex-row items-center gap-1">
                            {achievement.prefix}
                            <AnimatedNumbers
                                includeComma
                                animateToNumber={parseInt(achievement.value)}
                                locale="en-US"
                                className="text-white text-2xl sm:text-3xl lg:text-4xl font-bold"
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
                        <p className="text-[#ADB7BE] text-sm sm:text-base mt-1">{achievement.metric}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ExtracurricularAndAchievementSection;