import React, { useRef } from "react";
import { 
  Smartphone, 
  School, 
  Briefcase, 
  Phone, 
  Zap, 
  CreditCard, 
  Tv, 
  Send, 
  Building2 
} from "lucide-react";
import { motion, useInView } from "framer-motion";

const services = [
  {
    icon: <Smartphone className="w-12 h-20 text-orange-600" />,
    title: "Data Bundles",
    description: "Stay connected with affordable data bundles for all networks.",
  },
  {
    icon: <School className="w-12 h-20 text-purple-600" />,
    title: "School Fees Payment",
    description: "Easy and secure school fees payment for all institutions.",
  },
  {
    icon: <Briefcase className="w-12 h-20 text-teal-600" />,
    title: "Business Portfolio",
    description: "Manage your business finances with our comprehensive tools.",
  },
  {
    icon: <Phone className="w-12 h-20 text-blue-600" />,
    title: "Airtime Recharge",
    description: "Quick airtime top-up for all mobile networks.",
  },
  {
    icon: <Zap className="w-12 h-20 text-yellow-600" />,
    title: "Electricity Bills",
    description: "Pay your electricity bills seamlessly.",
  },
  {
    icon: <Building2 className="w-12 h-20 text-green-600" />,
    title: "Remita Payments",
    description: "Process Remita payments quickly and securely.",
  },
  {
    icon: <Tv className="w-12 h-20 text-red-600" />,
    title: "Cable TV",
    description: "Subscribe to your favorite TV packages.",
  },
  {
    icon: <CreditCard className="w-12 h-20 text-indigo-600" />,
    title: "Virtual Cards",
    description: "Create and manage virtual cards for online transactions.",
  },
  {
    icon: <Send className="w-12 h-20 text-pink-600" />,
    title: "Funds Transfer",
    description: "Send money instantly to any bank account.",
  },
];

const ServiceCard = ({ title, description, icon }) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow"
  >
    <div className="mb-4">{icon}</div>
    <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </motion.div>
);

const Services = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true });

  return (
    <section id="services" className="py-20 bg-[#08448c] relative overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-[#08448c] via-[#08448c] to-[#08448c]" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-6 lg:px-8">
        {/* Title Section */}
        <div className="text-center mb-16">
          <h3 className="text-3xl md:text-[3rem] font-bold mb-4 text-orange-500">Our Services</h3>
          <h2 className="text-3xl font-bold text-white mb-4">Comprehensive Solutions for All Your Needs</h2>
          <p className="text-gray-200 text-lg max-w-2xl mx-auto">
            Explore our diverse range of services tailored to simplify your financial transactions.
          </p>
        </div>

        {/* Services Grid */}
        <div
          ref={sectionRef}
          className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8`}
        >
          {services.map((service, index) => (
            <ServiceCard
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
