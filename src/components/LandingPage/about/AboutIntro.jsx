import React, { useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { FaArrowDown } from "react-icons/fa";
import Button from "../ui/Button";

const AboutIntro = ({ translation, isActive, onScrollToNext }) => {
  const [isVisible, setIsVisible] = useState(false);

  // Scroll progress tracking for parallax
  const { scrollYProgress } = useScroll();
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "-20%"]);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative flex items-center justify-center h-full">
      {/* Enhanced Animated Background */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900"
        style={{ y: backgroundY }}
      >
        <div className="absolute inset-0 bg-black/50"></div>
        
        {/* Enhanced floating particles */}
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-orange-400 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 1, 0.2],
              scale: [0.5, 1, 0.5]
            }}
            transition={{
              duration: 4 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 3
            }}
          />
        ))}
      </motion.div>

      {/* Enhanced Content */}
      <motion.div
        className="relative z-10 max-w-5xl mx-auto text-center px-6"
        style={{ y: textY }}
      >
        <motion.h2
          className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 50 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {translation.title}
        </motion.h2>
        
        <motion.p
          className="text-xl md:text-2xl text-gray-300 leading-relaxed mb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 30 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          {translation.description}
        </motion.p>
        
        <motion.p
          className="text-lg text-gray-400 leading-relaxed mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          {translation.subtitle}
        </motion.p>

        {/* Enhanced scroll hint */}
        <motion.div
          className="flex flex-col items-center space-y-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: isVisible ? 1 : 0 }}
          transition={{ duration: 0.8, delay: 1 }}
        >
          <span className="text-orange-400 text-sm font-medium">
            {translation.scrollHint}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={onScrollToNext}
            icon={<FaArrowDown />}
            className="animate-bounce"
          >
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default AboutIntro;