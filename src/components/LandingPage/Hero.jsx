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
      title: "Your All-in-One Wallet, Payment, and Financial Solution",
      description:
        "Experience seamless financial services with our comprehensive platform designed for individuals and businesses across Northern Nigeria.",
    },
    Hausa: {
      title: "Jakada, Biyan Kuɗi, da Hanyar Kuɗi Na Duk-in-Day",
      description:
        "Yi amfani da sabis na kuɗi tare da dandamali mai zurfi wanda aka tsara don mutane da kasuwanci a Arewacin Najeriya.",
    },
    Igbo: {
      title: "Obere Aka N’Onwe Gị Maka Ego, Ọrụ Ego, na Ntụgharị Ego",
      description:
        "Nwetaghachi ọrụ ego na enweghị nsogbu site na usoro anyị zuru oke nke dị maka ndị mmadụ na azụmahịa na Northern Nigeria.",
    },
    Yoruba: {
      title: "Ẹgbẹ Kan Fun Apo Wọle, Sisanwo, Ati Solusan Isuna",
      description:
        "Ni iriri awọn iṣẹ iṣuna ti ko ni wahala pẹlu pẹpẹ wa ti a ṣe apẹrẹ fun awọn ẹni-kọọkan ati awọn iṣowo ni Aarin Ariwa Nigeria.",
    },
  };

  return (
    <div className="pt-20 bg-[#025798] text-white">
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
              <button
                onClick={scrollToFeatures}
                className="px-6 py-3 border border-white text-white rounded-lg hover:bg-white hover:text-[#025798]"
              >
                Learn More
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
