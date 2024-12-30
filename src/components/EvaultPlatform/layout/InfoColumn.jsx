import React, { useState, useEffect } from 'react';
import { useTransition, animated } from '@react-spring/web';

const slides = [
  {
    id: 1,
    title: "Ultimate Security",
    subtitle: "for your banking and beyond",
    description: "Business and personal simplified"
  },
  {
    id: 2,
    title: "Smart Banking",
    subtitle: "solutions at your fingertips",
    description: "Seamless transactions anywhere"
  },
  {
    id: 3,
    title: "Secure Vault",
    subtitle: "storage for peace of mind",
    description: "Your data, protected 24/7"
  }
];

const InfoColumn = () => {
  const [index, setIndex] = useState(0);

  const transitions = useTransition(slides[index], {
    from: { opacity: 0, transform: 'translate3d(0,50px,0)' },
    enter: { opacity: 1, transform: 'translate3d(0,0px,0)' },
    leave: { opacity: 0, transform: 'translate3d(0,-50px,0)' },
    config: { tension: 280, friction: 60 }
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex(state => (state + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full lg:w-[40%] xl:w-[35%] bg-gray-50 p-8 lg:p-12 flex flex-col justify-center shadow-lg">
      <div className="relative h-[300px] overflow-hidden">
        {transitions((style, item) => (
          <animated.div
            key={item.id}
            style={style}
            className="absolute inset-0 flex flex-col justify-center"
          >
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">
              <span className="text-[#025798]">{item.title}</span>
              <br />
              {item.subtitle}
            </h1>
            <p className="text-xl text-gray-600">{item.description}</p>
          </animated.div>
        ))}
      </div>
      
      <div className="flex justify-center space-x-2 mt-8">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === i ? 'bg-[#025798] scale-110' : 'bg-gray-300'
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default InfoColumn;