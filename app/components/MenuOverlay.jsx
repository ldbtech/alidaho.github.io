"use client";
import React from "react";
import NavLink from "./NavLink";
import { motion } from "framer-motion";

const MenuOverlay = ({ links }) => {
    return (
        <motion.ul 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col py-4 items-center bg-[#121212] bg-opacity-95 backdrop-blur-sm"
        >
            {links.map((link, index) => (
                <motion.li 
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="w-full text-center"
                >
                    <NavLink href={link.path} title={link.title} />
                </motion.li>
            ))}
        </motion.ul>
    );
};

export default MenuOverlay;