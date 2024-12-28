import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css';

// Import Components
import Navbar from './components/LandingPage/Navbar';
import Hero from './components/LandingPage/Hero';
import Features from './components/LandingPage/Features';
import About from './components/LandingPage/About';
import Services from './components/LandingPage/Services';
import Mission from './components/LandingPage/Mission';
import Feedback from './components/LandingPage/Feedback';
import Offer from './components/LandingPage/Offer';
import FAQ from './components/LandingPage/FAQ';
import Footer from './components/LandingPage/Footer';
import PrivacyPolicy from './components/LandingPage/Extras/PrivacyPolicy'; // Imported Privacy Policy
import TermsAndConditions from './components/LandingPage/Extras/TermsAndConditions'; // Imported Terms & Conditions
import PlatformApp from './components/EvaultPlatform/PlatformApp';
import MobileApp from './components/LandingPage/MobileApp';

const App = () => {
  const [language, setLanguage] = useState("English");
  const [showPlatform, setShowPlatform] = useState(false);
  const [platformInitialView, setPlatformInitialView] = useState(null);

  // Scroll to the top on route change
  const ScrollToTop = () => {
    React.useEffect(() => {
      window.scrollTo(0, 0);
    }, []);
    return null;
  };

  if (showPlatform) {
    return (
      <PlatformApp 
        initialView={platformInitialView} 
        onBack={() => {
          setShowPlatform(false);
          setPlatformInitialView(null);
        }}
      />
    );
  }

  return (
    <Router>
      <ScrollToTop />
      <div className="App">
        <Navbar 
          language={language} 
          setLanguage={setLanguage}
          setShowPlatform={setShowPlatform}
          setPlatformInitialView={setPlatformInitialView}
        />
        <Routes>
          <Route path="*" element={
            <>
              <Hero 
                language={language} 
                setShowPlatform={setShowPlatform}
                setPlatformInitialView={setPlatformInitialView}
              />
              <About 
                language={language} 
                setShowPlatform={setShowPlatform}
                setPlatformInitialView={setPlatformInitialView}
              />
              <Services />
              <Features language={language} />
              <Feedback />
              <Offer language={language} setShowPlatform={setShowPlatform} />
			  <MobileApp />
              <FAQ />
              <Footer />
            </>
          } />
          <Route path="/privacy-policy" element={<><PrivacyPolicy /><Footer /></>} />
          <Route path="/terms-and-conditions" element={<><TermsAndConditions /><Footer /></>} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
