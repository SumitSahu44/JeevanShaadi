import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Cake, Ruler, GraduationCap, Briefcase, Heart, Mail, Phone, User, Settings, MessageCircle, ChevronLeft, Upload, Save, X, Camera } from 'lucide-react';

const EditProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
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
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  const PLACEHOLDER_IMAGE = 'https://t4.ftcdn.net/jpg/05/42/36/11/360_F_542361185_VFRJWpR2FH5OiAEVveWO7oZnfSccZfD3.jpg';

  useEffect(() => {
    fetchProfile();
  }, [id]);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('You are not logged in');

      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/profile/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || 'Failed to fetch profile');
      }

      const userProfile = await response.json();

      if (userProfile._id !== id) {
        throw new Error('Unauthorized: You can only edit your own profile');
      }

      setCurrentUser(userProfile);

      setFormData({
        Name: userProfile.Name || '',
        gender: userProfile.gender || '',
        dob: userProfile.dob ? new Date(userProfile.dob).toISOString().split('T')[0] : '',
        age: userProfile.age || '',
        height: userProfile.height || '',
        maritalStatus: userProfile.maritalStatus || '',
        profileFor: userProfile.profileFor || '',
        religion: userProfile.religion || '',
        community: userProfile.community || '',
        subCommunity: userProfile.subCommunity || '',
        noCasteBar: userProfile.noCasteBar || false,
        city: userProfile.city || '',
        state: userProfile.state || '',
        country: userProfile.country || 'India',
        livingIn: userProfile.livingIn || '',
        diet: userProfile.diet || '',
        weight: userProfile.weight || '',
        education: userProfile.education || '',
        highestQualification: userProfile.highestQualification || '',
        occupation: userProfile.workDetails || '',
        workingWith: userProfile.workingWith || '',
        workAs: userProfile.workDetails || '',
        income: userProfile.income || '',
        motherTongue: userProfile.motherTongue || '',
        about: userProfile.aboutYourself || '',
        familyBackground: userProfile.familyBackground || '',
        liveWithFamily: userProfile.liveWithFamily || false,
        motherName: userProfile.motherName || '',
        fatherName: userProfile.fatherName || '',
        mobile: userProfile.mobile || '',
        email: userProfile.email || '',
      });

      if (userProfile.profile?.photos?.[0]?.data) {
        const bytes = new Uint8Array(userProfile.profile.photos[0].data.data);
        let binary = '';
        bytes.forEach(b => binary += String.fromCharCode(b));
        setImagePreview(`data:${userProfile.profile.photos[0].contentType};base64,${btoa(binary)}`);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const submitData = new FormData();

      Object.entries(formData).forEach(([key, value]) => {
        submitData.append(key, value);
      });

      if (imageFile) {
        submitData.append('profileImage', imageFile);
      }

      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/profile`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: submitData,
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || 'Update failed');
      }

      alert('Profile updated!');
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const formatDate = (dob) => {
    if (!dob) return '';
    const date = new Date(dob);
    const day = date.getDate().toString().padStart(2, '0');
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();
    return `${day} ${month}, ${year}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-neutral-50">
        <div className="text-center">
          <div className="relative w-14 h-14 mx-auto mb-4">
            <div className="absolute inset-0 border-[3px] border-neutral-200 rounded-full"></div>
            <div className="absolute inset-0 border-[3px] border-neutral-800 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-neutral-600 font-medium">Loading profile</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-neutral-50 px-4">
        <div className="text-center bg-white p-8 rounded-lg border border-neutral-200 max-w-md w-full">
          <div className="w-14 h-14 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <X className="w-7 h-7 text-neutral-700" />
          </div>
          <h3 className="text-lg font-semibold text-neutral-900 mb-2">Something went wrong</h3>
          <p className="text-neutral-600 mb-6">{error}</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-5 py-2.5 bg-neutral-900 text-white rounded-lg font-medium hover:bg-neutral-800 transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <button
            onClick={() => navigate('/dashboard')}
            className="inline-flex items-center gap-2 text-neutral-600 hover:text-neutral-900 mb-6 transition-colors group"
          >
            <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Back</span>
          </button>
          
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-neutral-900 tracking-tight">Edit Profile</h1>
              <p className="text-neutral-600 mt-1.5">Update your personal information</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white border border-neutral-200 rounded-lg overflow-hidden sticky top-6">
              <div className="p-8">
                <div className="relative w-36 h-36 mx-auto mb-6 group">
                  <div className="w-full h-full rounded-full overflow-hidden border-2 border-neutral-200 bg-neutral-100">
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <User className="w-16 h-16 text-neutral-400" />
                      </div>
                    )}
                  </div>
                  <div className="absolute inset-0  bg-opacity-0 group-hover:bg-opacity-20 rounded-full transition-all flex items-center justify-center">
                    <Camera className="w-7 h-7 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>

                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  id="profile-image"
                />
                
                <label
                  htmlFor="profile-image"
                  className="flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-neutral-50 hover:bg-neutral-100 text-neutral-700 border border-neutral-200 rounded-lg cursor-pointer transition-colors font-medium"
                >
                  <Upload className="w-4 h-4" />
                  Change Photo
                </label>
                
                <p className="text-xs text-neutral-500 text-center mt-3">
                  JPG, PNG or GIF • Max 5MB
                </p>
              </div>

              <div className="border-t border-neutral-200 p-6">
                <h3 className="text-sm font-semibold text-neutral-900 mb-4">Quick Info</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center flex-shrink-0">
                      <User className="w-4 h-4 text-neutral-600" />
                    </div>
                    <div>
                      <p className="text-neutral-500 text-xs">Name</p>
                      <p className="text-neutral-900 font-medium">{formData.Name || 'Not set'}</p>
                    </div>
                  </div>
                  {/* <div className="flex items-center gap-3 text-sm">
                    <div className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center flex-shrink-0">
                      <Cake className="w-4 h-4 text-neutral-600" />
                    </div>
                    <div>
                      <p className="text-neutral-500 text-xs">Age</p>
                      <p className="text-neutral-900 font-medium">{formData.age ? `${formData.age} years` : 'Not set'}</p>
                    </div>
                  </div> */}
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-4 h-4 text-neutral-600" />
                    </div>
                    <div>
                      <p className="text-neutral-500 text-xs">Location</p>
                      <p className="text-neutral-900 font-medium">
                        {formData.city || formData.state ? `${formData.city || ''}${formData.city && formData.state ? ', ' : ''}${formData.state || ''}` : 'Not set'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center flex-shrink-0">
                      <Briefcase className="w-4 h-4 text-neutral-600" />
                    </div>
                    <div>
                      <p className="text-neutral-500 text-xs">Occupation</p>
                      <p className="text-neutral-900 font-medium">{formData.occupation || 'Not set'}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t border-neutral-200 p-6">
                <h3 className="text-sm font-semibold text-neutral-900 mb-3">Profile Completion</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-neutral-600 mb-1">
                    <span>Progress</span>
                    <span>{Math.round((Object.values(formData).filter(v => v !== '' && v !== false).length / Object.keys(formData).length) * 100)}%</span>
                  </div>
                  <div className="w-full bg-neutral-100 rounded-full h-2">
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
            </div>
          </div>

          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white border border-neutral-200 rounded-lg overflow-hidden">
              <div className="border-b border-neutral-200 px-6 py-4">
                <h2 className="text-lg font-semibold text-neutral-900 flex items-center gap-2.5">
                  <User className="w-5 h-5 text-neutral-600" />
                  Basic Information
                </h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1.5">Full Name</label>
                    <input
                      type="text"
                      name="Name"
                      value={formData.Name}
                      onChange={handleInputChange}
                      className="w-full px-3.5 py-2.5 border border-neutral-300 rounded-lg focus:outline-none focus:border-neutral-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1.5">Gender</label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleInputChange}
                      className="w-full px-3.5 py-2.5 border border-neutral-300 rounded-lg focus:outline-none focus:border-neutral-500 transition-colors"
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1.5">Date of Birth</label>
                    <input
                      type="date"
                      name="dob"
                      value={formData.dob}
                      onChange={handleInputChange}
                      className="w-full px-3.5 py-2.5 border border-neutral-300 rounded-lg focus:outline-none focus:border-neutral-500 transition-colors"
                    />
                    {formData.dob && (
                      <p className="text-sm text-neutral-500 mt-1.5">{formatDate(formData.dob)}</p>
                    )}
                  </div>
                  {/* <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1.5">Age</label>
                    <input
                      type="number"
                      name="age"
                      value={formData.age}
                      onChange={handleInputChange}
                      className="w-full px-3.5 py-2.5 border border-neutral-300 rounded-lg focus:outline-none focus:border-neutral-500 transition-colors"
                    />
                  </div> */}
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1.5">Height (cm)</label>
                    <input
                      type="number"
                      name="height"
                      value={formData.height}
                      onChange={handleInputChange}
                      placeholder="e.g., 170"
                      className="w-full px-3.5 py-2.5 border border-neutral-300 rounded-lg focus:outline-none focus:border-neutral-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1.5">Weight (kg)</label>
                    <input
                      type="number"
                      name="weight"
                      value={formData.weight}
                      onChange={handleInputChange}
                      placeholder="e.g., 60"
                      className="w-full px-3.5 py-2.5 border border-neutral-300 rounded-lg focus:outline-none focus:border-neutral-500 transition-colors"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white border border-neutral-200 rounded-lg overflow-hidden">
              <div className="border-b border-neutral-200 px-6 py-4">
                <h2 className="text-lg font-semibold text-neutral-900 flex items-center gap-2.5">
                  <Phone className="w-5 h-5 text-neutral-600" />
                  Contact Details
                </h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1.5">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-3.5 py-2.5 border border-neutral-300 rounded-lg focus:outline-none focus:border-neutral-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1.5">Mobile Number</label>
                    <input
                      type="tel"
                      name="mobile"
                      value={formData.mobile}
                      onChange={handleInputChange}
                      className="w-full px-3.5 py-2.5 border border-neutral-300 rounded-lg focus:outline-none focus:border-neutral-500 transition-colors"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white border border-neutral-200 rounded-lg overflow-hidden">
              <div className="border-b border-neutral-200 px-6 py-4">
                <h2 className="text-lg font-semibold text-neutral-900 flex items-center gap-2.5">
                  <MapPin className="w-5 h-5 text-neutral-600" />
                  Location
                </h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1.5">City</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      placeholder="e.g., Mumbai"
                      className="w-full px-3.5 py-2.5 border border-neutral-300 rounded-lg focus:outline-none focus:border-neutral-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1.5">State</label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      placeholder="e.g., Maharashtra"
                      className="w-full px-3.5 py-2.5 border border-neutral-300 rounded-lg focus:outline-none focus:border-neutral-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1.5">Country</label>
                    <input
                      type="text"
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      className="w-full px-3.5 py-2.5 border border-neutral-300 rounded-lg focus:outline-none focus:border-neutral-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1.5">Living In</label>
                    <input
                      type="text"
                      name="livingIn"
                      value={formData.livingIn}
                      onChange={handleInputChange}
                      placeholder="e.g., India"
                      className="w-full px-3.5 py-2.5 border border-neutral-300 rounded-lg focus:outline-none focus:border-neutral-500 transition-colors"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-neutral-700 mb-1.5">Profile For</label>
                    <select
                      name="profileFor"
                      value={formData.profileFor}
                      onChange={handleInputChange}
                      className="w-full px-3.5 py-2.5 border border-neutral-300 rounded-lg focus:outline-none focus:border-neutral-500 transition-colors"
                    >
                      <option value="">Select</option>
                      <option value="Self">Self</option>
                      <option value="Son">Son</option>
                      <option value="Daughter">Daughter</option>
                      <option value="Brother">Brother</option>
                      <option value="Sister">Sister</option>
                      <option value="Relative">Relative</option>
                      <option value="Friend">Friend</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white border border-neutral-200 rounded-lg overflow-hidden">
              <div className="border-b border-neutral-200 px-6 py-4">
                <h2 className="text-lg font-semibold text-neutral-900 flex items-center gap-2.5">
                  <Heart className="w-5 h-5 text-neutral-600" />
                  Religious & Family
                </h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1.5">Religion</label>
                    <input
                      type="text"
                      name="religion"
                      value={formData.religion}
                      onChange={handleInputChange}
                      placeholder="e.g., Hindu"
                      className="w-full px-3.5 py-2.5 border border-neutral-300 rounded-lg focus:outline-none focus:border-neutral-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1.5">Community</label>
                    <input
                      type="text"
                      name="community"
                      value={formData.community}
                      onChange={handleInputChange}
                      placeholder="e.g., Brahmin"
                      className="w-full px-3.5 py-2.5 border border-neutral-300 rounded-lg focus:outline-none focus:border-neutral-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1.5">Sub Community</label>
                    <input
                      type="text"
                      name="subCommunity"
                      value={formData.subCommunity}
                      onChange={handleInputChange}
                      placeholder="e.g., Iyengar"
                      className="w-full px-3.5 py-2.5 border border-neutral-300 rounded-lg focus:outline-none focus:border-neutral-500 transition-colors"
                    />
                  </div>
                  <div className="flex items-end pb-2">
                    <label className="flex items-center gap-2.5 cursor-pointer">
                      <input
                        type="checkbox"
                        name="noCasteBar"
                        checked={formData.noCasteBar}
                        onChange={handleInputChange}
                        className="w-4 h-4 rounded border-neutral-300 text-neutral-900 focus:ring-neutral-500"
                      />
                      <span className="text-sm font-medium text-neutral-700">No Caste Bar</span>
                    </label>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1.5">Mother's Name</label>
                    <input
                      type="text"
                      name="motherName"
                      value={formData.motherName}
                      onChange={handleInputChange}
                      className="w-full px-3.5 py-2.5 border border-neutral-300 rounded-lg focus:outline-none focus:border-neutral-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1.5">Father's Name</label>
                    <input
                      type="text"
                      name="fatherName"
                      value={formData.fatherName}
                      onChange={handleInputChange}
                      className="w-full px-3.5 py-2.5 border border-neutral-300 rounded-lg focus:outline-none focus:border-neutral-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1.5">Family Background</label>
                    <input
                      type="text"
                      name="familyBackground"
                      value={formData.familyBackground}
                      onChange={handleInputChange}
                      placeholder="e.g., Middle Class"
                      className="w-full px-3.5 py-2.5 border border-neutral-300 rounded-lg focus:outline-none focus:border-neutral-500 transition-colors"
                    />
                  </div>
                  <div className="flex items-end pb-2">
                    <label className="flex items-center gap-2.5 cursor-pointer">
                      <input
                        type="checkbox"
                        name="liveWithFamily"
                        checked={formData.liveWithFamily}
                        onChange={handleInputChange}
                        className="w-4 h-4 rounded border-neutral-300 text-neutral-900 focus:ring-neutral-500"
                      />
                      <span className="text-sm font-medium text-neutral-700">Live with Family</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white border border-neutral-200 rounded-lg overflow-hidden">
              <div className="border-b border-neutral-200 px-6 py-4">
                <h2 className="text-lg font-semibold text-neutral-900 flex items-center gap-2.5">
                  <Cake className="w-5 h-5 text-neutral-600" />
                  Lifestyle
                </h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1.5">Diet Preference</label>
                    <select
                      name="diet"
                      value={formData.diet}
                      onChange={handleInputChange}
                      className="w-full px-3.5 py-2.5 border border-neutral-300 rounded-lg focus:outline-none focus:border-neutral-500 transition-colors"
                    >
                      <option value="">Select Diet</option>
                      <option value="Vegetarian">Vegetarian</option>
                      <option value="Non-Vegetarian">Non-Vegetarian</option>
                      <option value="Eggetarian">Eggetarian</option>
                      <option value="Vegan">Vegan</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1.5">Mother Tongue</label>
                    <input
                      type="text"
                      name="motherTongue"
                      value={formData.motherTongue}
                      onChange={handleInputChange}
                      placeholder="e.g., Hindi"
                      className="w-full px-3.5 py-2.5 border border-neutral-300 rounded-lg focus:outline-none focus:border-neutral-500 transition-colors"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white border border-neutral-200 rounded-lg overflow-hidden">
              <div className="border-b border-neutral-200 px-6 py-4">
                <h2 className="text-lg font-semibold text-neutral-900 flex items-center gap-2.5">
                  <GraduationCap className="w-5 h-5 text-neutral-600" />
                  Education & Career
                </h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1.5">Education</label>
                    <input
                      type="text"
                      name="education"
                      value={formData.education}
                      onChange={handleInputChange}
                      placeholder="e.g., Graduate"
                      className="w-full px-3.5 py-2.5 border border-neutral-300 rounded-lg focus:outline-none focus:border-neutral-500 transition-colors"
                    />
                  </div> */}
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1.5">Highest Qualification</label>
                    <input
                      type="text"
                      name="highestQualification"
                      value={formData.highestQualification}
                      onChange={handleInputChange}
                      placeholder="e.g., B.Tech"
                      className="w-full px-3.5 py-2.5 border border-neutral-300 rounded-lg focus:outline-none focus:border-neutral-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1.5">Occupation</label>
                    <input
                      type="text"
                      name="occupation"
                      value={formData.occupation}
                      onChange={handleInputChange}
                      placeholder="e.g., Software Engineer"
                      className="w-full px-3.5 py-2.5 border border-neutral-300 rounded-lg focus:outline-none focus:border-neutral-500 transition-colors"
                    />
                  </div>
                  {/* <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1.5">Working With</label>
                    <select
                      name="workingWith"
                      value={formData.workingWith}
                      onChange={handleInputChange}
                      className="w-full px-3.5 py-2.5 border border-neutral-300 rounded-lg focus:outline-none focus:border-neutral-500 transition-colors"
                    >
                      <option value="">Select</option>
                      <option value="Private Company">Private Company</option>
                      <option value="Government">Government</option>
                      <option value="Business">Business</option>
                      <option value="Self Employed">Self Employed</option>
                      <option value="Not Working">Not Working</option>
                    </select>
                  </div> */}
                  {/* <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1.5">Working As</label>
                    <input
                      type="text"
                      name="workAs"
                      value={formData.workAs}
                      onChange={handleInputChange}
                      placeholder="e.g., Developer"
                      className="w-full px-3.5 py-2.5 border border-neutral-300 rounded-lg focus:outline-none focus:border-neutral-500 transition-colors"
                    />
                  </div> */}
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1.5">Annual Income</label>
                    <input
                      type="text"
                      name="income"
                      value={formData.income}
                      onChange={handleInputChange}
                      placeholder="e.g., 5 LPA"
                      className="w-full px-3.5 py-2.5 border border-neutral-300 rounded-lg focus:outline-none focus:border-neutral-500 transition-colors"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white border border-neutral-200 rounded-lg overflow-hidden">
              <div className="border-b border-neutral-200 px-6 py-4">
                <h2 className="text-lg font-semibold text-neutral-900 flex items-center gap-2.5">
                  <MessageCircle className="w-5 h-5 text-neutral-600" />
                  About Me
                </h2>
              </div>
              <div className="p-6">
                <textarea
                  name="about"
                  value={formData.about}
                  onChange={handleInputChange}
                  rows={5}
                  placeholder="Tell us about yourself, your interests, and what you're looking for..."
                  className="w-full px-3.5 py-2.5 border border-neutral-300 rounded-lg focus:outline-none focus:border-neutral-500 transition-colors resize-none"
                />
              </div>
            </div>

            <div className="bg-white border border-neutral-200 rounded-lg overflow-hidden">
              <div className="p-6">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="w-full flex items-center justify-center gap-2.5 px-6 py-3.5 bg-green-800 text-white rounded-lg font-semibold hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {saving ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Saving Changes
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="fixed bottom-6 right-6 max-w-md bg-white rounded-lg border border-neutral-200 p-5 shadow-lg animate-slide-up">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-neutral-100 rounded-full flex items-center justify-center flex-shrink-0">
                <X className="w-5 h-5 text-neutral-700" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-neutral-900 mb-1">Error</h3>
                <p className="text-neutral-600 text-sm">{error}</p>
              </div>
              <button
                onClick={() => setError(null)}
                className="text-neutral-400 hover:text-neutral-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EditProfile;