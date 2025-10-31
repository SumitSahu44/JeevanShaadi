import React, { useEffect, useState } from 'react';
import { MapPin, Briefcase, GraduationCap, Mail, Home, Heart, User, Settings, MessageCircle, Cake, Ruler, Users, Globe, Phone, Calendar, Scale, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function MatrimonyDashboard() {
  const [profiles, setProfiles] = useState([]);
  const [matches, setMatches] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('all');
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

  useEffect(() => {
    if (selectedProfile) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [selectedProfile]);

  const fetchProfiles = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('You are not logged in');

      const { email: userEmail, userId } = decodeToken(token);

      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/profile`, {
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

      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/matches`, {
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
      className="group bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden hover:-translate-y-0.5 cursor-pointer"
    >
      <div className="relative bg-gradient-to-br from-red-50 to-orange-50 pt-6 pb-12">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-2 right-2 w-16 h-16 bg-red-300 rounded-full blur-xl"></div>
          <div className="absolute bottom-2 left-2 w-12 h-12 bg-orange-300 rounded-full blur-xl"></div>
        </div>
        
        <div className="relative flex justify-center">
          <div className="relative">
            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg ring-2 ring-red-100">
              {profile.profileImage ? (
                <img
                  src={profile.profileImage}
                  alt={`${profile.Name} `}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-red-100 to-red-50 flex items-center justify-center">
                  <User className="w-12 h-12 text-red-300" />
                </div>
              )}
            </div>
            {isCurrentUser && (
              <div className="absolute -top-1 -right-1 bg-red-900 text-white px-1.5 py-0.5 rounded-full text-xs font-bold shadow-md">
                You
              </div>
            )}
          </div>
        </div>
        
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          <div className="px-2 py-0.5 bg-white/95 backdrop-blur-sm text-gray-900 rounded-full text-xs font-bold shadow-sm flex items-center gap-1">
            <Users className="w-2.5 h-2.5 text-red-900" />
            {profile.gender}
          </div>
          {profile.age && (
            <div className="px-2 py-0.5 bg-white/95 backdrop-blur-sm text-gray-900 rounded-full text-xs font-bold shadow-sm flex items-center gap-1">
              <Cake className="w-2.5 h-2.5 text-red-900" />
              {profile.age}
            </div>
          )}
        </div>
      </div>

      <div className="p-4 -mt-6 relative">
        <div className="text-center mb-3">
          <h3 className="text-lg font-bold text-gray-900 mb-1">
            {profile.Name}
          </h3>
          {profile.occupation && (
            <p className="text-xs text-gray-600 font-medium">{profile.occupation}</p>
          )}
        </div>
        
        <div className="space-y-2 mb-4">
          {profile.education && (
            <div className="flex items-center gap-2 p-2.5 bg-gray-50 rounded-md hover:bg-red-50 transition-colors">
              <div className="w-6 h-6 bg-red-100 rounded-md flex items-center justify-center flex-shrink-0">
                <GraduationCap className="w-3 h-3 text-red-900" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-500 font-medium">Education</p>
                <p className="text-sm font-semibold text-gray-900 truncate">{profile.education}</p>
              </div>
            </div>
          )}
          {profile.maritalStatus && (
            <div className="flex items-center gap-2 p-2.5 bg-gray-50 rounded-md hover:bg-red-50 transition-colors">
              <div className="w-6 h-6 bg-red-100 rounded-md flex items-center justify-center flex-shrink-0">
                <Heart className="w-3 h-3 text-red-900" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-500 font-medium">Marital Status</p>
                <p className="text-sm font-semibold text-gray-900 truncate">{profile.maritalStatus}</p>
              </div>
            </div>
          )}
          {profile.city && (
            <div className="flex items-center gap-2 p-2.5 bg-gray-50 rounded-md hover:bg-red-50 transition-colors">
              <div className="w-6 h-6 bg-red-100 rounded-md flex items-center justify-center flex-shrink-0">
                <MapPin className="w-3 h-3 text-red-900" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-500 font-medium">Location</p>
                <p className="text-sm font-semibold text-gray-900 truncate">{profile.city}, {profile.state}</p>
              </div>
            </div>
          )}
          {profile.height && (
            <div className="flex items-center gap-2 p-2.5 bg-gray-50 rounded-md hover:bg-red-50 transition-colors">
              <div className="w-6 h-6 bg-red-100 rounded-md flex items-center justify-center flex-shrink-0">
                <Ruler className="w-3 h-3 text-red-900" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-500 font-medium">Height</p>
                <p className="text-sm font-semibold text-gray-900">{profile.height}</p>
              </div>
            </div>
          )}
        </div>
        
        <button className="w-full py-2 bg-gradient-to-r from-red-900 to-red-800 text-white rounded-lg text-sm font-bold hover:from-red-800 hover:to-red-700 transition-all duration-300 shadow-md hover:shadow-lg">
          {isCurrentUser ? 'Edit Profile' : 'View Full Profile'}
        </button>
      </div>
    </div>
  );

  const renderDetailedProfileCard = (profile, isCurrentUser = false) => {
    const fieldConfig = [
      { key: 'profileFor', label: 'PROFILE FOR', icon: Heart },
      { key: 'Name', label: 'Name', icon: User },
      // { key: 'lastName', label: 'LAST NAME', icon: User },
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
      <div className="p-2 md:p-4 flex items-center justify-center min-h-screen">
        <div className="max-w-3xl w-full mx-auto">
          <div className="flex justify-end mb-2">
            <button
              onClick={() => setSelectedProfile(null)}
              className="p-1.5 bg-white rounded-full shadow-sm hover:bg-gray-100 transition-colors"
            >
              <Filter className="w-5 h-5 text-gray-600 cursor-pointer" />
            </button>
          </div>

          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="px-3 sm:px-6 py-4 sm:py-6 text-center relative">
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-6 right-6 w-24 h-24 bg-red-300 rounded-full blur-2xl"></div>
                <div className="absolute bottom-6 left-6 w-20 h-20 bg-orange-300 rounded-full blur-2xl"></div>
              </div>
              
              <div className="relative flex flex-col items-center gap-2">
                <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-white shadow-xl ring-2 ring-red-100">
                  {profile.profileImage ? (
                    <img
                      src={profile.profileImage}
                      alt={`${profile.Name} `}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-red-100 to-red-50 flex items-center justify-center">
                      <User className="w-12 h-12 sm:w-16 sm:h-16 text-red-300" />
                    </div>
                  )}
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">
                    {profile.Name}
                  </h2>
                  <p className="text-gray-600 text-sm sm:text-base">{profile.occupation || 'Professional'}</p>
                </div>
              </div>
            </div>

            <div className="p-3 sm:p-6 overflow-y-auto max-h-[calc(100vh-16rem)]">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                {profileFields.map(({ key, value, icon: Icon, label }) => (
                  <div key={key} className="bg-gray-50 rounded-lg p-2.5 sm:p-3 hover:bg-red-50 transition-colors">
                    <div className="flex items-start gap-2">
                      <div className="w-7 h-7 sm:w-8 sm:h-8 bg-white rounded-md flex items-center justify-center flex-shrink-0 shadow-sm">
                        <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-900" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-0.5">
                          {label}
                        </p>
                        <p className="text-sm sm:text-base font-bold text-gray-900 break-words">
                          {value}
                        </p>
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
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-red-900 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-gray-600">Loading profiles...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center bg-white p-6 rounded-lg ">
        <img className='h-80 lg:h-[40rem]'  src='/not-login.png'></img>
        <Link to={"/login"} className='z-10 px-10 py-3 bg-red-200 rounded-full text-red-900 font-semibold text-sm lg:text-lg '>Login</Link>
          {/* <p className="text-red-600">{error}</p> */}
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'all', label: 'Dashboard', icon: Home },
    { id: 'matches', label: 'Partner Preferences', icon: Filter },
    { id: 'messages', label: 'My Photos', icon: MessageCircle },
    { id: 'profile', label: 'My Profile', icon: User },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="flex bg-gray-50 min-h-screen flex-col">
      {selectedProfile ? (
        renderDetailedProfileCard(selectedProfile, selectedProfile._id === currentUser?._id)
      ) : (
        <>
          <div className="bg-white border-b border-gray-200">
            <nav className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
              <div className="flex flex-wrap items-center justify-start space-x-1 sm:space-x-3 lg:space-x-6 py-3">
                {tabs.map(tab => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`py-3 px-1 border-b-2 font-medium text-xs sm:text-sm flex items-center gap-1 transition-colors duration-200 ${
                        activeTab === tab.id
                          ? 'border-red-500 text-red-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </nav>
          </div>

          <div className="flex-1 overflow-auto">
            <main className="p-3 md:p-4">
              {activeTab === 'all' && (
                <div className="max-w-7xl mx-auto">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Dashboard</h2>
                  
                  <div className="mb-4">
                    <div className="bg-white rounded-lg shadow-sm p-3 border border-gray-200">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-3">
                        <button
                          onClick={() => setShowFilters(!showFilters)}
                          className="flex items-center gap-2 px-3 py-1.5 bg-red-900 text-white rounded-md hover:bg-red-800 transition-colors text-sm font-medium flex-1 sm:flex-none"
                        >
                          <Filter className="w-3.5 h-3.5" />
                          <span>Filters</span>
                          {activeFilterCount > 0 && (
                            <span className="px-1.5 py-0.5 bg-white text-red-900 rounded-full text-xs font-bold">
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
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-3 border-t border-gray-200">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Gender</label>
                            <select
                              value={filters.gender}
                              onChange={(e) => handleFilterChange('gender', e.target.value)}
                              className="w-full px-2.5 py-1.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-900 focus:border-transparent text-sm"
                            >
                              <option value="">All</option>
                              <option value="Male">Male</option>
                              <option value="Female">Female</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Min Age</label>
                            <input
                              type="number"
                              value={filters.minAge}
                              onChange={(e) => handleFilterChange('minAge', e.target.value)}
                              placeholder="e.g., 25"
                              className="w-full px-2.5 py-1.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-900 focus:border-transparent text-sm"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Max Age</label>
                            <input
                              type="number"
                              value={filters.maxAge}
                              onChange={(e) => handleFilterChange('maxAge', e.target.value)}
                              placeholder="e.g., 35"
                              className="w-full px-2.5 py-1.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-900 focus:border-transparent text-sm"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Education</label>
                            <input
                              type="text"
                              value={filters.education}
                              onChange={(e) => handleFilterChange('education', e.target.value)}
                              placeholder="e.g., MBA"
                              className="w-full px-2.5 py-1.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-900 focus:border-transparent text-sm"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">City</label>
                            <input
                              type="text"
                              value={filters.city}
                              onChange={(e) => handleFilterChange('city', e.target.value)}
                              placeholder="e.g., Mumbai"
                              className="w-full px-2.5 py-1.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-900 focus:border-transparent text-sm"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">State</label>
                            <input
                              type="text"
                              value={filters.state}
                              onChange={(e) => handleFilterChange('state', e.target.value)}
                              placeholder="e.g., Maharashtra"
                              className="w-full px-2.5 py-1.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-900 focus:border-transparent text-sm"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Min Height (ft)</label>
                            <input
                              type="number"
                              value={filters.minHeight}
                              onChange={(e) => handleFilterChange('minHeight', e.target.value)}
                              placeholder="e.g., 160"
                              className="w-full px-2.5 py-1.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-900 focus:border-transparent text-sm"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Max Height (ft)</label>
                            <input
                              type="number"
                              value={filters.maxHeight}
                              onChange={(e) => handleFilterChange('maxHeight', e.target.value)}
                              placeholder="e.g., 180"
                              className="w-full px-2.5 py-1.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-900 focus:border-transparent text-sm"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {applyFilters(profiles).length === 0 ? (
                    <div className="text-center py-8 bg-white rounded-lg">
                      <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500">
                        {activeFilterCount > 0 ? 'No profiles match your filters' : 'No profiles available'}
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Partner Preferences</h2>
                  {matches.length === 0 ? (
                    <div className="text-center py-8 bg-white rounded-lg">
                      <Heart className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500">No matches found yet</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {matches.map(profile => (
                        <div key={profile._id}>
                          {renderCompactProfileCard(profile)}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'messages' && (
                <div className="max-w-3xl mx-auto">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">My Photos</h2>
                  <div className="bg-white rounded-lg p-8 text-center">
                    <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">My Photos section coming soon.</p>
                  </div>
                </div>
              )}

              {activeTab === 'profile' && currentUser && (
                <div className="max-w-3xl mx-auto">
                  <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="bg-gradient-to-r from-gray-100 to-gray-50 p-3 sm:p-4 border-b">
                      <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-shrink-0">
                          <div className="w-40 h-48 border-4 border-white shadow-lg rounded-lg overflow-hidden">
                            {currentUser.profileImage ? (
                              <img
                                src={currentUser.profileImage}
                                alt={`${currentUser.Name} `}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-gradient-to-br from-red-100 to-red-50 flex items-center justify-center">
                                <User className="w-16 h-16 text-red-300" />
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex-1">
                          <h2 className="text-2xl font-bold text-gray-900 mb-1">
                            {currentUser.Name}
                            <span className="text-base text-gray-500 font-normal ml-2">
                              (JS{currentUser._id?.slice(-8)})
                            </span>
                          </h2>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 mt-3">
                            <div className="flex">
                              <span className="text-sm text-gray-600 w-32">Height</span>
                              <span className="text-gray-800 text-sm font-medium">: {currentUser.height} feet</span>
                            </div>
                            <div className="flex">
                              <span className="text-gray-600 w-32">Religion </span>
                              <span className="text-gray-800 font-medium">: {currentUser.religion}</span>
                            </div>
                              <div className="flex">
                              <span className="text-gray-600 w-32"> Community</span>
                              <span className="text-gray-800 font-medium">:{currentUser.community}</span>
                            </div>
                            <div className="flex">
                              <span className="text-sm text-gray-600 w-32">Marital Status</span>
                              <span className="text-gray-800 text-sm font-medium">: {currentUser.maritalStatus}</span>
                            </div>
                            <div className="flex">
                              <span className="text-gray-600 w-32">Location</span>
                              <span className="text-gray-800 font-medium">: {currentUser.city}</span>
                            </div>
                            <div className="flex">
                              <span className="text-sm text-gray-600 w-32">Profile For</span>
                              <span className="text-gray-800 text-sm font-medium">: {currentUser.profileFor || 'Self'}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-3 sm:p-4 border-b">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-red-500 font-bold text-lg">About me.</h3>
                   
                      </div>
                      <p className="text-gray-700 leading-relaxed text-sm">
                        {currentUser.about || 'Hello, here is a little bit about myself. Please drop in a message if you would like to know more.'}
                      </p>
                    </div>

                    <div className="p-3 sm:p-4 border-b">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-red-500 font-bold text-lg">Basics & Lifestyle</h3>
                       
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
                        <div className="flex">
                          <span className="text-sm text-gray-600 w-32">Diet</span>
                          <span className="text-gray-800 text-sm">: {currentUser.diet || 'Not Specified'}</span>
                        </div>
                      <div className="flex">
  <span className="text-sm text-gray-600 w-32">Date of Birth</span>
  <span className="text-gray-800 text-sm">
    : {currentUser.dob
        ? `${new Date(currentUser.dob).getDate()}, ${new Date(currentUser.dob).toLocaleString('en-US', { month: 'long' })} ${new Date(currentUser.dob).getFullYear()}`
        : 'Not Specified'}
  </span>
</div>

                       
                        <div className="flex">
                          <span className="text-sm text-gray-600 w-32">Marital Status</span>
                          <span className="text-gray-800 text-sm">: {currentUser.maritalStatus}</span>
                        </div>
                       
                        <div className="flex">
                          <span className="text-sm text-gray-600 w-32">Height</span>
                          <span className="text-gray-800 text-sm">: {currentUser.height} feet</span>
                        </div>
                        <div className="flex">
                          <span className="text-sm text-gray-600 w-32">Grew up in</span>
                          <span className="text-gray-800 text-sm">: {currentUser.country || 'India'}</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-3 sm:p-4 border-b">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <h3 className="text-red-500 font-bold text-lg">Religious Background</h3>
                           
                          </div>
                          <div className="space-y-2">
                            <div className="flex">
                              <span className="text-sm text-gray-600 w-32">Religion</span>
                              <span className="text-gray-800 text-sm">: {currentUser.religion}</span>
                            </div>
                            <div className="flex">
                              <span className="text-sm text-gray-600 w-32">Community</span>
                              <span className="text-gray-800 text-sm">: {currentUser.community}</span>
                            </div>
                            <div className="flex">
                              <span className="text-sm text-gray-600 w-32">Sub community</span>
                              <span className="text-gray-800 text-sm">: {currentUser.subCommunity || 'Not Specified'}</span>
                            </div>
                           
                           
                          </div>
                        </div>

                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <h3 className="text-red-500 font-bold text-lg">Astro Details</h3>
                           
                          </div>
                          <div className="space-y-2">
                            <div className="flex">
                              <span className="text-sm text-gray-600 w-32">Date of Birth</span>
                              <span className="text-gray-800 text-sm">: {currentUser.dob || 'Not Specified'}</span>
                            </div>
                         
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-3 sm:p-4 border-b">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-red-500 font-bold text-lg">Family details</h3>
                       
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
                        <div className="flex">
                          <span className="text-sm text-gray-600 w-32">Mother's Details</span>
                          <span className="text-gray-800 text-sm">: {currentUser.motherName || 'Enter Now'}</span>
                        </div>
                       
                        <div className="flex">
                          <span className="text-sm text-gray-600 w-32">Father's Details</span>
                          <span className="text-gray-800 text-sm">: {currentUser.fatherName || 'Enter Now'}</span>
                        </div>
                        
                        <div className="flex">
                          <span className="text-sm text-gray-600 w-32">Family Location</span>
                          <span className="text-gray-800 text-sm">: {currentUser.city}, {currentUser.state}, {currentUser.country}</span>
                        </div>
                       
                      </div>
                    </div>

                    <div className="p-3 sm:p-4 border-b">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-red-500 font-bold text-lg">Education & Career</h3>
                       
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
                        <div className="flex">
                          <span className="text-sm text-gray-600 w-32">Highest Qualification</span>
                          <span className="text-gray-800 text-sm">: {currentUser.highestQualification}</span>
                        </div>
                        <div className="flex">
                          <span className="text-sm text-gray-600 w-32">Working With</span>
                          <span className="text-gray-800 text-sm">: Private Company</span>
                        </div>
                       
                        <div className="flex">
                          <span className="text-sm text-gray-600 w-32">Working As</span>
                          <span className="text-gray-800 text-sm">: {currentUser.workAs}</span>
                        </div>
                        <div className="flex">
                          <span className="text-sm text-gray-600 w-32">Annual Income</span>
                          <span className="text-gray-800 text-sm">: {currentUser.income || 'Not Specified'}</span>
                        </div>
                        
                      </div>
                    </div>

                    <div className="p-3 sm:p-4 border-b">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-red-500 font-bold text-lg">Location of {currentUser.gender === 'Male' ? 'Groom' : 'Bride'}</h3>
                       
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
                        <div className="flex">
                          <span className="text-sm text-gray-600 w-32">Current Residence</span>
                          <span className="text-gray-800 text-sm">: {currentUser.city}, {currentUser.country}</span>
                        </div>
                       
                        <div className="flex">
                          <span className="text-sm text-gray-600 w-32">State Of Residence</span>
                          <span className="text-gray-800 text-sm">: {currentUser.state}</span>
                        </div>
                       
                      </div>
                    </div>

                    <div className="p-3 bg-gray-50 text-right">
                      <button 
                        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                        className="text-cyan-500 hover:underline text-sm font-medium"
                      >
                        Back to Top ▲
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'settings' && (
                <div className="max-w-3xl mx-auto">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Settings</h2>
                  <div className="bg-white rounded-lg p-8 text-center">
                    <Settings className="w-12 h-12 text-gray-300 mx-auto mb-3" />
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