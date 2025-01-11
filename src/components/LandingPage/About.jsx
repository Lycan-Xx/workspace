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

const About = ({ language }) => {
  const [activeDropdown, setActiveDropdown] = useState(null);

  const currentLanguage = language || "English";

  const translations = {
	English: {
		title: "About eVault",
		description: (
			<>
<span>At eVault, we believe in empowering individuals and businesses by providing them with the financial tools they need to succeed. Our mission is to create an inclusive and accessible financial ecosystem that helps bridge gaps in financial management, making it easier for everyone to participate in the economy.</span>
<br />
<br />
We are committed to delivering secure, reliable, and efficient financial solutions that cater to the...
			</>
		),
	},
	Hausa: {
		title: "Game da eVault",
		description: (
			<>
<span> A eVault, muna da yakinin cewa muna bai wa mutane da kasuwanci damar samun hanyoyin kudi masu aminci da saukin samu. Manufarmu ita ce gina tsarin hada-hadar kudi wanda zai tabbatar da samun dama ga kowa da kowa, wanda zai magance gibin da ke cikin gudanar da kudi, yana saukaka shiga cikin tattalin arziki.</span>
<br />
<br />
Muna da kwazo wajen bayar da sabis na kudi masu tsaro, masu kyau da inganci wadanda za su biya bukatun masu...
</>
		),
	},
	Igbo: {
		title: "Maka eVault",
		description: (
			<>
<span>Na eVault, anyị kwenyere n’inyere ndị mmadụ na azụmaahịa ikike iji nweta ihe ngwọta ego dị nchebe ma dị mfe. Ebumnobi anyị bụ iwulite usoro ego nke na-eme ka ọ dị mfe maka onye ọ bụla ịbanye n’ime akụ na ụba, iji kpochapụ ihe mgbochi ọ bụla na-arụ ọrụ akụ na ụba.</span>
<br />
<br />
Anyị kwadoro iji nyere ndị ahịa anyị usoro ego dị nchebe, kwụsie ike, na nke a pụrụ ịdabere na ya, nke na-enyere ha aka...
</>
		),
	},
	Yoruba: {
		title: "Nipa eVault",
		description: (
			<>
<span>Ni eVault, a gbagbọ ninu agbara eniyan ati awọn iṣowo pẹlu awọn solusan inawo ti o ni aabo ati ti o rọrun lati wọle si. Aims wa ni lati ṣẹda eto inawo ti o ni wiwo gbogbo eniyan ati ti o rọrun lati wọle si, ti o ṣe iranlọwọ lati ṣe iwọn awọn ailagbara ni iṣakoso inawo, ṣiṣe ni irọrun fun gbogbo eniyan lati kopa ninu ọrọ-aje.</span>
<br />
<br />
A ni igbẹkẹle lati pese awọn solusan inawo to ni aabo, to ni igbẹkẹle ati to munadoko ti o yẹ fun awọn iwulo oriṣiriṣi ti awọn...
</>
		),
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
      question: "Bill Payments",
      answer:
        "Pay your utility bills, cable subscriptions, and other bills with ease on our platform.",
      color: "green",
    },
    {
      id: 3,
      icon: <FaMobileAlt />,
      question: "Instant Airtime and Data Top Up",
      answer:
        "Top up your airtime and data instantly with our secure and reliable platform.",
      color: "blue",
    },
    {
      id: 4,
      icon: <FaCreditCard />,
      question: "Virtual Cards",
      answer:
        "Get a virtual card for online transactions and enjoy seamless and reliable payments.",
      color: "orange",
    },
  ];

  const toggleDropdown = (id) => {
    setActiveDropdown(activeDropdown === id ? null : id);
  };

  const colorMap = {
    red: 'bg-red-50 text-red-800',
    green: 'bg-green-50 text-green-800',
    blue: 'bg-blue-50 text-blue-800',
    orange: 'bg-orange-50 text-orange-800'
  };

  return (
    <section id="about" className="bg-white py-16 px-6 md:px-12">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        {/* Left Side */}
        <div className="relative">
          <div className="absolute inset-0 bg-cover bg-center filter blur-lg bg-blue-100"></div>
          <div className="relative z-10 bg-white p-8 rounded-3xl border border-blue-600">
            <h2 className="text-3xl md:text-[3rem] font-bold mb-4 text-orange-500">
              {translations[currentLanguage]?.title ||
                translations.English.title}
            </h2>
			<br />
            <p className="text-gray-700 text-lg leading-relaxed">
              {translations[currentLanguage]?.description ||
                translations.English.description}
            </p>
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
                  activeDropdown === item.id ? colorMap[item.color] : "bg-white text-gray-700"
                )}
                aria-expanded={activeDropdown === item.id}
                aria-controls={`faq-${item.id}`}
              >
                <div className="flex items-center space-x-3">
                  <span className={`text-${item.color}-500 text-2xl`} aria-hidden="true">
                    {item.icon}
                  </span>
                  <span className="font-medium text-lg">{item.question}</span>
                </div>
                <div className="transition-transform" aria-hidden="true">
                  {activeDropdown === item.id ? <FaChevronUp /> : <FaChevronDown />}
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
