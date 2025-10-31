import React, { useEffect, useState } from 'react';
import { MapPin, Briefcase, GraduationCap, Mail, Home, Heart, User, Settings, MessageCircle, Cake, Ruler, Users, Globe, Phone, Calendar, Scale, Filter, Star, Clock, Link as LinkIcon, Search, ChevronLeft, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export default function MatrimonyDashboard() {
  const navigate = useNavigate();
  const [profiles, setProfiles] = useState([]);
  const [matches, setMatches] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('matches');
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
  // Expanded state for partner search in matches tab
  const [partnerSearch, setPartnerSearch] = useState({
    profileFor: '',
    gender: '',
    minAge: '18',
    maxAge: '60',
    maritalStatus: '',
    minHeight: '',
    maxHeight: '',
    weight: '',
    diet: '',
    religion: '',
    community: '',
    subCommunity: '',
    noCasteBar: '',
    livingIn: '',
    city: '',
    state: '',
    liveWithFamily: '',
    familyBackground: '',
    highestQualification: '',
    workDetails: '',
    income: '',
    motherTongue: ''
  });
  const [searchResults, setSearchResults] = useState([]);
  const [searchType, setSearchType] = useState('normal');
  const [searchById, setSearchById] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const itemsPerPage = 7;

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

  // Function to calculate zodiac sign
  const getZodiacSign = (dob) => {
    if (!dob) return '';
    const date = new Date(dob);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return 'Aquarius';
    if ((month === 2 && day >= 19) || (month === 3 && day <= 20)) return 'Pisces';
    if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return 'Aries';
    if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return 'Taurus';
    if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return 'Gemini';
    if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return 'Cancer';
    if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return 'Leo';
    if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return 'Virgo';
    if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return 'Libra';
    if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return 'Scorpio';
    if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return 'Sagittarius';
    return 'Capricorn';
  };

  // Function to format DOB
  const formatDate = (dob) => {
    if (!dob) return '';
    const date = new Date(dob);
    const day = date.getDate().toString().padStart(2, '0');
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();
    return `${day} ${month},${year}`;
  };

  // Placeholder image URL
  const PLACEHOLDER_IMAGE = 'https://t4.ftcdn.net/jpg/05/42/36/11/360_F_542361185_VFRJWpR2FH5OiAEVveWO7oZnfSccZfD3.jpg';

  useEffect(() => {
    fetchProfiles();
    fetchMatches();
  }, []);

  useEffect(() => {
    if (selectedProfile) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [selectedProfile]);

  useEffect(() => {
    setSearchResults(profiles);
    setCurrentPage(1);
    if (searchType === 'normal') {
      clearFilters();
    } else if (searchType === 'byId') {
      setSearchById('');
    } else if (searchType === 'advanced') {
      clearPartnerSearch();
    }
  }, [searchType, profiles]);

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
        let profileImg = PLACEHOLDER_IMAGE;
        if (user.profileImage?.data?.data) {
          const bytes = new Uint8Array(user.profileImage.data.data);
          let binary = '';
          bytes.forEach(b => binary += String.fromCharCode(b));
          profileImg = `data:${user.profileImage.contentType};base64,${btoa(binary)}`;
        }
        return { ...user, profileImage: profileImg, zodiac: getZodiacSign(user.dob) };
      });
      let loggedInUser = profilesData.find(p => p._id === userId) || profilesData.find(p => p.email === userEmail);
      if (loggedInUser) setCurrentUser(loggedInUser);
      const otherProfiles = profilesData.filter(profile => profile._id !== (loggedInUser?._id));
      setProfiles(otherProfiles);
      // Initialize search results with all profiles
      setSearchResults(otherProfiles);
      setCurrentPage(1);
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
        let profileImg = PLACEHOLDER_IMAGE;
        if (user.profileImage?.data?.data) {
          const bytes = new Uint8Array(user.profileImage.data.data);
          let binary = '';
          bytes.forEach(b => binary += String.fromCharCode(b));
          profileImg = `data:${user.profileImage.contentType};base64,${btoa(binary)}`;
        }
        return { ...user, profileImage: profileImg, zodiac: getZodiacSign(user.dob) };
      });
      setMatches(processedMatches);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSearchById = () => {
    const inputId = searchById.trim().toUpperCase();
    let shortId;
    if (inputId.startsWith('JS')) {
      shortId = inputId.slice(2);
    } else {
      shortId = inputId;
    }
    if (shortId.length !== 8) {
      alert('Invalid ID format. Please enter 8-digit number (e.g., JS12345678)');
      return;
    }
    const foundProfile = profiles.find(profile => profile._id.slice(-8).toUpperCase() === shortId);
    if (foundProfile) {
      setSearchResults([foundProfile]);
      setError(null);
      setCurrentPage(1);
    } else {
      setSearchResults([]);
      setError('Profile not found with the given ID.');
      setCurrentPage(1);
    }
    setShowMobileFilters(false);
  };

  const applyFilters = (profilesList) => {
    const filtered = profilesList.filter(profile => {
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
    setSearchResults(filtered);
    setCurrentPage(1);
    setShowMobileFilters(false);
    return filtered;
  };

  // Expanded function for partner search filtering
  const applyPartnerSearch = () => {
    const filtered = profiles.filter(profile => {
      // Profile For
      if (partnerSearch.profileFor && profile.profileFor !== partnerSearch.profileFor) return false;
      // Gender
      if (partnerSearch.gender && profile.gender !== partnerSearch.gender) return false;
      // Age (assuming age is calculated from dob)
      if (partnerSearch.minAge && profile.age < parseInt(partnerSearch.minAge)) return false;
      if (partnerSearch.maxAge && profile.age > parseInt(partnerSearch.maxAge)) return false;
      // Marital Status
      if (partnerSearch.maritalStatus && profile.maritalStatus !== partnerSearch.maritalStatus) return false;
      // Height
      if (partnerSearch.minHeight && parseFloat(profile.height) < parseFloat(partnerSearch.minHeight)) return false;
      if (partnerSearch.maxHeight && parseFloat(profile.height) > parseFloat(partnerSearch.maxHeight)) return false;
      // Weight
      if (partnerSearch.weight && !profile.weight?.toLowerCase().includes(partnerSearch.weight.toLowerCase())) return false;
      // Diet
      if (partnerSearch.diet && profile.diet !== partnerSearch.diet) return false;
      // Religion
      if (partnerSearch.religion && profile.religion !== partnerSearch.religion) return false;
      // Community
      if (partnerSearch.community && !profile.community?.toLowerCase().includes(partnerSearch.community.toLowerCase())) return false;
      // Sub Community
      if (partnerSearch.subCommunity && !profile.subCommunity?.toLowerCase().includes(partnerSearch.subCommunity.toLowerCase())) return false;
      // No Caste Bar
      if (partnerSearch.noCasteBar !== '' && JSON.parse(partnerSearch.noCasteBar) !== profile.noCasteBar) return false;
      // Living In
      if (partnerSearch.livingIn && !profile.livingIn?.toLowerCase().includes(partnerSearch.livingIn.toLowerCase())) return false;
      // City
      if (partnerSearch.city && !profile.city?.toLowerCase().includes(partnerSearch.city.toLowerCase())) return false;
      // State
      if (partnerSearch.state && !profile.state?.toLowerCase().includes(partnerSearch.state.toLowerCase())) return false;
      // Live With Family
      if (partnerSearch.liveWithFamily !== '' && JSON.parse(partnerSearch.liveWithFamily) !== profile.liveWithFamily) return false;
      // Family Background
      if (partnerSearch.familyBackground && !profile.familyBackground?.toLowerCase().includes(partnerSearch.familyBackground.toLowerCase())) return false;
      // Highest Qualification
      if (partnerSearch.highestQualification && !profile.highestQualification?.toLowerCase().includes(partnerSearch.highestQualification.toLowerCase())) return false;
      // Work Details
      if (partnerSearch.workDetails && profile.workDetails !== partnerSearch.workDetails) return false;
      // Income
      if (partnerSearch.income && !profile.income?.toLowerCase().includes(partnerSearch.income.toLowerCase())) return false;
      // Mother Tongue
      if (partnerSearch.motherTongue && profile.motherTongue !== partnerSearch.motherTongue) return false;
      return true;
    });
    setSearchResults(filtered);
    setCurrentPage(1);
    setShowMobileFilters(false);
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handlePartnerSearchChange = (key, value) => {
    setPartnerSearch(prev => ({ ...prev, [key]: value }));
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

  const clearPartnerSearch = () => {
    setPartnerSearch({
      profileFor: '',
      gender: '',
      minAge: '18',
      maxAge: '60',
      maritalStatus: '',
      minHeight: '',
      maxHeight: '',
      weight: '',
      diet: '',
      religion: '',
      community: '',
      subCommunity: '',
      noCasteBar: '',
      livingIn: '',
      city: '',
      state: '',
      liveWithFamily: '',
      familyBackground: '',
      highestQualification: '',
      workDetails: '',
      income: '',
      motherTongue: ''
    });
    setSearchResults(profiles);
    setCurrentPage(1);
    setShowMobileFilters(false);
  };

  const activeFilterCount = Object.values(filters).filter(v => v !== '').length;

  const handleEditProfile = () => {
    if (currentUser) {
      navigate(`/edit-profile/${currentUser._id}`);
    }
  };

  const renderCompactProfileCard = (profile, isCurrentUser = false) => (
    <div
      onClick={() => setSelectedProfile(profile)}
      className="group bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden hover:-translate-y-1 cursor-pointer"
    >
      <div className="relative bg-gradient-to-br from-red-50 to-orange-50 pt-6 pb-12">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-2 right-2 w-16 h-16 bg-red-300 rounded-full blur-xl"></div>
          <div className="absolute bottom-2 left-2 w-12 h-12 bg-orange-300 rounded-full blur-xl"></div>
        </div>

        <div className="relative flex justify-center">
          <div className="relative">
            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg ring-2 ring-red-100">
              <img
                src={profile.profileImage}
                alt={`${profile.Name} Profile`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  e.target.src = PLACEHOLDER_IMAGE;
                }}
              />
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

        <button className="w-full py-2 bg-gradient-to-r from-red-900 to-red-800 text-white rounded-lg text-sm font-bold hover:from-red-800 hover:to-red-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-[1.02]">
          {isCurrentUser ? 'Edit Profile' : 'View Full Profile'}
        </button>
      </div>
    </div>
  );

  // Improved render function for match cards - Enhanced design with better visuals, gradients, icons, and layout
  const renderMatchCard = (profile) => {
    // Mock compatibility score for demo (can be replaced with real logic)
    const compatibilityScore = Math.floor(Math.random() * 30) + 70; // 70-100%
    return (
      <div className="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col lg:flex-row gap-4 p-4 lg:p-5 hover:shadow-xl transition-all duration-400 hover:-translate-y-1 relative max-w-4xl mx-auto">
        {/* Subtle background gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-red-50/50 to-orange-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        {/* Left: Enhanced Photo Section */}
        <div className="relative flex-shrink-0">
          <div className="relative">
            <img
              src={profile.profileImage}
              alt={profile.Name}
              className="w-28 h-28 lg:w-32 lg:h-32 rounded-2xl object-cover shadow-lg group-hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                e.target.src = PLACEHOLDER_IMAGE;
              }}
            />
            {/* Enhanced badges */}
            <div className="absolute top-2 right-2 flex flex-col gap-1">
              {profile.annualIncome && (
                <div className="bg-gradient-to-r from-pink-500 to-purple-600 text-white text-xs font-bold px-2 py-1 rounded-full shadow-md flex items-center gap-1">
                  💎 Premium
                </div>
              )}
              {profile.isPreferred && (
                <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white text-xs font-bold px-2 py-1 rounded-full shadow-md">
                  ⭐ Preferred
                </div>
              )}
            </div>
          </div>
        </div>
        {/* Center: Enhanced Details Grid */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-3 lg:gap-4 relative z-10">
          {/* Header with Name and Compatibility */}
          <div className="lg:col-span-2 space-y-1 mb-3">
            <div className="flex items-center justify-between">
              <h3 className="text-lg lg:text-xl font-bold text-gray-900 group-hover:text-red-700 transition-colors">
                {profile.Name}
              </h3>
              <div className="flex items-center gap-1 text-sm text-gray-600">
                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                <span>{compatibilityScore}% Match</span>
              </div>
            </div>
          </div>
          {/* Left Details Column: Personal Info */}
          <div className="space-y-2">
            {profile.mutualInterest && (
              <div className="flex items-center gap-2 px-3 py-2 bg-green-50 rounded-xl text-sm text-green-700 font-medium border border-green-200">
                👥 Mutual Interest: You & {profile.gender === 'Male' ? 'Him' : 'Her'}
              </div>
            )}
            <div className="space-y-1 text-sm">
              <p className="flex items-center gap-2 text-gray-700">
                <Cake className="w-4 h-4 text-red-600" />
                {profile.age || 'N/A'} yrs • {profile.height || 'N/A'}
              </p>
              <p className="flex items-center gap-2 text-gray-700">
                <Globe className="w-4 h-4 text-red-600" />
                {profile.religion}, {profile.community || 'N/A'}
              </p>
            </div>
          </div>
          {/* Right Details Column: Professional & Location */}
          <div className="space-y-1 text-sm text-gray-700">
            <p className="flex items-center gap-2">
              <Heart className="w-4 h-4 text-red-600" />
              {profile.maritalStatus || 'Single'}
            </p>
            <p className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-red-600 mt-0.5" />
              <span className="truncate">{profile.city}, {profile.state || 'N/A'}</span>
            </p>
            <p className="text-gray-600 font-medium">{profile.education || 'N/A'}</p>
            <p className="flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-red-600" />
              {profile.occupation || 'N/A'} • {profile.income ? `₹${profile.income}` : 'Income N/A'}
            </p>
          </div>
        </div>
        {/* Right: Enhanced Actions */}
        <div className="flex flex-col items-end gap-3 pt-2 lg:pt-0 relative z-10">
          <button
            onClick={() => console.log('Connect to', profile.Name)} // Replace with actual connect logic
            className="w-full lg:w-auto px-5 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl text-sm font-bold shadow-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
          >
            {/* <LinkIcon className="w-4 h-4" /> */}
            Connect Now
          </button>
          <button
            onClick={() => setSelectedProfile(profile)}
            className="w-full lg:w-auto px-5 py-2 border-2 border-red-200 text-red-700 rounded-xl text-sm font-semibold hover:bg-red-50 hover:border-red-300 transition-all duration-300"
          >
            View Profile
          </button>
        </div>
      </div>
    );
  };

  const renderDetailedProfileCard = (profile, isCurrentUser = false) => {
    return (
      <div className="p-3 md:p-4">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-gradient-to-r from-gray-100 to-gray-50 p-3 sm:p-4 border-b flex items-center justify-between">
              <div className="flex flex-col md:flex-row gap-4 flex-1">
                <div className="flex-shrink-0">
                  <div className="w-40 h-48 border-4 border-white shadow-lg rounded-lg overflow-hidden">
                    <img
                      src={profile.profileImage}
                      alt={`${profile.Name} Profile`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = PLACEHOLDER_IMAGE;
                      }}
                    />
                  </div>
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900 mb-1">
                    {profile.Name}
                    <span className="text-base text-gray-500 font-normal ml-2">
                      (JS{profile._id?.slice(-8)})
                    </span>
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 mt-3">
                    <div className="flex">
                      <span className="text-sm text-gray-600 w-32 font-medium">Height</span>
                      <span className="text-gray-800 text-sm">: {profile.height || 'N/A'} feet</span>
                    </div>
                    <div className="flex">
                      <span className="text-sm text-gray-600 w-32 font-medium">Religion</span>
                      <span className="text-gray-800 text-sm">: {profile.religion || 'N/A'}</span>
                    </div>
                    <div className="flex">
                      <span className="text-sm text-gray-600 w-32 font-medium">Community</span>
                      <span className="text-gray-800 text-sm">: {profile.community || 'N/A'}</span>
                    </div>
                    <div className="flex">
                      <span className="text-sm text-gray-600 w-32 font-medium">Marital Status</span>
                      <span className="text-gray-800 text-sm">: {profile.maritalStatus || 'N/A'}</span>
                    </div>
                    <div className="flex">
                      <span className="text-sm text-gray-600 w-32 font-medium">Location</span>
                      <span className="text-gray-800 text-sm">: {profile.city || 'N/A'}</span>
                    </div>
                    <div className="flex">
                      <span className="text-sm text-gray-600 w-32 font-medium">Profile For</span>
                      <span className="text-gray-800 text-sm">: {profile.profileFor || 'Self'}</span>
                    </div>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setSelectedProfile(null)}
                className="ml-4 p-2 bg-white rounded-lg shadow-sm hover:bg-gray-100 transition-colors"
              >
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              </button>
            </div>
            <div className="p-3 sm:p-4 border-b">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-red-500 font-bold text-lg">Basics & Lifestyle</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
                <div className="flex">
                  <span className="text-sm text-gray-600 w-32 font-medium">Diet</span>
                  <span className="text-gray-800 text-sm">: {profile.diet || 'Not Specified'}</span>
                </div>
                <div className="flex">
                  <span className="text-sm text-gray-600 w-32 font-medium">Date of Birth</span>
                  <span className="text-gray-800 text-sm">: {formatDate(profile.dob) || 'Not Specified'}</span>
                </div>
                <div className="flex">
                  <span className="text-sm text-gray-600 w-32 font-medium">Marital Status</span>
                  <span className="text-gray-800 text-sm">: {profile.maritalStatus || 'N/A'}</span>
                </div>
                <div className="flex">
                  <span className="text-sm text-gray-600 w-32 font-medium">Height</span>
                  <span className="text-gray-800 text-sm">: {profile.height || 'N/A'} feet</span>
                </div>
                <div className="flex">
                  <span className="text-sm text-gray-600 w-32 font-medium">Grew up in</span>
                  <span className="text-gray-800 text-sm">: {profile.country || 'India'}</span>
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
                      <span className="text-sm text-gray-600 w-32 font-medium">Religion</span>
                      <span className="text-gray-800 text-sm">: {profile.religion || 'N/A'}</span>
                    </div>
                    <div className="flex">
                      <span className="text-sm text-gray-600 w-32 font-medium">Community</span>
                      <span className="text-gray-800 text-sm">: {profile.community || 'N/A'}</span>
                    </div>
                    <div className="flex">
                      <span className="text-sm text-gray-600 w-32 font-medium">Sub community</span>
                      <span className="text-gray-800 text-sm">: {profile.subCommunity || 'Not Specified'}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-red-500 font-bold text-lg">Astro Details</h3>
                  </div>
                  <div className="space-y-2">
                    <div className="flex">
                      <span className="text-sm text-gray-600 w-32 font-medium">Date of Birth</span>
                      <span className="text-gray-800 text-sm">: {formatDate(profile.dob) || 'Not Specified'}</span>
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
                  <span className="text-sm text-gray-600 w-32 font-medium">Mother's Details</span>
                  <span className="text-gray-800 text-sm">: {profile.motherName || (isCurrentUser ? 'Enter Now' : 'N/A')}</span>
                </div>
                <div className="flex">
                  <span className="text-sm text-gray-600 w-32 font-medium">Father's Details</span>
                  <span className="text-gray-800 text-sm">: {profile.fatherName || (isCurrentUser ? 'Enter Now' : 'N/A')}</span>
                </div>
                <div className="flex">
                  <span className="text-sm text-gray-600 w-32 font-medium">Family Location</span>
                  <span className="text-gray-800 text-sm">: {profile.city}, {profile.state}, {profile.country || 'N/A'}</span>
                </div>
              </div>
            </div>
            <div className="p-3 sm:p-4 border-b">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-red-500 font-bold text-lg">Education & Career</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
                <div className="flex">
                  <span className="text-sm text-gray-600 w-32 font-medium">Highest Qualification</span>
                  <span className="text-gray-800 text-sm">: {profile.highestQualification || 'N/A'}</span>
                </div>
                <div className="flex">
                  <span className="text-sm text-gray-600 w-32 font-medium">Working With</span>
                  <span className="text-gray-800 text-sm">: {profile.workingWith || 'Private Company'}</span>
                </div>
                <div className="flex">
                  <span className="text-sm text-gray-600 w-32 font-medium">Working As</span>
                  <span className="text-gray-800 text-sm">: {profile.workAs || 'N/A'}</span>
                </div>
                <div className="flex">
                  <span className="text-sm text-gray-600 w-32 font-medium">Annual Income</span>
                  <span className="text-gray-800 text-sm">: {profile.income || 'Not Specified'}</span>
                </div>
              </div>
            </div>
            <div className="p-3 sm:p-4 border-b">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-red-500 font-bold text-lg">Location of {profile.gender === 'Male' ? 'Groom' : 'Bride'}</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
                <div className="flex">
                  <span className="text-sm text-gray-600 w-32 font-medium">Current Residence</span>
                  <span className="text-gray-800 text-sm">: {profile.city}, {profile.country || 'N/A'}</span>
                </div>
                <div className="flex">
                  <span className="text-sm text-gray-600 w-32 font-medium">State Of Residence</span>
                  <span className="text-gray-800 text-sm">: {profile.state || 'N/A'}</span>
                </div>
              </div>
            </div>
            <div className="p-3 sm:p-4 border-b">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-red-500 font-bold text-lg">About me.</h3>
              </div>
              <p className="text-gray-700 leading-relaxed text-sm">
                {profile.about || 'Hello, here is a little bit about myself. Please drop in a message if you would like to know more.'}
              </p>
            </div>
            <div className="p-3 bg-gray-50 text-right">
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="text-cyan-500 hover:underline text-sm font-medium"
              >
                Back to Top ▲
              </button>
            </div>
            {isCurrentUser && (
              <div className="p-3 text-center">
                <button
                  onClick={handleEditProfile}
                  className="px-6 py-2 bg-red-600 text-white rounded-md font-semibold hover:bg-red-700 transition-colors"
                >
                  Edit Profile
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Header without the right sidebar
  const ProfileHeader = () => {
    if (!currentUser) return null;
    const profileId = currentUser._id ? currentUser._id.slice(-5) : '31152';
    const lastLogin = currentUser.lastLogin ? new Date(currentUser.lastLogin).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    const createdDate = currentUser.createdAt ? new Date(currentUser.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '06-Mar-2020';
    // Calculate profile completion percentage dynamically
    const requiredFields = ['Name', 'gender', 'age', 'maritalStatus', 'height', 'religion', 'community', 'city', 'state', 'education', 'occupation'];
    const completionPercent = (Object.keys(currentUser).filter(key => requiredFields.includes(key) && currentUser[key]).length / requiredFields.length) * 100;
    return (
      <div className="bg-white border-b border-gray-200 p-4 md:p-6 mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Hello {currentUser.Name} (Profile ID: {profileId})</h2>
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Sidebar */}
          <div className="flex flex-col items-center lg:items-start gap-4 w-full lg:w-auto">
            <div className="relative">
              <div className="w-80 h-80 rounded-full overflow-hidden border-2 border-gray-200 shadow-md">
                <img
                  src={currentUser.profileImage}
                  alt={currentUser.Name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = PLACEHOLDER_IMAGE;
                  }}
                />
              </div>
            </div>
            <div className="flex flex-col gap-2 text-sm text-gray-700 w-full max-w-xs">
              <button
                onClick={handleEditProfile}
                className="px-3 py-1.5 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors text-left font-medium"
              >
                Edit Profile
              </button>
            </div>
            <div className="text-xs text-gray-500 text-center lg:text-left">
              <p>Last Login: {lastLogin}</p>
              <p>Profile created on: {createdDate}</p>
            </div>
          </div>
          {/* Center: Profile Completion */}
          <div className="flex-1">
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <p className="text-sm text-gray-600 mb-3">A Profile with 100% Completion get maximum response from users. Please Provide Latest Photographs</p>
              <div className="mb-3">
                <label className="text-xs font-medium text-gray-700 block mb-1">Profile Completion Percent</label>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full transition-all duration-300" style={{ width: `${completionPercent}%` }}></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">{Math.round(completionPercent)}% Complete</p>
              </div>
              <div className="mb-3">
                <label className="text-xs font-medium text-gray-700 block mb-1">Email-ID</label>
                {currentUser.email ? (
                  <span className="text-sm text-gray-900">{currentUser.email}</span>
                ) : (
                  <button className="px-3 py-1 bg-green-100 text-green-700 rounded-md text-sm hover:bg-green-200 transition-colors">Verify Now</button>
                )}
              </div>
              <div className="mb-3 flex items-center justify-between">
                <label className="text-xs font-medium text-gray-700">Mobile No.</label>
                {currentUser.phone ? (
                  <span className="text-sm text-green-600 flex items-center gap-1">
                    {currentUser.phone} <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                  </span>
                ) : (
                  <span className="text-sm text-gray-500">Not Verified</span>
                )}
              </div>
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-gray-700">Account Type</label>
                <span className="text-sm font-medium text-gray-900">{currentUser.accountType || 'Free'}</span>
              </div>
            </div>
            {/* Membership Banner */}
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-800 mb-1">Purchase Our Membership Plan and get better Response</p>
              <p className="text-sm text-red-800">View verified contact details and Write Direct Messages to members</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Partner Search Sidebar component
  const PartnerSearchSidebar = ({ isMobile = false, onClose }) => {
    const profileForOptions = ['Self', 'Son', 'Daughter', 'Brother', 'Sister', 'Relative', 'Friend'];
    const genderOptions = ['', 'Male', 'Female'];
    const maritalStatusOptions = ['', 'Never Married', 'Divorced', 'Widowed', 'Separated'];
    const dietOptions = ['', 'Vegetarian', 'Non-Vegetarian', 'Eggetarian', 'Vegan', 'Other'];
    const workDetailsOptions = ['', 'Private', 'Government', 'Business', 'Self Employed', 'Not Working'];
    const noCasteBarOptions = ['', 'true', 'false'];
    const liveWithFamilyOptions = ['', 'true', 'false'];
    return (
      <div className={`bg-purple-50 border border-purple-200 rounded-lg p-4 ${isMobile ? 'h-full' : 'sticky top-4'}`}>
        {isMobile && (
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-purple-900">Advanced Search</h3>
            <button onClick={onClose} className="text-purple-600 hover:text-purple-800">
              <X className="w-5 h-5" />
            </button>
          </div>
        )}
        {!isMobile && (
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-purple-900">Advanced Search</h3>
            <button
              onClick={clearPartnerSearch}
              className="text-sm text-purple-600 hover:text-purple-800 font-medium"
            >
              Clear All
            </button>
          </div>
        )}
        <div className="space-y-4 overflow-y-auto h-full">
          {/* Profile For */}
          <div>
            <label className="block text-xs font-medium text-purple-700 mb-1">Profile For</label>
            <select
              value={partnerSearch.profileFor}
              onChange={(e) => handlePartnerSearchChange('profileFor', e.target.value)}
              className="w-full px-2 py-1.5 border border-purple-300 rounded-md text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="">All</option>
              {profileForOptions.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
          {/* Gender */}
          <div>
            <label className="block text-xs font-medium text-purple-700 mb-1">Gender</label>
            <select
              value={partnerSearch.gender}
              onChange={(e) => handlePartnerSearchChange('gender', e.target.value)}
              className="w-full px-2 py-1.5 border border-purple-300 rounded-md text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="">All</option>
              {genderOptions.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
          {/* Age Range */}
          <div className="flex gap-2">
            <div className="flex-1">
              <label className="block text-xs font-medium text-purple-700 mb-1">Min Age</label>
              <select
                value={partnerSearch.minAge}
                onChange={(e) => handlePartnerSearchChange('minAge', e.target.value)}
                className="w-full px-2 py-1.5 border border-purple-300 rounded-md text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                {[...Array(43).keys()].map(i => (
                  <option key={i + 18} value={i + 18}>{i + 18}</option>
                ))}
              </select>
            </div>
            <span className="self-center text-gray-500">to</span>
            <div className="flex-1">
              <label className="block text-xs font-medium text-purple-700 mb-1">Max Age</label>
              <select
                value={partnerSearch.maxAge}
                onChange={(e) => handlePartnerSearchChange('maxAge', e.target.value)}
                className="w-full px-2 py-1.5 border border-purple-300 rounded-md text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                {[...Array(30).keys()].map(i => (
                  <option key={i + 18} value={i + 18}>{i + 18}</option>
                ))}
              </select>
            </div>
          </div>
          {/* Marital Status */}
          <div>
            <label className="block text-xs font-medium text-purple-700 mb-1">Marital Status</label>
            <select
              value={partnerSearch.maritalStatus}
              onChange={(e) => handlePartnerSearchChange('maritalStatus', e.target.value)}
              className="w-full px-2 py-1.5 border border-purple-300 rounded-md text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="">All</option>
              {maritalStatusOptions.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
          {/* Height Range */}
          <div className="flex gap-2">
            <div className="flex-1">
              <label className="block text-xs font-medium text-purple-700 mb-1">Min Height (cm)</label>
              <input
                type="number"
                value={partnerSearch.minHeight}
                onChange={(e) => handlePartnerSearchChange('minHeight', e.target.value)}
                placeholder="e.g., 150"
                className="w-full px-2 py-1.5 border border-purple-300 rounded-md text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <span className="self-center text-gray-500">to</span>
            <div className="flex-1">
              <label className="block text-xs font-medium text-purple-700 mb-1">Max Height (cm)</label>
              <input
                type="number"
                value={partnerSearch.maxHeight}
                onChange={(e) => handlePartnerSearchChange('maxHeight', e.target.value)}
                placeholder="e.g., 200"
                className="w-full px-2 py-1.5 border border-purple-300 rounded-md text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>
          {/* Weight */}
          <div>
            <label className="block text-xs font-medium text-purple-700 mb-1">Weight (kg)</label>
            <input
              type="text"
              value={partnerSearch.weight}
              onChange={(e) => handlePartnerSearchChange('weight', e.target.value)}
              placeholder="e.g., 60"
              className="w-full px-2 py-1.5 border border-purple-300 rounded-md text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          {/* Diet */}
          <div>
            <label className="block text-xs font-medium text-purple-700 mb-1">Diet</label>
            <select
              value={partnerSearch.diet}
              onChange={(e) => handlePartnerSearchChange('diet', e.target.value)}
              className="w-full px-2 py-1.5 border border-purple-300 rounded-md text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="">All</option>
              {dietOptions.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
          {/* Religion */}
          <div>
            <label className="block text-xs font-medium text-purple-700 mb-1">Religion</label>
            <input
              type="text"
              value={partnerSearch.religion}
              onChange={(e) => handlePartnerSearchChange('religion', e.target.value)}
              placeholder="e.g., Hindu"
              className="w-full px-2 py-1.5 border border-purple-300 rounded-md text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          {/* Community */}
          <div>
            <label className="block text-xs font-medium text-purple-700 mb-1">Community</label>
            <input
              type="text"
              value={partnerSearch.community}
              onChange={(e) => handlePartnerSearchChange('community', e.target.value)}
              placeholder="e.g., Brahmin"
              className="w-full px-2 py-1.5 border border-purple-300 rounded-md text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          {/* Sub Community */}
          <div>
            <label className="block text-xs font-medium text-purple-700 mb-1">Sub Community</label>
            <input
              type="text"
              value={partnerSearch.subCommunity}
              onChange={(e) => handlePartnerSearchChange('subCommunity', e.target.value)}
              placeholder="e.g., Iyengar"
              className="w-full px-2 py-1.5 border border-purple-300 rounded-md text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          {/* No Caste Bar */}
          <div>
            <label className="block text-xs font-medium text-purple-700 mb-1">No Caste Bar</label>
            <select
              value={partnerSearch.noCasteBar}
              onChange={(e) => handlePartnerSearchChange('noCasteBar', e.target.value)}
              className="w-full px-2 py-1.5 border border-purple-300 rounded-md text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="">All</option>
              {noCasteBarOptions.map(option => (
                <option key={option} value={option}>{option === 'true' ? 'Yes' : 'No'}</option>
              ))}
            </select>
          </div>
          {/* Living In */}
          <div>
            <label className="block text-xs font-medium text-purple-700 mb-1">Living In</label>
            <input
              type="text"
              value={partnerSearch.livingIn}
              onChange={(e) => handlePartnerSearchChange('livingIn', e.target.value)}
              placeholder="e.g., India"
              className="w-full px-2 py-1.5 border border-purple-300 rounded-md text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          {/* City */}
          <div>
            <label className="block text-xs font-medium text-purple-700 mb-1">City</label>
            <input
              type="text"
              value={partnerSearch.city}
              onChange={(e) => handlePartnerSearchChange('city', e.target.value)}
              placeholder="e.g., Mumbai"
              className="w-full px-2 py-1.5 border border-purple-300 rounded-md text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          {/* State */}
          <div>
            <label className="block text-xs font-medium text-purple-700 mb-1">State</label>
            <input
              type="text"
              value={partnerSearch.state}
              onChange={(e) => handlePartnerSearchChange('state', e.target.value)}
              placeholder="e.g., Maharashtra"
              className="w-full px-2 py-1.5 border border-purple-300 rounded-md text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          {/* Live With Family */}
          <div>
            <label className="block text-xs font-medium text-purple-700 mb-1">Live With Family</label>
            <select
              value={partnerSearch.liveWithFamily}
              onChange={(e) => handlePartnerSearchChange('liveWithFamily', e.target.value)}
              className="w-full px-2 py-1.5 border border-purple-300 rounded-md text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="">All</option>
              {liveWithFamilyOptions.map(option => (
                <option key={option} value={option}>{option === 'true' ? 'Yes' : 'No'}</option>
              ))}
            </select>
          </div>
          {/* Family Background */}
          <div>
            <label className="block text-xs font-medium text-purple-700 mb-1">Family Background</label>
            <input
              type="text"
              value={partnerSearch.familyBackground}
              onChange={(e) => handlePartnerSearchChange('familyBackground', e.target.value)}
              placeholder="e.g., Middle Class"
              className="w-full px-2 py-1.5 border border-purple-300 rounded-md text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          {/* Highest Qualification */}
          <div>
            <label className="block text-xs font-medium text-purple-700 mb-1">Highest Qualification</label>
            <input
              type="text"
              value={partnerSearch.highestQualification}
              onChange={(e) => handlePartnerSearchChange('highestQualification', e.target.value)}
              placeholder="e.g., B.Tech"
              className="w-full px-2 py-1.5 border border-purple-300 rounded-md text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          {/* Work Details */}
          <div>
            <label className="block text-xs font-medium text-purple-700 mb-1">Work Details</label>
            <select
              value={partnerSearch.workDetails}
              onChange={(e) => handlePartnerSearchChange('workDetails', e.target.value)}
              className="w-full px-2 py-1.5 border border-purple-300 rounded-md text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="">All</option>
              {workDetailsOptions.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
          {/* Income */}
          <div>
            <label className="block text-xs font-medium text-purple-700 mb-1">Income</label>
            <input
              type="text"
              value={partnerSearch.income}
              onChange={(e) => handlePartnerSearchChange('income', e.target.value)}
              placeholder="e.g., 5 LPA"
              className="w-full px-2 py-1.5 border border-purple-300 rounded-md text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          {/* Mother Tongue */}
          <div>
            <label className="block text-xs font-medium text-purple-700 mb-1">Mother Tongue</label>
            <input
              type="text"
              value={partnerSearch.motherTongue}
              onChange={(e) => handlePartnerSearchChange('motherTongue', e.target.value)}
              placeholder="e.g., Hindi"
              className="w-full px-2 py-1.5 border border-purple-300 rounded-md text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={applyPartnerSearch}
            className="w-full py-2 bg-red-600 text-white rounded-md font-semibold hover:bg-red-700 transition-colors"
          >
            SEARCH
          </button>
        </div>
      </div>
    );
  };

  const NormalSearchSidebar = ({ isMobile = false, onClose }) => {
    const genderOptions = ['', 'Male', 'Female'];
    return (
      <div className={`bg-purple-50 border border-purple-200 rounded-lg p-4 ${isMobile ? 'h-full' : 'sticky top-4'}`}>
        {isMobile && (
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-purple-900">Normal Search</h3>
            <button onClick={onClose} className="text-purple-600 hover:text-purple-800">
              <X className="w-5 h-5" />
            </button>
          </div>
        )}
        {!isMobile && (
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-purple-900">Normal Search</h3>
            <button
              onClick={clearFilters}
              className="text-sm text-purple-600 hover:text-purple-800 font-medium"
            >
              Clear All
            </button>
          </div>
        )}
        <div className="space-y-4 overflow-y-auto h-full">
          {/* Gender */}
          <div>
            <label className="block text-xs font-medium text-purple-700 mb-1">Gender</label>
            <select
              value={filters.gender}
              onChange={(e) => handleFilterChange('gender', e.target.value)}
              className="w-full px-2 py-1.5 border border-purple-300 rounded-md text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="">All</option>
              {genderOptions.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
          {/* Age Range */}
          <div className="flex gap-2">
            <div className="flex-1">
              <label className="block text-xs font-medium text-purple-700 mb-1">Min Age</label>
              <select
                value={filters.minAge || ''}
                onChange={(e) => handleFilterChange('minAge', e.target.value)}
                className="w-full px-2 py-1.5 border border-purple-300 rounded-md text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="">Any</option>
                {[...Array(43).keys()].map(i => (
                  <option key={i + 18} value={i + 18}>{i + 18}</option>
                ))}
              </select>
            </div>
            <span className="self-center text-gray-500">to</span>
            <div className="flex-1">
              <label className="block text-xs font-medium text-purple-700 mb-1">Max Age</label>
              <select
                value={filters.maxAge || ''}
                onChange={(e) => handleFilterChange('maxAge', e.target.value)}
                className="w-full px-2 py-1.5 border border-purple-300 rounded-md text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="">Any</option>
                {[...Array(43).keys()].map(i => (
                  <option key={i + 18} value={i + 18}>{i + 18}</option>
                ))}
              </select>
            </div>
          </div>
          {/* Education */}
          <div>
            <label className="block text-xs font-medium text-purple-700 mb-1">Education</label>
            <input
              type="text"
              value={filters.education || ''}
              onChange={(e) => handleFilterChange('education', e.target.value)}
              placeholder="e.g., Graduate"
              className="w-full px-2 py-1.5 border border-purple-300 rounded-md text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          {/* City */}
          <div>
            <label className="block text-xs font-medium text-purple-700 mb-1">City</label>
            <input
              type="text"
              value={filters.city || ''}
              onChange={(e) => handleFilterChange('city', e.target.value)}
              placeholder="e.g., Mumbai"
              className="w-full px-2 py-1.5 border border-purple-300 rounded-md text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          {/* State */}
          <div>
            <label className="block text-xs font-medium text-purple-700 mb-1">State</label>
            <input
              type="text"
              value={filters.state || ''}
              onChange={(e) => handleFilterChange('state', e.target.value)}
              placeholder="e.g., Maharashtra"
              className="w-full px-2 py-1.5 border border-purple-300 rounded-md text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          {/* Height Range */}
          <div className="flex gap-2">
            <div className="flex-1">
              <label className="block text-xs font-medium text-purple-700 mb-1">Min Height (cm)</label>
              <input
                type="number"
                value={filters.minHeight || ''}
                onChange={(e) => handleFilterChange('minHeight', e.target.value)}
                placeholder="e.g., 150"
                className="w-full px-2 py-1.5 border border-purple-300 rounded-md text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <span className="self-center text-gray-500">to</span>
            <div className="flex-1">
              <label className="block text-xs font-medium text-purple-700 mb-1">Max Height (cm)</label>
              <input
                type="number"
                value={filters.maxHeight || ''}
                onChange={(e) => handleFilterChange('maxHeight', e.target.value)}
                placeholder="e.g., 200"
                className="w-full px-2 py-1.5 border border-purple-300 rounded-md text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>
          <button
            onClick={() => applyFilters(profiles)}
            className="w-full py-2 bg-red-600 text-white rounded-md font-semibold hover:bg-red-700 transition-colors"
          >
            SEARCH
          </button>
        </div>
      </div>
    );
  };

  const ByIdSearchSidebar = ({ isMobile = false, onClose }) => (
    <div className={`bg-purple-50 border border-purple-200 rounded-lg p-4 ${isMobile ? 'h-full' : 'sticky top-4'}`}>
      {isMobile && (
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-purple-900">Search by ID</h3>
          <button onClick={onClose} className="text-purple-600 hover:text-purple-800">
            <X className="w-5 h-5" />
          </button>
        </div>
      )}
      {!isMobile && <h3 className="text-lg font-bold text-purple-900 mb-4">Search by ID</h3>}
      <div className="space-y-4 overflow-y-auto h-full">
        <input
          type="text"
          value={searchById}
          onChange={(e) => setSearchById(e.target.value)}
          placeholder="e.g., JS12345678"
          className="w-full px-2 py-1.5 border border-purple-300 rounded-md text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        />
        <button
          onClick={handleSearchById}
          className="w-full py-2 bg-red-600 text-white rounded-md font-semibold hover:bg-red-700 transition-colors"
        >
          SEARCH
        </button>
      </div>
      {error && <p className="text-red-600 text-xs mt-2">{error}</p>}
    </div>
  );

  const SearchTypeSelector = ({ isMobile = false, onClose }) => (
    <div className={`mb-4 p-3 bg-white rounded-lg border ${isMobile ? '' : ''}`}>
      <div className="flex gap-2 justify-center flex-wrap">
        {[
          { key: 'byId', label: 'By ID' },
          { key: 'normal', label: 'Normal Search' },
          { key: 'advanced', label: 'Advanced Search' }
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => {
              setSearchType(key);
              if (isMobile) onClose();
            }}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              searchType === key
                ? 'bg-red-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );

  const SearchSidebar = ({ isMobile = false, onClose }) => (
    <div className={`space-y-4 ${isMobile ? 'h-full overflow-y-auto' : ''}`}>
      <SearchTypeSelector isMobile={isMobile} onClose={onClose} />
      {searchType === 'byId' && <ByIdSearchSidebar isMobile={isMobile} onClose={onClose} />}
      {searchType === 'normal' && <NormalSearchSidebar isMobile={isMobile} onClose={onClose} />}
      {searchType === 'advanced' && <PartnerSearchSidebar isMobile={isMobile} onClose={onClose} />}
    </div>
  );

  // Pagination Component
  const PaginationControls = () => {
    const totalPages = Math.ceil(searchResults.length / itemsPerPage);
    if (totalPages <= 1) return null;
    return (
      <div className="flex justify-center items-center space-x-4 mt-6">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(prev => prev - 1)}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Previous
        </button>
        <span className="text-sm text-gray-600">
          Page {currentPage} of {totalPages}
        </span>
        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(prev => prev + 1)}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Next
        </button>
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

  if (error && !selectedProfile) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center bg-white p-6 rounded-lg ">
          <img className='h-80 lg:h-[40rem]' src='/not-login.png'></img>
          <Link to={"/login"} className='z-10 px-10 py-3 bg-red-200 rounded-full text-red-900 font-semibold text-sm lg:text-lg '>Login</Link>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'matches', label: 'Partner Preferences', icon: Filter },
    { id: 'messages', label: 'Search', icon: Search },
    { id: 'profile', label: 'My Profile', icon: User },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  // Compute current items for pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProfiles = searchResults.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="flex bg-gray-50 min-h-screen flex-col">
      {showMobileFilters && (
        <div className="fixed inset-0 z-40 lg:hidden" onClick={() => setShowMobileFilters(false)}>
          <div className="fixed inset-y-0 left-0 w-full max-w-sm bg-white transform transition-transform duration-300 ease-in-out z-50 overflow-y-auto shadow-2xl"
               style={{ transform: showMobileFilters ? 'translateX(0)' : 'translateX(-100%)' }}>
            {activeTab === 'matches' ? <PartnerSearchSidebar isMobile onClose={() => setShowMobileFilters(false)} /> : <SearchSidebar isMobile onClose={() => setShowMobileFilters(false)} />}
          </div>
        </div>
      )}
      {selectedProfile ? (
        renderDetailedProfileCard(selectedProfile, selectedProfile._id === currentUser?._id)
      ) : (
        <>
          <div className="bg-white border-b border-gray-200 shadow-sm">
            <nav className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
              <div className="flex flex-wrap items-center justify-start space-x-1 sm:space-x-3 lg:space-x-6 py-3">
                {tabs.map(tab => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => {
                        if (tab.id === 'home') {
                          navigate('/');
                        } else {
                          setActiveTab(tab.id);
                          setShowMobileFilters(false);
                        }
                      }}
                      className={`py-3 px-1 border-b-2 font-medium text-xs sm:text-sm flex items-center gap-1 transition-colors duration-200 rounded-t-md ${
                        activeTab === tab.id
                          ? 'border-red-500 text-red-600 bg-red-50'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 hover:bg-gray-50'
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
              {activeTab === 'matches' && (
                <div className="max-w-7xl mx-auto">
                  <ProfileHeader />
                  <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 relative z-0">
                    {/* Desktop Sidebar */}
                    <div className="hidden lg:block lg:col-span-1">
                      <PartnerSearchSidebar />
                    </div>
                    {/* Mobile Filter Button */}
                    <div className="lg:hidden col-span-1 mb-4 flex justify-end">
                      <button
                        onClick={() => setShowMobileFilters(true)}
                        className="px-4 py-2 bg-purple-600 text-white rounded-md text-sm font-medium hover:bg-purple-700 transition-colors flex items-center gap-2"
                      >
                        <Filter className="w-4 h-4" />
                        Filters
                      </button>
                    </div>
                    {/* Results */}
                    <div className={`lg:col-span-3 ${showMobileFilters ? 'lg:col-span-3' : 'col-span-1'}`}>
                      {searchResults.length > 0 && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                          <p className="text-sm text-blue-800">
                            Showing {searchResults.length} results based on applied filters
                          </p>
                        </div>
                      )}
                      {searchResults.length === 0 ? (
                        <div className="text-center py-8 bg-white rounded-lg">
                          <Heart className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                          <p className="text-gray-500">No matches found yet</p>
                        </div>
                      ) : (
                        <>
                          <div className="space-y-4">
                            {currentProfiles.map(profile => (
                              <div key={profile._id}>
                                {renderMatchCard(profile)}
                              </div>
                            ))}
                          </div>
                          <PaginationControls />
                        </>
                      )}
                    </div>
                  </div>
                </div>
              )}
              {activeTab === 'messages' && (
                <div className="max-w-7xl mx-auto">
                  <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 relative z-0">
                    {/* Desktop Sidebar */}
                    <div className="hidden lg:block lg:col-span-1">
                      <SearchSidebar />
                    </div>
                    {/* Mobile Filter Button */}
                    <div className="lg:hidden col-span-1 mb-4 flex justify-end">
                      <button
                        onClick={() => setShowMobileFilters(true)}
                        className="px-4 py-2 bg-purple-600 text-white rounded-md text-sm font-medium hover:bg-purple-700 transition-colors flex items-center gap-2"
                      >
                        <Filter className="w-4 h-4" />
                        Filters
                      </button>
                    </div>
                    {/* Results */}
                    <div className={`lg:col-span-3 ${showMobileFilters ? 'lg:col-span-3' : 'col-span-1'}`}>
                      {searchResults.length > 0 && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                          <p className="text-sm text-blue-800">
                            Showing {searchResults.length} results
                          </p>
                        </div>
                      )}
                      {searchResults.length === 0 ? (
                        <div className="text-center py-8 bg-white rounded-lg">
                          <Search className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                          <p className="text-gray-500">No results found. Try adjusting your search criteria.</p>
                        </div>
                      ) : (
                        <>
                          <div className="space-y-4">
                            {currentProfiles.map(profile => (
                              <div key={profile._id}>
                                {renderMatchCard(profile)}
                              </div>
                            ))}
                          </div>
                          <PaginationControls />
                        </>
                      )}
                    </div>
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
                            <img
                              src={currentUser.profileImage}
                              alt={`${currentUser.Name} Profile`}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.src = PLACEHOLDER_IMAGE;
                              }}
                            />
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
                              <span className="text-sm text-gray-600 w-32 font-medium">Height</span>
                              <span className="text-gray-800 text-sm">: {currentUser.height || 'N/A'} feet</span>
                            </div>
                            <div className="flex">
                              <span className="text-sm text-gray-600 w-32 font-medium">Religion</span>
                              <span className="text-gray-800 text-sm">: {currentUser.religion || 'N/A'}</span>
                            </div>
                            <div className="flex">
                              <span className="text-sm text-gray-600 w-32 font-medium">Community</span>
                              <span className="text-gray-800 text-sm">: {currentUser.community || 'N/A'}</span>
                            </div>
                            <div className="flex">
                              <span className="text-sm text-gray-600 w-32 font-medium">Marital Status</span>
                              <span className="text-gray-800 text-sm">: {currentUser.maritalStatus || 'N/A'}</span>
                            </div>
                            <div className="flex">
                              <span className="text-sm text-gray-600 w-32 font-medium">Location</span>
                              <span className="text-gray-800 text-sm">: {currentUser.city || 'N/A'}</span>
                            </div>
                            <div className="flex">
                              <span className="text-sm text-gray-600 w-32 font-medium">Profile For</span>
                              <span className="text-gray-800 text-sm">: {currentUser.profileFor || 'Self'}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-3 sm:p-4 border-b">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-red-500 font-bold text-lg">Basics & Lifestyle</h3>

                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
                        <div className="flex">
                          <span className="text-sm text-gray-600 w-32 font-medium">Diet</span>
                          <span className="text-gray-800 text-sm">: {currentUser.diet || 'Not Specified'}</span>
                        </div>
                        <div className="flex">
                          <span className="text-sm text-gray-600 w-32 font-medium">Date of Birth</span>
                          <span className="text-gray-800 text-sm">
                            : {formatDate(currentUser.dob) || 'Not Specified'}
                          </span>
                        </div>
                        <div className="flex">
                          <span className="text-sm text-gray-600 w-32 font-medium">Marital Status</span>
                          <span className="text-gray-800 text-sm">: {currentUser.maritalStatus || 'N/A'}</span>
                        </div>
                        <div className="flex">
                          <span className="text-sm text-gray-600 w-32 font-medium">Height</span>
                          <span className="text-gray-800 text-sm">: {currentUser.height || 'N/A'} feet</span>
                        </div>
                        <div className="flex">
                          <span className="text-sm text-gray-600 w-32 font-medium">Grew up in</span>
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
                              <span className="text-sm text-gray-600 w-32 font-medium">Religion</span>
                              <span className="text-gray-800 text-sm">: {currentUser.religion || 'N/A'}</span>
                            </div>
                            <div className="flex">
                              <span className="text-sm text-gray-600 w-32 font-medium">Community</span>
                              <span className="text-gray-800 text-sm">: {currentUser.community || 'N/A'}</span>
                            </div>
                            <div className="flex">
                              <span className="text-sm text-gray-600 w-32 font-medium">Sub community</span>
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
                              <span className="text-sm text-gray-600 w-32 font-medium">Date of Birth</span>
                              <span className="text-gray-800 text-sm">: {formatDate(currentUser.dob) || 'Not Specified'}</span>
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
                          <span className="text-sm text-gray-600 w-32 font-medium">Mother's Details</span>
                          <span className="text-gray-800 text-sm">: {currentUser.motherName || 'Enter Now'}</span>
                        </div>
                        <div className="flex">
                          <span className="text-sm text-gray-600 w-32 font-medium">Father's Details</span>
                          <span className="text-gray-800 text-sm">: {currentUser.fatherName || 'Enter Now'}</span>
                        </div>
                        <div className="flex">
                          <span className="text-sm text-gray-600 w-32 font-medium">Family Location</span>
                          <span className="text-gray-800 text-sm">: {currentUser.city}, {currentUser.state}, {currentUser.country || 'N/A'}</span>
                        </div>
                      </div>
                    </div>
                    <div className="p-3 sm:p-4 border-b">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-red-500 font-bold text-lg">Education & Career</h3>

                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
                        <div className="flex">
                          <span className="text-sm text-gray-600 w-32 font-medium">Highest Qualification</span>
                          <span className="text-gray-800 text-sm">: {currentUser.highestQualification || 'N/A'}</span>
                        </div>
                        <div className="flex">
                          <span className="text-sm text-gray-600 w-32 font-medium">Working With</span>
                          <span className="text-gray-800 text-sm">: {currentUser.workingWith || 'Private Company'}</span>
                        </div>
                        <div className="flex">
                          <span className="text-sm text-gray-600 w-32 font-medium">Working As</span>
                          <span className="text-gray-800 text-sm">: {currentUser.workAs || 'N/A'}</span>
                        </div>
                        <div className="flex">
                          <span className="text-sm text-gray-600 w-32 font-medium">Annual Income</span>
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
                          <span className="text-sm text-gray-600 w-32 font-medium">Current Residence</span>
                          <span className="text-gray-800 text-sm">: {currentUser.city}, {currentUser.country || 'N/A'}</span>
                        </div>
                        <div className="flex">
                          <span className="text-sm text-gray-600 w-32 font-medium">State Of Residence</span>
                          <span className="text-gray-800 text-sm">: {currentUser.state || 'N/A'}</span>
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