"use client";
import React from "react";
import Image from "next/image";
import { TypeAnimation } from "react-type-animation";
import { motion } from "framer-motion";
import Link from "next/link";
import { FaGithub, FaLinkedin } from "react-icons/fa";

const HeroSections = () => {
    const basePath = process.env.NODE_ENV === 'production' ? '/alidaho.github.io' : '';
    
    return (
        <section className="lg:py-16">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="col-span-7 place-self-center text-center sm:text-left"
                >
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-4">
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
                            Hello, I&apos;m{" "}
                        </span>
                        <br />
                        <TypeAnimation
                            sequence={[
                                "Ali Dahou",
                                1000,
                                "Software Engineer",
                                1000,
                                "Full Stack Developer",
                                1000,
                                "UI/UX Designer",
                                1000,
                            ]}
                            wrapper="span"
                            speed={50}
                            repeat={Infinity}
                            className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-400"
                        />
                    </h1>
                    <p className="text-[#ADB7BE] text-base sm:text-lg lg:text-xl mb-6">
                        I build exceptional digital experiences that make an impact. Specializing in creating
                        elegant solutions to complex problems through clean, efficient code and intuitive design.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center sm:justify-start">
                        <Link
                            href="/contact"
                            className="px-6 py-3 w-full sm:w-fit rounded-full mr-4 bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 text-white font-bold transition-all duration-300 shadow-lg hover:shadow-xl"
                        >
                            Hire Me
                        </Link>
                        <Link
                            href="https://github.com/alidaho"
                            target="_blank"
                            className="px-6 py-3 w-full sm:w-fit rounded-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                        >
                            <FaGithub className="text-xl" />
                            GitHub
                        </Link>
                        <Link
                            href="https://linkedin.com/in/alidaho"
                            target="_blank"
                            className="px-6 py-3 w-full sm:w-fit rounded-full bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white font-bold transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                        >
                            <FaLinkedin className="text-xl" />
                            LinkedIn
                        </Link>
                    </div>
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="col-span-5 mt-4 lg:mt-0"
                >
                    <div className="rounded-full bg-[#181818] w-[250px] h-[250px] lg:w-[400px] lg:h-[400px] relative mx-auto">
                        <Image
                            src={`${basePath}/public/images/Image.jpg`}
                            alt="hero image"
                            className="absolute transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 rounded-full"
                            width={400}
                            height={400}
                            style={{ objectFit: "cover" }}
                        />
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default HeroSections;