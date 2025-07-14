import React, { useState, useEffect, useRef } from "react";
import { FaQuoteLeft } from "react-icons/fa";
import { useInView } from "react-intersection-observer";

const testimonials = [
  {
    name: 'Ahmad Ibrahim',
    role: 'Suya spot owner',
    text: "eVault's services have transformed our communication strategy. The platform's ease of use and reliable payment system has helped grow my business significantly.",
    image: "https://picsum.photos/200/200?random=3",
    category: 'Business'
  },
  {
    name: 'Emmanuel Dangana',
    role: 'Restaurant Owner',
    text: "Reliable, fast, and incredibly user-friendly. eVault exceeds expectations with its seamless transactions and excellent customer support.",
    image: "https://picsum.photos/200/200?random=4",
    category: 'Finance'
  },
  {
    name: 'Michael Okonkwo',
    role: 'School Administrator',
    text: "The school fees payment system is brilliant! It has simplified our collection process and made tracking payments much more efficient.",
    image: "https://picsum.photos/200/200?random=6",
    category: 'Education'
  }
];

const Feedback = () => {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const countRef = useRef(null);
  const animationRef = useRef(null);
  const { inView, ref } = useInView({ threshold: 0.5, triggerOnce: true });

  const animateCount = (timestamp) => {
    if (!countRef.current) {
      countRef.current = timestamp;
    }

    const progress = timestamp - countRef.current;
    const duration = 2000;
    const value = Math.min(Math.floor((progress / duration) * 100000), 100000);

    setCount(value);

    if (progress < duration) {
      animationRef.current = requestAnimationFrame(animateCount);
    } else {
      setHasAnimated(true);
    }
  };

  useEffect(() => {
    if (inView && !hasAnimated) {
      animationRef.current = requestAnimationFrame(animateCount);
    }
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [inView, hasAnimated]);

  return (
    <div className="px-sm tablet:px-lg py-component-v bg-gradient-to-br from-[#ffffff] via-[#fac192cb] to-[#b0d5ff] text-black">
      <div className="max-w-content mx-auto space-y-component-v">
        {/* Header Section */}
        <div className="text-center space-y-md">
          <div className="inline-block">
            <h2 className="text-4xl tablet:text-5xl desktop:text-6xl font-bold bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
              Customer Stories
            </h2>
          </div>
          <p className="text-xl tablet:text-2xl text-black max-w-tablet mx-auto leading-relaxed">
            Discover what our valued clients have to say about their experiences with our platform
          </p>
        </div>

        {/* Trust Counter */}
        <div ref={ref} className="text-center">
          <div className="bg-white/5 backdrop-blur-sm rounded-large p-xl max-w-tablet mx-auto border border-white/10">
            <div className="text-2xl tablet:text-3xl font-medium text-black">
              Trusted by{' '}
              <span className="text-orange-500 text-4xl tablet:text-5xl font-bold block mt-xs">
                {count.toLocaleString()}+
              </span>{' '}
              <span className="text-lg tablet:text-xl text-black block mt-xs">
                individuals and businesses across Nigeria
              </span>
            </div>
          </div>
        </div>

        {/* Testimonials Grid */}
        {/* Desktop Grid View */}
        <div className="hidden tablet:grid tablet:grid-cols-2 desktop:grid-cols-3 gap-component-h">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="group relative bg-white/5 backdrop-blur-sm rounded-large p-xl border border-white/70 hover:border-orange-500/50 transition-all duration-500 hover:transform hover:scale-105 hover:shadow-2xl"
            >
              {/* Category Badge */}
              <div className="absolute -top-3 left-md">
                <span className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-sm py-xs rounded-xl text-sm font-medium shadow-lg">
                  {testimonial.category}
                </span>
              </div>

              {/* Quote Icon */}
              <div className="mb-md pt-sm">
                <FaQuoteLeft className="text-orange-500 text-3xl opacity-70 group-hover:opacity-100 transition-opacity duration-300" />
              </div>

              {/* Testimonial Text */}
              <blockquote className="text-gray-900 text-lg leading-relaxed mb-xl italic text-black">
                "{testimonial.text}"
              </blockquote>

              {/* Author Info */}
              <div className="flex items-center space-x-sm pt-sm border-t border-white/10 text-gray-900">
                <div className="relative">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-16 h-16 rounded-full object-cover border-3 border-orange-500 shadow-lg"
                  />
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-orange-500/20 to-transparent"></div>
                </div>
                <div>
                  <h4 className="font-bold text-xl text-gray-700 group-hover:text-orange-500 transition-colors duration-300">
                    {testimonial.name}
                  </h4>
                  <p className="text-gray-800 text-sm font-medium">
                    {testimonial.role}
                  </p>
                </div>
              </div>

              {/* Hover Effect Overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 to-transparent rounded-large opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
            </div>
          ))}
        </div>

        {/* Mobile List View */}
        <div className="tablet:hidden space-y-sm">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white/5 backdrop-blur-sm rounded-large p-sm border border-white/80 hover:border-orange-500/50 transition-all duration-300"
            >
              {/* Mobile Header */}
              <div className="flex items-center justify-between mb-sm">
                <div className="flex items-center space-x-sm">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-10 h-10 rounded-full object-cover border-2 border-orange-500"
                  />
                  <div>
                    <h4 className="font-semibold text-gray-700 text-sm">
                      {testimonial.name}
                    </h4>
                    <p className="text-gray-400 text-xs">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
                <span className="bg-gradient-to-r from-orange-500 to-orange-600 text-gray-900 px-xs py-xs rounded-xl text-xs font-medium">
                  {testimonial.category}
                </span>
              </div>

              {/* Mobile Quote */}
              <div className="flex items-start space-x-xs">
                <FaQuoteLeft className="text-orange-500 text-sm mt-xs flex-shrink-0 opacity-70" />
                <p className="text-black text-sm leading-relaxed italic">
                  {testimonial.text}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <div className="bg-white/5 backdrop-blur-sm rounded-large p-xl max-w-tablet mx-auto border border-white/10">
            <h3 className="text-2xl tablet:text-3xl font-bold text-black/70 mb-sm">
              Ready to Join Our Success Stories?
            </h3>
            <p className="text-gray-700 mb-md text-lg">
              Experience the difference that thousands of businesses already trust
            </p>
            <button className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-xl py-sm rounded-full font-semibold text-lg hover:from-orange-600 hover:to-orange-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl">
              Get Started Today
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Feedback;