import React, { useState } from 'react';
import { Heart, Search, User, Settings, LogOut, MapPin, Briefcase, GraduationCap, DollarSign, MessageCircle, Eye, Edit, Mail, Phone, Home, Users, Calendar, Utensils } from 'lucide-react';

export default function MatrimonyDashboard() {
  const [likedProfiles, setLikedProfiles] = useState([]);

  // Logged-in user data (dummy data based on schema)
  const currentUser = {
    profileFor: "Self",
    firstName: "Rahul",
    lastName: "Sharma",
    gender: "Male",
    dob: "1995-05-15",
    maritalStatus: "Never Married",
    height: "5'10\"",
    diet: "Vegetarian",
    religion: "Hindu",
    community: "Brahmin",
    subCommunity: "Gaur",
    city: "Mumbai",
    state: "Maharashtra",
    liveWithFamily: true,
    fatherName: "Mr. Rajesh Sharma",
    motherName: "Mrs. Sunita Sharma",
    familyMembers: 4,
    highestQualification: "B.Tech Computer Science, IIT Bombay",
    collegeName: "IIT Bombay",
    workDetails: "Private",
    workAs: "Software Engineer",
    currentCompany: "Amazon",
    income: "₹15-18 Lakhs",
    languagesKnown: ["Hindi", "English", "Marathi"],
    email: "rahul.sharma@example.com",
    mobile: "9876543210",
    aboutYourself: "A dedicated software engineer with a passion for technology and innovation. I enjoy problem-solving, traveling, and spending quality time with family. Looking for a life partner who values family, has a positive outlook, and shares similar interests.",
    profileImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop"
  };

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
      hobbies: ["Finance", "Gardening", "Music", "Volunteering"],
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
      hobbies: ["Research", "Swimming", "Painting", "Social Work"],
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
      image: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400&h=400&fit=crop"
    },
    {
      id: 6,
      name: "Divya Iyer",
      age: 26,
      height: "5'4\"",
      education: "B.Des Fashion Design, NIFT",
      occupation: "Fashion Designer",
      location: "Chennai, Tamil Nadu",
      annualIncome: "₹8-12 Lakhs",
      hobbies: ["Sketching", "Fashion", "Dance", "Shopping"],
      image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=400&fit=crop"
    }
  ];

  const calculateAge = (dob) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-72 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-8 border-b border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-rose-50 p-2 rounded-lg">
              <Heart className="text-rose-600" size={24} />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Shaadi</h1>
          </div>
          <p className="text-gray-500 text-sm mt-2">Find your perfect match</p>
        </div>
        
        <nav className="flex-1 p-6 space-y-2">
          <button className="w-full flex items-center gap-3 px-5 py-3.5 rounded-xl bg-gray-900 text-white font-medium">
            <Search size={20} />
            <span>Browse</span>
          </button>
          <button className="w-full flex items-center gap-3 px-5 py-3.5 rounded-xl text-gray-700 hover:bg-gray-100 transition-colors">
            <User size={20} />
            <span>My Profile</span>
          </button>
          <button className="w-full flex items-center gap-3 px-5 py-3.5 rounded-xl text-gray-700 hover:bg-gray-100 transition-colors">
            <Settings size={20} />
            <span>Settings</span>
          </button>
        </nav>
        
        <div className="p-6 border-t border-gray-200">
          <button className="w-full flex items-center gap-3 px-5 py-3.5 rounded-xl text-gray-700 hover:bg-gray-100 transition-colors">
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto p-8">
          {/* Current User Profile Section */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold text-gray-900">My Profile</h2>
              <button className="bg-gray-900 hover:bg-gray-800 text-white px-5 py-2.5 rounded-lg transition-colors flex items-center gap-2 font-medium">
                <Edit size={18} />
                Edit Profile
              </button>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-8">
                {/* Profile Image - Centered */}
                <div className="flex flex-col items-center mb-8">
                  <img 
                    src={currentUser.profileImage} 
                    alt={`${currentUser.firstName} ${currentUser.lastName}`}
                    className="w-40 h-40 rounded-full object-cover border-4 border-gray-100"
                  />
                  <h3 className="text-2xl font-bold text-gray-900 mt-4">{currentUser.firstName} {currentUser.lastName}</h3>
                  <p className="text-gray-500 text-sm mt-1">Profile for {currentUser.profileFor}</p>
                </div>

                {/* Details in 2 Columns */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 max-w-4xl mx-auto">
                  {/* Column 1 */}
                  <div className="space-y-5">
                    <div className="flex items-start gap-3">
                      <Calendar size={20} className="text-gray-400 mt-1 flex-shrink-0" />
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Age</p>
                        <p className="text-base font-semibold text-gray-900">{calculateAge(currentUser.dob)} years</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <User size={20} className="text-gray-400 mt-1 flex-shrink-0" />
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Height</p>
                        <p className="text-base font-semibold text-gray-900">{currentUser.height}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Utensils size={20} className="text-gray-400 mt-1 flex-shrink-0" />
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Diet</p>
                        <p className="text-base font-semibold text-gray-900">{currentUser.diet}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Heart size={20} className="text-gray-400 mt-1 flex-shrink-0" />
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Marital Status</p>
                        <p className="text-base font-semibold text-gray-900">{currentUser.maritalStatus}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <GraduationCap size={20} className="text-gray-400 mt-1 flex-shrink-0" />
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Education</p>
                        <p className="text-base font-semibold text-gray-900">{currentUser.highestQualification}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Briefcase size={20} className="text-gray-400 mt-1 flex-shrink-0" />
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Occupation</p>
                        <p className="text-base font-semibold text-gray-900">{currentUser.workAs}</p>
                        <p className="text-sm text-gray-600 mt-0.5">{currentUser.currentCompany}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <DollarSign size={20} className="text-gray-400 mt-1 flex-shrink-0" />
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Annual Income</p>
                        <p className="text-base font-semibold text-gray-900">{currentUser.income}</p>
                      </div>
                    </div>
                  </div>

                  {/* Column 2 */}
                  <div className="space-y-5">
                    <div className="flex items-start gap-3">
                      <Mail size={20} className="text-gray-400 mt-1 flex-shrink-0" />
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Email</p>
                        <p className="text-base font-semibold text-gray-900 break-all">{currentUser.email}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Phone size={20} className="text-gray-400 mt-1 flex-shrink-0" />
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Mobile</p>
                        <p className="text-base font-semibold text-gray-900">{currentUser.mobile}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <MapPin size={20} className="text-gray-400 mt-1 flex-shrink-0" />
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Location</p>
                        <p className="text-base font-semibold text-gray-900">{currentUser.city}, {currentUser.state}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Heart size={20} className="text-gray-400 mt-1 flex-shrink-0" />
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Religion</p>
                        <p className="text-base font-semibold text-gray-900">{currentUser.religion}</p>
                        <p className="text-sm text-gray-600 mt-0.5">{currentUser.community} • {currentUser.subCommunity}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Home size={20} className="text-gray-400 mt-1 flex-shrink-0" />
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Living Status</p>
                        <p className="text-base font-semibold text-gray-900">{currentUser.liveWithFamily ? 'Lives with family' : 'Lives separately'}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Users size={20} className="text-gray-400 mt-1 flex-shrink-0" />
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Family</p>
                        <p className="text-base font-semibold text-gray-900">{currentUser.familyMembers} members</p>
                        <p className="text-sm text-gray-600 mt-1">{currentUser.fatherName}</p>
                        <p className="text-sm text-gray-600">{currentUser.motherName}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <MessageCircle size={20} className="text-gray-400 mt-1 flex-shrink-0" />
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Languages</p>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {currentUser.languagesKnown.map((lang, index) => (
                            <span key={index} className="text-sm bg-gray-100 text-gray-700 px-3 py-1 rounded-lg font-medium">
                              {lang}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* About Section - Full Width (Merged Columns) */}
                <div className="mt-8 pt-6 border-t border-gray-200 max-w-4xl mx-auto">
                  <div className="flex items-start gap-3">
                    <User size={20} className="text-gray-400 mt-1 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">About Me</p>
                      <p className="text-base text-gray-700 leading-relaxed">{currentUser.aboutYourself}</p>
                    </div>
                  </div>
              </div>
            </div>
          </div>

          {/* Browse Profiles Section */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Discover Your Match</h2>
            <p className="text-gray-600">{profiles.length} profiles curated for you</p>
          </div>
          
          {/* Profile Cards Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {profiles.map((profile) => (
              <div key={profile.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-gray-200 overflow-hidden">
                <div className="relative">
                  <img 
                    src={profile.image} 
                    alt={profile.name}
                    className="w-full h-56 object-cover"
                  />
                </div>
                
                <div className="p-5">
                  <h3 className="text-xl font-bold text-gray-900">{profile.name}</h3>
                  <p className="text-sm text-gray-500 mt-1">{profile.age} years • {profile.height}</p>
                  
                  <div className="flex items-center gap-2 text-sm text-gray-600 mt-3">
                    <MapPin size={16} className="text-gray-400" />
                    <span>{profile.location}</span>
                  </div>
                  
                  <div className="mt-4 space-y-3">
                    <div className="flex items-start gap-3 text-sm">
                      <GraduationCap size={16} className="text-gray-400 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700 line-clamp-2">{profile.education}</span>
                    </div>
                    
                    <div className="flex items-start gap-3 text-sm">
                      <Briefcase size={16} className="text-gray-400 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700 line-clamp-1">{profile.occupation}</span>
                    </div>
                    
                    <div className="flex items-center gap-3 text-sm">
                      <DollarSign size={16} className="text-gray-400" />
                      <span className="text-gray-700">{profile.annualIncome}</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mt-4">
                    {profile.hobbies.slice(0, 3).map((hobby, index) => (
                      <span key={index} className="text-xs bg-gray-100 text-gray-600 px-3 py-1.5 rounded-lg">
                        {hobby}
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex gap-3 mt-5">
                    <button className="flex-1 bg-gray-900 hover:bg-gray-800 text-white py-2.5 rounded-lg transition-all text-sm font-medium flex items-center justify-center gap-2">
                      <MessageCircle size={16} />
                      <span>Connect</span>
                    </button>
                    <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 py-2.5 px-4 rounded-lg transition-all text-sm font-medium">
                      <Eye size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}