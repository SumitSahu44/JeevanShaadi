import React, { useState, useEffect } from 'react';
import { Heart, Sparkles, Star } from 'lucide-react';

export default function AboutUs() {
 

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      
      {/* Stylish Banner Section */}
      <div className="relative h-screen overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1606800052052-a08af7148866?w=1600" 
            alt="Wedding Banner"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-red-900/80 via-black/70 to-red-900/80"></div>
        </div>



        {/* Banner Content */}
        <div className="relative z-10 h-full flex items-center justify-center px-4">
          <div className="text-center max-w-5xl mx-auto">
            
            {/* Simple Icon */}
            <div className="mb-8">
              <Heart className="w-16 h-16 text-white mx-auto" fill="white" />
            </div>

            {/* Main Heading */}
            <h1 className="text-7xl md:text-8xl lg:text-9xl font-bold text-white mb-6 tracking-tight">
              About Us
            </h1>
            
            {/* Decorative Line */}
            <div className="w-24 h-1 bg-white mx-auto mb-8"></div>

            {/* Subtitle */}
            <p className="text-2xl md:text-4xl text-white font-light mb-6 leading-relaxed">
              Where Dreams Meet <span className="text-red-400 font-semibold">Reality</span>
            </p>
            <p className="text-lg md:text-xl text-red-100 max-w-3xl mx-auto">
              Creating timeless love stories through meaningful connections
            </p>

            {/* Scroll Indicator */}
            <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
              <div className="flex flex-col items-center gap-2 text-white">
                <span className="text-sm">Scroll to explore</span>
                <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
                  <div className="w-1 h-3 bg-white rounded-full mt-2 animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Wave with Scroll Animation */}
        <div 
          className="absolute bottom-0 left-0 right-0 transition-transform duration-100"
          
        >
          <svg viewBox="0 0 2880 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-[200%]">
            <path d="M0,64 L48,69.3 C96,75,192,85,288,80 C384,75,480,53,576,48 C672,43,768,53,864,58.7 C960,64,1056,64,1152,58.7 C1248,53,1344,43,1392,37.3 L1440,32 L1440,32 C1488,37.3,1584,43,1680,58.7 C1776,64,1872,64,1968,58.7 C2064,53,2160,53,2256,48 C2352,43,2448,75,2544,80 C2640,85,2736,75,2784,69.3 L2880,64 L2880,120 L0,120 Z" fill="#f9fafb"/>
          </svg>
        </div>
      </div>

      {/* About Content Section */}
      <div className="max-w-7xl mx-auto px-4 py-24 -mt-20 relative z-20">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Image Side with Multiple Images */}
          <div className="relative">
            {/* Main Image */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-red-900 to-red-700 rounded-3xl transform rotate-3 group-hover:rotate-6 transition-all duration-500"></div>
              <div className="relative overflow-hidden rounded-3xl shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=800" 
                  alt="Happy Couple"
                  className="w-full h-96 object-cover transform group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-red-900/30 to-transparent"></div>
              </div>
            </div>

            {/* Secondary Small Image - Top Right */}
            <div className="absolute -top-8 -right-8 w-40 h-40 rounded-2xl overflow-hidden shadow-xl border-4 border-white transform hover:scale-110 transition-transform duration-500 z-10">
              <img 
                src="https://images.unsplash.com/photo-1519741497674-611481863552?w=400" 
                alt="Couple"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Tertiary Small Image - Bottom Left */}
            <div className="absolute -bottom-8 -left-8 w-32 h-32 rounded-2xl overflow-hidden shadow-xl border-4 border-white transform hover:scale-110 transition-transform duration-500 z-10">
              <img 
                src="https://images.unsplash.com/photo-1522673607198-241e97b5d6f1?w=400" 
                alt="Wedding"
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Floating Stats Card */}
            <div className="absolute -bottom-6 right-12 bg-white p-6 rounded-2xl shadow-2xl border-t-4 border-red-900 transform hover:-translate-y-2 transition-transform duration-300 z-20">
              <div className="flex items-center gap-3">
                <Heart className="w-8 h-8 text-red-900" fill="currentColor" />
                <div>
                  <div className="text-4xl font-bold text-red-900">50K+</div>
                  <div className="text-gray-600 text-sm">Happy Marriages</div>
                </div>
              </div>
            </div>

            {/* Decorative Element */}
            <div className="absolute top-1/2 -left-4 w-24 h-24 bg-red-100 rounded-full -z-10"></div>
            <div className="absolute -top-6 right-1/3 w-16 h-16 bg-yellow-100 rounded-full -z-10"></div>
          </div>

          {/* Content Side */}
          <div>
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-900 to-red-800 text-white rounded-full text-sm font-semibold mb-6 shadow-lg">
              <Sparkles className="w-4 h-4" />
              <span>Our Journey</span>
            </div>
            
            {/* Main Heading */}
            <h2 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Connecting Hearts,
              <span className="text-red-900"> Creating Forever</span>
            </h2>
            
            {/* Content */}
            <div className="space-y-6 text-lg text-gray-700 leading-relaxed">
              <p className="text-xl font-medium text-gray-800">
                We don't just create matches; we craft beautiful love stories that stand the test of time.
              </p>
              
              <p>
                Founded with a vision to revolutionize matchmaking, we blend traditional values with cutting-edge technology. Our platform is more than just profiles and photos—it's a sanctuary where genuine connections flourish and lifelong partnerships begin.
              </p>

              <p>
                Every member is unique, every story is special, and every match is made with meticulous care. We understand that finding your life partner is one of the most important decisions you'll ever make, and we're honored to be part of that journey.
              </p>

              <p>
                With verified profiles, advanced matching algorithms, and a dedicated support team, we ensure your experience is safe, authentic, and successful. Our commitment goes beyond just introductions—we're here to support you every step of the way until you find "the one."
              </p>

              <div className="bg-gradient-to-r from-red-50 to-red-100 p-6 rounded-2xl border-l-4 border-red-900 mt-8">
                <p className="text-gray-800 font-semibold italic">
                  "Your perfect match is waiting. Let us help you discover a love that's meant to last forever."
                </p>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-6 mt-10 pt-8 border-t-2 border-gray-200">
              <div className="text-center group cursor-pointer">
                <div className="text-4xl font-bold text-red-900 mb-2 group-hover:scale-110 transition-transform duration-300">2L+</div>
                <div className="text-sm text-gray-600 font-medium">Active Members</div>
              </div>
              <div className="text-center group cursor-pointer">
                <div className="text-4xl font-bold text-red-900 mb-2 group-hover:scale-110 transition-transform duration-300">100%</div>
                <div className="text-sm text-gray-600 font-medium">Verified Profiles</div>
              </div>
              <div className="text-center group cursor-pointer">
                <div className="text-4xl font-bold text-red-900 mb-2 group-hover:scale-110 transition-transform duration-300">24/7</div>
                <div className="text-sm text-gray-600 font-medium">Support Available</div>
              </div>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}