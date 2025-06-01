import React from "react";

const ServiceCard = ({ icon, title }) => {
  return (
    <div className="flex flex-col items-center p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer">
      <div className="flex items-center justify-center w-16 h-16 mb-3 text-[#025798]">
        {React.cloneElement(icon, { className: "w-8 h-8" })}
      </div>
      <span className="text-sm font-medium text-gray-700 text-center">
        {title}
      </span>
    </div>
  );
};

export default ServiceCard;
