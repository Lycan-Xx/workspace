
import React from 'react';
import PropTypes from 'prop-types';

const SecurityStep = ({ children, title, subtitle }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 lg:p-8 w-full mx-auto">
      {title && (
        <div className="text-center mb-4 sm:mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">{title}</h2>
          {subtitle && <p className="text-sm sm:text-base text-gray-600">{subtitle}</p>}
        </div>
      )}
      <div className="space-y-4 sm:space-y-6">
        {children}
      </div>
    </div>
  );
};

SecurityStep.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string,
  subtitle: PropTypes.string,
};

export default SecurityStep;
