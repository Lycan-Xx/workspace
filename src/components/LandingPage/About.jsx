import React, { useState } from "react";
import {
  FaChevronDown,
  FaChevronUp,
  FaQuestionCircle,
  FaNetworkWired,
  FaMobileAlt,
  FaCreditCard,
} from "react-icons/fa";
import clsx from "clsx";

const About = ({ language, setShowPlatform, setPlatformInitialView }) => {
  const [activeDropdown, setActiveDropdown] = useState(null);

  const currentLanguage = language || "English";

  const translations = {
	English: {
		title: "About eVault",
		description: (
			<>
				At <span className="font-bold">eVault</span>, we believe in empowering individuals and businesses by providing them with the financial tools they need to succeed. Our mission is to create an inclusive and accessible financial ecosystem that helps bridge gaps in financial management, making it easier for everyone to participate in the economy. <br /><br /> We are committed to delivering <span className="text-orange-500">secure</span>, <span className="text-orange-500">reliable</span>, and <span className="text-orange-500">efficient</span> financial solutions that cater to the diverse needs of our customers. Whether you're an individual looking for better financial security, or a business seeking innovative solutions to enhance your operations, we are here to help you navigate your financial journey.
			</>
		),
		learnMore: "Learn More"
	},
	Hausa: {
		title: "Game da eVault",
		description: (
			<>
				A <span className="font-bold"> eVault</span> Muna da yakinin cewa muna bai wa mutane da kasuwanci damar samun hanyoyin kudi masu aminci da saukin samu. Manufarmu ita ce gina tsarin hada-hadar kudi wanda zai tabbatar da samun dama ga kowa da kowa, wanda zai magance gibin da ke cikin gudanar da kudi, yana saukaka shiga cikin tattalin arziki. <br /> <br /> Muna da kwazo wajen bayar da sabis na kudi masu tsaro, masu kyau da inganci wadanda za su biya bukatun masu amfani da su. Ko kai mutum ne da ke neman tsaro mafi kyau a cikin kudi, ko kuma kasuwanci da ke neman sabbin hanyoyi don inganta ayyukansu, muna nan don taimaka maka wajen shawo kan duk wani lamari na kudi.
			</>
		),
		learnMore: "Koyi Kari"
	},
	Igbo: {
		title: "Maka eVault",
		description: (
			<>
				Na <span className="font-bold"> eVault </span> Anyị kwenyere n’inyere ndị mmadụ na azụmaahịa ikike iji nweta ihe ngwọta ego dị nchebe ma dị mfe. Ebumnobi anyị bụ iwulite usoro ego nke na-eme ka ọ dị mfe maka onye ọ bụla ịbanye n’ime akụ na ụba, iji kpochapụ ihe mgbochi ọ bụla na-arụ ọrụ akụ na ụba. <br /> <br /> Anyị kwadoro iji nyere ndị ahịa anyị usoro ego dị nchebe, kwụsie ike, na nke a pụrụ ịdabere na ya, nke na-enyere ha aka nweta mkpa ha. Ma gị bụ onye ọchụnta ego ma ọ bụ azụmaahịa, anyị dị ebe a iji nyere gị aka.
			</>
		),
		learnMore: "Mụta Karịa"
	},
	Yoruba: {
		title: "Nipa eVault",
		description: (
			<>
				Ni <span className="font-bold">eVault</span> A gbagbọ ninu agbara eniyan ati awọn iṣowo pẹlu awọn solusan inawo ti o ni aabo ati ti o rọrun lati wọle si.Aims wa ni lati ṣẹda eto inawo ti o ni wiwo gbogbo eniyan ati ti o rọrun lati wọle si, ti o ṣe iranlọwọ lati ṣe iwọn awọn ailagbara ni iṣakoso inawo, ṣiṣe ni irọrun fun gbogbo eniyan lati kopa ninu ọrọ-aje. <br /> <br /> A ni igbẹkẹle lati pese awọn solusan inawo to ni aabo, to ni igbẹkẹle ati to munadoko ti o yẹ fun awọn iwulo oriṣiriṣi ti awọn alabara wa. Boya o jẹ ẹni-kọọkan ti n wa aabo inawo ti o dara julọ, tabi iṣowo ti o n wa awọn solusan alailẹgbẹ lati mu awọn iṣẹ wọn dara si, a wa nibi lati ṣe iranlọwọ fun ọ ni irin-ajo rẹ.
			</>
		),
		learnMore: "Kẹkọ Diẹ Sii"
	}
};

  const faqItems = [
    {
      id: 1,
      icon: <FaQuestionCircle />,
      question: "Getting Started",
      answer:
        "Create an account and sign in with your username and password to access all services.",
      color: "red",
    },
    {
      id: 2,
      icon: <FaNetworkWired />,
      question: "What We Offer",
      answer:
        "We support airtime conversion for all major networks, ensuring hassle-free transactions.",
      color: "green",
    },
    {
      id: 3,
      icon: <FaMobileAlt />,
      question: "Instant Delivery",
      answer:
        "Check your data balance directly through our platform in real-time.",
      color: "blue",
    },
    {
      id: 4,
      icon: <FaCreditCard />,
      question: "Place Order",
      answer:
        "We accept recharge card pins and VTU for flexible payment options.",
      color: "orange",
    },
  ];

  const toggleDropdown = (id) => {
    setActiveDropdown(activeDropdown === id ? null : id);
  };

  const handleLearnMore = () => {
    setPlatformInitialView("instant-payments");
    setShowPlatform(true);
  };

  return (
    <section id="about" className="bg-white py-16 px-6 md:px-12">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        {/* Left Side */}
        <div className="relative">
          <div className="absolute inset-0 bg-cover bg-center filter blur-lg bg-blue-100"></div>
          <div className="relative z-10 bg-white p-8 rounded-3xl border border-blue-600">
            <h2 className="text-4xl font-bold mb-6">
              {translations[currentLanguage]?.title ||
                translations.English.title}
            </h2>
            <p className="text-gray-700 text-lg leading-relaxed">
              {translations[currentLanguage]?.description ||
                translations.English.description}
            </p>
            <button
              onClick={handleLearnMore}
              className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-all text-lg"
            >
              {translations[currentLanguage]?.learnMore ||
                translations.English.learnMore}
            </button>
          </div>
        </div>

        {/* Right Side */}
        <div className="space-y-6">
          {faqItems.map((item) => (
            <div
              key={item.id}
              className="border border-blue-200 bg-white rounded-2xl hover:shadow-xl transition-all"
            >
              <button
                onClick={() => toggleDropdown(item.id)}
                className={clsx(
                  "w-full flex items-center justify-between p-4 text-left transition-all rounded-2xl",
                  {
                    [`bg-${item.color}-50 text-${item.color}-800`]:
                      activeDropdown === item.id,
                    "bg-white text-gray-700": activeDropdown !== item.id,
                  }
                )}
                aria-expanded={activeDropdown === item.id}
                aria-controls={`faq-${item.id}`}
              >
                <div className="flex items-center space-x-3">
                  <span className={`text-${item.color}-500 text-2xl`}>
                    {item.icon}
                  </span>
                  <span className="font-medium text-lg">{item.question}</span>
                </div>
                <div className="transition-transform">
                  {activeDropdown === item.id ? (
                    <FaChevronUp />
                  ) : (
                    <FaChevronDown />
                  )}
                </div>
              </button>

              <div
                id={`faq-${item.id}`}
                className={clsx(
                  "overflow-hidden transition-all",
                  activeDropdown === item.id
                    ? "max-h-96 opacity-100"
                    : "max-h-0 opacity-0"
                )}
              >
                <div className="p-4 border-t text-gray-700">{item.answer}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;
