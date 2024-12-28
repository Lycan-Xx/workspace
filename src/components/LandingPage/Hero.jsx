import React, { useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import { ArrowRight } from "lucide-react";

const Hero = ({ language, setShowPlatform, setPlatformInitialView }) => {
  // Scroll to the "Features" section
  const scrollToFeatures = () => {
    const featuresSection = document.getElementById("features");
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Get Started button functionality
  const handleGetStarted = () => {
    setPlatformInitialView("instant-payments");
    setShowPlatform(true);
  };

  // Language-specific content
  const buttonText = {
    English: "Get Started",
    Hausa: "Fara",
    Igbo: "Malite",
    Yoruba: "Bẹrẹ",
  };

  const content = {
    English: {
      title: "Welcome to eVault",
      description:
        "At eVault, we believe in empowering individuals and businesses with secure and accessible financial solutions.",
    },
    Hausa: {
      title: "Maraba da eVault",
      description:
        "A eVault, muna da yakinin cewa muna bai wa mutane da kasuwanci damar samun hanyoyin kudi masu aminci da saukin samu.",
    },
    Igbo: {
      title: "Nnọọ na eVault",
      description:
        "Na eVault, anyị kwenyere n’inyere ndị mmadụ na azụmaahịa ikike iji nweta ihe ngwọta ego dị nchebe ma dị mfe.",
    },
    Yoruba: {
      title: "Kaabo si eVault",
      description:
        "Ni eVault, a gbagbọ ninu agbara eniyan ati awọn iṣowo pẹlu awọn solusan inawo ti o ni aabo ati ti o rọrun lati wọle si.",
    },
  };

  return (
    <div className="pt-20 bg-[#08448c] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Left Content */}
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold">
              {content[language].title}
            </h1>
            <p className="text-lg text-gray-200">
              {content[language].description}
            </p>
            <div className="flex space-x-4">
              <button
                onClick={handleGetStarted}
                className="px-6 py-3 bg-orange-700 text-white rounded-lg hover:bg-orange-400 flex items-center"
              >
                {buttonText[language]} <ArrowRight className="ml-2 h-5 w-5" />
              </button>
            </div>
          </div>
          {/* Right Image */}
          <div className="relative">
            <img
              src="https://picsum.photos/seed/fintech/800/600"
              alt="Financial Platform"
              className="rounded-lg shadow-xl"
            />
          </div>
        </div>
      </div>
      {/* Animated Chevron Down */}
      <div
        className="absolute bottom-20 left-1/2 transform -translate-x-1/2 cursor-pointer z-10"
        onClick={scrollToFeatures}
      >
        <FaChevronDown
          className="text-white text-3xl animate-bounce"
          title="Scroll Down"
        />
      </div>
    </div>
  );
};

export default Hero;
