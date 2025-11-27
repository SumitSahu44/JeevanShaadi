import React, { useState, useEffect } from 'react';
import { Heart, Users, Shield, ArrowRight, ChevronLeft, ChevronRight, Link as LinkIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

const slides = [
  {
    image: "/4.png",
    title: "Begin Your Journey to",
    highlight: "Forever Together",
    description: "Join thousands of verified profiles and discover your perfect life partner."
  },
  {
    image: "/3.png",
    title: "Find Your Perfect",
    highlight: "Life Partner",
    description: "Trusted by millions. Your beautiful love story starts here."
  },
  {
    image: "/5.png",
    title: "Where Hearts Meet",
    highlight: "Souls Connect",
    description: "Experience India's most trusted matrimony platform with verified profiles."
  }
];

export default function SimpleHero() {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Automatic slider - changes every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gray-900">
      
      {/* Background Slides with Smooth Transitions */}
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out ${
            index === currentSlide ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ backgroundImage: `url('${slide.image}')` }}
        />
      ))}
      {/* Dark Overlay for Better Text Readability */}
      <div className="absolute inset-0 bg-black/50" />
    {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-all duration-300">
   <ChevronLeft className="w-6 h-6 text-white" />  
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-all duration-300"
      >
        <ChevronRight className="w-6 h-6 text-white" />
      </button>

      {/* Main Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center text-white">
        <div className="space-y-6">
          <h1 className="text-4xl md:text-6xl font-bold leading-tight">
            <span className="block">{slides[currentSlide].title}</span>
            <span className="block text-red-100 mt-2">
              {slides[currentSlide].highlight}
            </span>
          </h1>
          <p className="text-lg md:text-xl text-gray-200 max-w-2xl mx-auto leading-relaxed">
            {slides[currentSlide].description}
          </p>
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
            <Link to={"/inquery"} className="px-8 py-4 bg-red-600 rounded-lg font-semibold text-white flex items-center justify-center gap-2 hover:bg-red-700 transition-all duration-300 transform hover:scale-105">
             Find Your Partner
              <ArrowRight className="w-5 h-5" />
            </Link>
        
            {/* <Link to={"/inquery"} className="px-8 py-4 bg-white/10 rounded-lg font-semibold text-white hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
              Browse Profiles
            </Link> */}
          </div>
        </div>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide ? 'bg-white scale-125' : 'bg-white/50 hover:bg-white/70'
            }`}
          />
        ))}
      </div>

     

    </div>
  );
}