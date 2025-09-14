"use client";
import Link from "next/link";
import { motion } from "framer-motion";

const NavLink = ({ href, title }) => {
    return (
        <Link href={href}>
            <motion.span
                className="relative text-secondary hover:text-primary font-medium transition-apple group"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
            >
                {title}
                <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-accent transform scale-x-0 group-hover:scale-x-100 transition-apple" />
            </motion.span>
        </Link>
    );
};

export default NavLink;