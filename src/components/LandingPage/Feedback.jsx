import React, { useState, useEffect, useRef } from "react";
import { FaQuoteLeft } from "react-icons/fa";
import { useInView } from "react-intersection-observer";

const testimonials = [
	{
		name: 'Ahmad Ibrahim',
		role: 'Suya spot owner',
		text: "eVault's services have transformed our communication strategy. The platform's ease of use and reliable payment system has helped grow my business significantly.",
		image: "https://picsum.photos/200/200?random=3"
	  },
	  {
		name: 'Emmanuel Dangana',
		role: 'P.O.S Owner',
		text: "Reliable, fast, and incredibly user-friendly. eVault exceeds expectations with its seamless transactions and excellent customer support.",
		image: "https://picsum.photos/200/200?random=4"
	  },
	  {
		name: 'Sarah Johnson',
		role: 'Business Owner',
		text: "Since switching to eVault, managing my business finances has become effortless. Their digital wallet feature is a game-changer for daily transactions.",
		image: "https://picsum.photos/200/200?random=5"
	  },
	  {
		name: 'Michael Okonkwo',
		role: 'School Administrator',
		text: "The school fees payment system is brilliant! It has simplified our collection process and made tracking payments much more efficient.",
		image: "https://picsum.photos/200/200?random=6"
	  },
	  {
		name: 'Aisha Mohammed',
		role: 'Market Vendor',
		text: "eVault has made it so easy to receive payments from customers. The instant notification feature gives me peace of mind for every transaction.",
		image: "https://picsum.photos/200/200?random=7"
	  }
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
    const duration = 2000; // Reduced duration for smoother animation
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
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        left: currentTestimonial * scrollContainerRef.current.offsetWidth,
        behavior: "smooth",
      });
    }
  }, [currentTestimonial]);

  return (
    <div className="px-6 md:px-16 py-20 bg-[#08448c] text-white">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Counting and Feedback Header */}
        <div className="w-full text-center mb-12">
          <h2 className="text-3xl md:text-[3rem] font-bold mb-4 text-orange-500">
            <span>Feedback</span> from Our Customers
          </h2>
          <p className="text-xl text-gray-300 mt-4 max-w-2xl mx-auto">
            Discover what our valued clients have to say about their
            experiences with our platform.
          </p>
        </div>

        {/* Trust Counter */}
        <div ref={ref} className="text-center mb-12">
          <div className="text-2xl md:text-3xl font-medium">
            Trusted by{' '}
            <span className="text-orange-500 text-3xl md:text-4xl font-bold">
              {count.toLocaleString()}+
            </span>{' '}
            <br className="md:hidden" />
            individuals and businesses across Nigeria
          </div>
        </div>

        {/* Testimonials Carousel */}
        <div className="relative max-w-xl mx-auto">
          {/* Slider Container */}
          <div
            ref={scrollContainerRef}
            className="flex overflow-hidden"
            style={{ scrollSnapType: "x mandatory" }}
          >
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="flex-shrink-0 w-full px-4"
                style={{ scrollSnapAlign: "center" }}
              >
                <div className="bg-[#001E5A] p-8 rounded-lg shadow-lg flex flex-col items-center text-center mx-auto">
                  <FaQuoteLeft className="text-orange-500 text-4xl mb-6" />
                  <p className="text-gray-300 text-lg italic mb-6">
                    "{testimonial.text}"
                  </p>
                  <div className="flex items-center space-x-4 mt-4">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-14 h-14 rounded-full object-cover border-2 border-orange-500"
                    />
                    <div className="text-left">
                      <h4 className="font-semibold text-lg">{testimonial.name}</h4>
                      <p className="text-gray-400">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Dot Indicators */}
          <div className="flex justify-center mt-8 space-x-3">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentTestimonial(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  currentTestimonial === index
                    ? "bg-orange-500 w-8"
                    : "bg-gray-400 hover:bg-gray-300"
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Feedback;
