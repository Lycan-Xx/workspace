import React from "react";
import { motion } from "framer-motion";

const ServiceCardsDescription = ({ services, onServiceClick }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
      {services.map((service, index) => (
        <motion.div
          key={index}
          whileHover={{ scale: 1.02 }}
          onClick={() => onServiceClick(service)}
          className="cursor-pointer p-6 rounded-lg bg-white shadow-sm hover:shadow-lg transition-all duration-300"
        >
          <div className="flex flex-col items-center">
            <div className="flex items-center justify-center w-16 h-16 mb-4 text-[#025798]">
              {React.cloneElement(service.icon, { 
                className: 'w-10 h-10 text-[#025798]',
                style: { fontSize: '2.5rem' }
              })}
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">{service.title}</h3>
            <p className="text-sm text-gray-600 text-center">{service.description}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default ServiceCardsDescription;