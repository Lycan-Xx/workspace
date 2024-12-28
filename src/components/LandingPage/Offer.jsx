import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";

const Offer = ({ language = "English", setShowPlatform }) => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true }); // Trigger animation only once

  const translations = {
    English: {
      sectionTitle: "What We Offer",
      learnMore: "Learn More",
    },
    Hausa: {
      sectionTitle: "Abin Da Muke Bayarwa",
      learnMore: "Ƙara Koyi",
    },
    Igbo: {
      sectionTitle: "Ihe Anyị Na-Enye",
      learnMore: "Mụta Karịa",
    },
    Yoruba: {
      sectionTitle: "Ohun Ti A Npese",
      learnMore: "Kẹkọ Diẹ Sii",
    },
  };

  const content = {
    English: [
      {
        title: "Inclusive Financial Access",
        description:
          "We ensure that everyone, regardless of location or background, has the opportunity to access modern financial services.",
      },
      {
        title: "Reliable and Seamless Services",
        description:
          "Our focus is on providing stable and trustworthy services that streamline your financial operations.",
      },
      {
        title: "Innovative Financial Experiences",
        description:
          "We continuously strive to innovate and improve how you manage and grow your finances.",
      },
    ],
    Hausa: [
      {
        title: "Damar Samun Kudi Ga Kowa",
        description:
          "Muna tabbatar da cewa kowa, ba tare da la'akari da wurin da yake ko matsayin sa ba, yana da damar samun sabbin hanyoyin kudi.",
      },
      {
        title: "Ayyuka Masu Amfani da Tsaro",
        description:
          "Muna mayar da hankali wajen samar da ayyuka masu aminci da sauki, wanda zai taimaka wajen gudanar da harkokin kudi.",
      },
      {
        title: "Hanyoyin Inganta Kudi",
        description:
          "Muna ci gaba da ƙoƙarin sabunta hanyoyin da za a sarrafa kudi da kuma haɓaka nasarorin ku.",
      },
    ],
    Igbo: [
      {
        title: "Inweta Ego N’oge Ọ bụla",
        description:
          "Anyị na-eme ka ọ bụrụ na onye ọ bụla nwere ohere iji nweta ọrụ ego nke oge a.",
      },
      {
        title: "Ego Nchekwa na Nchebe",
        description:
          "Anyị na-elekwasị anya n’inye ọrụ dị nchebe na nke a pụrụ ịdabere na ya, nke na-eme ka ị na-arụ ọrụ ego gị na-adị mfe.",
      },
      {
        title: "Omenala Ịma Egwuregwu",
        description:
          "Anyị na-agbaso imepụta na mmezi ngwa ọrụ akụ na ụba.",
      },
    ],
    Yoruba: [
      {
        title: "Ibi-afẹde Ti Inawo Fun Gbogbo eniyan",
        description:
          "A rii daju pe gbogbo eniyan, lai wo ibi ti wọn wa tabi ipo wọn, ni anfaani lati wọle si awọn iṣẹ inawo igbalode.",
      },
      {
        title: "Awọn iṣẹ To Duroṣinṣin ati To Lọrẹ",
        description:
          "A nṣe itọsọna lori gbigbe awọn iṣẹ inawo ti o dara julọ ati ti o tọ.",
      },
      {
        title: "Iriri inawo Titun",
        description:
          "A n ṣafihan ọna tuntun ati ilọsiwaju bi a ṣe n ṣiṣẹda ati dagba awọn owo rẹ.",
      },
    ],
  };

  const offers = content[language] || content["English"];
  const currentTranslation = translations[language] || translations["English"];

  // Animation Variants
  const cardVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.9 },
    visible: { opacity: 1, y: 0, scale: 1 },
  };

  return (
    <section
      ref={sectionRef}
      className="relative bg-white text-gray-900 py-16 px-6 md:px-12"
    >
      <div className="relative max-w-7xl mx-auto z-10 space-y-12">
        {/* Section Title */}
        <h2 className="text-3xl md:text-[3rem] font-bold mb-4 text-orange-500">
          {currentTranslation.sectionTitle}
        </h2>

        {/* Offer Cards */}
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8">
          {offers.map((offer, index) => (
            <motion.div
              key={index}
              className="bg-white border border-gray-200 p-6 rounded-lg shadow-lg hover:shadow-xl transition-all"
              variants={cardVariants}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              whileHover={{ scale: 1.05 }}
              transition={{
                type: "spring",
                stiffness: 80,
                damping: 15,
                delay: index * 0.2,
              }}
            >
              <h3 className="text-xl font-bold text-blue-800 mb-4">
                {offer.title}
              </h3>
              <p className="text-gray-600">{offer.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Call-to-Action Button */}
        <div className="text-center">
          <button
            onClick={() => setShowPlatform(true)}
            className="mt-8 bg-blue-800 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-all"
          >
            {currentTranslation.learnMore}
          </button>
        </div>
      </div>
    </section>
  );
};

export default Offer;