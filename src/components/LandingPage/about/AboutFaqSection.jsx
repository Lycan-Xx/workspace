import React from "react";
import { motion } from "framer-motion";
import { FaQuestionCircle, FaNetworkWired, FaMobileAlt, FaCreditCard, FaChevronRight } from "react-icons/fa";
import Button from "../ui/Button";

const AboutFaqSection = ({ item, index, isActive, totalSections }) => {
  const iconMap = {
    startup: <FaQuestionCircle />,
    network: <FaNetworkWired />,
    mobile: <FaMobileAlt />,
    card: <FaCreditCard />,
  };

  // Animation components for each FAQ item
  const AnimationComponent = ({ type, isActive }) => {
    const baseClasses = "absolute inset-0 transition-all duration-1000";

    switch (type) {
      case "startup":
        return (
          <div className={`${baseClasses} ${isActive ? "opacity-100" : "opacity-0"}`}>
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/20 via-teal-500/20 to-cyan-600/20">
              <motion.div 
                className="absolute bottom-1/4 left-1/4 w-8 h-8 bg-white rounded-full"
                animate={isActive ? { y: [0, -20, 0] } : {}}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <div className="absolute -top-2 -left-2 w-12 h-12 bg-emerald-400/50 rounded-full animate-ping"></div>
              </motion.div>
              {[...Array(12)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 bg-emerald-400 rounded-full"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                  }}
                  animate={isActive ? { opacity: [0.3, 1, 0.3] } : { opacity: 0 }}
                  transition={{
                    duration: 2 + Math.random() * 2,
                    repeat: Infinity,
                    delay: Math.random() * 2
                  }}
                />
              ))}
            </div>
          </div>
        );

      case "network":
        return (
          <div className={`${baseClasses} ${isActive ? "opacity-100" : "opacity-0"}`}>
            <div className="absolute inset-0 bg-gradient-to-br from-violet-400/20 via-purple-500/20 to-indigo-600/20">
              <div className="absolute inset-0">
                {[...Array(6)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-4 h-4 bg-violet-400 rounded-full"
                    style={{
                      left: `${20 + (i % 3) * 30}%`,
                      top: `${30 + Math.floor(i / 3) * 40}%`,
                    }}
                    animate={isActive ? { scale: [1, 1.2, 1] } : { scale: 1 }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      delay: i * 0.3
                    }}
                  >
                    <div className="absolute inset-0 bg-violet-400/30 rounded-full animate-ping"></div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        );

      case "mobile":
        return (
          <div className={`${baseClasses} ${isActive ? "opacity-100" : "opacity-0"}`}>
            <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 via-cyan-500/20 to-teal-600/20">
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <motion.div 
                  className="w-24 h-40 border-4 border-blue-400 rounded-lg relative"
                  animate={isActive ? { rotateY: [0, 10, 0] } : {}}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-blue-400 rounded-full"></div>
                  <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-8 h-8 border-2 border-blue-400 rounded-full"></div>
                  <div className="absolute -top-8 -right-8 flex space-x-1">
                    {[...Array(4)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="bg-blue-400 rounded-sm"
                        style={{
                          width: "3px",
                          height: `${(i + 1) * 4}px`,
                        }}
                        animate={isActive ? { scaleY: [1, 1.5, 1] } : {}}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          delay: i * 0.2
                        }}
                      />
                    ))}
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        );

      case "card":
        return (
          <div className={`${baseClasses} ${isActive ? "opacity-100" : "opacity-0"}`}>
            <div className="absolute inset-0 bg-gradient-to-br from-orange-400/20 via-red-500/20 to-pink-600/20">
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <motion.div 
                  className="w-32 h-20 bg-gradient-to-r from-orange-400 to-pink-600 rounded-lg shadow-lg relative"
                  animate={isActive ? { rotateX: [0, 15, 0] } : {}}
                  transition={{ duration: 4, repeat: Infinity }}
                >
                  <div className="absolute top-2 left-2 w-6 h-4 bg-yellow-300 rounded-sm"></div>
                  <div className="absolute bottom-2 right-2 text-white text-xs font-bold">****</div>
                  <div className="absolute top-2 right-2 w-4 h-4 bg-white/30 rounded-full"></div>
                </motion.div>
              </div>
              {["$", "€", "£", "¥"].map((symbol, i) => (
                <motion.div
                  key={i}
                  className="absolute text-orange-400 text-2xl font-bold"
                  style={{
                    left: `${20 + i * 20}%`,
                    top: `${20 + (i % 2) * 60}%`,
                  }}
                  animate={isActive ? { y: [0, -10, 0] } : {}}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.5
                  }}
                >
                  {symbol}
                </motion.div>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="relative flex items-center h-full">
      {/* Enhanced background with animation */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className={`absolute inset-0 bg-gradient-to-br ${item.bgGradient}`}
          initial={{ scale: 1.1, opacity: 0.8 }}
          animate={{ 
            scale: isActive ? 1 : 1.1,
            opacity: isActive ? 1 : 0.8
          }}
          transition={{ duration: 0.8 }}
        >
          <div className="absolute inset-0 bg-black/60"></div>
          <AnimationComponent
            type={item.animation}
            isActive={isActive}
          />
        </motion.div>
      </div>

      {/* Enhanced Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Enhanced Left side - Icon and title */}
          <motion.div
            className="text-center md:text-left"
            initial={{ opacity: 0, x: -50 }}
            animate={{
              opacity: isActive ? 1 : 0.3,
              x: isActive ? 0 : -50
            }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              className={`inline-flex items-center justify-center w-24 h-24 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6 text-${item.color}-400 text-5xl`}
              animate={isActive ? { 
                rotate: [0, 360],
                scale: [1, 1.1, 1]
              } : {}}
              transition={{ duration: 2, ease: "easeInOut" }}
            >
              {iconMap[item.animation]}
            </motion.div>
            
            <h3 className="text-4xl md:text-6xl font-bold text-white mb-4">
              {item.question}
            </h3>
          </motion.div>

          {/* Enhanced Right side - Description */}
          <motion.div
            className="text-center md:text-left"
            initial={{ opacity: 0, x: 50 }}
            animate={{
              opacity: isActive ? 1 : 0.3,
              x: isActive ? 0 : 50
            }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 shadow-2xl">
              <p className="text-xl text-gray-200 leading-relaxed mb-6">
                {item.answer}
              </p>
              
              <Button
                variant="link"
                icon={<FaChevronRight />}
                className="text-orange-400 hover:text-orange-300"
              >
                Learn more
              </Button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Enhanced Section indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 border border-white/20">
          <span className="text-white text-sm font-medium">
            {index + 2} / {totalSections}
          </span>
          <div className="w-16 h-1 bg-white/20 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-orange-500 rounded-full"
              initial={{ width: "0%" }}
              animate={{ 
                width: isActive ? "100%" : "0%" 
              }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutFaqSection;