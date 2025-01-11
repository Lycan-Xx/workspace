import React from "react";
import { FaShieldAlt, FaClock, FaHeadset, FaWallet } from "react-icons/fa";
import { FaVault } from "react-icons/fa6";

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
				{ 
					icon: <FaShieldAlt className="w-8 h-8 text-blue-500" />, 
					title: "Bank-Grade Security", 
					description: "Your financial data is protected with military-grade encryption and multi-layer security protocols, ensuring your assets remain completely safe." 
				},
				{ 
					icon: <FaClock className="w-8 h-8 text-blue-500" />, 
					title: "24/7 Access", 
					description: "Manage your finances anytime, anywhere with our always-on platform. Real-time transactions and instant updates keep you in control of your money." 
				},
				{ 
					icon: <FaHeadset className="w-8 h-8 text-blue-500" />, 
					title: "Expert Support", 
					description: "Our dedicated support team is available round-the-clock to assist you with any queries or concerns, ensuring a smooth financial experience." 
				},
				{ 
					icon: <FaVault className="w-8 h-8 text-blue-500" />, 
					title: "Smart Digital Vault", 
					description: "Securely store and manage your sensitive credentials in our encrypted digital vault. Upload documents, passwords, and important files with confidence, knowing they're protected by advanced security measures."
				}
			]
		},
		Yoruba: {
			title: "Ise Wa",
			description: `Ni eVault, a ko nikan ni awọn iṣẹ inawo; a n ṣe iyipada bii iṣakoso owo 
			ṣe ṣiṣẹ fun awọn eniyan ati awọn iṣowo. Darapọ mọ wa ninu ẹda ọjọ 
			iwaju nibiti agbara inawo ti wa fun gbogbo eniyan.`,
			features: [
				{ 
					icon: <FaShieldAlt className="w-8 h-8 text-blue-500" />, 
					title: "Aabo Banki", 
					description: "A n lo aabo to ga julọ lati da owo rẹ si pamọ, pẹlu awọn ilana aabo pupọ lati rii daju pe ohun ini rẹ wa ni aabo patapata." 
				},
				{ 
					icon: <FaClock className="w-8 h-8 text-blue-500" />, 
					title: "Wiwọle 24/7", 
					description: "Ṣakoso owo rẹ nigbakugba, nibikibi pẹlu platform wa ti ko ni sinmi. Awọn iṣowo kiakia ati imudojuiwọn lesekese jẹ ki o ni iṣakoso owo rẹ." 
				},
				{ 
					icon: <FaHeadset className="w-8 h-8 text-blue-500" />, 
					title: "Atilẹyin Onimọ", 
					description: "Awọn ẹgbẹ atilẹyin wa wa ni gbogbo akoko lati ran ọ lọwọ pẹlu eyikeyi ibeere tabi aibalẹ, n rii daju iriri owo to dara." 
				},
				{ 
					icon: <FaVault className="w-8 h-8 text-blue-500" />, 
					title: "Apo Dijitali Ọlọgbọn", 
					description: "Ni iriri awọn iṣowo airokọ pẹlu apo wa dijitali ọlọgbọn. Fi ranṣẹ, gba, ki o si ṣakoso owo pẹlu awọn tẹ diẹ." 
				}
			]
		},
		Hausa: {
			title: "Manufarmu",
			description: `A eVault, ba wai kawai muna bayar da sabis na kudi ba, muna canza yadda 
			tsarin kula da kudi ke aiki ga mutane da kasuwanci. Ku kasance tare da mu 
			don gina wani makomar da samun damar kudi zai zama na kowa.`,
			features: [
				{ 
					icon: <FaShieldAlt className="w-8 h-8 text-blue-500" />, 
					title: "Tsaron Banki", 
					description: "Ana kare bayananku na kuɗi da tsaron soja kuma da tsarin tsaro na musamman, yana tabbatar da cewa dukiyarku na nan lafiya." 
				},
				{ 
					icon: <FaClock className="w-8 h-8 text-blue-500" />, 
					title: "Shiga 24/7", 
					description: "Sarrafa kuɗinku a kowane lokaci, a kowace wuri tare da dandamarmu mai aiki kullum. Ayyukan nan take da sabuntawa na nan take suna ba ku iko kan kuɗinku." 
				},
				{ 
					icon: <FaHeadset className="w-8 h-8 text-blue-500" />, 
					title: "Tallafin Masani", 
					description: "Ƙungiyarmu ta tallafi na nan a kowane lokaci don taimaka muku da duk wata tambaya ko damuwa, yana tabbatar da kyakkyawan ƙwarewa na kuɗi." 
				},
				{ 
					icon: <FaVault className="w-8 h-8 text-blue-500" />, 
					title: "Walat Mai Hankali", 
					description: "Sami ƙwarewa mai sauƙi tare da walatmu na dijital mai hankali. Aika, karɓa, kuma sarrafa kuɗi da dan taɓawa kaɗan." 
				}
			]
		},
		Igbo: {
			title: "Ọrụ Anyị",
			description: `Na eVault, anyị anaghị enwe naanị ọrụ ego; anyị na-agbanwe otu esi eji ego 
			eme ihe maka ndị mmadụ na azụmaahịa. Jikọọ anyị na mmepe nke ọchịchọ gị.`,
			features: [
				{ 
					icon: <FaShieldAlt className="w-8 h-8 text-blue-500" />, 
					title: "Nchekwa Banki", 
					description: "Ana echekwa data gị nke ego site na nchekwa dị elu nke agha na usoro nchekwa ọtụtụ ụzọ, na-ahụ na akụ gị ka dị nchekwa kpamkpam." 
				},
				{ 
					icon: <FaClock className="w-8 h-8 text-blue-500" />, 
					title: "Nweta 24/7", 
					description: "Jikwaa ego gị mgbe ọ bụla, ebe ọ bụla site na platform anyị na-arụ ọrụ mgbe niile. Azụmahịa ozugbo na mmelite ozugbo na-eme ka ị nwee njikwa ego gị." 
				},
				{ 
					icon: <FaHeadset className="w-8 h-8 text-blue-500" />, 
					title: "Nkwado Ọkachamara", 
					description: "Ndị otu nkwado anyị dị mgbe niile iji nyere gị aka na ajụjụ ọ bụla ma ọ bụ nchegbu, na-ahụ maka ahụmịhe ego dị mma." 
				},
				{ 
					icon: <FaVault className="w-8 h-8 text-blue-500" />, 
					title: "Akpa Dijitalụ Mara Ihe", 
					description: "Nwee ahụmịhe azụmahịa dị mfe site na akpa anyị dijitalụ mara ihe. Zipu, nata, ma jikwaa ego site na ịpị ole na ole." 
				}
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
					viewport={{ once: true, margin: "-100px" }}
					transition={{ 
						duration: 0.6,
						ease: [0.645, 0.045, 0.355, 1.000]
					}}
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
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 justify-items-center max-w-5xl mx-auto">
					{currentTranslation.features.map((feature, index) => (
						<motion.div
							key={index}
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true, margin: "-50px" }}
							transition={{ 
								duration: 0.5,
								delay: index * 0.1,
								ease: [0.645, 0.045, 0.355, 1.000]
							}}
							whileHover={{ 
								scale: 1.02,
								transition: { duration: 0.2 }
							}}
							className="bg-white w-full p-6 rounded-xl shadow-md 
								hover:shadow-xl transition-all duration-300
								border border-blue-100 backdrop-blur-sm"
						>
							<div className="flex flex-col items-center">
								<div className="mb-4 transform transition-transform duration-300 hover:scale-110">
									{feature.icon}
								</div>
								<h3 className="text-xl font-semibold mb-3 text-gray-800">
									{feature.title}
								</h3>
								<p className="text-gray-600 text-center leading-relaxed">
									{feature.description}
								</p>
							</div>
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
