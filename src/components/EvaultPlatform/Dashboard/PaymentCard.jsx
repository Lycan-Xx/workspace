import React, { useState } from "react";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useSpring, animated } from "react-spring";
import VirtualCardRequest from "./VirtualCardRequest";

const PaymentCards = ({ onRequestCard, cards, setCards }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const controls = useAnimation();

  // Animation for the entire card section
  const cardSpring = useSpring({
    opacity: 1,
    transform: "translateY(0px)",
    from: { opacity: 0, transform: "translateY(30px)" },
    config: { tension: 200, friction: 20 },
  });

  const nextCard = () => {
    setCurrentIndex((prev) => (prev + 1) % cards.length);
  };

  const prevCard = () => {
    setCurrentIndex((prev) => (prev - 1 + cards.length) % cards.length);
  };

  const addCard = (newCard) => {
    setCards((prev) => [...prev, newCard]);
  };

  // Add swipe handling logic
  const handleDragEnd = (event, info) => {
    const swipeThreshold = 50; // minimum distance for swipe
    const { offset, velocity } = info;

    // Check for both distance and velocity for a more natural feel
    if (offset.x < -swipeThreshold || velocity.x < -0.5) {
      // Swipe left - next card
      nextCard();
    } else if (offset.x > swipeThreshold || velocity.x > 0.5) {
      // Swipe right - previous card
      prevCard();
    } else {
      // Reset position if swipe wasn't strong enough
      controls.start({ x: 0, transition: { type: "spring", stiffness: 300, damping: 30 } });
    }
  };

  return (
    <animated.div style={cardSpring} className="relative mb-6">
      {/* Desktop View */}
      <div className="hidden md:grid md:grid-cols-3 gap-4">
        {cards.map((card, index) => (
          <PaymentCard key={index} card={card} />
        ))}
      </div>

      {/* Request Virtual Card Button */}
      <div className="mt-4 flex justify-end">
        <button
          onClick={onRequestCard}
          className="bg-blue-600 text-white px-8 py-2 mb-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <rect x="2" y="5" width="20" height="14" rx="2" />
            <path d="M2 10h20" />
          </svg>
          Request Virtual Card
        </button>
      </div>

      {/* Mobile View with Carousel */}
      <div className="block md:hidden relative">
        <div className="overflow-hidden px-4">
          <AnimatePresence initial={false} mode="wait">
            {cards && cards.length > 0 ? (
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="w-full" 
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.7}
                onDragEnd={handleDragEnd}
                animate={controls}
                whileTap={{ cursor: "grabbing" }}
              >
                <PaymentCard card={cards[currentIndex]} />
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="w-full px-4 py-6"
              >
                <div className="bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg h-44 flex flex-col items-center justify-center shadow-md">
                  <p className="text-gray-600 mb-4">No virtual cards yet</p>
                  <button
                    onClick={onRequestCard}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Request Your First Card
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Only show dots if there are multiple cards */}
        {cards && cards.length > 1 && (
          <div className="flex justify-center mt-4 space-x-2">
            {cards.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentIndex ? "bg-blue-600" : "bg-gray-300"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Mock Virtual Card */}
      {cards.length === 0 && (
        <div className="bg-gray-100 rounded-lg p-6 text-center">
          <div className="w-full max-w-sm mx-auto">
            <div className="bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg h-44 flex items-center justify-center">
              <p className="text-gray-600">No virtual cards yet</p>
            </div>
            <button
              onClick={onRequestCard}
              className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Request Your First Card
            </button>
          </div>
        </div>
      )}
    </animated.div>
  );
};

// Extracted Card Component
const PaymentCard = ({ card }) => {
  return (
    <motion.div
      className="relative rounded-lg overflow-hidden text-white h-44 shadow-lg"
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url('https://picsum.photos/400/250')`,
        }}
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/60 to-black/40" />

      {/* Card Content */}
      <div className="relative z-10 p-4 h-full flex flex-col justify-between">
        <div>
          <h4 className="text-lg font-bold mb-1">{card.name}</h4>
          <p className="text-sm opacity-90">Balance: {card.balance}</p>
          <p className="text-sm font-mono opacity-75">{card.cardNumber}</p>
        </div>
        <div className="flex justify-between text-sm opacity-75">
          <span>Expires: {card.expiry}</span>
          <span>{card.cardholder}</span>
        </div>
      </div>
    </motion.div>
  );
};

export default PaymentCards;
