import React from "react";
import { ArrowRight } from "lucide-react";
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
    <div className="bg-hero-gradient relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-orange-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-orange-500/5 to-blue-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-[calc(100vh-56px)] md:min-h-[calc(100vh-80px)] flex flex-col justify-center">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Left Content */}
          <div className="space-y-6">
            <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-sm font-medium text-gray-300 mb-6">
              <span className="w-2 h-2 bg-orange-500 rounded-full mr-2 animate-pulse"></span>
              Secure Financial Solutions
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold">
              <span className="text-white">{content[language].title.split(' ')[0]} </span>
              <span className="text-white">{content[language].title.split(' ')[1]} </span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">
                {content[language].title.split(' ')[2]}
              </span>
            </h1>
            
            <p className="text-lg text-gray-300 max-w-lg leading-relaxed">
              {content[language].description}
            </p>
            
            <div className="flex space-x-4 pt-4">
              <div className="relative group">
                <div className="absolute -inset-px bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
                <button
                  onClick={handleGetStarted}
                  className="relative flex items-center px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg font-medium hover:shadow-glow transition-all duration-300 transform hover:scale-105"
                >
                  {buttonText[language]} 
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                </button>
              </div>
            </div>

            {/* Stats */}
            <div className="flex items-center pt-6 mt-8 border-t border-white/10">
              <div className="flex items-center">
                <svg className="w-6 h-6 mr-2" viewBox="0 0 24 24" fill="none" strokeWidth="1.5">
                  <path d="M13 7.00003H21M21 7.00003V15M21 7.00003L13 15L9 11L3 17" stroke="url(#gradient)" strokeLinecap="round" strokeLinejoin="round" />
                  <defs>
                    <linearGradient id="gradient" x1="3" y1="7.00003" x2="22.2956" y2="12.0274" gradientUnits="userSpaceOnUse">
                      <stop offset="0%" stopColor="#f97316" />
                      <stop offset="100%" stopColor="#ea580c" />
                    </linearGradient>
                  </defs>
                </svg>
                <span className="text-gray-300 font-medium">100,000+ trusted users nationwide</span>
              </div>
            </div>
          </div>

          {/* Right Image */}
          <div className="relative">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-blue-500/20 rounded-2xl blur-2xl transform rotate-6"></div>
              <div className="relative bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-4 shadow-glass">
                <img
                  src={heroImage}
                  alt="Financial Platform"
                  className="rounded-xl shadow-2xl w-full h-auto"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;