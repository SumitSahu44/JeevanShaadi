import React, { useState } from 'react';
import { Heart, Search, User, Settings, LogOut, MapPin, Briefcase, GraduationCap, DollarSign, MessageCircle, Eye } from 'lucide-react';

export default function MatrimonyDashboard() {
  const [likedProfiles, setLikedProfiles] = useState([]);

  const profiles = [
    {
      id: 1,
      name: "Priya Sharma",
      age: 26,
      height: "5'4\"",
      education: "MBA in Marketing, IIM Bangalore",
      occupation: "Senior Marketing Manager",
      location: "Mumbai, Maharashtra",
      annualIncome: "₹12-15 Lakhs",
      hobbies: ["Reading", "Yoga", "Traveling", "Photography"],
      aboutMe: "A creative and ambitious professional who loves exploring new places and cultures. Looking for a partner who values family and has a positive outlook on life.",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop"
    },
    {
      id: 2,
      name: "Anjali Verma",
      age: 24,
      height: "5'3\"",
      education: "B.Tech Computer Science, NIT Trichy",
      occupation: "Software Engineer at Google",
      location: "Bangalore, Karnataka",
      annualIncome: "₹18-20 Lakhs",
      hobbies: ["Coding", "Gaming", "Cooking", "Music"],
      aboutMe: "Tech enthusiast with a passion for innovation. I enjoy problem-solving and creating meaningful solutions. Seeking someone who appreciates both technology and simple joys of life.",
      image: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=400&h=400&fit=crop"
    },
    {
      id: 3,
      name: "Neha Patel",
      age: 28,
      height: "5'5\"",
      education: "Chartered Accountant (CA)",
      occupation: "Financial Consultant",
      location: "Ahmedabad, Gujarat",
      annualIncome: "₹15-18 Lakhs",
      hobbies: ["Finance Blogs", "Gardening", "Classical Music", "Volunteering"],
      aboutMe: "Detail-oriented and analytical professional with a love for numbers and nature. I believe in giving back to society and living a balanced life. Looking for an understanding life partner.",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop"
    },
    {
      id: 4,
      name: "Kavya Reddy",
      age: 25,
      height: "5'6\"",
      education: "MBBS, AIIMS Delhi",
      occupation: "Medical Doctor",
      location: "Hyderabad, Telangana",
      annualIncome: "₹10-12 Lakhs",
      hobbies: ["Medical Research", "Swimming", "Painting", "Helping Others"],
      aboutMe: "Compassionate doctor dedicated to serving people. I find joy in making a difference in people's lives. Seeking a supportive partner who understands the demands of medical profession.",
      image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=400&fit=crop"
    },
    {
      id: 5,
      name: "Riya Singh",
      age: 27,
      height: "5'5\"",
      education: "M.Sc Physics, Delhi University",
      occupation: "Research Scientist at ISRO",
      location: "Delhi, Delhi",
      annualIncome: "₹8-10 Lakhs",
      hobbies: ["Astronomy", "Writing", "Hiking", "Chess"],
      aboutMe: "Curious mind working towards space exploration. I love stargazing and understanding the universe. Looking for someone who shares curiosity and respects each other's ambitions.",
      image: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400&h=400&fit=crop"
    },
    {
      id: 6,
      name: "Divya Iyer",
      age: 26,
      height: "5'4\"",
      education: "B.Des Fashion Design, NIFT",
      occupation: "Fashion Designer & Entrepreneur",
      location: "Chennai, Tamil Nadu",
      annualIncome: "₹8-12 Lakhs",
      hobbies: ["Sketching", "Fashion Shows", "Dance", "Shopping"],
      aboutMe: "Creative soul with an eye for aesthetics. I run my own boutique and love bringing ideas to life. Seeking a partner who appreciates art and creativity in everyday life.",
      image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=400&fit=crop"
    },
    {
      id: 7,
      name: "Shreya Gupta",
      age: 23,
      height: "5'3\"",
      education: "BBA, Symbiosis Pune",
      occupation: "Business Analyst at Deloitte",
      location: "Pune, Maharashtra",
      annualIncome: "₹6-8 Lakhs",
      hobbies: ["Data Analytics", "Badminton", "Movies", "Blogging"],
      aboutMe: "Young professional starting my journey in the corporate world. I'm passionate about learning and growing. Looking for someone who is mature, understanding and family-oriented.",
      image: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&h=400&fit=crop"
    },
    {
      id: 8,
      name: "Meera Joshi",
      age: 29,
      height: "5'6\"",
      education: "LLB, National Law School Bangalore",
      occupation: "Corporate Lawyer",
      location: "Mumbai, Maharashtra",
      annualIncome: "₹20-25 Lakhs",
      hobbies: ["Reading Legal Journals", "Debating", "Running", "Social Work"],
      aboutMe: "Dedicated lawyer fighting for justice. I believe in equality and fairness. Seeking an educated partner who respects professional commitments and shares similar values.",
      image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&h=400&fit=crop"
    },
    {
      id: 9,
      name: "Pooja Desai",
      age: 25,
      height: "5'4\"",
      education: "B.Arch, CEPT Ahmedabad",
      occupation: "Architect at Design Studio",
      location: "Surat, Gujarat",
      annualIncome: "₹7-9 Lakhs",
      hobbies: ["Architecture Tours", "Sketching", "Interior Design", "Pottery"],
      aboutMe: "Passionate architect who loves creating beautiful spaces. I believe homes reflect personalities. Looking for a life partner to build our dream home and future together.",
      image: "https://images.unsplash.com/photo-1499952127939-9bbf5af6c51c?w=400&h=400&fit=crop"
    },
    {
      id: 10,
      name: "Aditi Malhotra",
      age: 27,
      height: "5'5\"",
      education: "MBA Finance, XLRI Jamshedpur",
      occupation: "Investment Banker",
      location: "Gurgaon, Haryana",
      annualIncome: "₹25-30 Lakhs",
      hobbies: ["Stock Market", "Golf", "Fine Dining", "Meditation"],
      aboutMe: "Dynamic finance professional with global exposure. I enjoy challenges and believe in smart work. Seeking an ambitious partner who values both career and relationships equally.",
      image: "https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?w=400&h=400&fit=crop"
    }
  ];

  const toggleLike = (id) => {
    setLikedProfiles(prev => 
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  return (
    <div className="flex h-screen bg-white">
      {/* Sidebar */}
      <div className="w-72 bg-red-900 text-white flex flex-col">
        <div className="p-8 border-b border-red-800">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-white p-2 rounded-lg">
              <Heart className="text-red-900" size={24} />
            </div>
            <h1 className="text-2xl font-bold">Shaadi</h1>
          </div>
          <p className="text-red-200 text-sm mt-2">Find your perfect match</p>
        </div>
        
        <nav className="flex-1 p-6 space-y-2">
          <button className="w-full flex items-center gap-3 px-5 py-3.5 rounded-xl bg-white text-red-900 font-semibold shadow-lg">
            <Search size={20} />
            <span>Browse</span>
          </button>
          <button className="w-full flex items-center gap-3 px-5 py-3.5 rounded-xl hover:bg-red-800 transition-colors">
            <Heart size={20} />
            <span>Favorites</span>
            <span className="ml-auto bg-red-800 px-2 py-0.5 rounded-full text-xs">{likedProfiles.length}</span>
          </button>
          <button className="w-full flex items-center gap-3 px-5 py-3.5 rounded-xl hover:bg-red-800 transition-colors">
            <User size={20} />
            <span>My Profile</span>
          </button>
          <button className="w-full flex items-center gap-3 px-5 py-3.5 rounded-xl hover:bg-red-800 transition-colors">
            <Settings size={20} />
            <span>Settings</span>
          </button>
        </nav>
        
        <div className="p-6 border-t border-red-800">
          <button className="w-full flex items-center gap-3 px-5 py-3.5 rounded-xl hover:bg-red-800 transition-colors">
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto bg-gray-50">
        <div className="p-10">
          <div className="mb-10">
            <h2 className="text-4xl font-bold text-gray-900 mb-2">Discover Your Match</h2>
            <p className="text-gray-500 text-lg">{profiles.length} profiles curated for you</p>
          </div>
          
          {/* Profile Cards Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {profiles.map((profile) => (
              <div key={profile.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-gray-200 overflow-hidden">
                {/* Image Section */}
                <div className="relative">
                  <img 
                    src={profile.image} 
                    alt={profile.name}
                    className="w-full h-56 object-cover"
                  />
                  <button 
                    onClick={() => toggleLike(profile.id)}
                    className={`absolute top-3 right-3 p-2 rounded-full shadow-md transition-all ${
                      likedProfiles.includes(profile.id) 
                        ? 'bg-red-900 text-white' 
                        : 'bg-white text-red-900 hover:bg-red-50'
                    }`}
                  >
                    <Heart 
                      size={16} 
                      className={likedProfiles.includes(profile.id) ? 'fill-current' : ''} 
                    />
                  </button>
                </div>
                
                {/* Content Section */}
                <div className="p-4">
                  <h3 className="text-lg font-bold text-gray-900">{profile.name}</h3>
                  <p className="text-sm text-gray-500 mt-0.5">{profile.age} years • {profile.height}</p>
                  
                  <div className="flex items-center gap-1.5 text-xs text-gray-600 mt-2">
                    <MapPin size={14} className="text-red-900" />
                    <span>{profile.location}</span>
                  </div>
                  
                  {/* Key Info */}
                  <div className="mt-3 space-y-2">
                    <div className="flex items-start gap-2 text-xs">
                      <GraduationCap size={14} className="text-red-900 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700 line-clamp-2">{profile.education}</span>
                    </div>
                    
                    <div className="flex items-start gap-2 text-xs">
                      <Briefcase size={14} className="text-red-900 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700 line-clamp-1">{profile.occupation}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-xs">
                      <DollarSign size={14} className="text-red-900" />
                      <span className="text-gray-700">{profile.annualIncome}</span>
                    </div>
                  </div>
                  
                  {/* Hobbies */}
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {profile.hobbies.slice(0, 3).map((hobby, index) => (
                      <span key={index} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                        {hobby}
                      </span>
                    ))}
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex gap-2 mt-4">
                    <button className="flex-1 bg-red-900 hover:bg-red-800 text-white py-2 rounded-lg transition-all text-sm font-medium flex items-center justify-center gap-1.5">
                      <MessageCircle size={14} />
                      <span>Connect</span>
                    </button>
                    <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-lg transition-all text-sm font-medium">
                      <Eye size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}