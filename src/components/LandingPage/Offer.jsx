import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";

const Offer = ({ language = "English" }) => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true }); // Trigger animation only once

  const translations = {
    English: {
      sectionTitle: "What We Offer",
    },
    Hausa: {
      sectionTitle: "Abin Da Muke Bayarwa",
    },
    Igbo: {
      sectionTitle: "Ihe Anyị Na-Enye",
    },
    Yoruba: {
      sectionTitle: "Ohun Ti A Npese",
    },
  };

  const content = {
    English: {
      cards: [
        {
          title: "Inclusive Financial Access",
          CardDescription: "We ensure that everyone, regardless of location or background, has the opportunity to access modern financial services.",
        },
        {
          title: "Reliable and Seamless Services",
          CardDescription: "Our focus is on providing stable and trustworthy services that streamline your financial operations.",
        },
        {
          title: "Innovative Financial Experiences",
          CardDescription: "We continuously strive to innovate and improve how you manage and grow your finances.",
        },
      ],
      description: (
        <>
          <span className="text-black font-semibold">We are not just providing financial services</span> <br /> <br />
          We are transforming the way financial management works for PEOPLE and BUSINESSES. <br />
          <span className="text-[#025798] font-semibold">Join us</span> in shaping a future where financial empowerment is accessible to all. Together, we can create new opportunities and drive positive change for <span className="text-orange-500 font-semibold">Individuals, Businesses,</span> and <span className="text-orange-500 font-semibold">Communities</span> across the globe.
        </>
      )
    },
    Hausa: {
      cards: [
        {
          title: "Damar Samun Kudi Ga Kowa",
          CardDescription: "Muna tabbatar da cewa kowa, ba tare da la'akari da wurin da yake ko matsayin sa ba, yana da damar samun sabbin hanyoyin kudi.",
        },
        {
          title: "Ayyuka Masu Amfani da Tsaro",
          CardDescription: "Muna mayar da hankali wajen samar da ayyuka masu aminci da sauki, wanda zai taimaka wajen gudanar da harkokin kudi.",
        },
        {
          title: "Hanyoyin Inganta Kudi",
          CardDescription: "Muna ci gaba da ƙoƙarin sabunta hanyoyin da za a sarrafa kudi da kuma haɓaka nasarorin ku.",
        },
      ],
      description: (
        <>
          Ba wai kawai muna bayar da sabis na kudi ba, muna canza yadda tsarin kula da kudi ke aiki ga mutane da kasuwanci. Ku kasance tare da mu don gina wani makomar da samun damar kudi zai zama na kowa.
        </>
      ),
    },
    Igbo: {
      cards: [
        {
          title: "Inweta Ego N’oge Ọ bụla",
          CardDescription: "Anyị na-eme ka ọ bụrụ na onye ọ bụla nwere ohere iji nweta ọrụ ego nke oge a.",
        },
        {
          title: "Ego Nchekwa na Nchebe",
          CardDescription: "Anyị na-elekwasị anya n’inye ọrụ dị nchebe na nke a pụrụ ịdabere na ya, nke na-eme ka ị na-arụ ọrụ ego gị na-adị mfe.",
        },
        {
          title: "Omenala Ịma Egwuregwu",
          CardDescription: "Anyị na-agbaso imepụta na mmezi ngwa ọrụ akụ na ụba.",
        },
      ],
      description: (
        <>
          Anyị anaghị enwe naanị ọrụ ego; anyị na-agbanwe otu esi eji ego eme ihe maka ndị mmadụ na azụmaahịa. Jikọọ anyị na mmepe nke ọchịchọ gị.
        </>
      ),
    },
    Yoruba: {
      cards: [
        {
          title: "Ibi-afẹde Ti Inawo Fun Gbogbo eniyan",
          CardDescription: "A rii daju pe gbogbo eniyan, lai wo ibi ti wọn wa tabi ipo wọn, ni anfaani lati wọle si awọn iṣẹ inawo igbalode.",
        },
        {
          title: "Awọn iṣẹ To Duroṣinṣin ati To Lọrẹ",
          CardDescription: "A nṣe itọsọna lori gbigbe awọn iṣẹ inawo ti o dara julọ ati ti o tọ.",
        },
        {
          title: "Iriri inawo Titun",
          CardDescription: "A n ṣafihan ọna tuntun ati ilọsiwaju bi a ṣe n ṣiṣẹda ati dagba awọn owo rẹ.",
        },
      ],
      description: (
        <>
          A ko nikan ni awọn iṣẹ inawo; a n ṣe iyipada bii iṣakoso owo ṣe ṣiṣẹ fun awọn eniyan ati awọn iṣowo. Darapọ mọ wa ninu ẹda ọjọ iwaju nibiti agbara inawo ti wa fun gbogbo eniyan.
        </>
      ),
    },
  };

  const currentContent = content[language] || content["English"];
  const currentTranslation = translations[language] || translations["English"];

  // Animation Variants
  const cardVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.9 },
    visible: { opacity: 1, y: 0, scale: 1 },
  };

  return (
    <section
      ref={sectionRef}
      className="relative bg-white text-gray-900 py-8 sm:py-12 md:py-16 px-4 sm:px-6 md:px-12"
    >
      <div className="relative max-w-7xl mx-auto z-10 space-y-8 sm:space-y-12">
        {/* Section Title */}
        <h2 className="text-2xl sm:text-3xl md:text-[3rem] font-bold mb-4 text-orange-500 text-center">
          {currentTranslation.sectionTitle}
        </h2>

        {/* Description Section with rounded border */}
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-8 sm:mb-16"
          >
            <div className="max-w-4xl mx-auto border-2 border-gray-200 rounded-2xl p-6 sm:p-8 shadow-sm hover:shadow-md transition-shadow duration-300 bg-white">
              <p className="text-base sm:text-lg md:text-[1.2rem] text-gray-600 leading-relaxed">
                {currentContent.description}
              </p>
            </div>
          </motion.div>
        </div>

        {/* Offer Cards - Updated grid for better responsiveness */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          {currentContent.cards.map((offer, index) => (
            <motion.div
              key={index}
              className="bg-white border border-gray-200 p-4 sm:p-6 rounded-lg shadow-lg hover:shadow-xl transition-all"
              variants={cardVariants}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              whileHover={{ scale: 1.02 }}
              transition={{
                type: "spring",
                stiffness: 80,
                damping: 15,
                delay: index * 0.1,
              }}
            >
              <h3 className="text-lg sm:text-xl font-bold text-blue-800 mb-3 sm:mb-4">
                {offer.title}
              </h3>
              <p className="text-sm sm:text-base text-gray-600">
                {offer.CardDescription}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Offer;
