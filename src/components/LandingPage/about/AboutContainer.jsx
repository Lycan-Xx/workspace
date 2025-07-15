import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import AboutIntro from "./AboutIntro";
import AboutFaqSection from "./AboutFaqSection";
import AboutNavigationDots from "./AboutNavigationDots";

const AboutContainer = ({ language = "English" }) => {
  const [activeSection, setActiveSection] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const containerRef = useRef(null);
  const sectionsRef = useRef([]);
  const scrollTimeoutRef = useRef(null);
  const observerRef = useRef(null);

  const translations = {
    English: {
      title: "About eVault",
      description:
        "At eVault, we believe in empowering individuals and businesses by providing them with the financial tools they need to succeed. Our mission is to create an inclusive and accessible financial ecosystem that helps bridge gaps in financial management, making it easier for everyone to participate in the economy.",
      subtitle:
        "We are committed to delivering secure, reliable, and efficient financial solutions that cater to your needs.",
      scrollHint: "Scroll to explore",
    },
    Hausa: {
      title: "Game da eVault",
      description:
        "A eVault, muna da yakinin cewa muna bai wa mutane da kasuwanci damar samun hanyoyin kudi masu aminci da saukin samu. Manufarmu ita ce gina tsarin hada-hadar kudi wanda zai tabbatar da samun dama ga kowa da kowa, wanda zai magance gibin da ke cikin gudanar da kudi, yana saukaka shiga cikin tattalin arziki.",
      subtitle:
        "Muna da kwazo wajen bayar da sabis na kudi masu tsaro, masu kyau da inganci wadanda za su biya bukatun ku.",
      scrollHint: "Gungura don bincika",
    },
    Igbo: {
      title: "Maka eVault",
      description:
        "Na eVault, anyị kwenyere n'inyere ndị mmadụ na azụmaahịa ikike iji nweta ihe ngwọta ego dị nchebe ma dị mfe. Ebumnobi anyị bụ iwulite usoro ego nke na-eme ka ọ dị mfe maka onye ọ bụla ịbanye n'ime akụ na ụba, iji kpochapụ ihe mgbochi ọ bụla na-arụ ọrụ akụ na ụba.",
      subtitle:
        "Anyị kwadoro iji nyere ndị ahịa anyị usoro ego dị nchebe, kwụsie ike, na nke a pụrụ ịdabere na ya, nke na-enyere ha aka.",
      scrollHint: "Gbanwee iji chọpụta",
    },
    Yoruba: {
      title: "Nipa eVault",
      description:
        "Ni eVault, a gbagbọ ninu agbara eniyan ati awọn iṣowo pẹlu awọn solusan inawo ti o ni aabo ati ti o rọrun lati wọle si. Aims wa ni lati ṣẹda eto inawo ti o ni wiwo gbogbo eniyan ati ti o rọrun lati wọle si, ti o ṣe iranlọwọ lati ṣe iwọn awọn ailagbara ni iṣakoso inawo, ṣiṣe ni irọrun fun gbogbo eniyan lati kopa ninu ọrọ-aje.",
      subtitle:
        "A ni igbẹkẹle lati pese awọn solusan inawo to ni aabo, to ni igbẹkẹle ati to munadoko ti o yẹ fun awọn iwulo oriṣiriṣi ti awọn.",
      scrollHint: "Yi lati ṣawari",
    },
  };

  const faqItems = [
    {
      id: 0,
      question: "Getting Started",
      answer:
        "Create an account and sign in with your username and password to access all services.",
      color: "emerald",
      bgGradient: "from-emerald-400 via-teal-500 to-cyan-600",
      animation: "startup",
    },
    {
      id: 1,
      question: "Bill Payments",
      answer:
        "Pay your utility bills, cable subscriptions, and other bills with ease on our platform.",
      color: "violet",
      bgGradient: "from-violet-400 via-purple-500 to-indigo-600",
      animation: "network",
    },
    {
      id: 2,
      question: "Instant Airtime and Data Top Up",
      answer:
        "Top up your airtime and data instantly with our secure and reliable platform.",
      color: "blue",
      bgGradient: "from-blue-400 via-cyan-500 to-teal-600",
      animation: "mobile",
    },
    {
      id: 3,
      question: "Virtual Cards",
      answer:
        "Get a virtual card for online transactions and enjoy seamless and reliable payments.",
      color: "orange",
      bgGradient: "from-orange-400 via-red-500 to-pink-600",
      animation: "card",
    },
  ];

  // Enhanced scroll to section with better control
  const scrollToSection = useCallback((index) => {
    if (sectionsRef.current[index] && !isScrolling) {
      setIsScrolling(true);
      
      // Clear any existing timeout
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }

      // Scroll to section
      sectionsRef.current[index].scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
      
      // Set timeout to reset scrolling state
      scrollTimeoutRef.current = setTimeout(() => {
        setIsScrolling(false);
      }, 1000);
    }
  }, [isScrolling]);

  // Enhanced intersection observer
  useEffect(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.8) {
            const index = sectionsRef.current.indexOf(entry.target);
            if (index !== -1 && index !== activeSection && !isScrolling) {
              setActiveSection(index);
            }
          }
        });
      },
      {
        threshold: [0.8, 0.9],
        rootMargin: "-5% 0px -5% 0px"
      }
    );

    sectionsRef.current.forEach((section) => {
      if (section) observerRef.current.observe(section);
    });

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [activeSection, isScrolling]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowDown" && activeSection < faqItems.length) {
        e.preventDefault();
        scrollToSection(activeSection + 1);
      } else if (e.key === "ArrowUp" && activeSection > 0) {
        e.preventDefault();
        scrollToSection(activeSection - 1);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeSection, scrollToSection, faqItems.length]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  const currentTranslation = translations[language] || translations.English;

  return (
    <section
      ref={containerRef}
      id="about"
      className="relative h-screen overflow-y-auto"
      style={{
        scrollSnapType: "y mandatory",
        overscrollBehavior: "contain"
      }}
    >
      {/* Navigation Dots */}
      <AboutNavigationDots
        totalSections={faqItems.length + 1}
        activeSection={activeSection}
        onSectionClick={scrollToSection}
        isScrolling={isScrolling}
      />

      {/* Intro Section */}
      <div
        ref={(el) => (sectionsRef.current[0] = el)}
        style={{ 
          height: "100vh",
          scrollSnapAlign: "start",
          scrollSnapStop: "always"
        }}
      >
        <AboutIntro
          translation={currentTranslation}
          isActive={activeSection === 0}
          onScrollToNext={() => scrollToSection(1)}
        />
      </div>

      {/* FAQ Sections */}
      {faqItems.map((item, index) => (
        <div
          key={item.id}
          ref={(el) => (sectionsRef.current[index + 1] = el)}
          style={{ 
            height: "100vh",
            scrollSnapAlign: "start",
            scrollSnapStop: "always"
          }}
        >
          <AboutFaqSection
            item={item}
            index={index}
            isActive={activeSection === index + 1}
            totalSections={faqItems.length + 1}
          />
        </div>
      ))}
    </section>
  );
};

export default AboutContainer;