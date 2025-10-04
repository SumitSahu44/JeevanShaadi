import React from 'react';

export default function VideoBackgroundHero() {
  return (
    <div className="relative h-[40rem] w-full overflow-hidden">
      {/* Fixed Video Background - Only for this section */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src="v3.mp4" type="video/mp4" />
      </video>
      
      {/* Black Overlay with 50% opacity */}
      <div className="absolute inset-0 bg-black opacity-60" />
      
      {/* Content Container */}
      <div className="relative z-10 h-full flex items-center  justify-center px-4">
        <div className="text-center max-w-4xl ">
          {/* Motivational Quote */}
          <h1 className="text-5xl md:text-7xl font-main font-bold text-white leading-tight animate-fadeIn">
            "Two Hearts, One Soul, Endless Love"
          </h1>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 1.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
}