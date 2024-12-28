import React from "react";
import { Clock, Shield, HeadphonesIcon, Wallet } from "lucide-react";
import { motion } from "framer-motion";
import PropTypes from "prop-types";


  const Mission = ({ language }) => {
	const translations = {
	  English: {
		title: "Our Mission",
		description: `At eVault, we are not just providing financial services; we are transforming 
		the way financial management works for people and businesses. Join us in 
		shaping a future where financial empowerment is accessible to all.`,
		features: [
		  { icon: <Shield className="w-8 h-8 text-blue-500" />, title: "Secure", description: "Bank-grade security" },
		  { icon: <Clock className="w-8 h-8 text-blue-500" />, title: "24/7 Access", description: "Manage finances anytime" },
		  { icon: <HeadphonesIcon className="w-8 h-8 text-blue-500" />, title: "Support", description: "Round-the-clock assistance" },
		  { icon: <Wallet className="w-8 h-8 text-blue-500" />, title: "Digital Wallet", description: "Easy transactions" }
		]
	  },
	  Yoruba: {
		title: "Ise Wa",
		description: `Ni eVault, a ko nikan ni awọn iṣẹ inawo; a n ṣe iyipada bii iṣakoso owo 
		ṣe ṣiṣẹ fun awọn eniyan ati awọn iṣowo. Darapọ mọ wa ninu ẹda ọjọ 
		iwaju nibiti agbara inawo ti wa fun gbogbo eniyan.`,
		features: [
		  { icon: <Shield className="w-8 h-8 text-blue-500" />, title: "Aabo", description: "Aabo banki" },
		  { icon: <Clock className="w-8 h-8 text-blue-500" />, title: "Wiwọle 24/7", description: "Ṣakoso owo nigbakugba" },
		  { icon: <HeadphonesIcon className="w-8 h-8 text-blue-500" />, title: "Atilẹyin", description: "Iranlọwọ ni gbogbo akoko" },
		  { icon: <Wallet className="w-8 h-8 text-blue-500" />, title: "Apo Dijitali", description: "Awọn iṣowo rọrun" }
		]
	  },
	  Hausa: {
		title: "Manufarmu",
		description: `A eVault, ba wai kawai muna bayar da sabis na kudi ba, muna canza yadda 
		tsarin kula da kudi ke aiki ga mutane da kasuwanci. Ku kasance tare da mu 
		don gina wani makomar da samun damar kudi zai zama na kowa.`,
		features: [
		  { icon: <Shield className="w-8 h-8 text-blue-500" />, title: "Tsaro", description: "Tsaron banki" },
		  { icon: <Clock className="w-8 h-8 text-blue-500" />, title: "Shiga 24/7", description: "Gudanar da kudi koyaushe" },
		  { icon: <HeadphonesIcon className="w-8 h-8 text-blue-500" />, title: "Tallafi", description: "Taimako a kowane lokaci" },
		  { icon: <Wallet className="w-8 h-8 text-blue-500" />, title: "Walat Dijital", description: "Saukin biyan kudi" }
		]
	  },
	  Igbo: {
		title: "Ọrụ Anyị",
		description: `Na eVault, anyị anaghị enwe naanị ọrụ ego; anyị na-agbanwe otu esi eji ego 
		eme ihe maka ndị mmadụ na azụmaahịa. Jikọọ anyị na mmepe nke ọchịchọ gị.`,
		features: [
		  { icon: <Shield className="w-8 h-8 text-blue-500" />, title: "Nchekwa", description: "Nchekwa banki" },
		  { icon: <Clock className="w-8 h-8 text-blue-500" />, title: "Nweta 24/7", description: "Jikwaa ego mgbe ọ bụla" },
		  { icon: <HeadphonesIcon className="w-8 h-8 text-blue-500" />, title: "Nkwado", description: "Enyemaka mgbe niile" },
		  { icon: <Wallet className="w-8 h-8 text-blue-500" />, title: "Wallet Dijitalụ", description: "Mfe azụmahịa" }
		]
	  }
	};


  // Fallback to English if language not found
  const currentTranslation = translations[language] || translations.English;

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Title and Description */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-orange-500">
            {currentTranslation.title}
          </h2>
          <p className="max-w-2xl mx-auto text-lg text-gray-600 leading-relaxed">
            {currentTranslation.description}
          </p>
        </motion.div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 justify-items-center max-w-5xl mx-auto">
          {currentTranslation.features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white w-full min-w-[280px] h-[180px] rounded-xl shadow-md 
                     hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 
                     border border-blue-100 backdrop-blur-sm 
                     flex flex-col items-center justify-center p-6 
                     hover:border-blue-300"
            >
              <div className="mb-3 transform hover:scale-110 transition-transform">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2 text-center text-gray-800">
                {feature.title}
              </h3>
              <p className="text-gray-600 text-center text-sm">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

Mission.propTypes = {
  language: PropTypes.oneOf(["English", "Yoruba", "Hausa", "Igbo"]).isRequired,
};

Mission.defaultProps = {
  language: "English",
};

export default Mission;
