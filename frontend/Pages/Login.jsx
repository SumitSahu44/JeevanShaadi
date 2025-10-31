import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Mail, Lock, Eye, EyeOff, Sparkles } from 'lucide-react';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const navigate = useNavigate();

  const submitLogin = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setError('');
    setSuccess('');

    if ((!email && !mobile) || !password) {
      setError('Email or mobile and password are required');
      return;
    }

    try {
      setLoading(true);

      // Backend URL from .env
      const apiUrl = `${import.meta.env.VITE_BACKEND_URL}/api/login`;
      console.log('Calling API:', apiUrl);

      // Safe request body
      const bodyData = {
        ...(email && { email }),
        ...(mobile && { mobile }),
        password
      };

      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyData)
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Login failed');
        return;
      }

      const successMessage = data.message || 'Login successful';

      if (data.token) {
        try {
          localStorage.setItem('token', data.token);
        } catch (err) {
          console.warn('Could not save token to localStorage', err);
        }
      }

      toast.success(successMessage);

      setTimeout(() => {
        navigate('/dashboard');
      }, 500);
    } catch (err) {
      console.error('Login error:', err);
      setError('Network error while attempting to login');
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-red-900 flex flex-col md:flex-row overflow-hidden relative">
      
      {/* Gallery Section */}
      <div className="w-full md:w-1/2 relative overflow-hidden min-h-screen bg-gradient-to-br from-red-900 to-red-950">
        
        {/* Animated Gradient Mesh Background */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-72 h-72 md:w-96 md:h-96 bg-red-600 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
          <div className="absolute top-0 right-0 w-72 h-72 md:w-96 md:h-96 bg-red-800 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-0 left-20 w-72 h-72 md:w-96 md:h-96 bg-red-700 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
        </div>

        {/* Content */}
        <div className="relative h-full flex flex-col items-center justify-center p-6 sm:p-8 md:p-12 py-12">
          
          {/* Gallery Grid */}
          <div className="w-full max-w-md mb-6 md:mb-8">
            <h2 className="text-white text-2xl sm:text-3xl font-bold mb-4 md:mb-6">
              Join Our Community
            </h2>
            
            {/* Grid Layout */}
            <div className="grid grid-cols-4 gap-2 sm:gap-3 mb-4 md:mb-6">
              {/* Row 1 */}
              <div className="col-span-2 row-span-2 rounded-xl md:rounded-2xl overflow-hidden shadow-xl transform hover:scale-105 transition-transform duration-300">
                <img 
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&q=80" 
                  alt="Team collaboration"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="rounded-lg md:rounded-xl overflow-hidden shadow-lg transform hover:scale-105 transition-transform duration-300">
                <img 
                  src="https://images.unsplash.com/photo-1553877522-43269d4ea984?w=300&q=80" 
                  alt="Success"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="rounded-lg md:rounded-xl overflow-hidden shadow-lg transform hover:scale-105 transition-transform duration-300">
                <img 
                  src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=300&q=80" 
                  alt="Growth"
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Row 2 */}
              <div className="rounded-lg md:rounded-xl overflow-hidden shadow-lg transform hover:scale-105 transition-transform duration-300">
                <img 
                  src="https://images.unsplash.com/photo-1556761175-b413da4baf72?w=300&q=80" 
                  alt="Innovation"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="rounded-lg md:rounded-xl overflow-hidden shadow-lg transform hover:scale-105 transition-transform duration-300">
                <img 
                  src="https://images.unsplash.com/photo-1600880292089-90a7e086ee0c?w=300&q=80" 
                  alt="Teamwork"
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Row 3 */}
              <div className="rounded-lg md:rounded-xl overflow-hidden shadow-lg transform hover:scale-105 transition-transform duration-300">
                <img 
                  src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=300&q=80" 
                  alt="Technology"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="col-span-2 rounded-lg md:rounded-xl overflow-hidden shadow-lg transform hover:scale-105 transition-transform duration-300">
                <img 
                  src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=600&q=80" 
                  alt="Professional"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="rounded-lg md:rounded-xl overflow-hidden shadow-lg transform hover:scale-105 transition-transform duration-300">
                <img 
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&q=80" 
                  alt="Leader"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Stats Card */}
            <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl p-5 border border-white border-opacity-20 shadow-2xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-red-900" />
                </div>
                <div>
                  <h3 className="text-red-900 font-bold">Trusted Platform</h3>
                  <p className="text-red-900 text-sm">Join our community</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="text-center">
                  <p className="text-xl font-bold text-red-900">50K+</p>
                  <p className="text-xs text-red-900">Users</p>
                </div>
                <div className="text-center">
                  <p className="text-xl font-bold text-red-900">99.9%</p>
                  <p className="text-xs text-red-900">Uptime</p>
                </div>
                <div className="text-center">
                  <p className="text-xl font-bold text-red-900">24/7</p>
                  <p className="text-xs text-red-900">Support</p>
                </div>
              </div>
            </div>

          </div>

          <style jsx>{`
            @keyframes blob {
              0% { transform: translate(0px, 0px) scale(1); }
              33% { transform: translate(30px, -50px) scale(1.1); }
              66% { transform: translate(-20px, 20px) scale(0.9); }
              100% { transform: translate(0px, 0px) scale(1); }
            }
            .animate-blob {
              animation: blob 7s infinite;
            }
            .animation-delay-2000 {
              animation-delay: 2s;
            }
            .animation-delay-4000 {
              animation-delay: 4s;
            }
          `}</style>
        </div>
      </div>

      {/* Form Section */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-4 sm:p-6 md:p-8 bg-gray-50 min-h-screen">
        <div className="w-full max-w-md py-8 md:py-0">
          
          {/* Header */}
          <div className="mb-6 md:mb-8">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              Sign in
            </h1>
            <p className="text-sm sm:text-base text-gray-600">
              Welcome back! Please enter your details
            </p>
          </div>

          {/* Form */}
          <div className="space-y-3 md:space-y-4">
            
            {/* Email */}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 md:mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 sm:pl-11 pr-4 py-2.5 sm:py-3 text-sm sm:text-base bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-900 focus:border-transparent transition-all"
                  placeholder="Enter your email"
                />
              </div>
            </div>

          

            {/* Password */}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 md:mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 sm:pl-11 pr-10 sm:pr-11 py-2.5 sm:py-3 text-sm sm:text-base bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-900 focus:border-transparent transition-all"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" /> : <Eye className="w-4 h-4 sm:w-5 sm:h-5" />}
                </button>
              </div>
            </div>

         

            {/* Submit Button */}
            <button
              onClick={submitLogin}
              className="w-full bg-red-900 text-white py-2.5 sm:py-3 text-sm sm:text-base rounded-xl font-medium hover:bg-red-800 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl mt-2"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>

            {/* Messages */}
            {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
            {success && <p className="text-sm text-green-600 mt-2">{success}</p>}

         
            {/* Registration Link */}
            <p className="text-center text-xs sm:text-sm text-gray-600 mt-4">
              Don't have an account? 
              <a 
                href="/inquery"
                className="text-red-900 font-medium hover:text-red-800 ml-1"
              >
                Sign up for free
              </a>
            </p>
          </div>

        </div>
      </div>

    </div>
  );
}