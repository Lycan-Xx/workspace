import React from "react";
import { motion } from "framer-motion";

const AboutNavigationDots = ({ totalSections, activeSection, onSectionClick, isScrolling }) => {
  return (
    <div className="fixed top-1/2 right-4 transform -translate-y-1/2 z-50 space-y-3">
      {[...Array(totalSections)].map((_, index) => (
        <motion.button
          key={index}
          onClick={() => onSectionClick(index)}
          className={`relative w-4 h-4 rounded-full transition-all duration-300 ${
            index === activeSection
              ? "bg-orange-500 scale-125 shadow-lg shadow-orange-500/50"
              : "bg-white/30 hover:bg-white/50"
          }`}
          whileHover={{ scale: 1.3 }}
          whileTap={{ scale: 0.9 }}
          disabled={isScrolling}
        >
          {index === activeSection && (
            <motion.div
              className="absolute inset-0 bg-orange-500 rounded-full"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3 }}
            />
          )}
        </motion.button>
      ))}
    </div>
  );
};

export default AboutNavigationDots;