"use client";
import React, { useTransition, useState } from "react";
import TabButton from "./TabButton";

const TAB_DATA = [
    {
        title: "Skills",
        id: "skills",
        content: (
            <ul className="list-disc pl-2">
                <li>Programming Languages: Python, Java, C/C++, Scala, Go</li>
                <li>AI: Pytorch, TensorFlow, Pandas, Matplotlib, Tableau, PowerBI</li>
                <li>Data Management: Snowflake, SQL, Spark, Haadop</li>
                <li>Hardware: Arduino, AC Controls, Assembly MIPS, Verilog</li>
                <li>Cloud: AWS, Google Cloud, Firebase</li>
                <li></li>
            </ul>
        ),
    },
    {
        title: "Education",
        id: "education",
        content: (
            <ul className="list-disc pl-2">
                <li>B.S in Computer Science - University at Buffalo - Buffalo, NY</li>
            </ul>
        ),
    },
    {
        title: "Certifications",
        id: "certifications",
        content: (
            <ul className="list-disc pl-2">
                <li>Coursera: Deep Learning Specialisation - DeepLearning.ai</li>
                <li>Coursera: Self-Driving Car - Toronto University</li>
                <li>Coursera: Java Programming Language - Duke University</li>
            </ul>
        ),
    },
];

const AboutSection = () => {
    const [tab, setTab] = useState("skills");
    const [isPending, startTransition] = useTransition();

    const handleTabChange = (id) => {
        startTransition(() => {
            setTab(id);
        });
    };

    return (
        <section className="text-white" id="about">
            <div className="md:grid md:grid-cols-2 gap-8 items-center py-8 px-4 xl:gap-16 sm:py-16 xl:px-16">
                <img 
                    src="/images/profile-portfolio.jpg" 
                    alt="Ali Dahou - Professional Portrait"
                    className="rounded-lg w-full h-auto"
                />
                <div className="mt-4 md:mt-0 text-left flex flex-col h-full">
                    <h2 className="text-4xl font-bold text-white mb-4">About Me</h2>
                    <p className="text-base lg:text-lg">
                        I am Computer Scientist student from University at Buffalo. I am passionate about building softwares that solves real
                        world problems. I have worked on variety of projects in the past that involve Artifial intelligence, iOS development, Data engineering,
                        Web develpment and Machine Learning.
                        I am currently working on LLM Project to make it easier for freelancers and customers to find each others.
                    </p>
                    <div className="flex flex-row justify-start mt-8">
                        <TabButton
                            selectTab={() => handleTabChange("skills")}
                            active={tab === "skills"}
                        >
                            {" "}
                            Skills{" "}
                        </TabButton>
                        <TabButton
                            selectTab={() => handleTabChange("education")}
                            active={tab === "education"}
                        >
                            {" "}
                            Education{" "}
                        </TabButton>
                        <TabButton
                            selectTab={() => handleTabChange("certifications")}
                            active={tab === "certifications"}
                        >
                            {" "}
                            Certifications{" "}
                        </TabButton>
                    </div>
                    <div className="mt-8">
                        {TAB_DATA.find((t) => t.id === tab).content}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AboutSection;