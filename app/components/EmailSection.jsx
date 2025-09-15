"use client";
import React, { useState, useRef, useEffect } from "react";
import GithubIcon from "../../public/github-icon.svg";
import LinkedinIcon from "../../public/linkedin-icon.svg";
import Link from "next/link";
import Image from "next/image";
import emailjs from '@emailjs/browser';

const EmailSection = () => {
    const [emailSubmitted, setEmailSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const formRef = useRef();

    useEffect(() => {
        // Initialize EmailJS with your public key
        emailjs.init("6iPziy_x_pJRzimF_");
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            const result = await emailjs.sendForm(
                "service_xxxxx", // Replace with your service ID
                "template_xxxxx", // Replace with your template ID
                formRef.current,
                "6iPziy_x_pJRzimF_"
            );

            if (result.text === 'OK') {
                setEmailSubmitted(true);
                e.target.reset();
            } else {
                throw new Error('Failed to send email');
            }
        } catch (error) {
            console.error('Error sending email:', error);
            setError("Failed to send message. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <section
            id="contact"
            className="grid grid-cols-1 lg:grid-cols-2 my-8 sm:my-12 py-12 sm:py-16 lg:py-24 gap-8 lg:gap-4 relative px-4 sm:px-6 text-gray-900 dark:text-gray-100"
        >
            <div className="hidden dark:block bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary-900 to-transparent rounded-full h-60 w-60 sm:h-80 sm:w-80 z-0 blur-lg absolute top-3/4 -left-4 transform -translate-x-1/2 -translate-1/2"></div>
            <div className="z-10">
                <h5 className="text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight text-primary my-2">
                    Let&apos;s Connect
                </h5>
                <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-xl text-base sm:text-lg leading-relaxed">
                    I&apos;m currently looking for new opportunities, my inbox is always
                    open. Whether you have a question or just want to say hi, I&apos;ll
                    try my best to get back to you!
                </p>
                <div className="socials flex flex-row gap-3">
                    <Link href="https://github.com/ldbtech" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-full border border-gray-200 dark:border-gray-700 bg-transparent hover:bg-gray-100 dark:hover:bg-white/5 transition-colors">
                        <Image src={GithubIcon} alt="Github Icon" className="w-5 h-5 sm:w-6 sm:h-6 invert dark:invert-0" />
                    </Link>
                    <Link href="https://www.linkedin.com/in/alidaho/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-full border border-gray-200 dark:border-gray-700 bg-transparent hover:bg-gray-100 dark:hover:bg-white/5 transition-colors">
                        <Image src={LinkedinIcon} alt="Linkedin Icon" className="w-5 h-5 sm:w-6 sm:h-6 invert dark:invert-0" />
                    </Link>
                </div>
            </div>
            <div className="z-10">
                {emailSubmitted ? (
                    <div className="bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 rounded-2xl p-4 sm:p-5">
                        <p className="text-green-700 dark:text-green-400 text-center text-sm sm:text-base">
                            Thank you for your message! I&apos;ll get back to you soon.
                        </p>
                    </div>
                ) : (
                    <form
                        ref={formRef}
                        className="flex flex-col space-y-5 sm:space-y-6 bg-white dark:bg-transparent border border-gray-200 dark:border-[#33353F] rounded-3xl p-5 sm:p-7 shadow-sm"
                        onSubmit={handleSubmit}
                    >
                        <div>
                            <label
                                htmlFor="name"
                                className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-100"
                            >
                                Your Name
                            </label>
                            <input
                                name="name"
                                type="text"
                                id="name"
                                required
                                className="bg-gray-50 dark:bg-[#18191E] border border-gray-200 dark:border-[#33353F] text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-[#9CA2A9] text-base rounded-2xl block w-full p-4 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-colors"
                                placeholder="Your Name"
                            />
                        </div>
                        <div>
                            <label
                                htmlFor="email"
                                className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-100"
                            >
                                Your email
                            </label>
                            <input
                                name="email"
                                type="email"
                                id="email"
                                required
                                className="bg-gray-50 dark:bg-[#18191E] border border-gray-200 dark:border-[#33353F] text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-[#9CA2A9] text-base rounded-2xl block w-full p-4 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-colors"
                                placeholder="example@domain.com"
                            />
                        </div>
                        <div>
                            <label
                                htmlFor="subject"
                                className="block text-sm mb-2 font-medium text-gray-900 dark:text-gray-100"
                            >
                                Subject
                            </label>
                            <input
                                name="subject"
                                type="text"
                                id="subject"
                                required
                                className="bg-gray-50 dark:bg-[#18191E] border border-gray-200 dark:border-[#33353F] text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-[#9CA2A9] text-base rounded-2xl block w-full p-4 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-colors"
                                placeholder="Just saying hi"
                            />
                        </div>
                        <div>
                            <label
                                htmlFor="message"
                                className="block text-sm mb-2 font-medium text-gray-900 dark:text-gray-100"
                            >
                                Message
                            </label>
                            <textarea
                                name="message"
                                id="message"
                                required
                                className="bg-gray-50 dark:bg-[#18191E] border border-gray-200 dark:border-[#33353F] text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-[#9CA2A9] text-base rounded-2xl block w-full p-4 resize-none shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-colors"
                                placeholder="Let's talk about..."
                                rows="4"
                            />
                        </div>
                        {error && (
                            <div className="p-3 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-2xl">
                                <p className="text-red-700 dark:text-red-500 text-sm">{error}</p>
                            </div>
                        )}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`bg-black dark:bg-primary-500 hover:bg-black/90 dark:hover:bg-primary-600 text-white font-medium py-3.5 px-6 rounded-full w-full transition-all duration-300 text-sm sm:text-base shadow-sm ring-1 ring-black/10 dark:ring-0 ${
                                isLoading ? "opacity-50 cursor-not-allowed" : ""
                            }`}
                        >
                            {isLoading ? "Sending..." : "Send Message"}
                        </button>
                    </form>
                )}
            </div>
        </section>
    );
};

export default EmailSection;