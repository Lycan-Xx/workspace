import React, { useEffect } from "react";
import PropTypes from "prop-types";
import SecurityStep from "./SecurityStep";
import logo from "../../assets/logo.jpg";

const LoadingStep = ({ onAnimationComplete }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onAnimationComplete();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onAnimationComplete]);

  return (
    <SecurityStep>
      <div className="flex flex-col items-center space-y-8">
        <div className="relative animate-bounce">
          <img src={logo} alt="Profile" className="w-32 h-32 rounded-full" />
          <div className="absolute inset-0 rounded-full border-4 border-t-[#025798] animate-spin" />
        </div>
        <div className="w-64 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full bg-[#025798] animate-[progress_5s_linear]" />
        </div>
        <p className="text-gray-600">Verifying your information...</p>
      </div>
    </SecurityStep>
  );
};

LoadingStep.propTypes = {
  onAnimationComplete: PropTypes.func.isRequired,
};

export default LoadingStep;
