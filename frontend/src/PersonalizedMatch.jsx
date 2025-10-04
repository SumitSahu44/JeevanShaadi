const PersonalizedMatch = () => {
    return (
      <section className="py-20 bg-white  overflow-hidden">
        <div className=" px-4">
          <div className="grid  mx-auto grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Image Section */}
            <div className="relative">
              {/* Main Image Container */}
              <div className="relative z-10">
                <div className="aspect-square rounded-3xl overflow-hidden ">
                  <img 
                    src="/match.png"
                    alt="Happy couple matched through our service"
                    className="w-full h-full object-cover "
                  />
                </div>
                
                {/* Floating Stats Cards */}
                {/* <div className="absolute -top-6 -right-6 bg-white p-6 rounded-2xl shadow-xl border border-gray-100">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-[#722F37]">94%</div>
                    <div className="text-sm text-gray-600 mt-1">Success Rate</div>
                  </div>
                </div> */}
                
                {/* <div className="absolute -bottom-6 -left-6 bg-[#722F37] p-6 rounded-2xl shadow-xl">
                  <div className="text-center text-white">
                    <div className="text-3xl font-bold">5,000+</div>
                    <div className="text-sm opacity-90 mt-1">Matches Made</div>
                  </div>
                </div> */}
              </div>
              
              {/* Background Decorative Elements */}
              <div className="absolute -bottom-8 -right-8 w-64 h-64 bg-[#722F37]/5 rounded-full -z-10"></div>
              <div className="absolute -top-8 -left-8 w-48 h-48 bg-[#722F37]/10 rounded-full -z-10"></div>
            </div>
  
            {/* Text Content */}
            <div className="lg:pl-12">
              <div className="max-w-lg">
                {/* Badge */}
                <div className="inline-flex items-center px-4 py-2 rounded-full bg-[#722F37]/10 border border-[#722F37]/20 mb-6">
                  <div className="w-2 h-2 bg-[#722F37] rounded-full mr-2 animate-pulse"></div>
                  <span className="text-[#722F37] font-medium text-sm">Compatible Matching</span>
                </div>
  
                {/* Heading */}
                <h2 className="text-4xl lg:text-5xl font-semibold font-main text-gray-900 mb-6">
                  Your Perfect Match, 
                  <span className="text-[#722F37] block">Personalized for You</span>
                </h2>
  
                {/* Description */}
                <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                  We go beyond basic preferences to understand your unique personality, values, 
                  and life goals. Our advanced algorithm finds partners who complement you in 
                  ways you never imagined.
                </p>
  
                {/* Features List */}
                <div className="space-y-4 mb-8">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 w-6 h-6 bg-[#722F37] rounded-full flex items-center justify-center mr-4">
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-gray-700 font-medium">Compatibility score based on 50+ factors</span>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="flex-shrink-0 w-6 h-6 bg-[#722F37] rounded-full flex items-center justify-center mr-4">
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-gray-700 font-medium">Personality-based matching algorithm</span>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="flex-shrink-0 w-6 h-6 bg-[#722F37] rounded-full flex items-center justify-center mr-4">
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-gray-700 font-medium">Lifestyle and value alignment analysis</span>
                  </div>
                </div>
  
                {/* CTA Section */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <button className="bg-[#722F37] text-white px-8 py-4 rounded-2xl font-semibold hover:bg-[#5a252c] transform hover:-translate-y-1 transition-all duration-300 shadow-lg hover:shadow-xl">
                    Find Your Match
                  </button>
                  <button className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-2xl font-semibold hover:border-[#722F37] hover:text-[#722F37] transition-all duration-300">
                    How It Works
                  </button>
                </div>
  
                {/* Trust Indicator */}
                <div className="mt-8 flex items-center text-sm text-gray-500">
                  <div className="flex -space-x-2 mr-3">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-red-200"></div>
                    ))}
                  </div>
                  <span>Joined by 10,000+ singles this month</span>
                </div>
              </div>
            </div>
          </div>
  
          {/* Bottom Stats Bar */}
          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="border-r border-gray-200 last:border-r-0">
              <div className="text-3xl font-bold text-[#722F37]">98%</div>
              <div className="text-gray-600 mt-2">Customer Satisfaction</div>
            </div>
            <div className="border-r border-gray-200 last:border-r-0">
              <div className="text-3xl font-bold text-[#722F37]">2.1M+</div>
              <div className="text-gray-600 mt-2">Profiles Analyzed</div>
            </div>
            <div className="border-r border-gray-200 last:border-r-0">
              <div className="text-3xl font-bold text-[#722F37]">87%</div>
              <div className="text-gray-600 mt-2">Second Date Rate</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-[#722F37]">4.9/5</div>
              <div className="text-gray-600 mt-2">App Store Rating</div>
            </div>
          </div>
        </div>
      </section>
    );
  };
  
  export default PersonalizedMatch;