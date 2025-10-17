import React, { useEffect, useState } from 'react';
import { MapPin, Briefcase, GraduationCap, Mail, Home, Heart, User, Settings, MessageCircle, Cake, Ruler, Users, Globe, Phone, Calendar, Scale, Menu, X, Filter } from 'lucide-react';

export default function MatrimonyDashboard() {
  const [profiles, setProfiles] = useState([]);
  const [matches, setMatches] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('all');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [filters, setFilters] = useState({
    gender: '',
    minAge: '',
    maxAge: '',
    education: '',
    city: '',
    state: '',
    minHeight: '',
    maxHeight: ''
  });

  const decodeToken = (token) => {
    try {
      const payload = token.split('.')[1];
      const base64Url = payload.replace(/-/g, '+').replace(/_/g, '/');
      const base64 = base64Url + '==';
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      const decoded = JSON.parse(jsonPayload);
      return { email: decoded.email || decoded.sub, userId: decoded.sub || decoded.id || decoded.userId };
    } catch (e) {
      return { email: null, userId: null };
    }
  };

  useEffect(() => {
    fetchProfiles();
    fetchMatches();
  }, []);

  // Add this useEffect to scroll to top when detailed profile view opens
  useEffect(() => {
    if (selectedProfile) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [selectedProfile]);

  const fetchProfiles = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('User not logged in');

      const { email: userEmail, userId } = decodeToken(token);

      const response = await fetch('http://localhost:4000/api/profile', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('Failed to fetch profiles');

      const data = await response.json();

      const profilesData = data.map(user => {
        let profileImg = null;
        if (user.profileImage?.data?.data) {
          const bytes = new Uint8Array(user.profileImage.data.data);
          let binary = '';
          bytes.forEach(b => binary += String.fromCharCode(b));
          profileImg = `data:${user.profileImage.contentType};base64,${btoa(binary)}`;
        }
        return { ...user, profileImage: profileImg };
      });

      let loggedInUser = profilesData.find(p => p._id === userId) || profilesData.find(p => p.email === userEmail);
      if (loggedInUser) setCurrentUser(loggedInUser);

      const otherProfiles = profilesData.filter(profile => profile._id !== (loggedInUser?._id));
      setProfiles(otherProfiles);
    } catch (err) {
      setError(err.message || 'Failed to fetch profiles');
    } finally {
      setLoading(false);
    }
  };

  const fetchMatches = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch('http://localhost:4000/api/matches', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('Failed to fetch matches');

      const data = await response.json();

      const processedMatches = data.map(user => {
        let profileImg = null;
        if (user.profileImage?.data?.data) {
          const bytes = new Uint8Array(user.profileImage.data.data);
          let binary = '';
          bytes.forEach(b => binary += String.fromCharCode(b));
          profileImg = `data:${user.profileImage.contentType};base64,${btoa(binary)}`;
        }
        return { ...user, profileImage: profileImg };
      });

      setMatches(processedMatches);
    } catch (err) {
      console.error(err);
    }
  };

  const applyFilters = (profilesList) => {
    return profilesList.filter(profile => {
      if (filters.gender && profile.gender !== filters.gender) return false;
      
      if (filters.minAge && profile.age < parseInt(filters.minAge)) return false;
      if (filters.maxAge && profile.age > parseInt(filters.maxAge)) return false;
      
      if (filters.education && !profile.education?.toLowerCase().includes(filters.education.toLowerCase())) return false;
      
      if (filters.city && !profile.city?.toLowerCase().includes(filters.city.toLowerCase())) return false;
      if (filters.state && !profile.state?.toLowerCase().includes(filters.state.toLowerCase())) return false;
      
      if (filters.minHeight || filters.maxHeight) {
        const heightInCm = parseFloat(profile.height);
        if (filters.minHeight && heightInCm < parseFloat(filters.minHeight)) return false;
        if (filters.maxHeight && heightInCm > parseFloat(filters.maxHeight)) return false;
      }
      
      return true;
    });
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      gender: '',
      minAge: '',
      maxAge: '',
      education: '',
      city: '',
      state: '',
      minHeight: '',
      maxHeight: ''
    });
  };

  const activeFilterCount = Object.values(filters).filter(v => v !== '').length;

  const renderCompactProfileCard = (profile, isCurrentUser = false) => (
    <div 
      onClick={() => setSelectedProfile(profile)}
      className="group bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden hover:-translate-y-1 cursor-pointer"
    >
      <div className="relative bg-gradient-to-br from-red-50 to-orange-50 pt-8 pb-16">
        {/* Decorative Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-4 right-4 w-20 h-20 bg-red-300 rounded-full blur-2xl"></div>
          <div className="absolute bottom-4 left-4 w-16 h-16 bg-orange-300 rounded-full blur-2xl"></div>
        </div>
        
        {/* Profile Image Circle */}
        <div className="relative flex justify-center">
          <div className="relative">
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-xl ring-2 ring-red-100">
              {profile.profileImage ? (
                <img
                  src={profile.profileImage}
                  alt={`${profile.firstName} ${profile.lastName}`}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-red-100 to-red-50 flex items-center justify-center">
                  <User className="w-16 h-16 text-red-300" />
                </div>
              )}
            </div>
            {isCurrentUser && (
              <div className="absolute -top-2 -right-2 bg-red-900 text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg">
                You
              </div>
            )}
          </div>
        </div>
        
        {/* Age and Gender Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          <div className="px-3 py-1 bg-white/95 backdrop-blur-sm text-gray-900 rounded-full text-xs font-bold shadow-md flex items-center gap-1">
            <Users className="w-3 h-3 text-red-900" />
            {profile.gender}
          </div>
          {profile.age && (
            <div className="px-3 py-1 bg-white/95 backdrop-blur-sm text-gray-900 rounded-full text-xs font-bold shadow-md flex items-center gap-1">
              <Cake className="w-3 h-3 text-red-900" />
              {profile.age}
            </div>
          )}
        </div>
      </div>

      {/* Profile Details */}
      <div className="p-6 -mt-8 relative">
        <div className="text-center mb-4">
          <h3 className="text-xl font-bold text-gray-900 mb-1">
            {profile.firstName} {profile.lastName}
          </h3>
          {profile.occupation && (
            <p className="text-sm text-gray-600 font-medium">{profile.occupation}</p>
          )}
        </div>
        
        <div className="space-y-3 mb-5">
          {profile.education && (
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-red-50 transition-colors">
              <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <GraduationCap className="w-4 h-4 text-red-900" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-500 font-medium">Education</p>
                <p className="text-sm font-semibold text-gray-900 truncate">{profile.education}</p>
              </div>
            </div>
          )}
          {profile.maritalStatus && (
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-red-50 transition-colors">
              <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Heart className="w-4 h-4 text-red-900" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-500 font-medium">Marital Status</p>
                <p className="text-sm font-semibold text-gray-900 truncate">{profile.maritalStatus}</p>
              </div>
            </div>
          )}
          {profile.city && (
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-red-50 transition-colors">
              <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <MapPin className="w-4 h-4 text-red-900" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-500 font-medium">Location</p>
                <p className="text-sm font-semibold text-gray-900 truncate">{profile.city}, {profile.state}</p>
              </div>
            </div>
          )}
          {profile.height && (
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-red-50 transition-colors">
              <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Ruler className="w-4 h-4 text-red-900" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-500 font-medium">Height</p>
                <p className="text-sm font-semibold text-gray-900">{profile.height}</p>
              </div>
            </div>
          )}
        </div>
        
        <button className="w-full cursor-pointer py-3 bg-gradient-to-r from-red-900 to-red-800 text-white rounded-xl text-sm font-bold hover:from-red-800 hover:to-red-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02]">
          {isCurrentUser ? 'Edit Profile' : 'View Full Profile'}
        </button>
      </div>
    </div>
  );

  const renderDetailedProfileCard = (profile, isCurrentUser = false) => {
    const fieldConfig = [
      { key: 'profileFor', label: 'PROFILE FOR', icon: Heart },
      { key: 'firstName', label: 'FIRST NAME', icon: User },
      { key: 'lastName', label: 'LAST NAME', icon: User },
      { key: 'gender', label: 'GENDER', icon: Users },
      { key: 'dob', label: 'DOB', icon: Calendar },
      { key: 'age', label: 'AGE', icon: Cake },
      { key: 'maritalStatus', label: 'MARITAL STATUS', icon: Users },
      { key: 'height', label: 'HEIGHT', icon: Ruler },
      { key: 'weight', label: 'WEIGHT', icon: Scale },
      { key: 'diet', label: 'DIET', icon: Users },
      { key: 'religion', label: 'RELIGION', icon: Users },
      { key: 'community', label: 'COMMUNITY', icon: Users },
      { key: 'subCommunity', label: 'SUB COMMUNITY', icon: Users },
      { key: 'motherTongue', label: 'MOTHER TONGUE', icon: Globe },
      { key: 'caste', label: 'CASTE', icon: Users },
      { key: 'gotra', label: 'GOTRA', icon: Users },
      { key: 'city', label: 'CITY', icon: MapPin },
      { key: 'state', label: 'STATE', icon: Globe },
      { key: 'country', label: 'COUNTRY', icon: Globe },
      { key: 'education', label: 'EDUCATION', icon: GraduationCap },
      { key: 'occupation', label: 'OCCUPATION', icon: Briefcase },
      { key: 'annualIncome', label: 'ANNUAL INCOME', icon: Briefcase },
      { key: 'email', label: 'EMAIL', icon: Mail },
      { key: 'phone', label: 'PHONE', icon: Phone },
      { key: 'fatherName', label: 'FATHER NAME', icon: User },
      { key: 'motherName', label: 'MOTHER NAME', icon: User },
      { key: 'fatherOccupation', label: 'FATHER OCCUPATION', icon: Briefcase },
      { key: 'motherOccupation', label: 'MOTHER OCCUPATION', icon: Briefcase },
      { key: 'siblings', label: 'SIBLINGS', icon: Users },
      { key: 'familyType', label: 'FAMILY TYPE', icon: Home },
      { key: 'familyStatus', label: 'FAMILY STATUS', icon: Users },
      { key: 'about', label: 'ABOUT', icon: User },
    ];

    const profileFields = fieldConfig
      .filter(({ key }) => profile[key] !== null && profile[key] !== undefined && profile[key] !== '')
      .map(({ key, label, icon }) => ({
        key,
        value: profile[key],
        icon,
        label
      }));

    return (
      <div className=" p-4 md:p-8 flex items-center justify-center">
        <div className="max-w-6xl w-full mx-auto">
          {/* Header with close button */}
          <div className="flex justify-end mb-4">
            <button
              onClick={() => setSelectedProfile(null)}
              className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
            >
              <X className="w-6 h-6 text-gray-600 cursor-pointer" />
            </button>
          </div>

          <div className="bg-white rounded-2xl shadow-xl h-[65rem]">
            {/* Profile Header */}
            <div className=" px-8 py-12 text-center relative">
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-10 right-10 w-32 h-32 bg-red-300 rounded-full blur-3xl"></div>
                <div className="absolute bottom-10 left-10 w-24 h-24 bg-orange-300 rounded-full blur-3xl"></div>
              </div>
              
              <div className="relative flex flex-col items-center gap-4">
                <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-white shadow-2xl ring-4 ring-red-100">
                  {profile.profileImage ? (
                    <img
                      src={profile.profileImage}
                      alt={`${profile.firstName} ${profile.lastName}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-red-100 to-red-50 flex items-center justify-center">
                      <User className="w-20 h-20 text-red-300" />
                    </div>
                  )}
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">
                    {profile.firstName} {profile.lastName}
                  </h2>
                  <p className="text-gray-600 text-lg">{profile.occupation || 'Professional'}</p>
                </div>
              </div>
            </div>

            {/* Profile Details Grid */}
            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {profileFields.map(({ key, value, icon: Icon, label }) => (
                  <div key={key} className="bg-gray-50 rounded-xl p-4 hover:bg-red-50 transition-colors">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm">
                        <Icon className="w-5 h-5 text-red-900" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                          {label}
                        </p>
                        <p className="text-base font-bold text-gray-900 break-words">
                          {value}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              {/* <div className="mt-8 flex flex-wrap gap-4 justify-center">
                {isCurrentUser ? (
                  <button className="px-8 py-3 bg-gradient-to-r from-red-900 to-red-800 text-white rounded-xl text-sm font-bold hover:from-red-800 hover:to-red-700 transition-all duration-300 shadow-lg hover:shadow-xl">
                    Update Profile
                  </button>
                ) : (
                  <>
                    <button className="px-8 py-3 bg-gradient-to-r from-red-900 to-red-800 text-white rounded-xl text-sm font-bold hover:from-red-800 hover:to-red-700 transition-all duration-300 shadow-lg hover:shadow-xl">
                      Send Interest
                    </button>
                    <button className="px-8 py-3 bg-white border-2 border-red-900 text-red-900 rounded-xl text-sm font-bold hover:bg-red-50 transition-all duration-300 shadow-lg hover:shadow-xl">
                      Send Message
                    </button>
                  </>
                )}
              </div> */}
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-red-900 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profiles...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center bg-gray-50">
        <div className="text-center bg-white p-8 rounded-lg shadow-sm">
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'all', label: 'All Profiles', icon: Home },
    { id: 'matches', label: 'Matches', icon: Heart },
    { id: 'messages', label: 'Messages', icon: MessageCircle },
    { id: 'profile', label: 'My Profile', icon: User },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="flex bg-gray-50 justify-center">
      {/* Show detailed profile view if a profile is selected */}
      {selectedProfile ? (
        renderDetailedProfileCard(selectedProfile, selectedProfile._id === currentUser?._id)
      ) : (
        <>
          {/* Sidebar */}
          <div className={`
            fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 shadow-lg
            transform transition-transform duration-300 ease-in-out
            lg:relative lg:translate-x-0
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          `}>
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h1 className="text-xl font-bold text-red-900">MatriMatch</h1>
              <button
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden p-2 rounded-md hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <nav className="mt-6 px-3 space-y-1">
              {tabs.map(tab => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id);
                      setSidebarOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors duration-200 ${
                      activeTab === tab.id
                        ? 'bg-red-50 text-red-900'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-100">
              <button className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-900 hover:bg-red-50 rounded-lg transition-colors">
                <User className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </div>
          </div>

          {/* Overlay for mobile */}
          {sidebarOpen && (
            <div
              className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}

          {/* Main Content */}
          <div className="flex-1 overflow-auto">
            {/* Mobile Header */}
            <div className="lg:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-0 z-30">
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-2 rounded-md hover:bg-gray-100"
              >
                <Menu className="w-6 h-6" />
              </button>
              <h1 className="text-lg font-bold text-gray-900">MatriMatch</h1>
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                {currentUser?.profileImage ? (
                  <img
                    src={currentUser.profileImage}
                    alt="Profile"
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <User className="w-5 h-5 text-red-900" />
                )}
              </div>
            </div>

            <main className="p-4 md:p-8">
              {activeTab === 'all' && (
                <div className="max-w-7xl mx-auto">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">All Profiles</h2>
                  
                  {/* Filter Section */}
                  <div className="mb-6">
                    <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
                      <div className="flex items-center justify-between mb-4">
                        <button
                          onClick={() => setShowFilters(!showFilters)}
                          className="flex items-center gap-2 px-4 py-2 bg-red-900 text-white rounded-md hover:bg-red-800 transition-colors text-sm font-medium"
                        >
                          <Filter className="w-4 h-4" />
                          <span>Filters</span>
                          {activeFilterCount > 0 && (
                            <span className="px-2 py-0.5 bg-white text-red-900 rounded-full text-xs font-bold">
                              {activeFilterCount}
                            </span>
                          )}
                        </button>
                        {activeFilterCount > 0 && (
                          <button
                            onClick={clearFilters}
                            className="text-sm text-red-900 hover:text-red-700 font-medium"
                          >
                            Clear All
                          </button>
                        )}
                      </div>

                      {showFilters && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-gray-200">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                            <select
                              value={filters.gender}
                              onChange={(e) => handleFilterChange('gender', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-900 focus:border-transparent text-sm"
                            >
                              <option value="">All</option>
                              <option value="Male">Male</option>
                              <option value="Female">Female</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Min Age</label>
                            <input
                              type="number"
                              value={filters.minAge}
                              onChange={(e) => handleFilterChange('minAge', e.target.value)}
                              placeholder="e.g., 25"
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-900 focus:border-transparent text-sm"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Max Age</label>
                            <input
                              type="number"
                              value={filters.maxAge}
                              onChange={(e) => handleFilterChange('maxAge', e.target.value)}
                              placeholder="e.g., 35"
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-900 focus:border-transparent text-sm"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Education</label>
                            <input
                              type="text"
                              value={filters.education}
                              onChange={(e) => handleFilterChange('education', e.target.value)}
                              placeholder="e.g., MBA"
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-900 focus:border-transparent text-sm"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                            <input
                              type="text"
                              value={filters.city}
                              onChange={(e) => handleFilterChange('city', e.target.value)}
                              placeholder="e.g., Mumbai"
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-900 focus:border-transparent text-sm"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                            <input
                              type="text"
                              value={filters.state}
                              onChange={(e) => handleFilterChange('state', e.target.value)}
                              placeholder="e.g., Maharashtra"
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-900 focus:border-transparent text-sm"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Min Height (cm)</label>
                            <input
                              type="number"
                              value={filters.minHeight}
                              onChange={(e) => handleFilterChange('minHeight', e.target.value)}
                              placeholder="e.g., 160"
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-900 focus:border-transparent text-sm"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Max Height (cm)</label>
                            <input
                              type="number"
                              value={filters.maxHeight}
                              onChange={(e) => handleFilterChange('maxHeight', e.target.value)}
                              placeholder="e.g., 180"
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-900 focus:border-transparent text-sm"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Profiles Grid */}
                  {applyFilters(profiles).length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-lg">
                      <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">
                        {activeFilterCount > 0 ? 'No profiles match your filters' : 'No profiles available'}
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {applyFilters(profiles).map(profile => (
                        <div key={profile._id}>
                          {renderCompactProfileCard(profile)}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'matches' && (
                <div className="max-w-7xl mx-auto">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Matches</h2>
                  {matches.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-lg">
                      <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">No matches found yet</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2
                     md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {matches.map(profile => (
                        <div key={profile._id}>
                          {renderCompactProfileCard(profile)}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'profile' && currentUser && (
                <div className="max-w-4xl mx-auto">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">My Profile</h2>
                  <div onClick={() => setSelectedProfile(currentUser)} className="cursor-pointer">
                    {renderCompactProfileCard(currentUser, true)}
                  </div>
                </div>
              )}

              {activeTab === 'messages' && (
                <div className="max-w-4xl mx-auto">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Messages</h2>
                  <div className="bg-white rounded-lg p-12 text-center">
                    <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">Messages section coming soon.</p>
                  </div>
                </div>
              )}

              {activeTab === 'settings' && (
                <div className="max-w-4xl mx-auto">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Settings</h2>
                  <div className="bg-white rounded-lg p-12 text-center">
                    <Settings className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">Settings section coming soon.</p>
                  </div>
                </div>
              )}
            </main>
          </div>
        </>
      )}
    </div>
  );
}