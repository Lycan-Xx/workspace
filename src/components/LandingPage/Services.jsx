import React, { useRef } from "react";
import { motion } from "framer-motion";
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
  FaCreditCard
} from "react-icons/fa6";

// Separate main services from grid services
const mainServices = [
  {
    icon: <FaVault className="w-12 h-20 text-purple-600" />,
    title: "Secure Digital Vault",
    description: "Secure and easy-to-use digital vault for all your credentials.",
  },
  {
    icon: <FaBriefcase className="w-12 h-20 text-teal-600" />,
    title: "Business Financial Portfolio",
    description: "Manage your business finances with our comprehensive tools.",
  },
  {
    icon: <FaMoneyBillTransfer className="w-12 h-20 text-pink-600" />,
    title: "Funds Transfer",
    description: "Send money instantly to any bank account.",
  },
];

const gridServices = [
  {
    icon: <FaMobileScreen className="w-8 h-8 text-orange-600" />,
    title: "Data Bundles",
    description: "Stay connected with affordable data bundles for all networks.",
  },
  {
    icon: <FaSchool className="w-8 h-8 text-purple-600" />,
    title: "School Fees Payment",
    description: "Easy and secure school fees payment for all institutions.",
  },
  {
    icon: <FaPhone className="w-8 h-8 text-blue-600" />,
    title: "Airtime Recharge",
    description: "Quick airtime top-up for all mobile networks.",
  },
  {
    icon: <FaBolt className="w-8 h-8 text-yellow-600" />,
    title: "Electricity Bills",
    description: "Pay your electricity bills seamlessly.",
  },
  {
    icon: <FaBuilding className="w-8 h-8 text-green-600" />,
    title: "Remita Payments",
    description: "Process Remita payments quickly and securely.",
  },
  {
    icon: <FaTv className="w-8 h-8 text-red-600" />,
    title: "Cable TV",
    description: "Subscribe to your favorite TV packages.",
  },
  {
    icon: <FaCreditCard className="w-8 h-8 text-indigo-600" />,
    title: "Virtual Cards",
    description: "Create and manage virtual cards for online transactions.",
  },
];

const MainServiceCard = ({ title, description, icon }) => (
  <motion.div
    whileHover={{ scale: 1.03 }}
    whileTap={{ scale: 0.98 }}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ 
      duration: 0.5,
      type: "spring",
      stiffness: 300,
      damping: 20
    }}
    className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow"
  >
    <div className="mb-6">{icon}</div>
    <h3 className="text-2xl font-bold text-gray-800 mb-4">{title}</h3>
    <p className="text-gray-600 text-lg">{description}</p>
  </motion.div>
);

const GridServiceCard = ({ title, description, icon }) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ 
      duration: 0.3,
      type: "spring",
      stiffness: 400,
      damping: 25
    }}
    className="bg-white p-4 rounded-xl shadow-md hover:shadow-lg transition-shadow flex items-center space-x-4"
  >
    <div className="flex-shrink-0">
      {icon}
    </div>
    <div>
      <h3 className="text-lg font-semibold text-gray-800 mb-1">{title}</h3>
      <p className="text-gray-600 text-sm">{description}</p>
    </div>
  </motion.div>
);

const Services = () => {
  const sectionRef = useRef(null);

  return (
    <section id="services" className="py-20 bg-[#08448c] relative overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-[#08448c] via-[#08448c] to-[#08448c]" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title Section */}
        <div className="text-center mb-16">
          <h3 className="text-3xl md:text-[3rem] font-bold mb-4 text-orange-500">Our Services</h3>
          <h2 className="text-3xl font-bold text-white mb-4">Comprehensive Solutions for All Your Needs</h2>
          <p className="text-gray-200 text-lg max-w-2xl mx-auto">
            Explore our diverse range of services tailored to simplify your financial transactions.
          </p>
        </div>

        {/* Main Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {mainServices.map((service, index) => (
            <MainServiceCard
              key={index}
              title={service.title}
              description={service.description}
              icon={service.icon}
            />
          ))}
        </div>

        {/* Grid Services */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {gridServices.map((service, index) => (
            <GridServiceCard
              key={index}
              title={service.title}
              description={service.description}
              icon={service.icon}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
