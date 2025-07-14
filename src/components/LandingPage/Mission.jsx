import React, { useState, useRef, useEffect } from "react";
import { FaShieldAlt, FaClock, FaHeadset } from "react-icons/fa";
import { FaVault } from "react-icons/fa6";
import { motion } from "framer-motion";
import PropTypes from "prop-types";
import video from "../assets/background-video.mp4";

const Mission = ({ language = "English" }) => {
	const [hoveredCard, setHoveredCard] = useState(null);
	const videoRef = useRef(null);

	useEffect(() => {
		const videoElement = videoRef.current;
		if (videoElement) {
			videoElement.playbackRate = 0.75;
			
			const handlePlay = async () => {
				try {
					await videoElement.play();
				} catch (error) {
					console.log('Video autoplay prevented:', error);
				}
			};

			const handleStall = () => {
				// If video stalls, try to resume playback
				videoElement.currentTime = 0;
				handlePlay();
			};

			// Add event listeners for better playback handling
			videoElement.addEventListener('loadeddata', handlePlay);
			videoElement.addEventListener('stalled', handleStall);
			videoElement.addEventListener('suspend', handlePlay);

			return () => {
				// Cleanup event listeners
				videoElement.removeEventListener('loadeddata', handlePlay);
				videoElement.removeEventListener('stalled', handleStall);
				videoElement.removeEventListener('suspend', handlePlay);
			};
		}
	}, []);

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

	// Animation variants for container and cards
	const containerVariants = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: {
				staggerChildren: 0.2,
				delayChildren: 0.3,
				duration: 0.8,
				ease: [0.645, 0.045, 0.355, 1.000]
			}
		}
	};

	const cardVariants = {
		hidden: { 
			opacity: 0, 
			scale: 0.9,
			y: 30
		},
		visible: { 
			opacity: 1, 
			scale: 1,
			y: 0,
			transition: {
				duration: 0.8,
				ease: [0.215, 0.610, 0.355, 1.000]
			}
		},
		hover: {
			scale: 1.03,
			y: -8,
			transition: {
				duration: 0.3,
				ease: [0.215, 0.610, 0.355, 1.000]
			}
		}
	};

	return (
		<section className="relative min-h-screen overflow-hidden">
			{/* Video Background */}
			<video 
				ref={videoRef}
				autoPlay 
				loop 
				muted 
				playsInline
				preload="auto"
				className="absolute top-0 left-0 w-full h-full object-cover z-0"
				poster={video.replace('.mp4', '-poster.jpg')} // Optional: Add a poster image while video loads
			>
				<source src={video} type="video/mp4" />
			</video>

			{/* Dark overlay */}
			<div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-black/70 via-black/50 to-black/70 z-1">
			</div>

			<div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-24">
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
					<div className="max-w-4xl mx-auto">
						<h2 className="text-4xl tablet:text-5xl font-bold mb-6 bg-gradient-to-r from-orange-500 to-orange-400 bg-clip-text text-transparent">
							{currentTranslation.title}
						</h2>
						<p className="text-xl text-white/80 leading-relaxed">
							{currentTranslation.description}
						</p>
					</div>
				</motion.div>

				{/* Features Grid */}
				<motion.div
					variants={containerVariants}
					initial="hidden"
					whileInView="visible"
					viewport={{ once: true, margin: "-50px" }}
					className="max-w-7xl mx-auto mt-16"
				>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
						{currentTranslation.features.map((feature, index) => (
							<motion.div
								key={index}
								variants={cardVariants}
								initial="hidden"
								animate="visible"
								whileHover="hover"
								className="p-8 flex flex-col relative overflow-hidden group cursor-pointer rounded-xl bg-black/30 backdrop-blur-sm border-4 transition-all duration-300"
								onMouseEnter={() => {
									setHoveredCard(index);
								}}
								onMouseLeave={() => {
									setHoveredCard(null);
								}}
								style={{
									borderColor: hoveredCard === index ? generateRandomColor() : 'rgba(255,255,255,0.1)'
								}}
								role="button"
								tabIndex={0}
								aria-label={`Learn more about ${feature.title}`}
							>
								{/* Content */}
								<motion.div 
									className="relative z-10"
									variants={{
										hover: {
											y: -5,
											transition: { duration: 0.2 }
										}
									}}
								>
									{/* Icon */}
									<motion.div 
										className="mb-md m-8"
										variants={{
											hover: {
												scale: 1.1,
												transition: { duration: 0.2 }
											}
										}}
									>
										<div className="text-orange-400 transform">
											{feature.icon}
										</div>
									</motion.div>

									{/* Title */}
									<motion.h3 
										className="text-xl font-semibold text-white mb-4"
										variants={{
											hover: {
												scale: 1.05,
												transition: { duration: 0.2 }
											}
										}}
									>
										{feature.title}
									</motion.h3>

									{/* Description */}
									<motion.p 
										className="text-gray-600 flex-grow leading-relaxed mb-md"
										variants={{
											hover: {
												y: 0,
												transition: { duration: 0.2 }
											}
										}}
									>
										{feature.description}
									</motion.p>

									{/* Read More Link */}
									<motion.div 
										className="mt-sm"
										variants={{
											hover: {
												x: 5,
												transition: { duration: 0.2 }
											}
										}}
									>
										<span className="text-blue-600 font-medium hover:text-blue-700 transition-colors duration-300 cursor-pointer inline-flex items-center group">
											{feature.readMore}
											<motion.svg 
												className="w-4 h-4 ml-2" 
												fill="none" 
												stroke="currentColor" 
												viewBox="0 0 24 24"
												variants={{
													hover: {
														x: 5,
														transition: { duration: 0.2 }
													}
												}}
											>
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
											</motion.svg>
										</span>
									</motion.div>
								</motion.div>

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
	language: PropTypes.oneOf(["English", "Yoruba", "Hausa", "Igbo"]),
};

export default Mission;