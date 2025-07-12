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
  const [selectedCategory, setSelectedCategory] = useState(null);

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
  };

  const handleCloseModal = () => {
    setSelectedCategory(null);
  };

  return (
    <section className="services-section py-20 relative overflow-hidden min-h-screen">
      {/* Blurred Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900"></div>
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000"><defs><pattern id="cityscape" x="0" y="0" width="200" height="200" patternUnits="userSpaceOnUse"><rect width="200" height="200" fill="%23000033"/><rect x="10" y="50" width="30" height="150" fill="%23000066"/><rect x="50" y="30" width="25" height="170" fill="%23000099"/><rect x="85" y="70" width="20" height="130" fill="%23000066"/><rect x="115" y="40" width="35" height="160" fill="%23000099"/><rect x="160" y="60" width="30" height="140" fill="%23000066"/></pattern></defs><rect width="1000" height="1000" fill="url(%23cityscape)"/></svg>')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'blur(8px)',
        }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title Section */}
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-bold mb-4 text-white"
          >
            Our Services
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-gray-200 text-lg max-w-2xl mx-auto"
          >
            Explore our comprehensive range of services designed to simplify your financial life
          </motion.p>
        </div>

        {/* Main Service Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {serviceCategories.map((category, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              onClick={() => handleCategoryClick(category)}
              className="bg-white/10 backdrop-blur-md border border-white/10 p-6 rounded-xl flex items-center space-x-4 hover:bg-white/20 transition-all duration-300 cursor-pointer group"
            >
              <div className="flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                {category.icon}
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">{category.type}</h3>
                <p className="text-gray-300 text-sm">
                  {category.subServices.length} services available
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Modal Pop-up */}
      <AnimatePresence>
        {selectedCategory && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center z-50 p-4"
            onClick={handleCloseModal}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 50 }}
              transition={{ 
                type: "spring",
                stiffness: 300,
                damping: 30,
                duration: 0.4 
              }}
              className="bg-white/10 backdrop-blur-lg border border-white/20 p-8 rounded-3xl max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    {selectedCategory.icon}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">
                      {selectedCategory.type}
                    </h3>
                    <p className="text-gray-300 text-sm">
                      Choose from our available services
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleCloseModal}
                  className="text-gray-400 hover:text-white transition-colors duration-200 p-2 rounded-full hover:bg-white/10"
                >
                  <FaBolt className="w-5 h-5" />
                </button>
              </div>

              {/* Sub-services Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {selectedCategory.subServices.map((service, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ 
                      duration: 0.3, 
                      delay: idx * 0.1,
                      type: "spring",
                      stiffness: 200 
                    }}
                    whileHover={{ 
                      scale: 1.02,
                      transition: { duration: 0.2 }
                    }}
                    className="p-6 rounded-2xl backdrop-blur-sm bg-white/10 border border-white/20 hover:border-white/40 transition-all duration-300 shadow-lg hover:shadow-xl cursor-pointer group"
                  >
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                        {service.icon}
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-white mb-2">
                          {service.title}
                        </h4>
                        <p className="text-gray-300 text-sm leading-relaxed">
                          {service.description}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Footer */}
              <div className="mt-6 text-center">
                <p className="text-gray-400 text-sm">
                  Click on any service to learn more or get started
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Services;
