"use client";
import React, { useState, useRef } from "react";
import ProjectCard from "./ProjectCard";
import ProjectTag from "./ProjectTag";
import { motion, useInView } from "framer-motion";

const projectsData = [
    {
        id: 1,
        title: "iOS App - Social Media",
        description: "Flikor, is an app to make it easy for students to find roommates.",
        image: "/images/ios-v2.png",
        tag: ["All", "iOS"],
        gitUrl: "https://github.com/ldbtech/Flikor_Continues",
        previewUrl: "/",
    },
    {
        id: 2,
        title: "Rienforcement Learing Agent Play Tic Tac Toe",
        description: "I used Deep Q-LEARNING to create an agent that can play tic tac toe. ",
        image: "/images/tictactoe.jpeg",
        tag: ["All", "AI"],
        gitUrl: "/",
        previewUrl: "/",
    },
    {
        id: 3,
        title: "Soccer Player Position Prediction",
        description: "This project is about predicting players positions in soccer matches based on their previous performance.",
        image: "/images/football.jpeg",
        tag: ["All", "AI"],
        gitUrl: "/",
        previewUrl: "/",
    },
    {
        id: 4,
        title: "Food Ordering Web Application",
        description: "Build a food delivery web application, enabling users to browse restaurants, " +
            "place orders, and track deliveries in real-time.",
        image: "/images/food-delivery.jpeg",
        tag: ["All", "Java"],
        gitUrl: "/",
        previewUrl: "/",
    },
    {
        id: 5,
        title: "NS-3 Simulator",
        description: "- The project involves experimenting with the NS-3 Simulator on Linux Ubuntu, completing a total of four tasks.\n" +
            "- Implemented and reviewed networking concepts such as routing, congestion control, delays, and network Quality of Service (QoS) parameters.",
        image: "/images/ns3-sim.jpeg",
        tag: ["All", "C/C++"],
        gitUrl: "/",
        previewUrl: "/",
    },
    {
        id: 6,
        title: "Handwriting Recognition",
        description: "\n" +
            "Handwritten Digits Classification\n" +
            "Handwritten Digits Classification\n" +
            "Jul 2022 - Aug 2022Jul 2022 - Aug 2022\n" +
            "\n" +
            "Associated with University at Buffalo\n" +
            "Associated with University at Buffalo\n" +
            "• Built a neural network using python and no usage of external libraries, model accuracy on the MNIST Dataset was 82.4%. \n" +
            "• Deployed a deep neural network model using TensorFlow and Python for classifying the MNIST dataset following AlexNet Architecture. " +
            "The model was successfully getting an accuracy of 98.2% on the test set.",
        image: "/images/handwriting-detection.jpeg",
        tag: ["All", "AI"],
        gitUrl: "/",
        previewUrl: "/",
    },
    {
        id: 7,
        title: "TCP/UDP Text Chat",
        description: "Built text chat application using TCP and UDP protocols.",
        image: "/images/tcp-ip.jpeg",
        tag: ["All", "C/C++"],
        gitUrl: "/",
        previewUrl: "/",
    },

    {
        id: 8,
        title: "Conway's Game of Life Simulation",
        description: "Created a simulation of Conway's Game of Life, a cellular automaton " +
            "that models the evolution of cells in a 2D grid based on a set of rules.",
        image: "/images/conways-game.png",
        tag: ["All", "C/C++"],
        gitUrl: "/",
        previewUrl: "/",
    },
    {
        id: 9,
        title: "Face Detection - Image Processing",
        description: "Performed Face Detection using OpenCV and Python; used multiple facial detection algorithms like Haar Cascade, " +
            "Deep Neural Network, and HOG. " +
            "The F1 score of each algorithm was calculated by using the result JSON file to select the best algorithm. ",
        image: "/images/face-detection.png",
        tag: ["All", "AI"],
        gitUrl: "https://github.com/ldbtech/FaceDetection.git",
        previewUrl: "/",
    },
];

const ProjectsSection = () => {
    const [tag, setTag] = useState("All");
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });

    const handleTagChange = (newTag) => {
        setTag(newTag);
    };

    const filteredProjects = projectsData.filter((project) =>
        project.tag.includes(tag)
    );

    const cardVariants = {
        initial: { y: 50, opacity: 0 },
        animate: { y: 0, opacity: 1 },
    };

    return (
        <section id="projects">
            <h2 className="text-center text-4xl font-bold text-white mt-4 mb-8 md:mb-12">
                My Projects
            </h2>
            <div className="text-white flex flex-row justify-center items-center gap-2 py-6">
                <ProjectTag
                    onClick={handleTagChange}
                    name="All"
                    isSelected={tag === "All"}
                />
                <ProjectTag
                    onClick={handleTagChange}
                    name="AI"
                    isSelected={tag === "AI"}
                />
                <ProjectTag
                    onClick={handleTagChange}
                    name="iOS"
                    isSelected={tag === "iOS"}
                />
                <ProjectTag
                    onClick={handleTagChange}
                    name="Java"
                    isSelected={tag === "Java"}
                />
                <ProjectTag
                    onClick={handleTagChange}
                    name="C/C++"
                    isSelected={tag === "C/C++"}
                />
            </div>
            <ul ref={ref} className="grid md:grid-cols-3 gap-8 md:gap-12">
                {filteredProjects.map((project, index) => (
                    <motion.li
                        key={index}
                        variants={cardVariants}
                        initial="initial"
                        animate={isInView ? "animate" : "initial"}
                        transition={{ duration: 0.3, delay: index * 0.4 }}
                    >
                        <ProjectCard
                            key={project.id}
                            title={project.title}
                            description={project.description}
                            imgUrl={project.image}
                            gitUrl={project.gitUrl}
                            previewUrl={project.previewUrl}
                        />
                    </motion.li>
                ))}
            </ul>
        </section>
    );
};

export default ProjectsSection;