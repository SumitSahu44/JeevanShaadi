import React, { useState } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white shadow-md  top-0 left-0 w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="text-2xl font-bold text-red-600">
            Jeevanshaadi<span className="text-gray-800">.com</span>
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex space-x-8 text-gray-700 font-medium">
            <a href="/about" className="hover:text-red-600 transition-colors">
              About Us
            </a>
            <a href="/help" className="hover:text-red-600 transition-colors">
              Help
            </a>
            <a href="/login" className="hover:text-red-600 transition-colors">
              Login
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-red-600 focus:outline-none"
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu with Animation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="fixed top-0 left-0 h-full w-3/4 bg-white shadow-lg z-40 md:hidden"
          >
            <div className="px-6 pt-20 space-y-6 text-lg font-medium">
              <a
                href="/about"
                className="block text-gray-700 hover:text-red-600 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                About Us
              </a>
              <a
                href="/help"
                className="block text-gray-700 hover:text-red-600 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Help
              </a>
              <a
                href="/login"
                className="block text-gray-700 hover:text-red-600 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Login
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
