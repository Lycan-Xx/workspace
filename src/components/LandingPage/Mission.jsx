import React from "react";
import { motion } from "framer-motion";
import imageSrc from "../assets/smiling-image.jpg"; // Fix import path

const Mission = ({ language }) => {
  const translations = {
    English: {
      title: "Our Mission",
      description: `At eVault, we are not just providing financial services; we are transforming 
      the way financial management works for people and businesses. Join us in 
      shaping a future where financial empowerment is accessible to all.`,
    },
    Hausa: {
      title: "Manufarmu",
      description: `A eVault, ba wai kawai muna bayar da sabis na kudi ba, muna canza yadda 
      tsarin kula da kudi ke aiki ga mutane da kasuwanci. Ku kasance tare da mu 
      don gina wani makomar da samun damar kudi zai zama na kowa.`,
    },
    Igbo: {
      title: "Ebumnuche Anyị",
      description: `Na eVault, anyị anaghị enwe naanị ọrụ ego; anyị na-agbanwe otu esi eji ego 
      eme ihe maka ndị mmadụ na azụmaahịa. Jikọọ anyị na mmepe nke ọchịchọ gị.`,
    },
    Yoruba: {
      title: "Ise Wa",
      description: `Ni eVault, a ko nikan ni awọn iṣẹ inawo; a n ṣe iyipada bii iṣakoso owo 
      ṣe ṣiṣẹ fun awọn eniyan ati awọn iṣowo. Darapọ mọ wa ninu ẹda ọjọ 
      iwaju nibiti agbara inawo ti wa fun gbogbo eniyan.`,
    },
  };

  const variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } },
  };

  const currentTranslation = translations[language] || translations.English;

  return (
    <section className="bg-[#000B5B] text-white px-6 py-16 md:py-24">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-6xl font-bold text-orange-400">
          Why You Should Choose eVault
        </h2>
      </div>

      {/* 2x2 Grid for Cards */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Card 1 */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={variants}
          className="flex flex-col items-center bg-white/10 backdrop-blur-sm p-6 rounded-lg border-2 border-orange-400 shadow-md"
        >
          <img
            src={imageSrc}
            alt="Smiling Visual"
            className="w-full max-w-[300px] h-auto rounded-lg mb-6"
          />
          <h3 className="text-2xl font-semibold text-orange-400">
            Financial Empowerment
          </h3>
          <p className="text-sm text-gray-300 text-center">
            Transform the way financial management works with eVault.
          </p>
        </motion.div>

        {/* Card 2 */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={variants}
          className="flex flex-col items-center bg-white/10 backdrop-blur-sm p-6 rounded-lg border-2 border-orange-400 shadow-md"
        >
          <h3 className="text-2xl font-semibold text-orange-400 mb-4">
            {currentTranslation.title}
          </h3>
          <p className="text-sm text-gray-300 text-center">
            {currentTranslation.description.trim()}
          </p>
        </motion.div>

        {/* Card 3 */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={variants}
          className="flex flex-col items-center bg-white/10 backdrop-blur-sm p-6 rounded-lg border-2 border-orange-400 shadow-md"
        >
          <img
            src="https://picsum.photos/200/300" // Placeholder image
            alt="Innovation"
            className="w-full max-w-[300px] h-auto rounded-lg mb-6"
          />
          <h3 className="text-2xl font-semibold text-orange-400">Innovation</h3>
          <p className="text-sm text-gray-300 text-center">
            Pioneering cutting-edge financial solutions for businesses.
          </p>
        </motion.div>

        {/* Card 4 */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={variants}
          className="flex flex-col items-center bg-white/10 backdrop-blur-sm p-6 rounded-lg border-2 border-orange-400 shadow-md"
        >
          <h3 className="text-2xl font-semibold text-orange-400 mb-4">
            Customer Focus
          </h3>
          <p className="text-sm text-gray-300 text-center">
            Empowering individuals and businesses with reliable services.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default Mission;
