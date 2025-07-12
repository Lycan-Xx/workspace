import React from "react";
import { ArrowRight, Search } from "lucide-react";
import heroImage from "../assets/hero-page.jpg";

const Hero = ({ language }) => {
  const handleGetStarted = () => {
    window.open('https://app.evault.com.ng/mobile/register/', '_blank');
  };

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
        "Na eVault, anyị kwenyere n'inyere ndị mmadụ na azụmaahịa ikike iji nweta ihe ngwọta ego dị nchebe ma dị mfe.",
    },
    Yoruba: {
      title: "Kaabo si eVault",
      description:
        "Ni eVault, a gbagbọ ninu agbara eniyan ati awọn iṣowo pẹlu awọn solusan inawo ti o ni aabo ati ti o rọrun lati wọle si.",
    },
  };

  return (
    <div className="bg-hero-gradient relative overflow-hidden min-h-screen flex flex-col lg:flex-row pt-16">
      {/* Left Content */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-4 sm:px-6 lg:px-8 relative z-10 py-12 lg:py-0">
        <div className="space-y-6 max-w-2xl mx-auto lg:mx-0">
          <div className="inline-flex items-center px-4 py-2 bg-white rounded-full text-sm font-medium text-gray-700 mb-6">
            <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
            Secure Financial Solutions
          </div>
          
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
            <span className="text-white">{content[language].title.split(' ')[0]} </span>
            <span className="text-white">{content[language].title.split(' ')[1]} </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">
              {content[language].title.split(' ')[2]}
            </span>
          </h1>
          
          <p className="text-base sm:text-lg text-gray-300 leading-relaxed">
            {content[language].description}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <div className="relative group">
              <div className="absolute -inset-px bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
              <button
                onClick={handleGetStarted}
                className="relative flex items-center justify-center w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg font-medium hover:shadow-glow transition-all duration-300 transform hover:scale-105"
              >
                {buttonText[language]} 
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
              </button>
            </div>
            
            <button className="flex items-center justify-center sm:justify-start text-gray-300 hover:text-white transition-colors duration-300 py-4">
              Learn more
              <ArrowRight className="ml-2 h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Right Image - Full Height */}
      <div className="w-full lg:w-1/2 relative min-h-64 lg:min-h-screen order-first lg:order-last">
        <div 
          className="absolute inset-0 lg:clip-path-polygon"
          style={{ 
            clipPath: window.innerWidth >= 1024 ? 'polygon(10% 0, 100% 0, 100% 100%, 0 100%)' : 'none'
          }}
        >
          <img
            src={heroImage}
            alt="Financial Platform"
            className="w-full h-full object-cover lg:object-cover"
          />
          {/* Mobile overlay for better text readability */}
          <div className="absolute inset-0 bg-black/30 lg:hidden"></div>
        </div>
      </div>
    </div>
  );
};

export default Hero;