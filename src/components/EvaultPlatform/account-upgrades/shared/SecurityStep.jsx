
import React from 'react';
import PropTypes from 'prop-types';

const SecurityStep = ({ children, title, subtitle }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md mx-auto">
      {title && (
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{title}</h2>
          {subtitle && <p className="text-gray-600">{subtitle}</p>}
        </div>
      )}
      <div className="space-y-6">
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
