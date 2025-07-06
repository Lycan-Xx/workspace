import React, { useState, useEffect } from "react";
import {
  FaQuestionCircle,
  FaNetworkWired,
  FaMobileAlt,
  FaCreditCard,
  FaChevronRight,
  FaPlay,
  FaPause,
} from "react-icons/fa";

const About = ({ language = "English" }) => {
  const [activeCard, setActiveCard] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const translations = {
    English: {
      title: "About eVault",
      description: "At eVault, we believe in empowering individuals and businesses by providing them with the financial tools they need to succeed. Our mission is to create an inclusive and accessible financial ecosystem that helps bridge gaps in financial management, making it easier for everyone to participate in the economy.",
      subtitle: "We are committed to delivering secure, reliable, and efficient financial solutions that cater to your needs.",
    },
    Hausa: {
      title: "Game da eVault",
      description: "A eVault, muna da yakinin cewa muna bai wa mutane da kasuwanci damar samun hanyoyin kudi masu aminci da saukin samu. Manufarmu ita ce gina tsarin hada-hadar kudi wanda zai tabbatar da samun dama ga kowa da kowa, wanda zai magance gibin da ke cikin gudanar da kudi, yana saukaka shiga cikin tattalin arziki.",
      subtitle: "Muna da kwazo wajen bayar da sabis na kudi masu tsaro, masu kyau da inganci wadanda za su biya bukatun ku.",
    },
    Igbo: {
      title: "Maka eVault",
      description: "Na eVault, anyị kwenyere n'inyere ndị mmadụ na azụmaahịa ikike iji nweta ihe ngwọta ego dị nchebe ma dị mfe. Ebumnobi anyị bụ iwulite usoro ego nke na-eme ka ọ dị mfe maka onye ọ bụla ịbanye n'ime akụ na ụba, iji kpochapụ ihe mgbochi ọ bụla na-arụ ọrụ akụ na ụba.",
      subtitle: "Anyị kwadoro iji nyere ndị ahịa anyị usoro ego dị nchebe, kwụsie ike, na nke a pụrụ ịdabere na ya, nke na-enyere ha aka.",
    },
    Yoruba: {
      title: "Nipa eVault",
      description: "Ni eVault, a gbagbọ ninu agbara eniyan ati awọn iṣowo pẹlu awọn solusan inawo ti o ni aabo ati ti o rọrun lati wọle si. Aims wa ni lati ṣẹda eto inawo ti o ni wiwo gbogbo eniyan ati ti o rọrun lati wọle si, ti o ṣe iranlọwọ lati ṣe iwọn awọn ailagbara ni iṣakoso inawo, ṣiṣe ni irọrun fun gbogbo eniyan lati kopa ninu ọrọ-aje.",
      subtitle: "A ni igbẹkẹle lati pese awọn solusan inawo to ni aabo, to ni igbẹkẹle ati to munadoko ti o yẹ fun awọn iwulo oriṣiriṣi ti awọn.",
    }
  };

  const faqItems = [
    {
      id: 0,
      icon: <FaQuestionCircle />,
      question: "Getting Started",
      answer: "Create an account and sign in with your username and password to access all services.",
      color: "emerald",
      bgGradient: "from-emerald-400 via-teal-500 to-cyan-600",
      animation: "startup"
    },
    {
      id: 1,
      icon: <FaNetworkWired />,
      question: "Bill Payments",
      answer: "Pay your utility bills, cable subscriptions, and other bills with ease on our platform.",
      color: "violet",
      bgGradient: "from-violet-400 via-purple-500 to-indigo-600",
      animation: "network"
    },
    {
      id: 2,
      icon: <FaMobileAlt />,
      question: "Instant Airtime and Data Top Up",
      answer: "Top up your airtime and data instantly with our secure and reliable platform.",
      color: "blue",
      bgGradient: "from-blue-400 via-cyan-500 to-teal-600",
      animation: "mobile"
    },
    {
      id: 3,
      icon: <FaCreditCard />,
      question: "Virtual Cards",
      answer: "Get a virtual card for online transactions and enjoy seamless and reliable payments.",
      color: "orange",
      bgGradient: "from-orange-400 via-red-500 to-pink-600",
      animation: "card"
    },
  ];

  const handleCardClick = (index) => {
    if (index !== activeCard) {
      setIsAnimating(true);
      setTimeout(() => {
        setActiveCard(index);
        setIsAnimating(false);
      }, 300);
    }
  };

  // Animation components for each FAQ item
  const AnimationComponent = ({ type, isActive }) => {
    const baseClasses = "absolute inset-0 transition-all duration-1000";
    
    switch (type) {
      case "startup":
        return (
          <div className={`${baseClasses} ${isActive ? 'opacity-100' : 'opacity-0'}`}>
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/20 via-teal-500/20 to-cyan-600/20">
              {/* Rocket launch animation */}
              <div className="absolute bottom-1/4 left-1/4 w-8 h-8 bg-white rounded-full animate-bounce">
                <div className="absolute -top-2 -left-2 w-12 h-12 bg-emerald-400/50 rounded-full animate-ping"></div>
              </div>
              {/* Floating particles */}
              {[...Array(12)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-2 h-2 bg-emerald-400 rounded-full animate-pulse"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 2}s`,
                    animationDuration: `${2 + Math.random() * 2}s`
                  }}
                />
              ))}
            </div>
          </div>
        );
      
      case "network":
        return (
          <div className={`${baseClasses} ${isActive ? 'opacity-100' : 'opacity-0'}`}>
            <div className="absolute inset-0 bg-gradient-to-br from-violet-400/20 via-purple-500/20 to-indigo-600/20">
              {/* Network nodes */}
              <div className="absolute inset-0">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-4 h-4 bg-violet-400 rounded-full animate-pulse"
                    style={{
                      left: `${20 + (i % 3) * 30}%`,
                      top: `${30 + Math.floor(i / 3) * 40}%`,
                      animationDelay: `${i * 0.5}s`
                    }}
                  >
                    <div className="absolute inset-0 bg-violet-400/30 rounded-full animate-ping"></div>
                  </div>
                ))}
              </div>
              {/* Connecting lines */}
              <svg className="absolute inset-0 w-full h-full">
                {[...Array(5)].map((_, i) => (
                  <line
                    key={i}
                    x1={`${20 + (i % 3) * 30}%`}
                    y1={`${30 + Math.floor(i / 3) * 40}%`}
                    x2={`${20 + ((i + 1) % 3) * 30}%`}
                    y2={`${30 + Math.floor((i + 1) / 3) * 40}%`}
                    stroke="rgba(139, 92, 246, 0.3)"
                    strokeWidth="2"
                    className="animate-pulse"
                  />
                ))}
              </svg>
            </div>
          </div>
        );
      
      case "mobile":
        return (
          <div className={`${baseClasses} ${isActive ? 'opacity-100' : 'opacity-0'}`}>
            <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 via-cyan-500/20 to-teal-600/20">
              {/* Phone outline */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="w-24 h-40 border-4 border-blue-400 rounded-lg relative animate-pulse">
                  <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-blue-400 rounded-full"></div>
                  <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-8 h-8 border-2 border-blue-400 rounded-full"></div>
                  {/* Signal bars */}
                  <div className="absolute -top-8 -right-8 flex space-x-1">
                    {[...Array(4)].map((_, i) => (
                      <div
                        key={i}
                        className="bg-blue-400 rounded-sm animate-pulse"
                        style={{
                          width: '3px',
                          height: `${(i + 1) * 4}px`,
                          animationDelay: `${i * 0.2}s`
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
              {/* Data waves */}
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 border-2 border-blue-400/30 rounded-full animate-ping"
                  style={{
                    width: `${100 + i * 50}px`,
                    height: `${100 + i * 50}px`,
                    animationDelay: `${i * 0.7}s`,
                    animationDuration: '2s'
                  }}
                />
              ))}
            </div>
          </div>
        );
      
      case "card":
        return (
          <div className={`${baseClasses} ${isActive ? 'opacity-100' : 'opacity-0'}`}>
            <div className="absolute inset-0 bg-gradient-to-br from-orange-400/20 via-red-500/20 to-pink-600/20">
              {/* Credit card */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="w-32 h-20 bg-gradient-to-r from-orange-400 to-pink-600 rounded-lg shadow-lg animate-pulse relative">
                  <div className="absolute top-2 left-2 w-6 h-4 bg-yellow-300 rounded-sm"></div>
                  <div className="absolute bottom-2 right-2 text-white text-xs font-bold">****</div>
                  <div className="absolute top-2 right-2 w-4 h-4 bg-white/30 rounded-full"></div>
                </div>
              </div>
              {/* Floating currency symbols */}
              {['$', '€', '£', '¥'].map((symbol, i) => (
                <div
                  key={i}
                  className="absolute text-orange-400 text-2xl font-bold animate-bounce"
                  style={{
                    left: `${20 + i * 20}%`,
                    top: `${20 + (i % 2) * 60}%`,
                    animationDelay: `${i * 0.3}s`
                  }}
                >
                  {symbol}
                </div>
              ))}
              {/* Transaction lines */}
              <div className="absolute inset-0 flex flex-col justify-center items-center space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="w-1/2 h-0.5 bg-gradient-to-r from-transparent via-orange-400 to-transparent animate-pulse"
                    style={{
                      animationDelay: `${i * 0.4}s`,
                      animationDuration: '1.5s'
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  const currentTranslation = translations[language] || translations.English;

  return (
    <section id="about" className="relative min-h-screen bg-gray-900 overflow-hidden">
      {/* Desktop Split Screen Layout */}
      <div className="hidden lg:flex min-h-screen">
        {/* Left Side - Animated Background */}
        <div className="w-1/2 relative overflow-hidden">
          <div className={`absolute inset-0 bg-gradient-to-br ${faqItems[activeCard].bgGradient} transition-all duration-1000`}>
            <div className="absolute inset-0 bg-black/20"></div>
            
            {/* Dynamic Animation based on active card */}
            {faqItems.map((item, index) => (
              <AnimationComponent
                key={item.id}
                type={item.animation}
                isActive={index === activeCard}
              />
            ))}
            
            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-gray-900/50"></div>
          </div>
        </div>

        {/* Right Side - Content */}
        <div className="w-1/2 relative bg-gray-900 p-12 flex flex-col justify-center">
          <div className="max-w-xl mx-auto">
            {/* About Content */}
            <div className="mb-12">
              <h2 className="text-4xl font-bold text-white mb-6 leading-tight">
                {currentTranslation.title}
              </h2>
              <p className="text-gray-300 text-lg leading-relaxed mb-6">
                {currentTranslation.description}
              </p>
              <p className="text-gray-400 leading-relaxed">
                {currentTranslation.subtitle}
              </p>
            </div>

            {/* FAQ Cards */}
            <div className="space-y-4">
              {faqItems.map((item, index) => (
                <div
                  key={item.id}
                  className={`relative overflow-hidden rounded-2xl transition-all duration-500 cursor-pointer ${
                    activeCard === index
                      ? 'bg-white/10 backdrop-blur-sm border border-white/20 shadow-2xl'
                      : 'bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10'
                  }`}
                  onClick={() => handleCardClick(index)}
                >
                  <div className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className={`p-3 rounded-full bg-${item.color}-500/20 text-${item.color}-400 text-xl transition-all duration-300`}>
                          {item.icon}
                        </div>
                        <div>
                          <h3 className="text-white font-semibold text-lg">
                            {item.question}
                          </h3>
                          <div className={`overflow-hidden transition-all duration-500 ${
                            activeCard === index ? 'max-h-40 opacity-100 mt-2' : 'max-h-0 opacity-0'
                          }`}>
                            <p className="text-gray-300 text-sm leading-relaxed">
                              {item.answer}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className={`transform transition-transform duration-300 ${
                        activeCard === index ? 'rotate-90' : ''
                      }`}>
                        <FaChevronRight className="text-gray-400" />
                      </div>
                    </div>
                  </div>
                  
                  {/* Active indicator */}
                  {activeCard === index && (
                    <div className={`absolute left-0 top-0 w-1 h-full bg-gradient-to-b ${item.bgGradient} transition-all duration-500`} />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="lg:hidden relative">
        {/* Mobile Header with Animation */}
        <div className="relative h-64 overflow-hidden">
          <div className={`absolute inset-0 bg-gradient-to-br ${faqItems[activeCard].bgGradient} transition-all duration-1000`}>
            <div className="absolute inset-0 bg-black/30"></div>
            
            {/* Dynamic Animation for mobile */}
            {faqItems.map((item, index) => (
              <AnimationComponent
                key={item.id}
                type={item.animation}
                isActive={index === activeCard}
              />
            ))}
            
            {/* Mobile overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-900/80"></div>
          </div>
        </div>

        {/* Mobile Content */}
        <div className="relative bg-gray-900 p-6 -mt-8 rounded-t-3xl">
          {/* About Content */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-white mb-4 leading-tight">
              {currentTranslation.title}
            </h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              {currentTranslation.description}
            </p>
            <p className="text-gray-400 text-sm leading-relaxed">
              {currentTranslation.subtitle}
            </p>
          </div>

          {/* Mobile FAQ Cards */}
          <div className="space-y-3">
            {faqItems.map((item, index) => (
              <div
                key={item.id}
                className={`relative overflow-hidden rounded-xl transition-all duration-500 cursor-pointer ${
                  activeCard === index
                    ? 'bg-white/10 backdrop-blur-sm border border-white/20 shadow-xl'
                    : 'bg-white/5 backdrop-blur-sm border border-white/10'
                }`}
                onClick={() => handleCardClick(index)}
              >
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg bg-${item.color}-500/20 text-${item.color}-400 text-sm`}>
                        {item.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-white font-medium text-sm">
                          {item.question}
                        </h3>
                      </div>
                    </div>
                    <div className={`transform transition-transform duration-300 ${
                      activeCard === index ? 'rotate-90' : ''
                    }`}>
                      <FaChevronRight className="text-gray-400 text-sm" />
                    </div>
                  </div>
                  
                  {/* Mobile expanded content */}
                  <div className={`overflow-hidden transition-all duration-500 ${
                    activeCard === index ? 'max-h-32 opacity-100 mt-3' : 'max-h-0 opacity-0'
                  }`}>
                    <p className="text-gray-300 text-xs leading-relaxed pl-8">
                      {item.answer}
                    </p>
                  </div>
                </div>
                
                {/* Mobile active indicator */}
                {activeCard === index && (
                  <div className={`absolute left-0 top-0 w-1 h-full bg-gradient-to-b ${item.bgGradient} transition-all duration-500`} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;