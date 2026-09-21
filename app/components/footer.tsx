"use client";
import { motion } from "motion/react";
const footer = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
      className="flex flex-col py-4 justify-between w-full border-t border-t-sky-500/30 bg-transparent  items-center px-10 sm:px-20 lg:px-25"
    >
      <p>Copyright 2026 AI Website Builder </p>
      <div className="flex flex-wrap gap-1.5">
        <p>Facebook</p>
        <p>Instagram</p>
        <p>LinkedIn</p>
        <p>GitHub</p>
      </div>
    </motion.div>
  );
};
export default footer;
