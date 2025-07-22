import React, { useState } from "react";
import { motion } from "framer-motion";

const TabContent = () => {
  const [copied, setCopied] = useState(false);
  const accountNumber = "4321 8765 9012 5678";
  const bankName = "Metropolitan Trust Bank";

  const handleCopy = () => {
    navigator.clipboard.writeText(accountNumber.replace(/\s/g, ''));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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
            <motion.h4
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="text-lg md:text-xl font-medium text-gray-200 font-ubuntu"
            >
              {bankName}
            </motion.h4>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
              className="bg-black/50 backdrop-blur-md rounded-xl p-4 border border-gray-700 shadow-inner"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-xs text-gray-400 mb-1">Account Number</p>
                  <p 
                    className="text-xl md:text-2xl lg:text-3xl font-bold text-white tracking-wider"
                    style={{ fontFamily: "'Digital-7', 'DS-Digital', monospace" }}
                  >
                    {accountNumber.split('').map((char, index) => (
                      <span key={index} className={char !== ' ' ? 'text-cyan-300' : 'text-transparent'}>
                        {char}
                      </span>
                    ))}
                  </p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleCopy}
                  className="bg-white/10 hover:bg-white/20 p-3 rounded-lg transition-all"
                  aria-label="Copy account number"
                >
                  {copied ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-300" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                      <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                    </svg>
                  )}
                </motion.button>
              </div>
            </motion.div>

            {/* Additional account info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
              className="flex flex-wrap gap-3 mt-2"
            >
              <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                <span className="text-white text-sm font-medium">💳 Primary Account</span>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                <span className="text-white text-sm font-medium">🔒 Protected</span>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2 hidden md:block">
                <span className="text-white text-sm font-medium">📱 Mobile Banking Enabled</span>
              </div>
            </motion.div>

            {copied && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-green-800/90 text-white text-sm py-2 px-4 rounded-full"
              >
                Account number copied!
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Add digital font styles */}
      <style jsx>{`
        @font-face {
          font-family: 'Digital-7';
          src: url('https://fonts.cdnfonts.com/css/ds-digital') format('woff2');
          font-weight: normal;
          font-style: normal;
          font-display: swap;
        }
      `}</style>
    </div>
  );
};

export default TabContent;