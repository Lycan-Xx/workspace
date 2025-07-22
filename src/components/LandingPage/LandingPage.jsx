import React, { useState } from "react";
import Navbar from "./Navbar";
import Hero from "./Hero";
import About from "./About";
import Mission from "./Mission";
import Offer from "./Offer";
import Services from "./Services";
import Feedback from "./Feedback";
import MobileApp from "./MobileApp";
import Footer from "./Footer";

const LandingPage = () => {
  const [language, setLanguage] = useState("English");

  return (
    <>
      <Navbar language={language} setLanguage={setLanguage} />
      <Hero language={language} />
      <About language={language} />
      <Mission language={language} />
      <Offer language={language} />
      <Services />
      <Feedback />
      <MobileApp />
      <Footer setLanguage={setLanguage} />
    </>
  );
};

export default LandingPage;