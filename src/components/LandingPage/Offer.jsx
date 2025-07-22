import React, { useState, useCallback, useMemo, useEffect } from "react";
import { ArrowRight, Sparkles, Users, Shield, Zap, Star, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

const Offer = React.memo(({ language = "English" }) => {
  const [activeCard, setActiveCard] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

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
      rightPanelDescription: "Empowering the future of financial services through cutting-edge technology and inclusive design.",
      exploreMore: "Explore Features",
      trustedBy: "Trusted by thousands"
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
      rightPanelDescription: "Ƙarfafa makomar sabis na kudi ta hanyar fasaha da tsarin haɗawa.",
      exploreMore: "Duba Abubuwa",
      trustedBy: "Amintattun mutane dubu-dubu"
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
      rightPanelDescription: "Inyere aka n'ọdịnihu nke ọrụ ego site na teknụzụ na nhazi nke gụnyere onye ọ bụla.",
      exploreMore: "Chọpụta Ihe",
      trustedBy: "Ndị pụrụ ịdabere na ya ọtụtụ puku"
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
      rightPanelDescription: "Fifun agbara si ọjọ iwaju ti awọn iṣẹ inawo nipasẹ imọ-ẹrọ ti o ga julọ ati apẹrẹ ti o ni ifisi.",
      exploreMore: "Wo Awọn Ẹya",
      trustedBy: "Ti awọn egberun gbẹkẹle"
    }
  }), []);

  const content = useMemo(() => ({
    English: {
      cards: [
        {
          icon: <Users className="w-6 h-6" />,
          title: "Inclusive Financial Access",
          description: "We ensure that everyone, regardless of location or background, has the opportunity to access modern financial services.",
          metric: "10M+",
          metricLabel: "Users Served"
        },
        {
          icon: <Shield className="w-6 h-6" />,
          title: "Reliable and Seamless Services",
          description: "Our focus is on providing stable and trustworthy services that streamline your financial operations.",
          metric: "99.9%",
          metricLabel: "Uptime"
        },
        {
          icon: <Zap className="w-6 h-6" />,
          title: "Innovative Financial Experiences",
          description: "We continuously strive to innovate and improve how you manage and grow your finances.",
          metric: "24/7",
          metricLabel: "Support"
        }
      ]
    },
    Hausa: {
      cards: [
        {
          icon: <Users className="w-6 h-6" />,
          title: "Damar Samun Kudi Ga Kowa",
          description: "Muna tabbatar da cewa kowa, ba tare da la'akari da wurin da yake ko matsayin sa ba, yana da damar samun sabbin hanyoyin kudi.",
          metric: "10M+",
          metricLabel: "Masu Amfani"
        },
        {
          icon: <Shield className="w-6 h-6" />,
          title: "Ayyuka Masu Amfani da Tsaro",
          description: "Muna mayar da hankali wajen samar da ayyuka masu aminci da sauki, wanda zai taimaka wajen gudanar da harkokin kudi.",
          metric: "99.9%",
          metricLabel: "Aiki"
        },
        {
          icon: <Zap className="w-6 h-6" />,
          title: "Hanyoyin Inganta Kudi",
          description: "Muna ci gaba da ƙoƙarin sabunta hanyoyin da za a sarrafa kudi da kuma haɓaka nasarorin ku.",
          metric: "24/7",
          metricLabel: "Tallafi"
        }
      ]
    },
    Igbo: {
      cards: [
        {
          icon: <Users className="w-6 h-6" />,
          title: "Inweta Ego N'oge Ọ bụla",
          description: "Anyị na-eme ka ọ bụrụ na onye ọ bụla nwere ohere iji nweta ọrụ ego nke oge a.",
          metric: "10M+",
          metricLabel: "Ndị Ọrụ"
        },
        {
          icon: <Shield className="w-6 h-6" />,
          title: "Ego Nchekwa na Nchebe",
          description: "Anyị na-elekwasị anya n'inye ọrụ dị nchebe na nke a pụrụ ịdabere na ya, nke na-eme ka ị na-arụ ọrụ ego gị na-adị mfe.",
          metric: "99.9%",
          metricLabel: "Oge Ọrụ"
        },
        {
          icon: <Zap className="w-6 h-6" />,
          title: "Omenala Ịma Egwuregwu",
          description: "Anyị na-agbaso imepụta na mmezi ngwa ọrụ akụ na ụba.",
          metric: "24/7",
          metricLabel: "Nkwado"
        }
      ]
    },
    Yoruba: {
      cards: [
        {
          icon: <Users className="w-6 h-6" />,
          title: "Ibi-afẹde Ti Inawo Fun Gbogbo eniyan",
          description: "A rii daju pe gbogbo eniyan, lai wo ibi ti wọn wa tabi ipo wọn, ni anfaani lati wọle si awọn iṣẹ inawo igbalode.",
          metric: "10M+",
          metricLabel: "Awọn Olumulo"
        },
        {
          icon: <Shield className="w-6 h-6" />,
          title: "Awọn iṣẹ To Duroṣinṣin ati To Lọrẹ",
          description: "A nṣe itọsọna lori gbigbe awọn iṣẹ inawo ti o dara julọ ati ti o tọ.",
          metric: "99.9%",
          metricLabel: "Akoko Iṣẹ"
        },
        {
          icon: <Zap className="w-6 h-6" />,
          title: "Iriri inawo Titun",
          description: "A n ṣafihan ọna tuntun ati ilọsiwaju bi a ṣe n ṣiṣẹda ati dagba awọn owo rẹ.",
          metric: "24/7",
          metricLabel: "Atilẹyin"
        }
      ]
    }
  }), []);

  const currentContent = content[language] || content.English;
  const currentTranslation = translations[language] || translations.English;

  const handleCardClick = useCallback((index) => {
    setActiveCard(index);
  }, []);

  return (
    <section className="relative min-h-screen bg-white overflow-hidden">
      {/* Hero Section */}
      <div className="relative">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/90 to-orange-500/20" />
          
          {/* Animated Background Elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-10 left-10 w-20 h-20 bg-orange-500/20 rounded-full blur-xl animate-pulse" />
            <div className="absolute top-1/3 right-1/4 w-32 h-32 bg-white/10 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }} />
            <div className="absolute bottom-1/4 left-1/3 w-16 h-16 bg-orange-500/30 rounded-full blur-lg animate-pulse" style={{ animationDelay: '2s' }} />
          </div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
          <div className="max-w-7xl mx-auto">
            <div className="text-center">
              {/* Badge */}
              <div className={`inline-flex items-center px-4 py-2 rounded-full bg-orange-500/20 backdrop-blur-sm border border-orange-500/30 mb-8 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                <Sparkles className="w-4 h-4 text-orange-500 mr-2" />
                <span className="text-white font-medium text-sm">
                  {currentTranslation.sectionTitle}
                </span>
              </div>

              {/* Main Heading */}
              <h1 className={`text-4xl sm:text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                {currentTranslation.subtitle}
              </h1>

              {/* Description */}
              <div className={`max-w-3xl mx-auto mb-8 transition-all duration-1000 delay-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                <p className="text-lg sm:text-xl text-white/90 mb-4">
                  <span className="font-semibold text-white">
                    {currentTranslation.mainDescription}
                  </span>
                </p>
                <p className="text-lg sm:text-xl text-white/90 font-medium">
                  {currentTranslation.subDescription}
                </p>
              </div>

              {/* CTA Button */}
              <div className={`transition-all duration-1000 delay-600 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                <button className="inline-flex items-center px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
                  <span>{currentTranslation.exploreMore}</span>
                  <ArrowRight className="w-5 h-5 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
                </button>
              </div>

              {/* Trust Indicator */}
              <div className={`mt-12 flex items-center justify-center space-x-2 transition-all duration-1000 delay-800 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-orange-500 fill-current" />
                  ))}
                </div>
                <span className="text-white/80 text-sm font-medium">
                  {currentTranslation.trustedBy}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="relative bg-white py-16 sm:py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-600/10 border border-blue-600/20 mb-6">
              <TrendingUp className="w-4 h-4 text-blue-600 mr-2" />
              <span className="text-blue-600 font-medium text-sm">
                {currentTranslation.rightPanelTitle}
              </span>
            </div>
            
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {currentTranslation.rightPanelDescription}
            </p>
          </div>

          {/* Mobile Card Stack */}
          <div className="lg:hidden space-y-6">
            {currentContent.cards.map((card, index) => (
              <div
                key={index}
                className={`bg-white rounded-2xl border-2 p-6 transition-all duration-300 ${
                  activeCard === index 
                    ? 'border-blue-600 shadow-lg transform scale-105' 
                    : 'border-gray-200 hover:border-blue-600/50'
                }`}
                onClick={() => handleCardClick(index)}
              >
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white">
                    {card.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {card.title}
                    </h3>
                    <p className="text-gray-600 mb-4 leading-relaxed">
                      {card.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-2xl font-bold text-blue-600">{card.metric}</div>
                        <div className="text-sm text-gray-500">{card.metricLabel}</div>
                      </div>
                      <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                        <ArrowRight className="w-4 h-4 text-white" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Grid */}
          <div className="hidden lg:grid lg:grid-cols-3 lg:gap-8">
            {currentContent.cards.map((card, index) => (
              <div
                key={index}
                className={`group relative bg-white rounded-2xl border-2 p-8 transition-all duration-300 cursor-pointer ${
                  activeCard === index 
                    ? 'border-blue-600 shadow-xl transform -translate-y-2' 
                    : 'border-gray-200 hover:border-blue-600/50 hover:shadow-lg hover:-translate-y-1'
                }`}
                onClick={() => handleCardClick(index)}
                onMouseEnter={() => setActiveCard(index)}
              >
                {/* Card Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="w-14 h-14 bg-blue-600 rounded-xl flex items-center justify-center text-white group-hover:bg-blue-700 transition-colors duration-300">
                    {card.icon}
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-blue-600">{card.metric}</div>
                    <div className="text-sm text-gray-500">{card.metricLabel}</div>
                  </div>
                </div>

                {/* Card Content */}
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
                    {card.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {card.description}
                  </p>
                </div>

                {/* Card Footer */}
                <div className="mt-6 flex items-center text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="text-sm font-medium">Learn more</span>
                  <ArrowRight className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform duration-300" />
                </div>

                {/* Active Indicator */}
                {activeCard === index && (
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Call to Action Section */}
      <div className="relative overflow-hidden">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#040d21] via-[#071630] to-[#0a1f3f]">
          {/* Glossy Overlay */}
          <div className="absolute inset-0 bg-blue-500/5 backdrop-blur-3xl"></div>
          {/* Radial Glow Effects */}
          <div className="absolute inset-0">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full filter blur-3xl"></div>
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full filter blur-3xl"></div>
          </div>
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6 bg-clip-text">
              {currentTranslation.callToAction}
            </h2>
            <div className="text-xl text-white/90 mb-2 backdrop-blur-xl bg-white/5 border border-white/10 rounded-large p-6 shadow-2xl">
              <motion.span 
                className="text-orange-500 font-bold block mb-2"
                animate={{ scale: [1, 1.02, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {currentTranslation.highlights.join(' • ')}
              </motion.span>
              <span className="font-semibold text-white/80">
                {currentTranslation.globalReach}
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
});

Offer.displayName = 'Offer';

export default Offer;