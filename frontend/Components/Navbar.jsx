import React, { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, NavLink, useNavigate } from "react-router-dom";

const PLACEHOLDER_IMAGE = "https://t4.ftcdn.net/jpg/05/42/36/11/360_F_542361185_VFRJWpR2FH5OiAEVveWO7oZnfSccZfD3.jpg"; // Add your placeholder image path here

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const fetchCurrentUser = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      const meRes = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/profile/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      if (!meRes.ok) throw new Error('Failed to fetch your profile');
      const meData = await meRes.json();
      console.log(meData);

      const processImage = (user) => {
        let img = PLACEHOLDER_IMAGE;
        if (user.profile?.photos?.[0]?.data) {
          const bytes = new Uint8Array(user.profile.photos[0].data.data);
          let binary = '';
          bytes.forEach(b => binary += String.fromCharCode(b));
          img = `data:${user.profile.photos[0].contentType};base64,${btoa(binary)}`;
        }
        return { ...user, profileImage: img };
      };

      const processedMe = processImage(meData);
      setCurrentUser(processedMe);
    } catch (err) {
      console.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setCurrentUser(null);
    setIsOpen(false);
    navigate('/login');
  };

  if (loading) {
    return (
      <nav className="bg-white shadow-md top-0 left-0 w-full z-50 h-16 flex items-center justify-center">
        <div>Loading...</div>
      </nav>
    );
  }

  return (
    <nav className="bg-white shadow-md top-0 left-0 w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link to={"/"} className="text-2xl font-bold text-red-600">
            Jeevanshaadi<span className="text-gray-800">.com</span>
          </Link>

          {/* Desktop Links & User Section */}
          <div className="hidden md:flex items-center space-x-8 text-gray-700 font-medium">
            <a href="/about" className="hover:text-red-600 transition-colors">
              About Us
            </a>
            <a href="/help" className="hover:text-red-600 transition-colors">
              Help
            </a>
           {currentUser ? (
              <>
                <NavLink to="/dashboard" className="hover:text-red-600 transition-colors">
                  Dashboard
                </NavLink>
              </>
            ) : (
              <Link to="/login" className="hover:text-red-600 transition-colors">
                Login
              </Link>
            )}

            {currentUser ? (
              <>
                <div className="flex items-center space-x-2">
                  <img 
                    src={currentUser.profileImage} 
                    alt="Profile" 
                    className="w-8 h-8  rounded-full object-cover" 
                    onError={(e) => { e.target.src = PLACEHOLDER_IMAGE; }}
                  />
                  <span className="text-sm font-medium">{currentUser.Name}</span>
                </div>
                <button 
                  onClick={handleLogout}
                  className="text-red-600 hover:text-red-700 transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link to="/login" className="hover:text-red-600 transition-colors">
                Login
              </Link>
            )}
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
              {currentUser ? (
                <>
                  <div className="flex items-center space-x-3 bg-gray-100 rounded">
                    <img 
                      src={currentUser.profileImage} 
                      alt="Profile" 
                      className="w-10 h-10 rounded-full object-cover" 
                      onError={(e) => { e.target.src = PLACEHOLDER_IMAGE; }}
                    />
                    <div>
                      <p className="font-semibold text-gray-800">{currentUser.Name}</p>
                      <button 
                        onClick={handleLogout}
                        className="text-red-600 text-sm"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <Link
                  to="/login"
                  className="block text-gray-700 hover:text-red-600 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Login
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}