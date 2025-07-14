import React, { useRef, useState, useCallback, useMemo } from "react";
import { useInView } from "react-intersection-observer";
import { ArrowRight, Sparkles, Users, Shield, Zap } from "lucide-react";

const Offer = React.memo(({ language = "English" }) => {
  const [hoveredCard, setHoveredCard] = useState(null);
  const [hasAnimated, setHasAnimated] = useState(false);
  const { ref: sectionRef, inView } = useInView({ 
    threshold: 0.1,
    triggerOnce: true,
    onChange: (inView) => {
      if (inView && !hasAnimated) {
        setHasAnimated(true);
      }
    }
  });

  const translations = useMemo(() => ({
    English: {
      sectionTitle: "What We Offer",
      subtitle: "Transforming Financial Management",
      mainDescription: "We are not just providing financial services",
      subDescription: "We are transforming the way financial management works for PEOPLE and BUSINESSES.",
      callToAction: "Join us in shaping a future where financial empowerment is accessible to all. Together, we can create new opportunities and drive positive change for",
      highlights: ["Individuals", "Businesses", "Communities"],
      globalReach: "across the globe.",
      rightPanelTitle: "Financial Innovation",
      rightPanelDescription: "Empowering the future of financial services through cutting-edge technology and inclusive design."
    },
    Hausa: {
      sectionTitle: "Abin Da Muke Bayarwa",
      subtitle: "Canza Tsarin Kula Da Kudi",
      mainDescription: "Ba wai kawai muna bayar da sabis na kudi ba",
      subDescription: "Muna canza yadda tsarin kula da kudi ke aiki ga MUTANE da KASUWANCI.",
      callToAction: "Ku kasance tare da mu don gina wani makomar da samun damar kudi zai zama na kowa. Tare za mu iya samar da sabbin damammaki da haifar da kyakkyawan canji ga",
      highlights: ["Mutane", "Kasuwanci", "Al'ummomi"],
      globalReach: "a duk duniya.",
      rightPanelTitle: "Sabbin Hanyoyin Kudi",
      rightPanelDescription: "Ƙarfafa makomar sabis na kudi ta hanyar fasaha da tsarin haɗawa."
    },
    Igbo: {
      sectionTitle: "Ihe Anyị Na-Enye",
      subtitle: "Ịgbanwe Njikwa Ego",
      mainDescription: "Anyị anaghị enwe naanị ọrụ ego",
      subDescription: "Anyị na-agbanwe otu esi eji ego eme ihe maka NDỊ MMADỤ na AZỤMAAHỊA.",
      callToAction: "Jikọọ anyị na mmepe nke ọdịnihu ebe ike ego ga-adị mfe maka onye ọ bụla. Ọnụ, anyị nwere ike ịmepụta ohere ọhụrụ ma kwalite mgbanwe dị mma maka",
      highlights: ["Ndị mmadụ", "Azụmaahịa", "Obodo"],
      globalReach: "n'ụwa niile.",
      rightPanelTitle: "Ọhụrụ Ego",
      rightPanelDescription: "Inyere aka n'ọdịnihu nke ọrụ ego site na teknụzụ na nhazi nke gụnyere onye ọ bụla."
    },
    Yoruba: {
      sectionTitle: "Ohun Ti A Npese",
      subtitle: "Iyipada Iṣakoso Inawo",
      mainDescription: "A ko nikan ni awọn iṣẹ inawo",
      subDescription: "A n ṣe iyipada bii iṣakoso owo ṣe ṣiṣẹ fun AWỌN ENIYAN ati AWỌN IṢOWO.",
      callToAction: "Darapọ mọ wa ninu ẹda ọjọ iwaju nibiti agbara inawo ti wa fun gbogbo eniyan. Papọ, a le ṣẹda awọn anfaani tuntun ki a si ṣe iyipada rere fun",
      highlights: ["Awọn eniyan", "Awọn iṣowo", "Awọn agbegbe"],
      globalReach: "ni gbogbo agbaye.",
      rightPanelTitle: "Imudojuiwon Inawo",
      rightPanelDescription: "Fifun agbara si ọjọ iwaju ti awọn iṣẹ inawo nipasẹ imọ-ẹrọ ti o ga julọ ati apẹrẹ ti o ni ifisi."
    }
  }), []);

  const content = useMemo(() => ({
    English: {
      cards: [
        {
          icon: <Users className="w-6 h-6" />,
          title: "Inclusive Financial Access",
          description: "We ensure that everyone, regardless of location or background, has the opportunity to access modern financial services.",
          gradient: "from-blue-500 to-cyan-500",
          bgColor: "bg-blue-50",
          iconColor: "text-blue-600"
        },
        {
          icon: <Shield className="w-6 h-6" />,
          title: "Reliable and Seamless Services",
          description: "Our focus is on providing stable and trustworthy services that streamline your financial operations.",
          gradient: "from-emerald-500 to-teal-500",
          bgColor: "bg-emerald-50",
          iconColor: "text-emerald-600"
        },
        {
          icon: <Zap className="w-6 h-6" />,
          title: "Innovative Financial Experiences",
          description: "We continuously strive to innovate and improve how you manage and grow your finances.",
          gradient: "from-orange-500 to-red-500",
          bgColor: "bg-orange-50",
          iconColor: "text-orange-600"
        }
      ]
    },
    Hausa: {
      cards: [
        {
          icon: <Users className="w-6 h-6" />,
          title: "Damar Samun Kudi Ga Kowa",
          description: "Muna tabbatar da cewa kowa, ba tare da la'akari da wurin da yake ko matsayin sa ba, yana da damar samun sabbin hanyoyin kudi.",
          gradient: "from-blue-500 to-cyan-500",
          bgColor: "bg-blue-50",
          iconColor: "text-blue-600"
        },
        {
          icon: <Shield className="w-6 h-6" />,
          title: "Ayyuka Masu Amfani da Tsaro",
          description: "Muna mayar da hankali wajen samar da ayyuka masu aminci da sauki, wanda zai taimaka wajen gudanar da harkokin kudi.",
          gradient: "from-emerald-500 to-teal-500",
          bgColor: "bg-emerald-50",
          iconColor: "text-emerald-600"
        },
        {
          icon: <Zap className="w-6 h-6" />,
          title: "Hanyoyin Inganta Kudi",
          description: "Muna ci gaba da ƙoƙarin sabunta hanyoyin da za a sarrafa kudi da kuma haɓaka nasarorin ku.",
          gradient: "from-orange-500 to-red-500",
          bgColor: "bg-orange-50",
          iconColor: "text-orange-600"
        }
      ]
    },
    Igbo: {
      cards: [
        {
          icon: <Users className="w-6 h-6" />,
          title: "Inweta Ego N'oge Ọ bụla",
          description: "Anyị na-eme ka ọ bụrụ na onye ọ bụla nwere ohere iji nweta ọrụ ego nke oge a.",
          gradient: "from-blue-500 to-cyan-500",
          bgColor: "bg-blue-50",
          iconColor: "text-blue-600"
        },
        {
          icon: <Shield className="w-6 h-6" />,
          title: "Ego Nchekwa na Nchebe",
          description: "Anyị na-elekwasị anya n'inye ọrụ dị nchebe na nke a pụrụ ịdabere na ya, nke na-eme ka ị na-arụ ọrụ ego gị na-adị mfe.",
          gradient: "from-emerald-500 to-teal-500",
          bgColor: "bg-emerald-50",
          iconColor: "text-emerald-600"
        },
        {
          icon: <Zap className="w-6 h-6" />,
          title: "Omenala Ịma Egwuregwu",
          description: "Anyị na-agbaso imepụta na mmezi ngwa ọrụ akụ na ụba.",
          gradient: "from-orange-500 to-red-500",
          bgColor: "bg-orange-50",
          iconColor: "text-orange-600"
        }
      ]
    },
    Yoruba: {
      cards: [
        {
          icon: <Users className="w-6 h-6" />,
          title: "Ibi-afẹde Ti Inawo Fun Gbogbo eniyan",
          description: "A rii daju pe gbogbo eniyan, lai wo ibi ti wọn wa tabi ipo wọn, ni anfaani lati wọle si awọn iṣẹ inawo igbalode.",
          gradient: "from-blue-500 to-cyan-500",
          bgColor: "bg-blue-50",
          iconColor: "text-blue-600"
        },
        {
          icon: <Shield className="w-6 h-6" />,
          title: "Awọn iṣẹ To Duroṣinṣin ati To Lọrẹ",
          description: "A nṣe itọsọna lori gbigbe awọn iṣẹ inawo ti o dara julọ ati ti o tọ.",
          gradient: "from-emerald-500 to-teal-500",
          bgColor: "bg-emerald-50",
          iconColor: "text-emerald-600"
        },
        {
          icon: <Zap className="w-6 h-6" />,
          title: "Iriri inawo Titun",
          description: "A n ṣafihan ọna tuntun ati ilọsiwaju bi a ṣe n ṣiṣẹda ati dagba awọn owo rẹ.",
          gradient: "from-orange-500 to-red-500",
          bgColor: "bg-orange-50",
          iconColor: "text-orange-600"
        }
      ]
    }
  }), []);

  const currentContent = content[language] || content.English;
  const currentTranslation = translations[language] || translations.English;

  const handleCardHover = useCallback((index) => {
    setHoveredCard(index);
  }, []);

  const handleCardLeave = useCallback(() => {
    setHoveredCard(null);
  }, []);

  const handleCardKeyDown = useCallback((e, index) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleCardHover(index);
    }
  }, [handleCardHover]);

  // Optimized floating elements
  const floatingElements = useMemo(() => 
    Array.from({ length: 8 }, (_, i) => ({
      id: i,
      left: Math.random() * 80 + 10,
      top: Math.random() * 80 + 10,
      delay: Math.random() * 2,
      duration: 3 + Math.random() * 2
    }))
  , []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen bg-white overflow-hidden"
      role="region"
      aria-labelledby="offer-section-title"
    >
      {/* CSS Animations */}
      <style jsx>{`
        @media (prefers-reduced-motion: reduce) {
          .animate-float,
          .animate-pulse,
          .animate-slide-in,
          .animate-fade-in {
            animation: none !important;
          }
        }
        
        .animate-slide-in {
          animation: slideIn 0.8s ease-out forwards;
        }
        
        .animate-fade-in {
          animation: fadeIn 0.6s ease-out forwards;
        }
        
        .animate-float {
          animation: float var(--duration, 4s) ease-in-out infinite;
          animation-delay: var(--delay, 0s);
        }
        
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-2rem);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(1rem);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0) scale(1);
            opacity: 0.3;
          }
          50% {
            transform: translateY(-1.25rem) scale(1.1);
            opacity: 0.8;
          }
        }
        
        .card-hover {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          transform: translateY(0);
        }
        
        .card-hover:hover {
          transform: translateY(-0.25rem);
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
        }
        
        .card-hover:focus {
          outline: 2px solid #3b82f6;
          outline-offset: 2px;
        }
      `}</style>

      {/* Split Screen Container */}
      <div className="flex flex-col lg:flex-row min-h-screen">
        {/* Left Side - Content */}
        <div className="w-full desktop:w-1/2 relative z-10 flex flex-col justify-center px-sm tablet:px-md desktop:px-lg py-lg desktop:py-0">
          <div className="max-w-tablet mx-auto desktop:mx-0">
            {/* Header Section */}
            <div className="mb-xl">
              <div 
                className={`flex items-center mb-md ${hasAnimated ? 'animate-fade-in' : 'opacity-0'}`}
                style={{ animationDelay: '0.2s' }}
              >
                <Sparkles className="w-5 h-5 text-orange-500 mr-3" aria-hidden="true" />
                <span className="text-orange-500 font-semibold text-base tablet:text-lg tracking-wide uppercase">
                  {currentTranslation.sectionTitle}
                </span>
              </div>

              <h1
                id="offer-section-title"
                className={`text-3xl tablet:text-4xl desktop:text-6xl font-bold text-gray-900 mb-xl leading-tight ${hasAnimated ? 'animate-fade-in' : 'opacity-0'}`}
                style={{ animationDelay: '0.3s' }}
              >
                {currentTranslation.subtitle}
              </h1>

              <div 
                className={`space-y-sm tablet:space-y-md text-base tablet:text-lg leading-relaxed ${hasAnimated ? 'animate-fade-in' : 'opacity-0'}`}
                style={{ animationDelay: '0.4s' }}
              >
                <p className="text-gray-700">
                  <span className="font-semibold text-gray-900">
                    {currentTranslation.mainDescription}
                  </span>
                </p>
                
                <p className="text-gray-700 font-medium">
                  {currentTranslation.subDescription}
                </p>
                
                <p className="text-gray-600">
                  <span className="text-blue-600 font-semibold">
                    Join us in shaping a future where financial empowerment is accessible to all.
                  </span>
                  {' '}Together, we can create new opportunities and drive positive change for{' '}
                  <span className="text-orange-500 font-bold">
                    {currentTranslation.highlights.join(', ')}
                  </span>
                  <span className="font-semibold"> {currentTranslation.globalReach}</span>
                </p>
              </div>
            </div>

            {/* Feature Cards */}
            <div className="space-y-sm tablet:space-y-md">
              {currentContent.cards.map((card, idx) => (
                <div
                  key={idx}
                  className={`card-hover group relative overflow-hidden rounded-large border border-gray-100 bg-white p-sm tablet:p-md shadow-sm cursor-pointer focus:outline-none ${hasAnimated ? 'animate-fade-in' : 'opacity-0'}`}
                  style={{ animationDelay: `${0.6 + idx * 0.1}s` }}
                  onMouseEnter={() => handleCardHover(idx)}
                  onMouseLeave={handleCardLeave}
                  onKeyDown={(e) => handleCardKeyDown(e, idx)}
                  tabIndex={0}
                  role="button"
                  aria-label={`Learn more about ${card.title}`}
                >
                  {/* Gradient overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-r ${card.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
                  
                  {/* Content */}
                  <div className="relative z-10 flex items-start space-x-3 sm:space-x-4">
                    <div className={`${card.bgColor} ${card.iconColor} flex-shrink-0 p-xs tablet:p-sm rounded-medium group-hover:scale-105 transition-transform duration-300`}>
                      {card.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg tablet:text-xl font-bold text-gray-900 mb-xs tablet:mb-sm group-hover:text-gray-800 transition-colors duration-300">
                        {card.title}
                      </h3>
                      <p className="text-sm tablet:text-base text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
                        {card.description}
                      </p>
                    </div>
                    <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <ArrowRight className="w-4 h-4 tablet:w-5 tablet:h-5 text-gray-400 group-hover:text-gray-600 group-hover:translate-x-1 transition-all duration-300" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side - Background */}
        <div className="w-full desktop:w-1/2 relative min-h-64 desktop:min-h-screen">
          {/* Background Image */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-orange-500">
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/20" />
            
            {/* Optimized geometric patterns */}
            <div className="absolute inset-0 overflow-hidden">
              {/* Large circles */}
              <div className="absolute top-1/4 right-1/4 w-48 tablet:w-64 h-48 tablet:h-64 bg-white/10 rounded-full blur-3xl animate-pulse" />
              <div className="absolute bottom-1/4 left-1/4 w-32 tablet:w-48 h-32 tablet:h-48 bg-orange-400/20 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }} />
              
              {/* Floating elements */}
              {floatingElements.map((element) => (
                <div
                  key={element.id}
                  className="absolute w-3 h-3 tablet:w-4 tablet:h-4 bg-white/30 rounded-full animate-float"
                  style={{
                    left: `${element.left}%`,
                    top: `${element.top}%`,
                    '--delay': `${element.delay}s`,
                    '--duration': `${element.duration}s`
                  }}
                />
              ))}
            </div>
            
            {/* Content overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-white p-md tablet:p-xl">
                <div 
                  className={`mb-md tablet:mb-xl ${hasAnimated ? 'animate-fade-in' : 'opacity-0'}`}
                  style={{ animationDelay: '0.8s' }}
                >
                  <div className="w-20 h-20 tablet:w-32 tablet:h-32 mx-auto bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/30">
                    <Sparkles className="w-10 h-10 tablet:w-16 tablet:h-16 text-white" aria-hidden="true" />
                  </div>
                </div>
                
                <h2 
                  className={`text-2xl tablet:text-3xl font-bold mb-sm tablet:mb-sm ${hasAnimated ? 'animate-fade-in' : 'opacity-0'}`}
                  style={{ animationDelay: '1s' }}
                >
                  {currentTranslation.rightPanelTitle}
                </h2>
                
                <p 
                  className={`text-base tablet:text-lg opacity-90 max-w-md mx-auto px-sm ${hasAnimated ? 'animate-fade-in' : 'opacity-0'}`}
                  style={{ animationDelay: '1.2s' }}
                >
                  {currentTranslation.rightPanelDescription}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Background (fallback) */}
      <div className="desktop:hidden absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-orange-50 -z-10">
        <div className="absolute inset-0 bg-white/80" />
      </div>
    </section>
  );
});

Offer.displayName = 'Offer';

export default Offer;