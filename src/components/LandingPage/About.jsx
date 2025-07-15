import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowRight, 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Shield, 
  Zap, 
  Users, 
  Globe,
  Sparkles,
  Eye
} from "lucide-react";
import Button from "./ui/Button";

const About = ({ language = "English" }) => {
  const [isPortalActive, setIsPortalActive] = useState(false);
  const [currentSubComponent, setCurrentSubComponent] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const containerRef = useRef(null);
  const subComponentsRef = useRef([]);

  const translations = {
    English: {
      title: "About eVault",
      subtitle: "Transforming Financial Services",
      description: "At eVault, we believe in empowering individuals and businesses by providing them with the financial tools they need to succeed. Our mission is to create an inclusive and accessible financial ecosystem.",
      portalButton: "Experience Our Services",
      returnButton: "Return to About",
      escapeHint: "Press ESC to exit",
      subComponents: [
        {
          title: "Security First",
          subtitle: "Bank-Grade Protection",
          description: "Your financial data is protected with military-grade encryption and multi-layer security protocols, ensuring your assets remain completely safe.",
          icon: Shield,
          color: "emerald"
        },
        {
          title: "Lightning Fast",
          subtitle: "Instant Transactions",
          description: "Experience real-time processing with our advanced infrastructure. Send money, pay bills, and manage finances with unprecedented speed.",
          icon: Zap,
          color: "yellow"
        },
        {
          title: "For Everyone",
          subtitle: "Inclusive Access",
          description: "We ensure that everyone, regardless of location or background, has the opportunity to access modern financial services.",
          icon: Users,
          color: "blue"
        },
        {
          title: "Global Reach",
          subtitle: "Worldwide Coverage",
          description: "Connect with financial services across borders. Our platform supports international transactions and multi-currency operations.",
          icon: Globe,
          color: "purple"
        }
      ]
    },
    Hausa: {
      title: "Game da eVault",
      subtitle: "Canza Sabis na Kudi",
      description: "A eVault, muna da yakinin cewa muna bai wa mutane da kasuwanci damar samun hanyoyin kudi masu aminci da saukin samu.",
      portalButton: "Gwada Sabis Dinmu",
      returnButton: "Koma zuwa About",
      escapeHint: "Danna ESC don fita",
      subComponents: [
        {
          title: "Tsaro Na Farko",
          subtitle: "Kariya Kamar Banki",
          description: "Ana kare bayananku na kuɗi da tsarin soja kuma da tsarin tsaro na musamman.",
          icon: Shield,
          color: "emerald"
        },
        {
          title: "Sauri Kamar Walƙiya",
          subtitle: "Canja Wuri Nan Take",
          description: "Sami ƙwarewa na ainihi tare da kayan aikin mu na zamani.",
          icon: Zap,
          color: "yellow"
        },
        {
          title: "Ga Kowa",
          subtitle: "Damar Shiga Ga Kowa",
          description: "Muna tabbatar da cewa kowa yana da damar samun sabbin hanyoyin kudi.",
          icon: Users,
          color: "blue"
        },
        {
          title: "Isar Da Duniya",
          subtitle: "Rufe Duniya",
          description: "Haɗa kai da sabis na kuɗi a fadin duniya.",
          icon: Globe,
          color: "purple"
        }
      ]
    },
    Igbo: {
      title: "Maka eVault",
      subtitle: "Ịgbanwe Ọrụ Ego",
      description: "Na eVault, anyị kwenyere n'inyere ndị mmadụ na azụmaahịa ikike iji nweta ihe ngwọta ego dị nchebe ma dị mfe.",
      portalButton: "Nweta Ọrụ Anyị",
      returnButton: "Laghachi na About",
      escapeHint: "Pịa ESC ka ị pụọ",
      subComponents: [
        {
          title: "Nchekwa Mbụ",
          subtitle: "Nchebe Banki",
          description: "Ana echekwa data gị nke ego site na nchekwa dị elu nke agha.",
          icon: Shield,
          color: "emerald"
        },
        {
          title: "Ọsọ Ọsọ",
          subtitle: "Azụmahịa Ozugbo",
          description: "Nwee ahụmịhe nhazi oge n'ezie site na akụrụngwa anyị dị elu.",
          icon: Zap,
          color: "yellow"
        },
        {
          title: "Maka Onye Ọ Bụla",
          subtitle: "Nnweta Nke Gụnyere",
          description: "Anyị na-eme ka ọ bụrụ na onye ọ bụla nwere ohere iji nweta ọrụ ego nke oge a.",
          icon: Users,
          color: "blue"
        },
        {
          title: "Iru Ụwa",
          subtitle: "Mkpuchi Ụwa Niile",
          description: "Jikọọ na ọrụ ego n'ofe oke. Platform anyị na-akwado azụmahịa mba ụwa.",
          icon: Globe,
          color: "purple"
        }
      ]
    },
    Yoruba: {
      title: "Nipa eVault",
      subtitle: "Iyipada Awọn Iṣẹ Inawo",
      description: "Ni eVault, a gbagbọ ninu agbara eniyan ati awọn iṣowo pẹlu awọn solusan inawo ti o ni aabo.",
      portalButton: "Ni Iriri Awọn Iṣẹ Wa",
      returnButton: "Pada si About",
      escapeHint: "Tẹ ESC lati jade",
      subComponents: [
        {
          title: "Aabo Akọkọ",
          subtitle: "Aabo Banki",
          description: "A n lo aabo to ga julọ lati da owo rẹ si pamọ.",
          icon: Shield,
          color: "emerald"
        },
        {
          title: "Yara Bi Mọnamọna",
          subtitle: "Awọn Iṣowo Kiakia",
          description: "Ni iriri sisẹ akoko gidi pẹlu awọn ohun elo wa to ga.",
          icon: Zap,
          color: "yellow"
        },
        {
          title: "Fun Gbogbo Eniyan",
          subtitle: "Wiwọle Ti O Ni Ifisi",
          description: "A rii daju pe gbogbo eniyan ni anfaani lati wọle si awọn iṣẹ inawo igbalode.",
          icon: Users,
          color: "blue"
        },
        {
          title: "Iru Agbaye",
          subtitle: "Iboju Agbaye",
          description: "Sopọ pẹlu awọn iṣẹ inawo kọja awọn aala.",
          icon: Globe,
          color: "purple"
        }
      ]
    }
  };

  const currentTranslation = translations[language] || translations.English;

  // Lock/unlock viewport scrolling
  const lockViewport = useCallback(() => {
    document.body.style.overflow = 'hidden';
    document.body.style.height = '100vh';
  }, []);

  const unlockViewport = useCallback(() => {
    document.body.style.overflow = '';
    document.body.style.height = '';
  }, []);

  // Handle portal activation
  const activatePortal = useCallback(() => {
    setIsTransitioning(true);
    setIsPortalActive(true);
    lockViewport();
    
    setTimeout(() => {
      setIsTransitioning(false);
    }, 800);
  }, [lockViewport]);

  // Handle portal deactivation
  const deactivatePortal = useCallback(() => {
    setIsTransitioning(true);
    
    setTimeout(() => {
      setIsPortalActive(false);
      setCurrentSubComponent(0);
      unlockViewport();
      setIsTransitioning(false);
    }, 500);
  }, [unlockViewport]);

  // Navigate between subcomponents
  const navigateToSubComponent = useCallback((index) => {
    if (index >= 0 && index < currentTranslation.subComponents.length && !isTransitioning) {
      setIsTransitioning(true);
      setCurrentSubComponent(index);
      
      setTimeout(() => {
        setIsTransitioning(false);
      }, 600);
    }
  }, [currentTranslation.subComponents.length, isTransitioning]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isPortalActive) return;

      switch (e.key) {
        case 'Escape':
          e.preventDefault();
          deactivatePortal();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          if (currentSubComponent > 0) {
            navigateToSubComponent(currentSubComponent - 1);
          }
          break;
        case 'ArrowRight':
          e.preventDefault();
          if (currentSubComponent < currentTranslation.subComponents.length - 1) {
            navigateToSubComponent(currentSubComponent + 1);
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPortalActive, currentSubComponent, deactivatePortal, navigateToSubComponent, currentTranslation.subComponents.length]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      unlockViewport();
    };
  }, [unlockViewport]);

  const colorVariants = {
    emerald: {
      bg: "from-emerald-500 to-teal-600",
      accent: "emerald-400",
      glow: "emerald-500/30"
    },
    yellow: {
      bg: "from-yellow-500 to-orange-600",
      accent: "yellow-400",
      glow: "yellow-500/30"
    },
    blue: {
      bg: "from-blue-500 to-cyan-600",
      accent: "blue-400",
      glow: "blue-500/30"
    },
    purple: {
      bg: "from-purple-500 to-pink-600",
      accent: "purple-400",
      glow: "purple-500/30"
    }
  };

  return (
    <section id="about" className="relative min-h-screen overflow-hidden">
      {/* Main About View */}
      <AnimatePresence>
        {!isPortalActive && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.5 }}
            className="relative min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 flex items-center justify-center"
          >
            {/* Background Effects */}
            <div className="absolute inset-0">
              <div className="absolute inset-0 bg-black/50"></div>
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-orange-400 rounded-full"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                  }}
                  animate={{
                    y: [0, -30, 0],
                    opacity: [0.2, 1, 0.2],
                    scale: [0.5, 1, 0.5]
                  }}
                  transition={{
                    duration: 4 + Math.random() * 3,
                    repeat: Infinity,
                    delay: Math.random() * 3
                  }}
                />
              ))}
            </div>

            {/* Content */}
            <div className="relative z-10 max-w-4xl mx-auto text-center px-6">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="space-y-8"
              >
                <div className="space-y-4">
                  <h2 className="text-5xl md:text-7xl font-bold text-white leading-tight">
                    {currentTranslation.title}
                  </h2>
                  <p className="text-xl md:text-2xl text-orange-400 font-medium">
                    {currentTranslation.subtitle}
                  </p>
                </div>
                
                <p className="text-lg md:text-xl text-gray-300 leading-relaxed max-w-3xl mx-auto">
                  {currentTranslation.description}
                </p>

                {/* Portal Button */}
                <motion.div
                  className="pt-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                >
                  <motion.button
                    onClick={activatePortal}
                    className="group relative inline-flex items-center px-8 py-4 bg-gradient-to-r from-orange-500 to-pink-600 text-white font-bold text-lg rounded-full overflow-hidden shadow-2xl"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {/* Portal Ring Effect */}
                    <motion.div
                      className="absolute inset-0 rounded-full border-2 border-orange-400"
                      animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.5, 0, 0.5]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    />
                    
                    {/* Sparkle Effects */}
                    <Sparkles className="w-5 h-5 mr-3 group-hover:animate-spin" />
                    <span className="relative z-10">{currentTranslation.portalButton}</span>
                    <Eye className="w-5 h-5 ml-3 group-hover:scale-110 transition-transform" />
                    
                    {/* Glow Effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-orange-500/50 to-pink-600/50 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </motion.button>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Portal Experience */}
      <AnimatePresence>
        {isPortalActive && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="fixed inset-0 z-50 bg-black"
          >
            {/* Escape Hint */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              className="absolute top-6 right-6 z-50"
            >
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg px-4 py-2 text-white text-sm">
                {currentTranslation.escapeHint}
              </div>
            </motion.div>

            {/* Progress Indicator */}
            <div className="absolute top-6 left-1/2 transform -translate-x-1/2 z-50">
              <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-6 py-3">
                <span className="text-white text-sm font-medium">
                  {currentSubComponent + 1} / {currentTranslation.subComponents.length}
                </span>
                <div className="w-32 h-1 bg-white/20 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-orange-500 to-pink-600 rounded-full"
                    initial={{ width: "0%" }}
                    animate={{ 
                      width: `${((currentSubComponent + 1) / currentTranslation.subComponents.length) * 100}%` 
                    }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>
            </div>

            {/* Navigation Arrows */}
            {currentSubComponent > 0 && (
              <motion.button
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                onClick={() => navigateToSubComponent(currentSubComponent - 1)}
                className="absolute left-6 top-1/2 transform -translate-y-1/2 z-50 p-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white hover:bg-white/20 transition-all duration-300"
                disabled={isTransitioning}
              >
                <ChevronLeft className="w-6 h-6" />
              </motion.button>
            )}

            {currentSubComponent < currentTranslation.subComponents.length - 1 && (
              <motion.button
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                onClick={() => navigateToSubComponent(currentSubComponent + 1)}
                className="absolute right-6 top-1/2 transform -translate-y-1/2 z-50 p-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white hover:bg-white/20 transition-all duration-300"
                disabled={isTransitioning}
              >
                <ChevronRight className="w-6 h-6" />
              </motion.button>
            )}

            {/* Subcomponent Content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSubComponent}
                initial={{ opacity: 0, scale: 0.9, rotateY: 90 }}
                animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                exit={{ opacity: 0, scale: 0.9, rotateY: -90 }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
                className="h-full flex items-center justify-center"
              >
                {(() => {
                  const subComponent = currentTranslation.subComponents[currentSubComponent];
                  const colors = colorVariants[subComponent.color];
                  const IconComponent = subComponent.icon;

                  return (
                    <div className="relative max-w-4xl mx-auto text-center px-6">
                      {/* Background Gradient */}
                      <div className={`absolute inset-0 bg-gradient-to-br ${colors.bg} opacity-20 rounded-3xl blur-3xl`} />
                      
                      {/* Content */}
                      <div className="relative z-10 space-y-8">
                        {/* Icon */}
                        <motion.div
                          initial={{ scale: 0, rotate: -180 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{ duration: 0.8, delay: 0.2 }}
                          className="flex justify-center"
                        >
                          <div className={`p-6 bg-gradient-to-br ${colors.bg} rounded-full shadow-2xl`}>
                            <IconComponent className="w-16 h-16 text-white" />
                          </div>
                        </motion.div>

                        {/* Text Content */}
                        <motion.div
                          initial={{ opacity: 0, y: 30 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.8, delay: 0.4 }}
                          className="space-y-4"
                        >
                          <h3 className="text-4xl md:text-6xl font-bold text-white">
                            {subComponent.title}
                          </h3>
                          <p className={`text-xl md:text-2xl text-${colors.accent} font-medium`}>
                            {subComponent.subtitle}
                          </p>
                          <p className="text-lg text-gray-300 leading-relaxed max-w-2xl mx-auto">
                            {subComponent.description}
                          </p>
                        </motion.div>

                        {/* Return Button (only on last subcomponent) */}
                        {currentSubComponent === currentTranslation.subComponents.length - 1 && (
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.6 }}
                            className="pt-8"
                          >
                            <Button
                              variant="primary"
                              size="lg"
                              onClick={deactivatePortal}
                              icon={<ArrowRight />}
                              className="bg-gradient-to-r from-orange-500 to-pink-600 hover:from-orange-600 hover:to-pink-700 shadow-2xl"
                            >
                              {currentTranslation.returnButton}
                            </Button>
                          </motion.div>
                        )}
                      </div>

                      {/* Floating Particles */}
                      {[...Array(8)].map((_, i) => (
                        <motion.div
                          key={i}
                          className={`absolute w-2 h-2 bg-${colors.accent} rounded-full`}
                          style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                          }}
                          animate={{
                            y: [0, -20, 0],
                            opacity: [0.3, 1, 0.3],
                            scale: [0.5, 1, 0.5]
                          }}
                          transition={{
                            duration: 3 + Math.random() * 2,
                            repeat: Infinity,
                            delay: Math.random() * 2
                          }}
                        />
                      ))}
                    </div>
                  );
                })()}
              </motion.div>
            </AnimatePresence>

            {/* Dot Navigation */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3">
              {currentTranslation.subComponents.map((_, index) => (
                <button
                  key={index}
                  onClick={() => navigateToSubComponent(index)}
                  disabled={isTransitioning}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentSubComponent
                      ? 'bg-orange-500 scale-125'
                      : 'bg-white/30 hover:bg-white/50'
                  }`}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default About;