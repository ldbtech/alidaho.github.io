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
            className="grid grid-cols-1 lg:grid-cols-2 my-8 sm:my-12 py-12 sm:py-16 lg:py-24 gap-8 lg:gap-4 relative px-4 sm:px-6"
        >
            <div className="bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary-900 to-transparent rounded-full h-60 w-60 sm:h-80 sm:w-80 z-0 blur-lg absolute top-3/4 -left-4 transform -translate-x-1/2 -translate-1/2"></div>
            <div className="z-10">
                <h5 className="text-lg sm:text-xl font-bold text-white my-2">
                    Let&apos;s Connect
                </h5>
                <p className="text-gray-300 mb-4 max-w-md text-sm sm:text-base">
                    I&apos;m currently looking for new opportunities, my inbox is always
                    open. Whether you have a question or just want to say hi, I&apos;ll
                    try my best to get back to you!
                </p>
                <div className="socials flex flex-row gap-3">
                    <Link href="https://github.com/ldbtech" target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition-transform">
                        <Image src={GithubIcon} alt="Github Icon" className="w-8 h-8 sm:w-10 sm:h-10" />
                    </Link>
                    <Link href="https://www.linkedin.com/in/alidaho/" target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition-transform">
                        <Image src={LinkedinIcon} alt="Linkedin Icon" className="w-8 h-8 sm:w-10 sm:h-10" />
                    </Link>
                </div>
            </div>
            <div className="z-10">
                {emailSubmitted ? (
                    <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                        <p className="text-green-500 text-center text-sm sm:text-base">
                            Thank you for your message! I&apos;ll get back to you soon.
                        </p>
                    </div>
                ) : (
                    <form ref={formRef} className="flex flex-col space-y-4 sm:space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label
                                htmlFor="name"
                                className="text-white block mb-2 text-sm font-medium"
                            >
                                Your name
                            </label>
                            <input
                                name="name"
                                type="text"
                                id="name"
                                required
                                className="bg-[#18191E] border border-[#33353F] placeholder-[#9CA2A9] text-gray-100 text-sm rounded-lg block w-full p-3"
                                placeholder="Your Name"
                            />
                        </div>
                        <div>
                            <label
                                htmlFor="email"
                                className="text-white block mb-2 text-sm font-medium"
                            >
                                Your email
                            </label>
                            <input
                                name="email"
                                type="email"
                                id="email"
                                required
                                className="bg-[#18191E] border border-[#33353F] placeholder-[#9CA2A9] text-gray-100 text-sm rounded-lg block w-full p-3"
                                placeholder="example@domain.com"
                            />
                        </div>
                        <div>
                            <label
                                htmlFor="subject"
                                className="text-white block text-sm mb-2 font-medium"
                            >
                                Subject
                            </label>
                            <input
                                name="subject"
                                type="text"
                                id="subject"
                                required
                                className="bg-[#18191E] border border-[#33353F] placeholder-[#9CA2A9] text-gray-100 text-sm rounded-lg block w-full p-3"
                                placeholder="Just saying hi"
                            />
                        </div>
                        <div>
                            <label
                                htmlFor="message"
                                className="text-white block text-sm mb-2 font-medium"
                            >
                                Message
                            </label>
                            <textarea
                                name="message"
                                id="message"
                                required
                                className="bg-[#18191E] border border-[#33353F] placeholder-[#9CA2A9] text-gray-100 text-sm rounded-lg block w-full p-3 resize-none"
                                placeholder="Let's talk about..."
                                rows="4"
                            />
                        </div>
                        {error && (
                            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                                <p className="text-red-500 text-sm">{error}</p>
                            </div>
                        )}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`bg-primary-500 hover:bg-primary-600 text-white font-medium py-3 px-5 rounded-lg w-full transition-all duration-300 text-sm sm:text-base ${
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