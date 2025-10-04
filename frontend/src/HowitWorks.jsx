import React, { useState } from 'react';
import { UserPlus, Search, MessageCircle, Heart, Sparkles, Star, Shield, Zap } from 'lucide-react';

export default function HowItWorks() {
  const [activeStep, setActiveStep] = useState(null);

  const steps = [
    {
      icon: UserPlus,
      title: "Create Profile",
      description: "Tell your story, share your dreams, and let your personality shine through.",
      color: "bg-gradient-to-br from-red-900 to-red-700"
    },
    {
      icon: Search,
      title: "Smart Matching",
      description: "Our AI finds compatible matches based on your preferences and values.",
      color: "bg-gradient-to-br from-red-800 to-rose-600"
    },
    {
      icon: MessageCircle,
      title: "Start Chatting",
      description: "Connect with verified profiles and have meaningful conversations securely.",
      color: "bg-gradient-to-br from-red-700 to-pink-600"
    },
    {
      icon: Heart,
      title: "Find Love",
      description: "Build a connection and start your beautiful journey together.",
      color: "bg-gradient-to-br from-rose-600 to-pink-500"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 bg-red-50 text-red-900 px-4 py-2 rounded-full text-sm font-semibold mb-6">
            <Sparkles size={16} />
            <span>Simple & Effective</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-main font-bold text-[#722F37] mb-4">
            How It Works
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Find your perfect match in four simple steps
          </p>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-24">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = activeStep === index;
            
            return (
              <div
                key={index}
                className="relative group"
                onMouseEnter={() => setActiveStep(index)}
                onMouseLeave={() => setActiveStep(null)}
              >
                {/* Card */}
                <div className={`bg-white rounded-3xl p-8 h-full transition-all duration-300 ${
                  isActive 
                    ? 'shadow-2xl -translate-y-2' 
                    : 'shadow-lg'
                }`}>
                  {/* Step Number */}
                  <div className="flex items-start justify-between mb-6">
                    <span className="text-6xl font-bold text-gray-100 group-hover:text-red-100 transition-colors">
                      {index + 1}
                    </span>
                    <div className={`${step.color} p-4 rounded-2xl transition-transform duration-300 ${
                      isActive ? 'scale-110 rotate-6' : ''
                    }`}>
                      <Icon className="w-8 h-8 text-white" strokeWidth={2} />
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {/* Connector Line */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-red-200 to-transparent"></div>
                )}
              </div>
            );
          })}
        </div>

        {/* Features Grid */}
        {/* <div className="grid md:grid-cols-3 gap-8 mb-24">
          <div className="bg-gradient-to-br from-red-50 to-rose-50 rounded-3xl p-8 text-center hover:shadow-lg transition-shadow duration-300">
            <div className="w-16 h-16 bg-red-900 rounded-2xl flex items-center justify-center mx-auto mb-4 rotate-3 hover:rotate-6 transition-transform">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">100% Verified</h3>
            <p className="text-gray-600">Every profile is verified for your safety and peace of mind.</p>
          </div>

          <div className="bg-gradient-to-br from-rose-50 to-pink-50 rounded-3xl p-8 text-center hover:shadow-lg transition-shadow duration-300">
            <div className="w-16 h-16 bg-rose-600 rounded-2xl flex items-center justify-center mx-auto mb-4 -rotate-3 hover:-rotate-6 transition-transform">
              <Zap className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">AI Powered</h3>
            <p className="text-gray-600">Smart matching algorithm finds your most compatible matches.</p>
          </div>

          <div className="bg-gradient-to-br from-pink-50 to-red-50 rounded-3xl p-8 text-center hover:shadow-lg transition-shadow duration-300">
            <div className="w-16 h-16 bg-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4 rotate-3 hover:rotate-6 transition-transform">
              <Star className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Success Stories</h3>
            <p className="text-gray-600">Thousands of happy couples started their journey here.</p>
          </div>
        </div> */}

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-red-900 to-rose-700 rounded-[2.5rem] p-12 md:p-16 text-center relative overflow-hidden">
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -translate-y-32 translate-x-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-5 rounded-full translate-y-24 -translate-x-24"></div>
          
          <div className="relative z-10">
            <Heart className="w-16 h-16 text-rose-300 mx-auto mb-6" />
            <h3 className="text-4xl md:text-5xl font-main font-bold text-white mb-4">
              Ready to Find Your Match?
            </h3>
            <p className="text-red-100 text-sm lg:text-lg mb-8 max-w-2xl mx-auto">
              Join millions of people finding meaningful connections and lasting relationships.
            </p>
            <button className="bg-white text-red-900 lg:px-10 lg:py-4 px-5 py-3 rounded-full font-bold text-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 inline-flex items-center gap-3 group">
              <span>Get Started Free</span>
              <Heart className="w-5 h-5 group-hover:fill-current transition-all" />
            </button>
            <p className="text-red-200 text-sm mt-4">No credit card required • Free forever</p>
          </div>
        </div>

       
      </div>
    </div>
  );
}