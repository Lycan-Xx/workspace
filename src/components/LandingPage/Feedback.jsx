import React, { useState, useEffect, useRef } from "react";
import { FaQuoteLeft } from "react-icons/fa";
import { useInView } from "react-intersection-observer";

const testimonials = [
	{
		name: 'Ahmad Ibrahim',
		role: 'Suya spot owner',
		text: "Evault's services have transformed our communication strategy. Highly recommended!",
		image: "https://picsum.photos/200/200?random=3"
	  },
	  {
		name: 'Emmanuel Dangana',
		role: 'P.O.S Owner',
		text: "Reliable, fast, and incredibly user-friendly. Evault exceeds expectations.",
		image: "https://picsum.photos/200/200?random=4"
	  },
  // Add more testimonials as needed
];

const Feedback = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const scrollContainerRef = useRef(null);
  const countRef = useRef(null);
  const animationRef = useRef(null);
  const { inView, ref } = useInView({ threshold: 0.5, triggerOnce: true });

  const animateCount = (timestamp) => {
    if (!countRef.current) {
      countRef.current = timestamp;
    }

    const progress = timestamp - countRef.current;
    const duration = 8000; // 2 seconds animation
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

  useEffect(() => {
    const intervalId = setInterval(() => {
      const nextTestimonial = (currentTestimonial + 1) % testimonials.length;
      setCurrentTestimonial(nextTestimonial);
      scrollContainerRef.current?.scrollTo({
        left: nextTestimonial * scrollContainerRef.current.offsetWidth,
        behavior: "smooth",
      });
    }, 5000);

    return () => clearInterval(intervalId);
  }, [currentTestimonial]);

  return (
    <div className="px-6 md:px-16 py-20 bg-[#08448c] text-white">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Counting and Feedback Header */}
        <div className="w-full text-center mb-12">
          <h2 className="text-3xl md:text-[3rem] font-bold mb-4 text-orange-500">
            <span>Feedback</span> from Our Customers
          </h2>
          <p className="text-3xl text-gray-300 mt-4 max-w-2xl mx-auto">
            Discover what our valued clients have to say about their
            experiences with our platform.
          </p>
        </div>

        {/* Feedback Section */}
        <div className="flex flex-col md:flex-row items-center justify-between space-y-12 md:space-y-0">
          {/* Trust Counter */}
          <div className="text-center">
            <div ref={ref} className="text-3xl font-medium">
              Trusted by{' '}
              <span className="text-orange-500 text-4xl font-bold">
                {count.toLocaleString()}+
              </span>{' '}
              <br className="md:hidden" />
              individuals and businesses across Nigeria
            </div>
          </div>
        </div>

        {/* Testimonials Carousel */}
        <div className="md:w-2/3 w-full relative">
            {/* Slider Container */}
            <div
              ref={scrollContainerRef}
              className="flex overflow-x-hidden"
              style={{ scrollSnapType: "x mandatory" }}
            >
              {testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className="flex-shrink-0 w-full px-4"
                  style={{ scrollSnapAlign: "center" }}
                >
                  <div className="bg-[#001E5A] p-6 rounded-lg shadow-lg flex flex-col items-center text-center w-[350px] h-[220px] mx-auto">
                    <FaQuoteLeft className="text-orange-500 text-3xl mb-4" />
                    <p className="text-gray-300 text-sm italic mb-4">
                      "{testimonial.text}"
                    </p>
                    <div className="flex items-center space-x-3 mt-auto">
                      <img
                        src={testimonial.image}
                        alt={testimonial.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div>
                        <h4 className="font-semibold text-sm">{testimonial.name}</h4>
                        <p className="text-gray-400 text-xs">{testimonial.role}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Dot Indicators */}
            <div className="flex justify-center mt-6 space-x-3">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    currentTestimonial === index
                      ? "bg-orange-500 w-6"
                      : "bg-gray-300"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
  );
};

export default Feedback;
