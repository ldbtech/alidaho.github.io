"use client";
import Link from "next/link";
import { motion } from "framer-motion";

const NavLink = ({ href, title }) => {
    return (
        <Link href={href}>
            <motion.span
                className="block py-2 pl-3 pr-4 text-[#ADB7BE] sm:text-xl rounded md:p-0 hover:text-white relative group"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
                {title}
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-primary-400 to-secondary-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
            </motion.span>
        </Link>
    );
};

export default NavLink;