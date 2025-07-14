import React, { useState, useEffect, useRef } from "react";
import {
  FaQuestionCircle,
  FaNetworkWired,
  FaMobileAlt,
  FaCreditCard,
  FaChevronRight,
} from "react-icons/fa";

const About = ({ language = "English" }) => {
  const [activeCard, setActiveCard] = useState(0);
  const [isScrollLocked, setIsScrollLocked] = useState(false);
  const containerRef = useRef(null);
  const isScrollingRef = useRef(false);

  const translations = {
    English: {
      title: "About eVault",
      description:
        "At eVault, we believe in empowering individuals and businesses by providing them with the financial tools they need to succeed. Our mission is to create an inclusive and accessible financial ecosystem that helps bridge gaps in financial management, making it easier for everyone to participate in the economy.",
      subtitle:
        "We are committed to delivering secure, reliable, and efficient financial solutions that cater to your needs.",
    },
    Hausa: {
      title: "Game da eVault",
      description:
        "A eVault, muna da yakinin cewa muna bai wa mutane da kasuwanci damar samun hanyoyin kudi masu aminci da saukin samu. Manufarmu ita ce gina tsarin hada-hadar kudi wanda zai tabbatar da samun dama ga kowa da kowa, wanda zai magance gibin da ke cikin gudanar da kudi, yana saukaka shiga cikin tattalin arziki.",
      subtitle:
        "Muna da kwazo wajen bayar da sabis na kudi masu tsaro, masu kyau da inganci wadanda za su biya bukatun ku.",
    },
    Igbo: {
      title: "Maka eVault",
      description:
        "Na eVault, anyị kwenyere n'inyere ndị mmadụ na azụmaahịa ikike iji nweta ihe ngwọta ego dị nchebe ma dị mfe. Ebumnobi anyị bụ iwulite usoro ego nke na-eme ka ọ dị mfe maka onye ọ bụla ịbanye n'ime akụ na ụba, iji kpochapụ ihe mgbochi ọ bụla na-arụ ọrụ akụ na ụba.",
      subtitle:
        "Anyị kwadoro iji nyere ndị ahịa anyị usoro ego dị nchebe, kwụsie ike, na nke a pụrụ ịdabere na ya, nke na-enyere ha aka.",
    },
    Yoruba: {
      title: "Nipa eVault",
      description:
        "Ni eVault, a gbagbọ ninu agbara eniyan ati awọn iṣowo pẹlu awọn solusan inawo ti o ni aabo ati ti o rọrun lati wọle si. Aims wa ni lati ṣẹda eto inawo ti o ni wiwo gbogbo eniyan ati ti o rọrun lati wọle si, ti o ṣe iranlọwọ lati ṣe iwọn awọn ailagbara ni iṣakoso inawo, ṣiṣe ni irọrun fun gbogbo eniyan lati kopa ninu ọrọ-aje.",
      subtitle:
        "A ni igbẹkẹle lati pese awọn solusan inawo to ni aabo, to ni igbẹkẹle ati to munadoko ti o yẹ fun awọn iwulo oriṣiriṣi ti awọn.",
    },
  };

  const faqItems = [
    {
      id: 0,
      icon: <FaQuestionCircle />,
      question: "Getting Started",
      answer:
        "Create an account and sign in with your username and password to access all services.",
      color: "emerald",
      bgGradient: "from-emerald-400 via-teal-500 to-cyan-600",
      animation: "startup",
    },
    {
      id: 1,
      icon: <FaNetworkWired />,
      question: "Bill Payments",
      answer:
        "Pay your utility bills, cable subscriptions, and other bills with ease on our platform.",
      color: "violet",
      bgGradient: "from-violet-400 via-purple-500 to-indigo-600",
      animation: "network",
    },
    {
      id: 2,
      icon: <FaMobileAlt />,
      question: "Instant Airtime and Data Top Up",
      answer:
        "Top up your airtime and data instantly with our secure and reliable platform.",
      color: "blue",
      bgGradient: "from-blue-400 via-cyan-500 to-teal-600",
      animation: "mobile",
    },
    {
      id: 3,
      icon: <FaCreditCard />,
      question: "Virtual Cards",
      answer:
        "Get a virtual card for online transactions and enjoy seamless and reliable payments.",
      color: "orange",
      bgGradient: "from-orange-400 via-red-500 to-pink-600",
      animation: "card",
    },
  ];

  // Scroll lock implementation
  useEffect(() => {
    let scrollTimeout = null;
    let wheelTimeout = null;
    let scrollAccumulator = 0;
    let isProcessingWheel = false;
    const scrollThreshold = 120; // Increased threshold for more deliberate scrolling

    const handleScroll = () => {
      if (scrollTimeout) clearTimeout(scrollTimeout);

      scrollTimeout = setTimeout(() => {
        if (!containerRef.current) return;

        const container = containerRef.current;
        const rect = container.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const containerTop = rect.top;
        const containerHeight = rect.height;

        // More stable scroll lock detection with larger buffer zones
        const shouldLock =
          containerTop <= 100 &&
          containerTop >= -(containerHeight - viewportHeight + 200);

        if (shouldLock !== isScrollLocked) {
          setIsScrollLocked(shouldLock);
          document.body.style.overflow = shouldLock ? "hidden" : "auto";
          // Reset all state when entering/leaving scroll lock
          scrollAccumulator = 0;
          isProcessingWheel = false;
          if (wheelTimeout) {
            clearTimeout(wheelTimeout);
            wheelTimeout = null;
          }
        }
      }, 50); // Increased debounce time for stability
    };

    const handleWheel = (e) => {
      // Only process wheel events when we're definitely in the About section
      if (!isScrollLocked || isProcessingWheel) return;

      // Check if we're actually within the About container bounds
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const isWithinContainer = rect.top <= 100 && rect.bottom >= 100;
        if (!isWithinContainer) return;
      }

      e.preventDefault();
      e.stopPropagation();

      const deltaY = e.deltaY;
      const scrollMagnitude = Math.abs(deltaY);

      // Ignore very small scroll movements (trackpad micro-movements)
      if (scrollMagnitude < 10) return;

      scrollAccumulator += scrollMagnitude;

      // Only trigger change if we've accumulated enough scroll
      if (scrollAccumulator >= scrollThreshold) {
        isProcessingWheel = true;
        const scrollingDown = deltaY > 0;

        if (scrollingDown && activeCard < faqItems.length - 1) {
          setActiveCard((prev) => prev + 1);
          scrollAccumulator = 0;
          wheelTimeout = setTimeout(() => {
            isProcessingWheel = false;
          }, 1000); // Longer timeout for more stable navigation
        } else if (!scrollingDown && activeCard > 0) {
          setActiveCard((prev) => prev - 1);
          scrollAccumulator = 0;
          wheelTimeout = setTimeout(() => {
            isProcessingWheel = false;
          }, 1000);
        } else if (scrollingDown && activeCard === faqItems.length - 1) {
          // Unlock and continue scrolling
          setIsScrollLocked(false);
          document.body.style.overflow = "auto";
          scrollAccumulator = 0;
          isProcessingWheel = false;
          setTimeout(() => {
            window.scrollBy(0, 200);
          }, 150);
        } else if (!scrollingDown && activeCard === 0) {
          // Unlock and continue scrolling up
          setIsScrollLocked(false);
          document.body.style.overflow = "auto";
          scrollAccumulator = 0;
          isProcessingWheel = false;
          setTimeout(() => {
            window.scrollBy(0, -200);
          }, 150);
        } else {
          // Reset if we can't scroll in the desired direction
          scrollAccumulator = 0;
          isProcessingWheel = false;
        }
      }
    };

    // Add event listeners
    window.addEventListener("scroll", handleScroll, { passive: true });

    // Add wheel listener specifically to the container for better control
    if (containerRef.current) {
      containerRef.current.addEventListener("wheel", handleWheel, {
        passive: false,
      });
    }

    return () => {
      if (scrollTimeout) clearTimeout(scrollTimeout);
      if (wheelTimeout) clearTimeout(wheelTimeout);
      window.removeEventListener("scroll", handleScroll);
      if (containerRef.current) {
        containerRef.current.removeEventListener("wheel", handleWheel);
      }
      document.body.style.overflow = "auto";
    };
  }, [activeCard, isScrollLocked, faqItems.length]);

  // Animation components for each FAQ item
  const AnimationComponent = ({ type, isActive }) => {
    const baseClasses = "absolute inset-0 transition-all duration-1000";

    switch (type) {
      case "startup":
        return (
          <div
            className={`${baseClasses} ${isActive ? "opacity-100" : "opacity-0"}`}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/20 via-teal-500/20 to-cyan-600/20">
              <div className="absolute bottom-1/4 left-1/4 w-8 h-8 bg-white rounded-full animate-bounce">
                <div className="absolute -top-2 -left-2 w-12 h-12 bg-emerald-400/50 rounded-full animate-ping"></div>
              </div>
              {[...Array(12)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-2 h-2 bg-emerald-400 rounded-full animate-pulse"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 2}s`,
                    animationDuration: `${2 + Math.random() * 2}s`,
                  }}
                />
              ))}
            </div>
          </div>
        );

      case "network":
        return (
          <div
            className={`${baseClasses} ${isActive ? "opacity-100" : "opacity-0"}`}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-violet-400/20 via-purple-500/20 to-indigo-600/20">
              <div className="absolute inset-0">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-4 h-4 bg-violet-400 rounded-full animate-pulse"
                    style={{
                      left: `${20 + (i % 3) * 30}%`,
                      top: `${30 + Math.floor(i / 3) * 40}%`,
                      animationDelay: `${i * 0.5}s`,
                    }}
                  >
                    <div className="absolute inset-0 bg-violet-400/30 rounded-full animate-ping"></div>
                  </div>
                ))}
              </div>
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
          <div
            className={`${baseClasses} ${isActive ? "opacity-100" : "opacity-0"}`}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 via-cyan-500/20 to-teal-600/20">
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="w-24 h-40 border-4 border-blue-400 rounded-lg relative animate-pulse">
                  <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-blue-400 rounded-full"></div>
                  <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-8 h-8 border-2 border-blue-400 rounded-full"></div>
                  <div className="absolute -top-8 -right-8 flex space-x-1">
                    {[...Array(4)].map((_, i) => (
                      <div
                        key={i}
                        className="bg-blue-400 rounded-sm animate-pulse"
                        style={{
                          width: "3px",
                          height: `${(i + 1) * 4}px`,
                          animationDelay: `${i * 0.2}s`,
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 border-2 border-blue-400/30 rounded-full animate-ping"
                  style={{
                    width: `${100 + i * 50}px`,
                    height: `${100 + i * 50}px`,
                    animationDelay: `${i * 0.7}s`,
                    animationDuration: "2s",
                  }}
                />
              ))}
            </div>
          </div>
        );

      case "card":
        return (
          <div
            className={`${baseClasses} ${isActive ? "opacity-100" : "opacity-0"}`}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-orange-400/20 via-red-500/20 to-pink-600/20">
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="w-32 h-20 bg-gradient-to-r from-orange-400 to-pink-600 rounded-lg shadow-lg animate-pulse relative">
                  <div className="absolute top-2 left-2 w-6 h-4 bg-yellow-300 rounded-sm"></div>
                  <div className="absolute bottom-2 right-2 text-white text-xs font-bold">
                    ****
                  </div>
                  <div className="absolute top-2 right-2 w-4 h-4 bg-white/30 rounded-full"></div>
                </div>
              </div>
              {["$", "€", "£", "¥"].map((symbol, i) => (
                <div
                  key={i}
                  className="absolute text-orange-400 text-2xl font-bold animate-bounce"
                  style={{
                    left: `${20 + i * 20}%`,
                    top: `${20 + (i % 2) * 60}%`,
                    animationDelay: `${i * 0.3}s`,
                  }}
                >
                  {symbol}
                </div>
              ))}
              <div className="absolute inset-0 flex flex-col justify-center items-center space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="w-1/2 h-0.5 bg-gradient-to-r from-transparent via-orange-400 to-transparent animate-pulse"
                    style={{
                      animationDelay: `${i * 0.4}s`,
                      animationDuration: "1.5s",
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
    <section
      ref={containerRef}
      id="about"
      className="relative min-h-screen bg-gray-900 overflow-hidden"
    >
      {/* Progress indicator - only visible when scroll locked in About section */}
      {isScrollLocked && (
        <div className="fixed top-1/2 right-6 transform -translate-y-1/2 z-50 flex flex-col space-y-2">
          {faqItems.map((item, index) => (
            <div
              key={item.id}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === activeCard
                  ? `bg-gradient-to-r ${item.bgGradient} shadow-lg scale-110`
                  : "bg-white/30 hover:bg-white/50"
              }`}
            />
          ))}
        </div>
      )}

      {/* Desktop Split Screen Layout */}
      <div className="hidden desktop:flex min-h-screen">
        {/* Left Side - Animated Background */}
        <div className="w-1/2 relative overflow-hidden">
          <div
            className={`absolute inset-0 bg-gradient-to-br ${faqItems[activeCard].bgGradient} transition-all duration-1000`}
          >
            <div className="absolute inset-0 bg-black/20"></div>

            {faqItems.map((item, index) => (
              <AnimationComponent
                key={item.id}
                type={item.animation}
                isActive={index === activeCard}
              />
            ))}

            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-gray-900/50"></div>
          </div>
        </div>

        {/* Right Side - Content */}
        <div className="w-1/2 relative bg-gray-900 p-xl flex flex-col justify-center">
          <div className="max-w-tablet mx-auto">
            <div className="mb-xl">
              <h2 className="text-4xl font-bold text-white mb-md leading-tight">
                {currentTranslation.title}
              </h2>
              <p className="text-gray-300 text-lg leading-relaxed mb-md">
                {currentTranslation.description}
              </p>
              <p className="text-gray-400 leading-relaxed">
                {currentTranslation.subtitle}
              </p>
            </div>

            <div className="space-y-sm">
              {faqItems.map((item, index) => (
                <div
                  key={item.id}
                  className={`relative overflow-hidden rounded-large transition-all duration-500 ${
                    activeCard === index
                      ? "bg-white/10 backdrop-blur-sm border border-white/20 shadow-2xl scale-105"
                      : "bg-white/5 backdrop-blur-sm border border-white/10 opacity-60"
                  }`}
                >
                  <div className="p-md">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-sm">
                        <div
                          className={`p-sm rounded-full bg-${item.color}-500/20 text-${item.color}-400 text-xl transition-all duration-300 ${
                            activeCard === index ? "scale-110" : ""
                          }`}
                        >
                          {item.icon}
                        </div>
                        <div>
                          <h3 className="text-white font-semibold text-lg">
                            {item.question}
                          </h3>
                          <div
                            className={`overflow-hidden transition-all duration-500 ${
                              activeCard === index
                                ? "max-h-40 opacity-100 mt-xs"
                                : "max-h-0 opacity-0"
                            }`}
                          >
                            <p className="text-gray-300 text-sm leading-relaxed">
                              {item.answer}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div
                        className={`transform transition-transform duration-300 ${
                          activeCard === index ? "rotate-90" : ""
                        }`}
                      >
                        <FaChevronRight className="text-gray-400" />
                      </div>
                    </div>
                  </div>

                  {activeCard === index && (
                    <div
                      className={`absolute left-0 top-0 w-1 h-full bg-gradient-to-b ${item.bgGradient} transition-all duration-500`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="desktop:hidden relative">
        <div className="relative h-64 overflow-hidden">
          <div
            className={`absolute inset-0 bg-gradient-to-br ${faqItems[activeCard].bgGradient} transition-all duration-1000`}
          >
            <div className="absolute inset-0 bg-black/30"></div>

            {faqItems.map((item, index) => (
              <AnimationComponent
                key={item.id}
                type={item.animation}
                isActive={index === activeCard}
              />
            ))}

            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-900/80"></div>
          </div>
        </div>

        <div className="relative bg-gray-900 p-md -mt-xl rounded-t-3xl">
          {/* Mobile progress indicator - only when scroll locked */}
          {isScrollLocked && (
            <div className="absolute top-8 right-4 z-20 flex space-x-2">
              {faqItems.map((item, index) => (
                <div
                  key={item.id}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === activeCard
                      ? `bg-gradient-to-r ${item.bgGradient} shadow-lg`
                      : "bg-white/30"
                  }`}
                />
              ))}
            </div>
          )}

          <div className="mb-xl">
            <h2 className="text-3xl font-bold text-white mb-md leading-tight">
              {currentTranslation.title}
            </h2>
            <p className="text-gray-300 leading-relaxed mb-md">
              {currentTranslation.description}
            </p>
            <p className="text-gray-400 text-sm leading-relaxed">
              {currentTranslation.subtitle}
            </p>
          </div>

          <div className="space-y-sm">
            {faqItems.map((item, index) => (
              <div
                key={item.id}
                className={`relative overflow-hidden rounded-large transition-all duration-500 ${
                  activeCard === index
                    ? "bg-white/10 backdrop-blur-sm border border-white/20 shadow-xl scale-105"
                    : "bg-white/5 backdrop-blur-sm border border-white/10 opacity-60"
                }`}
              >
                <div className="p-md">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-sm">
                      <div
                        className={`p-sm rounded-full bg-${item.color}-500/20 text-${item.color}-400 text-lg transition-all duration-300 ${
                          activeCard === index ? "scale-110" : ""
                        }`}
                      >
                        {item.icon}
                      </div>
                      <div>
                        <h3 className="text-white font-semibold">
                          {item.question}
                        </h3>
                        <div
                          className={`overflow-hidden transition-all duration-500 ${
                            activeCard === index
                              ? "max-h-32 opacity-100 mt-xs"
                              : "max-h-0 opacity-0"
                          }`}
                        >
                          <p className="text-gray-300 text-sm leading-relaxed">
                            {item.answer}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div
                      className={`transform transition-transform duration-300 ${
                        activeCard === index ? "rotate-90" : ""
                      }`}
                    >
                      <FaChevronRight className="text-gray-400" />
                    </div>
                  </div>
                </div>

                {activeCard === index && (
                  <div
                    className={`absolute left-0 top-0 w-1 h-full bg-gradient-to-b ${item.bgGradient} transition-all duration-500`}
                  />
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
