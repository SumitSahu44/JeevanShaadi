import React, { useEffect, useState } from 'react';
import { MapPin, Briefcase, GraduationCap, Home, Heart, User, Settings, Cake, Ruler, Users, Globe, Filter, Star, Search, ChevronLeft, X, BookAIcon, MessageCircle, Bell, Menu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import axios from 'axios'; // Add axios import for API calls
import { toast } from 'react-toastify'; // Add toast import for notifications
import io from 'socket.io-client'; // Add socket for real-time notify
const socket = io('http://localhost:4000', {
  auth: { token: localStorage.getItem('token') }
}); // Global socket instance
export default function MatrimonyDashboard() {
  const navigate = useNavigate();
  const [profiles, setProfiles] = useState([]);
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
   const [formData, setFormData] = useState({
      Name: '',
      gender: '',
      dob: '',
      age: '',
      height: '',
      maritalStatus: '',
      profileFor: '',
      religion: '',
      community: '',
      subCommunity: '',
      noCasteBar: false,
      city: '',
      state: '',
      country: 'India',
      livingIn: '',
      diet: '',
      weight: '',
      education: '',
      highestQualification: '',
      occupation: '',
      workingWith: '',
      workAs: '',
      income: '',
      motherTongue: '',
      about: '',
      familyBackground: '',
      liveWithFamily: false,
      motherName: '',
      fatherName: '',
      mobile: '',
      email: ''
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
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const itemsPerPage = 7;
  const countries = [
    { name: "India", code: "IN" },
    { name: "United States", code: "US" },
    { name: "United Kingdom", code: "GB" },
    { name: "Canada", code: "CA" },
    { name: "Australia", code: "AU" },
  ];
  // States by Country (as provided)
  const statesByCountry = {
    IN: [
      { name: "Andhra Pradesh", iso2: "AP" },
      { name: "Arunachal Pradesh", iso2: "AR" },
      { name: "Assam", iso2: "AS" },
      { name: "Bihar", iso2: "BR" },
      { name: "Chhattisgarh", iso2: "CT" },
      { name: "Goa", iso2: "GA" },
      { name: "Gujarat", iso2: "GJ" },
      { name: "Haryana", iso2: "HR" },
      { name: "Himachal Pradesh", iso2: "HP" },
      { name: "Jharkhand", iso2: "JH" },
      { name: "Karnataka", iso2: "KA" },
      { name: "Kerala", iso2: "KL" },
      { name: "Madhya Pradesh", iso2: "MP" },
      { name: "Maharashtra", iso2: "MH" },
      { name: "Manipur", iso2: "MN" },
      { name: "Meghalaya", iso2: "ML" },
      { name: "Mizoram", iso2: "MZ" },
      { name: "Nagaland", iso2: "NL" },
      { name: "Odisha", iso2: "OR" },
      { name: "Punjab", iso2: "PB" },
      { name: "Rajasthan", iso2: "RJ" },
      { name: "Sikkim", iso2: "SK" },
      { name: "Tamil Nadu", iso2: "TN" },
      { name: "Telangana", iso2: "TS" },
      { name: "Tripura", iso2: "TR" },
      { name: "Uttar Pradesh", iso2: "UP" },
      { name: "Uttarakhand", iso2: "UK" },
      { name: "West Bengal", iso2: "WB" },
      { name: "Andaman and Nicobar Islands", iso2: "AN" },
      { name: "Chandigarh", iso2: "CH" },
      { name: "Dadra and Nagar Haveli and Daman and Diu", iso2: "DN" },
      { name: "Delhi", iso2: "DL" },
      { name: "Jammu and Kashmir", iso2: "JK" },
      { name: "Ladakh", iso2: "LA" },
      { name: "Lakshadweep", iso2: "LD" },
      { name: "Puducherry", iso2: "PY" },
    ],
    US: [
      { name: "California", iso2: "CA" },
      { name: "New York", iso2: "NY" },
      { name: "Texas", iso2: "TX" },
      { name: "Florida", iso2: "FL" },
    ],
    GB: [
      { name: "England", iso2: "ENG" },
      { name: "Scotland", iso2: "SCO" },
      { name: "Wales", iso2: "WAL" },
      { name: "Northern Ireland", iso2: "NIR" },
    ],
    CA: [
      { name: "Ontario", iso2: "ON" },
      { name: "Quebec", iso2: "QC" },
      { name: "British Columbia", iso2: "BC" },
      { name: "Alberta", iso2: "AB" },
    ],
    AU: [
      { name: "New South Wales", iso2: "NSW" },
      { name: "Victoria", iso2: "VIC" },
      { name: "Queensland", iso2: "QLD" },
      { name: "Western Australia", iso2: "WA" },
    ],
  };
  // Example cities data (nested by country code + state iso2, e.g., 'IN-AP'). You'll need to expand this with real data.
  const citiesByState = {
    'IN-AP': ['Visakhapatnam', 'Vijayawada', 'Guntur'],
    'IN-MH': ['Mumbai', 'Pune', 'Nagpur'],
    'US-CA': ['Los Angeles', 'San Francisco', 'San Diego'],
    'US-NY': ['New York City', 'Buffalo', 'Albany'],
    // Add more as needed for other states/countries
  };
  const stateOptions = selectedCountry ? statesByCountry[selectedCountry] || [] : [];
  const cityOptions = selectedCountry && selectedState ? citiesByState[`${selectedCountry}-${selectedState}`] || [] : [];
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
    if (!token) throw new Error('Not logged in');
    // 1. अपना प्रोफाइल
    const meRes = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/profile/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!meRes.ok) throw new Error('Failed to fetch your profile');
    const meData = await meRes.json();
    // 2. सभी यूज़र्स
    const allRes = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/profile/all`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!allRes.ok) throw new Error('Failed to fetch matches');
    const allData = await allRes.json();
    const processImage = (user) => {
      let img = PLACEHOLDER_IMAGE;
      if (user.profile?.photos?.[0]?.data) {
        const bytes = new Uint8Array(user.profile.photos[0].data.data);
        let binary = '';
        bytes.forEach(b => binary += String.fromCharCode(b));
        img = `data:${user.profile.photos[0].contentType};base64,${btoa(binary)}`;
      }
      return { ...user, profileImage: img, zodiac: getZodiacSign(user.dob) };
    };
    const processedMe = processImage(meData);
    const processedAll = allData.map(processImage);
    setCurrentUser(processedMe);
    setFormData({
      Name: processedMe.Name || '',
      gender: processedMe.gender || '',
      dob: processedMe.dob ? new Date(processedMe.dob).toISOString().split('T')[0] : '',
      age: processedMe.age || calculateAge(processedMe.dob).toString() || '',
      height: processedMe.height || '',
      maritalStatus: processedMe.maritalStatus || '',
      profileFor: processedMe.profileFor || '',
      religion: processedMe.religion || '',
      community: processedMe.community || '',
      subCommunity: processedMe.subCommunity || '',
      noCasteBar: processedMe.noCasteBar || false,
      city: processedMe.city || '',
      state: processedMe.state || '',
      country: processedMe.country || 'India',
      livingIn: processedMe.livingIn || '',
      diet: processedMe.diet || '',
      weight: processedMe.weight || '',
      education: processedMe.education || '',
      highestQualification: processedMe.highestQualification || '',
      occupation: processedMe.workDetails || '',
      workingWith: processedMe.workingWith || '',
      workAs: processedMe.workDetails || '',
      income: processedMe.income || '',
      motherTongue: processedMe.motherTongue || '',
      about: processedMe.aboutYourself || '',
      familyBackground: processedMe.familyBackground || '',
      liveWithFamily: processedMe.liveWithFamily || false,
      motherName: processedMe.motherName || '',
      fatherName: processedMe.fatherName || '',
      mobile: processedMe.mobile || '',
      email: processedMe.email || ''
    });
    const others = processedAll.filter(p => p._id !== processedMe._id);
    setProfiles(others);
    setSearchResults(others);
  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
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
      // if (partnerSearch.familyBackground && !profile.familyBackground?.toLowerCase().includes(partnerSearch.familyBackground.toLowerCase())) return false;
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
  const handleCountryChange = (e) => {
    const countryCode = e.target.value;
    setSelectedCountry(countryCode);
    setSelectedState(''); // Reset state
    handlePartnerSearchChange('livingIn', countries.find(c => c.code === countryCode)?.name || '');
    handlePartnerSearchChange('state', '');
    handlePartnerSearchChange('city', '');
  };
  const handleStateChange = (e) => {
    const stateIso2 = e.target.value;
    setSelectedState(stateIso2);
    const selectedStateName = stateOptions.find(s => s.iso2 === stateIso2)?.name || '';
    handlePartnerSearchChange('state', selectedStateName);
    handlePartnerSearchChange('city', ''); // Reset city
  };
  const handleCityChange = (e) => {
    handlePartnerSearchChange('city', e.target.value);
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
  const handleEditProfile = () => {
  if (currentUser?._id) {
    navigate(`/edit-profile/${currentUser._id}`);
  } else {
    alert('Profile not loaded yet');
  }
};
const calculateAge = (dob) => {
  if (!dob) return "";
  const birth = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
};
  // New function to send chat request
  const sendChatRequest = async (receiverId, receiverName) => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/chat/requests/send`,
        { receiverId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.success) {
        toast.success(`Chat request sent to ${receiverName}!`);
        socket.emit('newRequest', { receiverId });
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error sending request');
    }
  };
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
                <div className="bg-gradient-to-r from-pink-500 to-gray-600 text-white text-xs font-bold px-2 py-1 rounded-full shadow-md flex items-center gap-1">
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
                <Cake className="w-4 h-4 text-gray-900 font-bold" />
                {profile.dob && (
  <div className="col-span-1 md:col-span-2 text-sm text-gray-600">
    Age: <strong>{calculateAge(profile.dob)}</strong> years
  </div>
)}
                {/* {profile.dob || 'N/A'} */}
                 • {profile.height || 'N/A'}ft
              </p>
              <p className="flex items-center gap-2 text-gray-700">
                <Globe className="w-4 h-4 text-gray-900 font-bold" />
                {profile.religion}, {profile.community || 'N/A'}
              </p>
            </div>
          </div>
          {/* Right Details Column: Professional & Location */}
          <div className="space-y-1 text-sm text-gray-700">
            <p className="flex items-center gap-2">
              <Heart className="w-4 h-4 text-gray-900 font-bold" />
              {profile.maritalStatus || 'Single'}
            </p>
            <p className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-gray-900 font-bold mt-0.5" />
              <span className="truncate">{profile.city}, {profile.state || 'N/A'}</span>
            </p>
            <div className="flex items-center gap-2">
         
                <BookAIcon className="w-4 h-4 text-gray-900 font-bold" />
            <p className="text-gray-600 font-medium">{profile.highestQualification || 'N/A'}</p>
            </div>
            <p className="flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-gray-900 font-bold" />
              {profile.workDetails || 'N/A'} • {profile.income ? `₹${profile.income}` : 'Income N/A'}
            </p>
          </div>
        </div>
        {/* Right: Enhanced Actions */}
        <div className="flex flex-col items-end gap-3 pt-2 lg:pt-0 relative z-10">
          <button
            onClick={() => sendChatRequest(profile._id, profile.Name)} // Updated: Send chat request
            className="w-full lg:w-auto px-5 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl text-sm font-bold shadow-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
          >
            {/* <LinkIcon className="w-4 h-4" /> */}
            Send Request
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
          <button
                onClick={() => setSelectedProfile(null)}
                className="ml-4 py-2 px-5 bg-white text-gray-600 flex items-center m-2 rounded-lg shadow-sm hover:bg-gray-100 transition-colors"
              >
                <ChevronLeft className="w-5 h-5 text-gray-600" /> Back
              </button>
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
                      <span className="text-gray-800 text-sm">: {profile.height || 'N/A'} </span>
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
                     <div className="flex">
                      <span className="text-sm text-gray-600 w-32 font-medium">Mobile No.</span>
                      <span className="text-gray-800 text-sm">: {profile.mobile || 'Self'}</span>
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
                  <span className="text-gray-800 text-sm">: {profile.height || 'N/A'} </span>
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
                {profile.aboutYourself }
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
                  className="px-6 py-2 cursor-pointer bg-red-600 text-white rounded-md font-semibold hover:bg-red-700 transition-colors"
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
    return (
      <div className="bg-white border-b border-gray-200 p-4 md:p-6 mb-6">
        {/* <h2 className="text-2xl font-bold text-gray-900 mb-6">Hello {currentUser.Name} </h2> */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Sidebar */}
          <div className="flex flex-col items-center lg:items-start gap-4 w-full lg:w-auto">
            <div className="relative">
              <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-gray-200 shadow-md">
                <img
                  src={currentUser.profileImage}
                  alt={currentUser.Name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = PLACEHOLDER_IMAGE;
                  }}
                />
              </div>
              <h1 className='font-bold text-gray-700 text-center mt-3'><span className='text-gray-600'>User ID :</span> {currentUser.userId}</h1>
            </div>
            <div className="flex flex-col gap-2 text-sm text-gray-700 w-full max-w-xs">
              <button
                onClick={handleEditProfile}
                className="px-3 py-1.5 bg-red-100 cursor-pointer text-red-700 rounded-md hover:bg-red-200 transition-colors text-left font-medium"
              >
                Edit Profile
              </button>
            </div>
           
          </div>
          {/* Center: Profile Completion */}
          <div className="flex-1">
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <p className="text-sm text-gray-600 mb-3">A Profile with 100% Completion get maximum response from users. Please Provide Latest Photographs</p>
               <div className="border-t border-neutral-200 p-6">
                <h3 className="text-sm font-semibold text-neutral-900 mb-3">Profile Completion</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-neutral-600 mb-1">
                    <span>Progress</span>
                    {/* <span>{Math.round((Object.values(formData).filter(v => v !== '' && v !== false).length / Object.keys(formData).length) * 100)}%</span> */}
                  </div>
                  <div className="w-full bg-neutral-300 rounded-full h-2">
                    <div
                      className="bg-green-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(Object.values(formData).filter(v => v !== '' && v !== false).length / Object.keys(formData).length) * 100}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-neutral-500 mt-2">
                    {Object.values(formData).filter(v => v !== '' && v !== false).length} of {Object.keys(formData).length} fields completed
                  </p>
                </div>
              </div>
              <div className="mb-3 flex items-center gap-4">
                <label className="text-xs font-medium text-gray-700 block mb-1">Email-ID</label>
                {currentUser.email ? (
                  <span className="text-sm text-gray-900">{currentUser.email}</span>
                ) : (
                  <button className="px-3 py-1 bg-green-100 text-green-700 rounded-md text-sm hover:bg-green-200 transition-colors"></button>
                )}
              </div>
              <div className="mb-3 flex items-center gap-4">
                <label className="text-xs font-medium text-gray-700">Mobile No.</label>
                {currentUser.mobile ? (
                  <span className="text-sm text-green-600 flex items-center gap-1">
                    {currentUser.mobile} <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                  </span>
                ) : (
                  <span className="text-sm text-gray-500"></span>
                )}
              </div>
        
            </div>
      
          </div>
        </div>
      </div>
    );
  };
  // Enhanced Chat Section Component
  const ChatSection = () => (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100 mb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white rounded-full shadow-sm border border-gray-200">
              <MessageCircle className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Chat & Connections</h3>
              <p className="text-sm text-gray-600">Manage your conversations and requests</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/chat"
              className="flex items-center gap-2 px-4 py-2.5 bg-white text-blue-700 font-medium rounded-lg shadow-sm border border-blue-200 hover:bg-blue-50 hover:border-blue-300 transition-all duration-200 text-sm"
            >
              <MessageCircle className="w-4 h-4" />
              My Chats
            </Link>
            <Link
              to="/pending-requests"
              className="flex items-center gap-2 px-4 py-2.5 bg-white text-green-700 font-medium rounded-lg shadow-sm border border-green-200 hover:bg-green-50 hover:border-green-300 transition-all duration-200 text-sm"
            >
              <Bell className="w-4 h-4" />
              Pending Requests
            </Link>
         
          </div>
        </div>
      </div>
    </div>
  );
  // Partner Search Sidebar component
const PartnerSearchSidebar = ({ isMobile = false, onClose }) => {
  // === Yeh sab aapke code mein pehle se hone chahiye the ===
  const profileForOptions = ['Self', 'Son', 'Daughter', 'Brother', 'Sister', 'Relative', 'Friend'];
  const genderOptions = ['', 'Male', 'Female'];
  const maritalStatusOptions = ['', 'Never Married', 'Divorced', 'Widowed', 'Separated'];
  const dietOptions = ['', 'Vegetarian', 'Non-Vegetarian', 'Eggetarian', 'Vegan', 'Other'];
  const workDetailsOptions = ['', 'Private', 'Government', 'Business', 'Self Employed', 'Not Working'];
  const noCasteBarOptions = ['', 'true', 'false'];
  const liveWithFamilyOptions = ['', 'true', 'false'];
  // ---- Height dropdown (4ft 0in – 7ft 0in) ----
  const heightOptions = [];
  for (let ft = 4; ft <= 7; ft++) {
    for (let inc = 0; inc < 12; inc++) {
      heightOptions.push(`${ft}ft ${inc}in`);
    }
  }
  // ---- Weight range (30-150 kg) ----
  const weightOptions = Array.from({ length: 121 }, (_, i) => i + 30);
  // ---- Religion → Community → Sub-Community (Dummy - Replace with your real data) ----
  const religionCommunityMap = {
    'Hindu': {
      communities: ['Brahmin', 'Rajput', 'Gujarati', 'Marathi'],
      subCommunities: {
        'Brahmin': ['Iyengar', 'Iyer'],
        'Rajput': ['Chauhan', 'Rathore'],
      }
    },
    'Muslim': {
      communities: ['Sunni', 'Shia'],
      subCommunities: { 'Sunni': ['Hanafi', 'Maliki'], 'Shia': ['Twelver'] }
    },
    'Christian': {
      communities: ['Catholic', 'Protestant'],
      subCommunities: { 'Catholic': ['Roman', 'Syro-Malabar'] }
    },
    // Add more religions as needed
  };
  const religionOptions = Object.keys(religionCommunityMap);
  const selectedReligion = partnerSearch.religion;
  const communityOptions = selectedReligion ? religionCommunityMap[selectedReligion]?.communities || [] : [];
  const selectedCommunity = partnerSearch.community;
  const subCommunityOptions = selectedReligion && selectedCommunity
    ? religionCommunityMap[selectedReligion]?.subCommunities?.[selectedCommunity] || []
    : [];
  // Compute city options based on selected country and state
  const cityOptionsLocal = cityOptions;
  // ---- Dropdown Options (All ek baar) ----
  const qualificationOptions = [
    'High School', 'Diploma', 'Bachelor\'s Degree', 'Master\'s Degree', 'PhD', 'Other'
  ];
  const incomeOptions = [
    'Below ₹3 Lakh', '₹3 - ₹5 Lakh', '₹5 - ₹8 Lakh', '₹8 - ₹12 Lakh',
    '₹12 - ₹20 Lakh', '₹20 - ₹30 Lakh', 'Above ₹30 Lakh'
  ];
  const motherTongueOptions = [
    'Hindi', 'English', 'Bengali', 'Telugu', 'Marathi', 'Tamil',
    'Gujarati', 'Kannada', 'Malayalam', 'Punjabi', 'Odia', 'Urdu', 'Other'
  ];
  return (
    <div className={`bg-gray-50 border border-gray-200 rounded-lg p-4 ${isMobile ? 'h-full' : 'sticky top-4'}`}>
      {isMobile && (
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-gray-900">Advanced Search</h3>
          <button onClick={onClose} className="text-gray-600 hover:text-gray-800">
            <X className="w-5 h-5" />
          </button>
        </div>
      )}
      {!isMobile && (
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-gray-900">Advanced Search</h3>
          <button
            onClick={clearPartnerSearch}
            className="text-sm text-gray-600 hover:text-gray-800 font-medium"
          >
            Clear All
          </button>
        </div>
      )}
      <div className="space-y-4 max-h-[calc(100vh-200px)]">
        {/* Profile For */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Profile For</label>
          <select
            value={partnerSearch.profileFor}
            onChange={(e) => handlePartnerSearchChange('profileFor', e.target.value)}
            className="w-full px-2 py-1.5 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-gray-500"
          >
            <option value="">All</option>
            {profileForOptions.map(o => <option key={o} value={o}>{o}</option>)}
          </select>
        </div>
        {/* Gender */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Gender</label>
          <select
            value={partnerSearch.gender}
            onChange={(e) => handlePartnerSearchChange('gender', e.target.value)}
            className="w-full px-2 py-1.5 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-gray-500"
          >
            <option value="">All</option>
            {genderOptions.map(o => <option key={o} value={o}>{o}</option>)}
          </select>
        </div>
        {/* Age Range */}
        <div className="flex gap-2">
          <div className="flex-1">
            <label className="block text-xs font-medium text-gray-700 mb-1">Min Age</label>
            <select
              value={partnerSearch.minAge}
              onChange={(e) => handlePartnerSearchChange('minAge', e.target.value)}
              className="w-full px-2 py-1.5 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-gray-500"
            >
              {[...Array(43).keys()].map(i => (
                <option key={i + 18} value={i + 18}>{i + 18}</option>
              ))}
            </select>
          </div>
          <span className="self-center text-gray-500">to</span>
          <div className="flex-1">
            <label className="block text-xs font-medium text-gray-700 mb-1">Max Age</label>
            <select
              value={partnerSearch.maxAge}
              onChange={(e) => handlePartnerSearchChange('maxAge', e.target.value)}
              className="w-full px-2 py-1.5 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-gray-500"
            >
              {[...Array(43).keys()].map(i => (
                <option key={i + 18} value={i + 18}>{i + 18}</option>
              ))}
            </select>
          </div>
        </div>
        {/* Marital Status */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Marital Status</label>
          <select
            value={partnerSearch.maritalStatus}
            onChange={(e) => handlePartnerSearchChange('maritalStatus', e.target.value)}
            className="w-full px-2 py-1.5 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-gray-500"
          >
            <option value="">All</option>
            {maritalStatusOptions.map(o => <option key={o} value={o}>{o}</option>)}
          </select>
        </div>
        {/* Height */}
        <div className="flex gap-2">
          <div className="flex-1">
            <label className="block text-xs font-medium text-gray-700 mb-1">Min Height</label>
            <select
              value={partnerSearch.minHeight}
              onChange={(e) => handlePartnerSearchChange('minHeight', e.target.value)}
              className="w-full px-2 py-1.5 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-gray-500"
            >
              <option value="">Any</option>
              {heightOptions.map(h => <option key={h} value={h}>{h}</option>)}
            </select>
          </div>
          <span className="self-center text-gray-500">to</span>
          <div className="flex-1">
            <label className="block text-xs font-medium text-gray-700 mb-1">Max Height</label>
            <select
              value={partnerSearch.maxHeight}
              onChange={(e) => handlePartnerSearchChange('maxHeight', e.target.value)}
              className="w-full px-2 py-1.5 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-gray-500"
            >
              <option value="">Any</option>
              {heightOptions.map(h => <option key={h} value={h}>{h}</option>)}
            </select>
          </div>
        </div>
        {/* Weight */}
        <div className="flex gap-2">
          <div className="flex-1">
            <label className="block text-xs font-medium text-gray-700 mb-1">Min Weight (kg)</label>
            <select
              value={partnerSearch.weight?.split('-')[0] || ''}
              onChange={(e) => {
                const min = e.target.value;
                const max = partnerSearch.weight?.split('-')[1] || '';
                handlePartnerSearchChange('weight', min ? `${min}-${max}` : '');
              }}
              className="w-full px-2 py-1.5 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-gray-500"
            >
              <option value="">Any</option>
              {weightOptions.map(w => <option key={w} value={w}>{w}</option>)}
            </select>
          </div>
          <span className="self-center text-gray-500">to</span>
          <div className="flex-1">
            <label className="block text-xs font-medium text-gray-700 mb-1">Max Weight (kg)</label>
            <select
              value={partnerSearch.weight?.split('-')[1] || ''}
              onChange={(e) => {
                const max = e.target.value;
                const min = partnerSearch.weight?.split('-')[0] || '';
                handlePartnerSearchChange('weight', max ? `${min}-${max}` : '');
              }}
              className="w-full px-2 py-1.5 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-gray-500"
            >
              <option value="">Any</option>
              {weightOptions.map(w => <option key={w} value={w}>{w}</option>)}
            </select>
          </div>
        </div>
        {/* Diet */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Diet</label>
          <select
            value={partnerSearch.diet}
            onChange={(e) => handlePartnerSearchChange('diet', e.target.value)}
            className="w-full px-2 py-1.5 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-gray-500"
          >
            <option value="">All</option>
            {dietOptions.map(o => <option key={o} value={o}>{o}</option>)}
          </select>
        </div>
        {/* Religion */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Religion</label>
          <select
            value={partnerSearch.religion}
            onChange={(e) => {
              const rel = e.target.value;
              handlePartnerSearchChange('religion', rel);
              handlePartnerSearchChange('community', '');
              handlePartnerSearchChange('subCommunity', '');
            }}
            className="w-full px-2 py-1.5 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-gray-500"
          >
            <option value="">All</option>
            {religionOptions.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>
        {/* Community */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Community</label>
          <select
            value={partnerSearch.community}
            onChange={(e) => {
              const com = e.target.value;
              handlePartnerSearchChange('community', com);
              handlePartnerSearchChange('subCommunity', '');
            }}
            disabled={!selectedReligion}
            className="w-full px-2 py-1.5 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-gray-500 disabled:opacity-50"
          >
            <option value="">All</option>
            {communityOptions.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        {/* Sub Community */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Sub Community</label>
          <select
            value={partnerSearch.subCommunity}
            onChange={(e) => handlePartnerSearchChange('subCommunity', e.target.value)}
            disabled={!selectedCommunity}
            className="w-full px-2 py-1.5 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-gray-500 disabled:opacity-50"
          >
            <option value="">All</option>
            {subCommunityOptions.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        {/* No Caste Bar */}
        <div className="flex items-center gap-4">
          <span className="text-xs font-medium text-gray-700">No Caste Bar</span>
          <div className="flex gap-3">
            {noCasteBarOptions.map(v => (
              <label key={v} className="flex items-center gap-1 cursor-pointer">
                <input
                  type="radio"
                  name="noCasteBar"
                  value={v}
                  checked={partnerSearch.noCasteBar === v}
                  onChange={(e) => handlePartnerSearchChange('noCasteBar', e.target.value)}
                  className="w-4 h-4 text-gray-900 font-bold focus:ring-red-500"
                />
                <span className="text-sm">{v === '' ? 'All' : v === 'true' ? 'Yes' : 'No'}</span>
              </label>
            ))}
          </div>
        </div>
        {/* Living In (Country) */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Living In</label>
          <select
            value={selectedCountry}
            onChange={handleCountryChange}
            className="w-full px-2 py-1.5 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-gray-500"
          >
            <option value="">Select Country</option>
            {countries.map(c => (
              <option key={c.code} value={c.code}>{c.name}</option>
            ))}
          </select>
        </div>
        {/* State */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">State</label>
          <select
            value={selectedState}
            onChange={handleStateChange}
            disabled={!selectedCountry}
            className="w-full px-2 py-1.5 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-gray-500 disabled:opacity-50"
          >
            <option value="">Select State</option>
            {stateOptions.map(s => (
              <option key={s.iso2} value={s.iso2}>{s.name}</option>
            ))}
          </select>
        </div>
        {/* City */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">City</label>
          <select
            value={partnerSearch.city}
            onChange={handleCityChange}
            disabled={!selectedState}
            className="w-full px-2 py-1.5 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-gray-500 disabled:opacity-50"
          >
            <option value="">Select City</option>
            {cityOptionsLocal.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        {/* Live With Family */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Live With Family</label>
          <select
            value={partnerSearch.liveWithFamily}
            onChange={(e) => handlePartnerSearchChange('liveWithFamily', e.target.value)}
            className="w-full px-2 py-1.5 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-gray-500"
          >
            <option value="">All</option>
            {liveWithFamilyOptions.map(o => (
              <option key={o} value={o}>{o === 'true' ? 'Yes' : o === 'false' ? 'No' : 'All'}</option>
            ))}
          </select>
        </div>
        {/* Family Background */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Family Background</label>
          <input
            type="text"
            value={partnerSearch.familyBackground}
            onChange={(e) => handlePartnerSearchChange('familyBackground', e.target.value)}
            placeholder="e.g., Middle Class"
            className="w-full px-2 py-1.5 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-gray-500"
          />
        </div>
        {/* Highest Qualification */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Highest Qualification</label>
          <select
            value={partnerSearch.highestQualification}
            onChange={(e) => handlePartnerSearchChange('highestQualification', e.target.value)}
            className="w-full px-2 py-1.5 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-gray-500"
          >
            <option value="">All</option>
            {qualificationOptions.map(o => (
              <option key={o} value={o}>{o}</option>
            ))}
          </select>
        </div>
        {/* Work Details */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Work Details</label>
          <select
            value={partnerSearch.workDetails}
            onChange={(e) => handlePartnerSearchChange('workDetails', e.target.value)}
            className="w-full px-2 py-1.5 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-gray-500"
          >
            <option value="">All</option>
            {workDetailsOptions.map(o => <option key={o} value={o}>{o}</option>)}
          </select>
        </div>
        {/* Income */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Income</label>
          <select
            value={partnerSearch.income}
            onChange={(e) => handlePartnerSearchChange('income', e.target.value)}
            className="w-full px-2 py-1.5 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-gray-500"
          >
            <option value="">All</option>
            {incomeOptions.map(o => (
              <option key={o} value={o}>{o}</option>
            ))}
          </select>
        </div>
        {/* Mother Tongue */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Mother Tongue</label>
          <select
            value={partnerSearch.motherTongue}
            onChange={(e) => handlePartnerSearchChange('motherTongue', e.target.value)}
            className="w-full px-2 py-1.5 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-gray-500"
          >
            <option value="">All</option>
            {motherTongueOptions.map(o => (
              <option key={o} value={o}>{o}</option>
            ))}
          </select>
        </div>
        {/* SEARCH BUTTON */}
        <button
          onClick={applyPartnerSearch}
          className="w-full mt-6 py-2 bg-green-200 cursor-pointer text-green-700 rounded-md hover:bg-green-200 transition-colors font-semibold text-lg "
        >
          Search
        </button>
      </div>
    </div>
  );
};
  const NormalSearchSidebar = ({ isMobile = false, onClose }) => {
    const genderOptions = ['', 'Male', 'Female'];
    return (
      <div className={`bg-gray-50 border border-gray-200 rounded-lg p-4 ${isMobile ? 'h-full' : 'sticky top-4'}`}>
        {isMobile && (
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-gray-900">Normal Search</h3>
            <button onClick={onClose} className="text-gray-600 hover:text-gray-800">
              <X className="w-5 h-5" />
            </button>
          </div>
        )}
        {!isMobile && (
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-gray-900">Normal Search</h3>
            <button
              onClick={clearFilters}
              className="text-sm text-gray-600 hover:text-gray-800 font-medium"
            >
              Clear All
            </button>
          </div>
        )}
        <div className="space-y-4 overflow-y-auto h-full">
          {/* Gender */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Gender</label>
            <select
              value={filters.gender}
              onChange={(e) => handleFilterChange('gender', e.target.value)}
              className="w-full px-2 py-1.5 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-gray-500 focus:border-transparent"
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
              <label className="block text-xs font-medium text-gray-700 mb-1">Min Age</label>
              <select
                value={filters.minAge || ''}
                onChange={(e) => handleFilterChange('minAge', e.target.value)}
                className="w-full px-2 py-1.5 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-gray-500 focus:border-transparent"
              >
                <option value="">Any</option>
                {[...Array(43).keys()].map(i => (
                  <option key={i + 18} value={i + 18}>{i + 18}</option>
                ))}
              </select>
            </div>
            <span className="self-center text-gray-500">to</span>
            <div className="flex-1">
              <label className="block text-xs font-medium text-gray-700 mb-1">Max Age</label>
              <select
                value={filters.maxAge || ''}
                onChange={(e) => handleFilterChange('maxAge', e.target.value)}
                className="w-full px-2 py-1.5 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-gray-500 focus:border-transparent"
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
            <label className="block text-xs font-medium text-gray-700 mb-1">Education</label>
            <input
              type="text"
              value={filters.education || ''}
              onChange={(e) => handleFilterChange('education', e.target.value)}
              placeholder="e.g., Graduate"
              className="w-full px-2 py-1.5 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-gray-500 focus:border-transparent"
            />
          </div>
          {/* City */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">City</label>
            <input
              type="text"
              value={filters.city || ''}
              onChange={(e) => handleFilterChange('city', e.target.value)}
              placeholder="e.g., Mumbai"
              className="w-full px-2 py-1.5 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-gray-500 focus:border-transparent"
            />
          </div>
          {/* State */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">State</label>
            <input
              type="text"
              value={filters.state || ''}
              onChange={(e) => handleFilterChange('state', e.target.value)}
              placeholder="e.g., Maharashtra"
              className="w-full px-2 py-1.5 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-gray-500 focus:border-transparent"
            />
          </div>
          {/* Height Range */}
          <div className="flex gap-2">
            <div className="flex-1">
              <label className="block text-xs font-medium text-gray-700 mb-1">Min Height (cm)</label>
              <input
                type="number"
                value={filters.minHeight || ''}
                onChange={(e) => handleFilterChange('minHeight', e.target.value)}
                placeholder="e.g., 150"
                className="w-full px-2 py-1.5 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-gray-500 focus:border-transparent"
              />
            </div>
            <span className="self-center text-gray-500">to</span>
            <div className="flex-1">
              <label className="block text-xs font-medium text-gray-700 mb-1">Max Height (cm)</label>
              <input
                type="number"
                value={filters.maxHeight || ''}
                onChange={(e) => handleFilterChange('maxHeight', e.target.value)}
                placeholder="e.g., 200"
                className="w-full px-2 py-1.5 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-gray-500 focus:border-transparent"
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
    <div className={`bg-gray-50 border border-gray-200 rounded-lg p-4 ${isMobile ? 'h-full' : 'sticky top-4'}`}>
      {isMobile && (
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-gray-900">Search by ID</h3>
          <button onClick={onClose} className="text-gray-600 hover:text-gray-800">
            <X className="w-5 h-5" />
          </button>
        </div>
      )}
      {!isMobile && <h3 className="text-lg font-bold text-gray-900 mb-4">Search by ID</h3>}
      <div className="space-y-4 overflow-y-auto h-full">
        <input
          type="text"
          value={searchById}
          onChange={(e) => setSearchById(e.target.value)}
          placeholder="e.g., JS12345678"
          className="w-full px-2 py-1.5 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-gray-500 focus:border-transparent"
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
  // if (error && !selectedProfile) {
  // return (
  // <div className="flex items-center justify-center min-h-screen bg-gray-50">
  // <div className="text-center bg-white p-6 rounded-lg ">
  // <img className='h-80 lg:h-[40rem]' src='/not-login.png'></img>
  // <Link to={"/login"} className='z-10 px-10 py-3 bg-red-200 rounded-full text-red-900 font-semibold text-sm lg:text-lg '>Login</Link>
  // </div>
  // </div>
  // );
  // }
  const tabs = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'matches', label: 'Dashbaord', icon: Filter },
    { id: 'messages', label: 'Search', icon: Search },
    { id: 'profile', label: 'My Profile', icon: User },
    // { id: 'settings', label: 'Settings', icon: Settings },
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
                  <ChatSection />
                  <h1 className='font-bold text-gray-700 text-left mt-3 ml-5'>Hello, {currentUser.Name}!</h1>
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
                        className="px-4 py-2 bg-gray-600 text-white rounded-md text-sm font-medium hover:bg-gray-700 transition-colors flex items-center gap-2"
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
                        className="px-4 py-2 bg-gray-600 text-white rounded-md text-sm font-medium hover:bg-gray-700 transition-colors flex items-center gap-2"
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
                              <span className="text-gray-800 text-sm">: {currentUser.height || 'N/A'} </span>
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
                          <span className="text-gray-800 text-sm">: {currentUser.height || 'N/A'} </span>
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