import React from 'react'
import MagicBento from '../Reactbit/MagicBento'

const Gallery = () => {
  const features = [
    {
      icon: "💫",
      title: "Smart Matching",
      value: "AI-Powered"
    },
    {
      icon: "🔒",
      title: "Verified Profiles",
      value: "100% Secure"
    },
    {
      icon: "🎯",
      title: "High Success Rate",
      value: "94% Match"
    },
    {
      icon: "⚡",
      title: "Fast Results",
      value: "24/7 Active"
    }
  ];

  return (
    <div className="min-h-screen-2xl bg-white py-20 overflow-x-hidden">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Side - Minimal Text Content */}
          <div className="w-full">
            {/* Badge */}
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-[#722F37]/10 border border-[#722F37]/20 mb-8">
              <div className="w-2 h-2 bg-[#722F37] rounded-full mr-2 animate-pulse"></div>
              <span className="text-[#722F37] font-medium text-sm">Premium Matchmaking</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Find Your
              <span className="text-[#722F37] block">Perfect Match</span>
            </h1>

            {/* Short Description */}
            <p className="text-lg sm:text-xl text-gray-600 mb-12">
              Advanced AI. Real connections. Lasting relationships.
            </p>

            {/* Feature Grid - Minimal */}
            <div className="grid grid-cols-2 gap-4 sm:gap-6 mb-12">
              {features.map((feature, index) => (
                <div key={index} className="text-center border border-red-900 p-4 sm:p-6 rounded-2xl bg-gray-50 hover:bg-[#722F37] group transition-all duration-300 cursor-pointer">
                  <div className="text-2xl sm:text-3xl mb-3 transform group-hover:scale-110 transition duration-300">
                    {feature.icon}
                  </div>
                  <h3 className="font-semibold text-sm sm:text-base text-gray-900 group-hover:text-white mb-1">
                    {feature.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#722F37] group-hover:text-white/90 font-medium">
                    {feature.value}
                  </p>
                </div>
              ))}
            </div>

            {/* Single CTA */}
            <button className="w-full bg-[#722F37] text-white py-4 sm:py-5 rounded-2xl font-bold text-base sm:text-lg hover:bg-[#5a252c] transform hover:-translate-y-1 transition-all duration-300 shadow-2xl hover:shadow-3xl">
              Start Your Journey
            </button>
          </div>

          {/* Right Side - Gallery */}
          <div className="relative w-full">
            <div className="bg-gradient-to-br from-gray-50 to-white rounded-3xl border border-gray-100">
              <MagicBento
                textAutoHide={true}
                enableStars={true}
                enableSpotlight={true}
                enableBorderGlow={true}
                enableTilt={true}
                enableMagnetism={true}
                clickEffect={true}
                spotlightRadius={300}
                particleCount={12}
                glowColor="114, 47, 55"
              />
            </div>
            
            {/* Floating Elements */}
            <div className="absolute -top-6 -right-6 w-20 sm:w-24 h-20 sm:h-24 bg-[#722F37]/10 rounded-full -z-10 animate-pulse"></div>
            <div className="absolute -bottom-8 -left-8 w-24 sm:w-32 h-24 sm:h-32 bg-[#722F37]/5 rounded-full -z-10"></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Gallery