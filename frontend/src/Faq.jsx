import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const faqs = [
    {
      question: "How do I create a matrimonial profile?",
      answer:
        "You can create your profile by signing up, adding your personal details, preferences, and uploading a profile picture. Make sure all information is accurate to get the best matches.",
      icon: (
        <span className="text-2xl sm:text-3xl">👤</span>
      )
    },
    {
      question: "How can I search for compatible matches?",
      answer:
        "Use advanced search filters based on age, religion, location, education, and interests to find the most compatible partners.",
      icon: (
        <span className="text-2xl sm:text-3xl">🔍</span>
      )
    },
    {
      question: "Is my personal information safe?",
      answer:
        "Absolutely. We ensure that all your data is securely stored and encrypted. Only verified users can view your profile.",
      icon: (
        <span className="text-2xl sm:text-3xl">🛡️</span>
      )
    },
    {
      question: "How do I contact a potential match?",
      answer:
        "You can send interests, messages, or schedule a chat with verified profiles directly from your dashboard.",
      icon: (
        <span className="text-2xl sm:text-3xl">💬</span>
      )
    },
    {
      question: "What are the benefits of premium membership?",
      answer:
        "Premium members get highlighted profiles, unlimited messaging, advanced filters, and personalized matchmaking recommendations.",
      icon: (
        <span className="text-2xl sm:text-3xl">⭐</span>
      )
    }
  ];

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className="relative bg-white py-20 sm:py-28 px-4 sm:px-6 md:px-12 overflow-hidden">
      <div className="max-w-5xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12 sm:mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-main font-bold text-black mb-4">
            Frequently Asked <span className="text-red-900">Questions</span>
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-700 px-2 sm:px-12">
            Everything you need to know about creating your profile and finding matches
          </p>
        </motion.div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full text-left p-4 sm:p-6 rounded-xl bg-white border border-red-900 hover:border-red-800 transition-all duration-300 group shadow-sm"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-3 sm:gap-4">
                    {faq.icon}
                    <h3 className="text-base sm:text-lg md:text-xl font-semibold text-black group-hover:text-red-900 transition-colors duration-300">
                      {faq.question}
                    </h3>
                  </div>
                  <motion.div
                    animate={{ rotate: activeIndex === index ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="text-gray-400 group-hover:text-red-900 transition-colors duration-300"
                  >
                    <svg
                      className="w-5 h-5 sm:w-6 sm:h-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </motion.div>
                </div>

                <AnimatePresence>
                  {activeIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <p className="mt-3 sm:mt-4 text-sm sm:text-base text-gray-800 pl-10 sm:pl-12">
                        {faq.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
