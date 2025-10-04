import React, { useState, useEffect } from 'react'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import CircularGallery from '../Reactbit/CircularGallery '

const Match = () => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  const galleryItems = [
    { image: `https://imgs.bharatmatrimony.com/bmimgs/homepage-revamp-images/ss-images/priyajit-and-monisa-aug-2023.jpg`, text: 'Happy Couple', desc: 'Found love through our platform' },
    { image: `https://imgs.bharatmatrimony.com/bmimgs/homepage-revamp-images/ss-images/rohan-and-dhanyalakshmi-aug-2023.jpg`, text: 'Engagement Moment', desc: 'A beautiful beginning' },
    { image: `https://imgs.bharatmatrimony.com/bmimgs/homepage-revamp-images/ss-images/bichu-and-athira-aug-2023.jpg`, text: 'Wedding Vows', desc: 'Forever starts here' },
    { image: `https://imgs.bharatmatrimony.com/bmimgs/homepage-revamp-images/ss-images/souvik-and-ranjana-aug-2023.jpg`, text: 'Smiling Bride', desc: 'Happiness redefined' },
    { image: `https://imgs.bharatmatrimony.com/bmimgs/homepage-revamp-images/ss-images/vysakh-and-pooja-aug-2023.jpg`, text: 'Celebration', desc: 'Love celebrated' },
  ]

  useEffect(() => {
    if (!isAutoPlaying) return
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % galleryItems.length)
    }, 4000)

    return () => clearInterval(interval)
  }, [isAutoPlaying, galleryItems.length])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % galleryItems.length)
    setIsAutoPlaying(false)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + galleryItems.length) % galleryItems.length)
    setIsAutoPlaying(false)
  }

  const goToSlide = (index) => {
    setCurrentSlide(index)
    setIsAutoPlaying(false)
  }

  return (
    <div className='mb-40'>
      <h1 className="text-4xl md:text-5xl font-bold font-main mb-8 mt-40 text-center bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
        Love Stories Created Here
      </h1>
      
      {/* Desktop: Circular Gallery */}
      <div className="hidden md:block" style={{ height: '600px', position: 'relative' }}>
        <CircularGallery bend={3} textColor="#11111" borderRadius={0.05} scrollEase={0.02} />
      </div>

      {/* Mobile: Auto-playing Carousel */}
      <div className="block md:hidden px-4">
        <div className="relative max-w-md mx-auto">
          {/* Main Carousel Container */}
          <div className="relative h-[500px] overflow-hidden rounded-3xl shadow-2xl">
            {galleryItems.map((item, index) => (
              <div
                key={index}
                className={`absolute w-full h-full transition-all duration-700 ease-in-out ${
                  index === currentSlide 
                    ? 'opacity-100 translate-x-0 scale-100' 
                    : index < currentSlide 
                    ? 'opacity-0 -translate-x-full scale-95' 
                    : 'opacity-0 translate-x-full scale-95'
                }`}
              >
                <img 
                  src={item.image} 
                  alt={item.text}
                  className="w-full h-full object-cover"
                />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                
                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h3 className="text-2xl font-bold mb-2">{item.text}</h3>
                  <p className="text-sm text-gray-200">{item.desc}</p>
                </div>
              </div>
            ))}

            {/* Navigation Arrows */}
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white p-3 rounded-full transition-all duration-300 shadow-lg"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white p-3 rounded-full transition-all duration-300 shadow-lg"
              aria-label="Next slide"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center gap-2 mt-6">
            {galleryItems.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`transition-all duration-300 rounded-full ${
                  index === currentSlide 
                    ? 'w-8 h-3 bg-red-600' 
                    : 'w-3 h-3 bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

          {/* Counter */}
          <div className="text-center mt-4 text-gray-600 font-medium">
            {currentSlide + 1} / {galleryItems.length}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Match