import React, { useState } from "react";
import { FaShieldAlt, FaClock, FaHeadset } from "react-icons/fa";
import { FaVault } from "react-icons/fa6";
import { motion } from "framer-motion";
import PropTypes from "prop-types";

const Mission = ({ language }) => {
	const [hoveredCard, setHoveredCard] = useState(null);

	const translations = {
		English: {
			title: "Our Mission",
			description: `At eVault, we are not just providing financial services; we are transforming 
			the way financial management works for people and businesses. Join us in 
			shaping a future where financial empowerment is accessible to all.`,
			features: [
				{ 
					icon: <FaShieldAlt className="w-10 h-10" />, 
					title: "Bank-Grade Security", 
					description: "Your financial data is protected with military-grade encryption and multi-layer security protocols, ensuring your assets remain completely safe.",
					readMore: "Learn about our security measures"
				},
				{ 
					icon: <FaClock className="w-10 h-10" />, 
					title: "24/7 Access", 
					description: "Manage your finances anytime, anywhere with our always-on platform. Real-time transactions and instant updates keep you in control of your money.",
					readMore: "Explore accessibility features"
				},
				{ 
					icon: <FaHeadset className="w-10 h-10" />, 
					title: "Expert Support", 
					description: "Our dedicated support team is available round-the-clock to assist you with any queries or concerns, ensuring a smooth financial experience.",
					readMore: "Contact our support team"
				},
				{ 
					icon: <FaVault className="w-10 h-10" />, 
					title: "Smart Digital Vault", 
					description: "Securely store and manage your sensitive credentials in our encrypted digital vault. Upload documents, passwords, and important files with confidence.",
					readMore: "Discover vault features"
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
					icon: <FaShieldAlt className="w-10 h-10" />, 
					title: "Aabo Banki", 
					description: "A n lo aabo to ga julọ lati da owo rẹ si pamọ, pẹlu awọn ilana aabo pupọ lati rii daju pe ohun ini rẹ wa ni aabo patapata.",
					readMore: "Kọ ẹkọ nipa awọn ilana aabo wa"
				},
				{ 
					icon: <FaClock className="w-10 h-10" />, 
					title: "Wiwọle 24/7", 
					description: "Ṣakoso owo rẹ nigbakugba, nibikibi pẹlu platform wa ti ko ni sinmi. Awọn iṣowo kiakia ati imudojuiwọn lesekese jẹ ki o ni iṣakoso owo rẹ.",
					readMore: "Ṣawari awọn ẹya wiwọle"
				},
				{ 
					icon: <FaHeadset className="w-10 h-10" />, 
					title: "Atilẹyin Onimọ", 
					description: "Awọn ẹgbẹ atilẹyin wa wa ni gbogbo akoko lati ran ọ lọwọ pẹlu eyikeyi ibeere tabi aibalẹ, n rii daju iriri owo to dara.",
					readMore: "Kan si ẹgbẹ atilẹyin wa"
				},
				{ 
					icon: <FaVault className="w-10 h-10" />, 
					title: "Apo Dijitali Ọlọgbọn", 
					description: "Ni iriri awọn iṣowo airokọ pẹlu apo wa dijitali ọlọgbọn. Fi ranṣẹ, gba, ki o si ṣakoso owo pẹlu awọn tẹ diẹ.",
					readMore: "Ṣawari awọn ẹya apo"
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
					icon: <FaShieldAlt className="w-10 h-10" />, 
					title: "Tsaron Banki", 
					description: "Ana kare bayananku na kuɗi da tsarin soja kuma da tsarin tsaro na musamman, yana tabbatar da cewa dukiyarku na nan lafiya.",
					readMore: "Koyi game da matakan tsaro"
				},
				{ 
					icon: <FaClock className="w-10 h-10" />, 
					title: "Shiga 24/7", 
					description: "Sarrafa kuɗinku a kowane lokaci, a kowace wuri tare da dandamarmu mai aiki kullum. Ayyukan nan take da sabuntawa na nan take suna ba ku iko kan kuɗinku.",
					readMore: "Bincika fasalolin samun dama"
				},
				{ 
					icon: <FaHeadset className="w-10 h-10" />, 
					title: "Tallafin Masani", 
					description: "Ƙungiyarmu ta tallafi na nan a kowane lokaci don taimaka muku da duk wata tambaya ko damuwa, yana tabbatar da kyakkyawan ƙwarewa na kuɗi.",
					readMore: "Tuntuɓi ƙungiyar tallafi"
				},
				{ 
					icon: <FaVault className="w-10 h-10" />, 
					title: "Walat Mai Hankali", 
					description: "Sami ƙwarewa mai sauƙi tare da walatmu na dijital mai hankali. Aika, karɓa, kuma sarrafa kuɗi da dan taɓawa kaɗan.",
					readMore: "Gano fasalolin walat"
				}
			]
		},
		Igbo: {
			title: "Ọrụ Anyị",
			description: `Na eVault, anyị anaghị enwe naanị ọrụ ego; anyị na-agbanwe otu esi eji ego 
			eme ihe maka ndị mmadụ na azụmaahịa. Jikọọ anyị na mmepe nke ọchịchọ gị.`,
			features: [
				{ 
					icon: <FaShieldAlt className="w-10 h-10" />, 
					title: "Nchekwa Banki", 
					description: "Ana echekwa data gị nke ego site na nchekwa dị elu nke agha na usoro nchekwa ọtụtụ ụzọ, na-ahụ na akụ gị ka dị nchekwa kpamkpam.",
					readMore: "Mụta banyere usoro nchekwa anyị"
				},
				{ 
					icon: <FaClock className="w-10 h-10" />, 
					title: "Nweta 24/7", 
					description: "Jikwaa ego gị mgbe ọ bụla, ebe ọ bụla site na platform anyị na-arụ ọrụ mgbe niile. Azụmahịa ozugbo na mmelite ozugbo na-eme ka ị nwee njikwa ego gị.",
					readMore: "Chọpụta atụmatụ nnweta"
				},
				{ 
					icon: <FaHeadset className="w-10 h-10" />, 
					title: "Nkwado Ọkachamara", 
					description: "Ndị otu nkwado anyị dị mgbe niile iji nyere gị aka na ajụjụ ọ bụla ma ọ bụ nchegbu, na-ahụ maka ahụmịhe ego dị mma.",
					readMore: "Kpọtụrụ ndị otu nkwado anyị"
				},
				{ 
					icon: <FaVault className="w-10 h-10" />, 
					title: "Akpa Dijitalụ Mara Ihe", 
					description: "Nwee ahụmịhe azụmahịa dị mfe site na akpa anyị dijitalụ mara ihe. Zipu, nata, ma jikwaa ego site na ịpị ole na ole.",
					readMore: "Chọpụta atụmatụ akpa"
				}
			]
		}
	};

	// Generate random HSL background color
	const generateRandomColor = () => {
		const hue = Math.floor(Math.random() * 360);
		const saturation = Math.floor(Math.random() * 30) + 70; // 70-100%
		const lightness = Math.floor(Math.random() * 20) + 80; // 80-100%
		return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
	};

	// Fallback to English if language not found
	const currentTranslation = translations[language] || translations.English;

	const containerVariants = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: {
				staggerChildren: 0.1,
				delayChildren: 0.2
			}
		}
	};

	const cardVariants = {
		hidden: { 
			opacity: 0, 
			scale: 0.95 
		},
		visible: { 
			opacity: 1, 
			scale: 1,
			transition: {
				duration: 0.3,
				ease: "easeOut"
			}
		}
	};

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

				{/* 2x2 Dashboard Grid */}
				<motion.div
					variants={containerVariants}
					initial="hidden"
					whileInView="visible"
					viewport={{ once: true, margin: "-50px" }}
					className="max-w-6xl mx-auto"
				>
					<div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-200 border border-gray-200 rounded-2xl overflow-hidden bg-white shadow-lg">
						{currentTranslation.features.map((feature, index) => (
							<motion.div
								key={index}
								variants={cardVariants}
								className="p-8 flex flex-col hover:bg-gray-50 transition-all duration-300 ease-in-out relative overflow-hidden group cursor-pointer"
								onMouseEnter={() => setHoveredCard(index)}
								onMouseLeave={() => setHoveredCard(null)}
								style={{
									backgroundColor: hoveredCard === index ? generateRandomColor() : 'transparent'
								}}
								whileHover={{ 
									scale: 1.02,
									transition: { duration: 0.2 }
								}}
								role="button"
								tabIndex={0}
								aria-label={`Learn more about ${feature.title}`}
							>
								{/* Content */}
								<div className="relative z-10">
									{/* Icon */}
									<div className="mb-6">
										<div className="text-purple-600 transform transition-transform duration-300 group-hover:scale-105">
											{feature.icon}
										</div>
									</div>

									{/* Title */}
									<h3 className="text-xl font-semibold text-gray-800 mb-4 transition-all duration-300 group-hover:scale-105 transform">
										{feature.title}
									</h3>

									{/* Description */}
									<p className="text-gray-600 flex-grow leading-relaxed mb-6 transition-all duration-300 group-hover:scale-105 transform">
										{feature.description}
									</p>

									{/* Read More Link */}
									<div className="mt-4">
										<span className="text-purple-600 font-medium hover:underline transition-all duration-300 cursor-pointer inline-flex items-center group">
											{feature.readMore}
											<svg 
												className="w-4 h-4 ml-2 transform transition-transform duration-300 group-hover:translate-x-1" 
												fill="none" 
												stroke="currentColor" 
												viewBox="0 0 24 24"
											>
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
											</svg>
										</span>
									</div>
								</div>

								{/* Hover effect overlay */}
								<div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
							</motion.div>
						))}
					</div>
				</motion.div>
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