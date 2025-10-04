import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Heart, Star, Quote } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    name: "Priya & Rahul",
    location: "Mumbai, Maharashtra",
    image: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=400&h=400&fit=crop",
    story: "We found each other through this wonderful platform. Our families connected instantly, and within 6 months, we were married. Thank you for helping us find our perfect match!",
    rating: 5,
    date: "Married Dec 2024"
  },
  {
    id: 2,
    name: "Anjali & Vikram",
    location: "Delhi, India",
    image: "https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=400&h=400&fit=crop",
    story: "The detailed profiles and compatibility matching made it so easy to find someone who truly understood me. We're now happily married with a beautiful journey ahead!",
    rating: 5,
    date: "Married Aug 2024"
  },
  {
    id: 3,
    name: "Neha & Arjun",
    location: "Bangalore, Karnataka",
    image: "https://images.unsplash.com/photo-1606800052052-a08af7148866?w=400&h=400&fit=crop",
    story: "From the first conversation, we knew we were meant to be. This platform gave us the confidence to take the next step. Forever grateful for bringing us together!",
    rating: 5,
    date: "Married Oct 2024"
  },
  {
    id: 4,
    name: "Shreya & Karthik",
    location: "Chennai, Tamil Nadu",
    image: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=400&h=400&fit=crop",
    story: "We were both looking for someone with similar values and traditions. This site connected us perfectly. Our wedding was a dream come true!",
    rating: 5,
    date: "Married Sep 2024"
  },
  {
    id: 5,
    name: "Divya & Rohan",
    location: "Pune, Maharashtra",
    image: "https://images.unsplash.com/photo-1519741497674-611481863552?w=400&h=400&fit=crop",
    story: "The journey from strangers to soulmates was beautiful. Thank you for creating a platform where genuine connections happen. Highly recommend!",
    rating: 5,
    date: "Married Nov 2024"
  }
];

export default function TestimonialCarousel() {
  const [current, setCurrent] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      handleNext();
    }, 5000);
    return () => clearInterval(timer);
  }, [current]);

  const handleNext = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrent((prev) => (prev + 1) % testimonials.length);
    setTimeout(() => setIsAnimating(false), 500);
  };

  const handlePrev = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    setTimeout(() => setIsAnimating(false), 500);
  };

  const goToSlide = (index) => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrent(index);
    setTimeout(() => setIsAnimating(false), 500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-rose-50 to-red-100 py-16 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Heart className="w-10 h-10 text-red-900 fill-red-900 animate-pulse" />
            <h1 className="text-4xl md:text-5xl font-main font-bold text-red-900 ">
              Testimonials
            </h1>
            <Heart className="w-10 h-10 text-red-900 fill-red-900 animate-pulse" />
          </div>
          <p className="text-sm lg:text-2xl text-red-800 font-medium">Real couples, real happiness</p>
          <div className="flex items-center justify-center gap-2 mt-4">
            <div className="w-20 h-1 bg-red-900 rounded-full"></div>
            <div className="w-3 h-3 bg-red-900 rounded-full rotate-45"></div>
            <div className="w-20 h-1 bg-red-900 rounded-full"></div>
          </div>
        </div>

        {/* Main Carousel */}
        <div className="relative">
          {/* Testimonial Card */}
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden transform transition-all duration-500 hover:shadow-red-200 border-2 border-red-100">
            <div className="grid md:grid-cols-2 gap-0">
              {/* Image Section */}
              <div className="relative h-80 md:h-auto overflow-hidden bg-gradient-to-br from-red-100 to-red-200">
                <div className="absolute top-4 left-4 z-10">
                  <Quote className="w-12 h-12 text-white opacity-50" />
                </div>
                <img
                  src={testimonials[current].image}
                  alt={testimonials[current].name}
                  className={`w-full h-full object-cover transition-all duration-700 ${
                    isAnimating ? 'scale-110 blur-sm' : 'scale-100 blur-0'
                  }`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-red-900/60 to-transparent"></div>
                <div className="absolute bottom-6 left-6 text-white">
                  <div className="bg-red-900 text-white px-4 py-1 rounded-full text-sm font-semibold inline-block mb-2">
                    {testimonials[current].date}
                  </div>
                </div>
              </div>

              {/* Content Section */}
              <div className="p-8 md:p-12 flex flex-col justify-center bg-gradient-to-br from-white to-red-50">
                <div className={`transition-all duration-500 ${
                  isAnimating ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'
                }`}>
                  {/* Stars */}
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonials[current].rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-red-900 fill-red-900" />
                    ))}
                  </div>

                  {/* Story */}
                  <p className="text-gray-700 text-lg leading-relaxed mb-6 italic">
                    "{testimonials[current].story}"
                  </p>

                  {/* Names and Location */}
                  <div className="border-t-2 border-red-200 pt-4">
                    <h3 className="text-2xl font-bold text-red-900 mb-2">
                      {testimonials[current].name}
                    </h3>
                    <p className="text-red-700 flex items-center gap-2 font-medium">
                      <span className="w-2 h-2 bg-red-900 rounded-full"></span>
                      {testimonials[current].location}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Buttons */}
          <button
            onClick={handlePrev}
            className="absolute lg:left-4 lg:top-1/2 top-[48%] -translate-y-1/2 bg-white hover:bg-red-50 p-3 rounded-full shadow-lg transition-all hover:scale-110 active:scale-95 z-10 border-2 border-red-900"
            disabled={isAnimating}
          >
            <ChevronLeft className="w-6 h-6 text-red-900" />
          </button>
          <button
            onClick={handleNext}
            className="absolute lg:right-4 right-1 top-[48%] lg:top-1/2 -translate-y-1/2 bg-white hover:bg-red-50 p-3 rounded-full shadow-lg transition-all hover:scale-110 active:scale-95 z-10 border-2 border-red-900"
            disabled={isAnimating}
          >
            <ChevronRight className="w-6 h-6 text-red-900" />
          </button>
        </div>

        {/* Dots Navigation */}
        <div className="flex justify-center gap-3 mt-8">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`transition-all duration-300 rounded-full ${
                current === index
                  ? 'w-12 h-3 bg-red-900'
                  : 'w-3 h-3 bg-red-300 hover:bg-red-400'
              }`}
              disabled={isAnimating}
            />
          ))}
        </div>

       
      </div>
    </div>
  );
}