const WhyChooseUs = () => {
  return (
    <section className="bg-white py-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-main font-bold text-[#722F37] mb-4">
            Why Choose Our Service
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Experience matchmaking redefined with our exclusive approach that combines 
            tradition with cutting-edge technology
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div className="space-y-8">
            {/* Feature 1 - Verified Profiles */}
            <div className="group p-6 rounded-2xl hover:bg-white hover:shadow-lg transition-all duration-300">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-[#722F37] to-[#9C3B45] rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-[#722F37] mb-2">Verified Profiles</h3>
                  <p className="text-gray-600">
                    Every profile undergoes rigorous verification to ensure authenticity and build trust within our community.
                  </p>
                </div>
              </div>
            </div>

            {/* Feature 2 - AI Matchmaking */}
            <div className="group p-6 rounded-2xl hover:bg-white hover:shadow-lg transition-all duration-300">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-[#722F37] to-[#9C3B45] rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-[#722F37] mb-2">AI-Based Matchmaking</h3>
                  <p className="text-gray-600">
                    Our advanced algorithms analyze compatibility beyond surface level to find your perfect match.
                  </p>
                </div>
              </div>
            </div>

            {/* Feature 3 - Privacy & Security */}
            <div className="group p-6 rounded-2xl hover:bg-white hover:shadow-lg transition-all duration-300">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-[#722F37] to-[#9C3B45] rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-[#722F37] mb-2">Privacy & Security</h3>
                  <p className="text-gray-600">
                    Your privacy is our priority. Advanced encryption and privacy controls keep your information secure.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Illustration Section */}
          <div className="relative flex justify-center">
           <img className="rounded-xl" src="/why.png" alt="Illustration" />
         </div>
        </div>

        {/* CTA Button */}
        {/* <div className="text-center mt-12">
          <button className="bg-gradient-to-r from-[#722F37] to-[#9C3B45] text-white px-8 py-4 rounded-full font-semibold hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300">
            Begin Your Journey
          </button>
        </div> */}
      </div>
    </section>
  );
};

export default WhyChooseUs;
