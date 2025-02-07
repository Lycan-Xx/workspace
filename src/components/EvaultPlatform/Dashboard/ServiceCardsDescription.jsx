import React from "react";
import { motion } from "framer-motion";
import { ShoppingCart } from "lucide-react";

const ServiceCardsDescription = ({ services, onServiceClick }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {services.map((service, index) => (
        <div
          key={index}
          onClick={() => onServiceClick(service)}
          className="cursor-pointer p-4 rounded-lg bg-white shadow-md hover:shadow-lg transition-shadow"
        >
          <div className="text-center">
            {service.icon}
            <h3 className="mt-2 font-semibold">{service.title}</h3>
            <p className="text-sm text-gray-600">{service.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ServiceCardsDescription;