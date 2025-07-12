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
    <div className="px-6 md:px-16 py-20 bg-gradient-to-br from-[#08448c] via-[#0a4d9c] to-[#0c56ac] text-white">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Header Section */}
        <div className="text-center space-y-6">
          <div className="inline-block">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
              Customer Stories
            </h2>
            <div className="h-1 bg-gradient-to-r from-orange-400 to-orange-600 mt-2 rounded-full"></div>
          </div>
          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Discover what our valued clients have to say about their experiences with our platform
          </p>
        </div>

        {/* Trust Counter */}
        <div ref={ref} className="text-center">
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 max-w-2xl mx-auto border border-white/10">
            <div className="text-2xl md:text-3xl font-medium text-gray-200">
              Trusted by{' '}
              <span className="text-orange-500 text-4xl md:text-5xl font-bold block mt-2">
                {count.toLocaleString()}+
              </span>{' '}
              <span className="text-lg md:text-xl text-gray-300 block mt-2">
                individuals and businesses across Nigeria
              </span>
            </div>
          </div>
        </div>

        {/* Testimonials Grid */}
        {/* Desktop Grid View */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="group relative bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:border-orange-500/50 transition-all duration-500 hover:transform hover:scale-105 hover:shadow-2xl"
            >
              {/* Category Badge */}
              <div className="absolute -top-3 left-6">
                <span className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 py-1 rounded-full text-sm font-medium shadow-lg">
                  {testimonial.category}
                </span>
              </div>

              {/* Quote Icon */}
              <div className="mb-6 pt-4">
                <FaQuoteLeft className="text-orange-500 text-3xl opacity-70 group-hover:opacity-100 transition-opacity duration-300" />
              </div>

              {/* Testimonial Text */}
              <blockquote className="text-gray-300 text-lg leading-relaxed mb-8 italic">
                "{testimonial.text}"
              </blockquote>

              {/* Author Info */}
              <div className="flex items-center space-x-4 pt-4 border-t border-white/10">
                <div className="relative">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-16 h-16 rounded-full object-cover border-3 border-orange-500 shadow-lg"
                  />
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-orange-500/20 to-transparent"></div>
                </div>
                <div>
                  <h4 className="font-bold text-xl text-white group-hover:text-orange-400 transition-colors duration-300">
                    {testimonial.name}
                  </h4>
                  <p className="text-gray-400 text-sm font-medium">
                    {testimonial.role}
                  </p>
                </div>
              </div>

              {/* Hover Effect Overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
            </div>
          ))}
        </div>

        {/* Mobile List View */}
        <div className="md:hidden space-y-4">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:border-orange-500/50 transition-all duration-300"
            >
              {/* Mobile Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-10 h-10 rounded-full object-cover border-2 border-orange-500"
                  />
                  <div>
                    <h4 className="font-semibold text-white text-sm">
                      {testimonial.name}
                    </h4>
                    <p className="text-gray-400 text-xs">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
                <span className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-2 py-1 rounded-full text-xs font-medium">
                  {testimonial.category}
                </span>
              </div>

              {/* Mobile Quote */}
              <div className="flex items-start space-x-2">
                <FaQuoteLeft className="text-orange-500 text-sm mt-1 flex-shrink-0 opacity-70" />
                <p className="text-gray-300 text-sm leading-relaxed italic">
                  {testimonial.text}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 max-w-2xl mx-auto border border-white/10">
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Ready to Join Our Success Stories?
            </h3>
            <p className="text-gray-300 mb-6 text-lg">
              Experience the difference that thousands of businesses already trust
            </p>
            <button className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-8 py-4 rounded-full font-semibold text-lg hover:from-orange-600 hover:to-orange-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl">
              Get Started Today
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Feedback;