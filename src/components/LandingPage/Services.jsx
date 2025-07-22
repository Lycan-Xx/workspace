import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaVault,
  FaBriefcase,
  FaMoneyBillTransfer,
  FaMobileScreen,
  FaSchool,
  FaPhone,
  FaBolt,
  FaBuilding,
  FaTv,
  FaCreditCard,
} from "react-icons/fa6";

// Service Categories Data
const serviceCategories = [
  {
    type: "Financial Services",
    icon: <FaMoneyBillTransfer className="w-8 h-8 text-cyan-400" />,
    color: "text-cyan-400",
    subServices: [
      {
        title: "Secure Digital Vault",
        icon: <FaVault className="text-cyan-400 w-6 h-6" />,
        description: "Secure and easy-to-use digital vault for all your credentials with military-grade encryption.",
      },
      {
        title: "Business Financial Portfolio",
        icon: <FaBriefcase className="text-cyan-400 w-6 h-6" />,
        description: "Manage your business finances with our comprehensive tools and analytics dashboard.",
      },
      {
        title: "Funds Transfer",
        icon: <FaMoneyBillTransfer className="text-cyan-400 w-6 h-6" />,
        description: "Send money instantly to any bank account with competitive exchange rates.",
      },
    ],
  },
  {
    type: "Utility Payments",
    icon: <FaBolt className="w-8 h-8 text-orange-400" />,
    color: "text-orange-400",
    subServices: [
      {
        title: "Electricity Bills",
        icon: <FaBolt className="text-orange-400 w-6 h-6" />,
        description: "Pay your electricity bills seamlessly with instant confirmation and receipts.",
      },
      {
        title: "Remita Payments",
        icon: <FaBuilding className="text-orange-400 w-6 h-6" />,
        description: "Process Remita payments quickly and securely for government services.",
      },
      {
        title: "Cable TV",
        icon: <FaTv className="text-orange-400 w-6 h-6" />,
        description: "Subscribe to your favorite TV packages with flexible payment options.",
      },
    ],
  },
  {
    type: "Digital Essentials",
    icon: <FaMobileScreen className="w-8 h-8 text-pink-400" />,
    color: "text-pink-400",
    subServices: [
      {
        title: "Data Bundles",
        icon: <FaMobileScreen className="text-pink-400 w-6 h-6" />,
        description: "Stay connected with affordable data bundles for all major networks.",
      },
      {
        title: "Airtime Recharge",
        icon: <FaPhone className="text-pink-400 w-6 h-6" />,
        description: "Quick airtime top-up for all mobile networks with instant delivery.",
      },
      {
        title: "School Fees Payment",
        icon: <FaSchool className="text-pink-400 w-6 h-6" />,
        description: "Easy and secure school fees payment for all educational institutions.",
      },
      {
        title: "Virtual Cards",
        icon: <FaCreditCard className="text-pink-400 w-6 h-6" />,
        description: "Create and manage virtual cards for safe online transactions worldwide.",
      },
    ],
  },
];

const Services = () => {
  const [hoveredCategory, setHoveredCategory] = useState(serviceCategories[0]);

  return (
    <section className="services-section py-20 relative overflow-hidden min-h-screen">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#040d21] via-[#071630] to-[#0a1f3f]">
        {/* Glossy Overlay */}
        <div className="absolute inset-0 bg-blue-500/5 backdrop-blur-3xl"></div>
        {/* Radial Glow Effects */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full filter blur-3xl"></div>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-content mx-auto px-sm tablet:px-md desktop:px-lg">
        {/* Title Section */}
        <div className="text-center mb-component-v pb-8">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl tablet:text-5xl font-bold mb-sm text-white"
          >
            Our Services
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-gray-200 text-lg max-w-tablet mx-auto"
          >
            Explore our comprehensive range of services designed to simplify your financial life
          </motion.p>
        </div>

        {/* Main Service Cards */}
        <div className="grid grid-cols-1 tablet:grid-cols-3 gap-component-h max-w-content mx-auto">
          {serviceCategories.map((category, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.6,
                delay: index * 0.15,
                ease: [0.215, 0.610, 0.355, 1.000]
              }}
              whileHover={{ 
                scale: 1.02,
                y: -5,
                transition: { duration: 0.2 }
              }}
              whileTap={{ scale: 0.98 }}
              onMouseEnter={() => setHoveredCategory(category)}
              className={`bg-white/5 backdrop-blur-2xl border-2 p-md rounded-large flex items-center space-x-sm cursor-pointer group shadow-lg
                ${hoveredCategory === category 
                  ? 'bg-white/10 border-white/30 shadow-xl' 
                  : 'hover:bg-white/8 border-orange-500/50'}`}
            >
              <motion.div 
                className="flex-shrink-0"
                animate={{ 
                  rotate: [0, 5, 0, -5, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  repeatType: "reverse",
                  ease: "easeInOut"
                }}
              >
                {category.icon}
              </motion.div>
              <motion.div
                initial={{ x: 0 }}
                whileHover={{ x: 3 }}
                transition={{ duration: 0.2 }}
              >
                <h3 className="text-xl font-semibold text-white mb-xs">{category.type}</h3>
                <p className="text-gray-300 text-sm">
                  {category.subServices.length} services available
                </p>
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Preview Card */}
        <motion.div
          layout
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mt-8 bg-white/5 backdrop-blur-2xl border border-white/20 rounded-large overflow-hidden shadow-2xl"
        >
          <div className="p-xl">
            {/* Header */}
            <div className="flex items-center space-x-sm mb-lg">
              <motion.div 
                className="flex-shrink-0"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
              >
                {hoveredCategory.icon}
              </motion.div>
              <div>
                <h3 className="text-2xl font-bold text-white">
                  {hoveredCategory.type}
                </h3>
                <p className="text-gray-300 text-sm">
                  Available services in this category
                </p>
              </div>
            </div>

            {/* Sub-services Grid */}
            <div className="grid grid-cols-2 tablet:grid-cols-2 desktop:grid-cols-3 gap-2 tablet:gap-md">
              {hoveredCategory.subServices.map((service, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: idx * 0.1 }}
                  className="p-3 tablet:p-md rounded-large backdrop-blur-xl bg-white/5 border border-white/10 hover:border-white/30 transition-all duration-300 cursor-pointer group hover:bg-white/10"
                >
                  <div className="flex items-center tablet:items-start tablet:space-x-sm">
                    <div className="flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                      {service.icon}
                    </div>
                    <div className="ml-2 tablet:ml-0">
                      <h4 className="text-sm tablet:text-lg font-semibold text-white">
                        {service.title}
                      </h4>
                      <p className="hidden tablet:block text-gray-300 text-sm leading-relaxed mt-xs">
                        {service.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      
    </section>
  );
};

export default Services;
