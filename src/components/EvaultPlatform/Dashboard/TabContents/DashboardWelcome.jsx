
import React from "react";
import { motion } from "framer-motion";

const TabContent = () => {
  return (
    <div className="relative overflow-hidden rounded-lg shadow-sm">
      {/* Background with proper responsive handling */}
      <div
        className="relative min-h-[200px] md:min-h-[250px] bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('https://picsum.photos/1200/400?blue')",
        }}
      >
        {/* Overlay for dark, blurry effect */}
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>

        {/* Content container with proper spacing */}
        <div className="relative z-10 p-6 md:p-8 flex flex-col justify-center h-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-4"
          >
            <h4 className="text-xl md:text-2xl lg:text-3xl font-bold text-white font-ubuntu">
              Welcome to eVault Dashboard!
            </h4>
            
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
              className="text-sm md:text-base lg:text-lg text-gray-200 font-ubuntu max-w-2xl leading-relaxed"
            >
              Here you can manage your accounts, make payments, and access all the services we offer. 
              Your financial management hub designed for security and convenience.
            </motion.p>

            {/* Quick action buttons for mobile responsiveness */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
              className="flex flex-wrap gap-3 mt-6"
            >
              <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                <span className="text-white text-sm font-medium">💳 Secure Payments</span>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                <span className="text-white text-sm font-medium">🔒 Bank-Grade Security</span>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2 hidden md:block">
                <span className="text-white text-sm font-medium">📱 24/7 Access</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default TabContent;
