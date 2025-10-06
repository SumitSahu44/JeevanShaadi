import React, { useState } from 'react';
import { X, User, Phone, Users, Briefcase, ChevronRight, ChevronLeft, Camera } from 'lucide-react';

const Inquiry = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Profile For
    profileFor: '',
    
    // Personal Details
    firstName: '',
    lastName: '',
    gender: '',
    dob: '',
    maritalStatus: '',
    height: '',
    diet: '',
    
    // Religion & Community
    religion: '',
    community: '',
    subCommunity: '',
    
    // Location
    livingIn: '',
    city: '',
    state: '',
    country: '',
    
    // Family Background
    liveWithFamily: true,
    fatherName: '',
    motherName: '',
    familyMembers: '',
    
    // Education & Career
    highestQualification: '',
    collegeName: '',
    workDetails: '',
    workAs: '',
    currentCompany: '',
    income: '',
    
    // Languages & Other
    languagesKnown: [],
    aboutYourself: '',
    
    // Profile Image
    profileImage: null,
    
    // Contact
    email: '',
    mobile: '',
    password: ''
  });

  const [errors, setErrors] = useState({});
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [imagePreview, setImagePreview] = useState(null);

  const steps = [
    { num: 1, title: 'Personal Details', desc: 'Basic information about you', icon: User },
    { num: 2, title: 'Contact Information', desc: 'How can we reach you', icon: Phone },
    { num: 3, title: 'Family & Career', desc: 'Tell us about your background', icon: Users },
    { num: 4, title: 'Profile Photo', desc: 'Upload your profile picture', icon: Camera }
  ];

  const religionOptions = [
    'Buddhist',
    'Christian',
    'Hindu',
    'Jain',
    'Jewish',
    'Muslim',
    'Others / No Religion',
    'Parsi / Zoroastrian',
    'Sikh'
  ];

  const communityOptions = [
    'Agarwal', 'Ahmadiyya', 'Arora Sikh', 'Ashkenazi', 'Baniya', 'Baptist', 'Bohra', 'Brahmin',
    'Catholic', 'Cochin Jews (India)', 'Digambar', 'Ezhava', 'Gupta', 'Irani', 'Ismaili', 'Jat',
    'Jat Sikh', 'Kamma', 'Khandelwal', 'Khatri Sikh', 'Khoja', 'Konkani', 'Kshatriya', 'Kurmi',
    'Lingayat', 'Lutheran', 'Maheshwari', 'Mahayana', 'Maliki', 'Maratha', 'Methodist', 'Nair',
    'Namboodiri', 'Navayana (Dalit Buddhist)', 'Orthodox', 'Oswal', 'Patel', 'Parsi', 'Pentecostal',
    'Protestant', 'Rajput', 'Reddy', 'Saraswat', 'Sephardic', 'Shia', 'Shwetambar',
    'Spiritual but not religious', 'Sufi', 'Sunni', 'Syro Malabar', 'Syro Malankara', 'Theravada',
    'Vaishya', 'Vokkaliga', 'Yadav'
  ];

  const subCommunityOptions = [
    'Agarwal', 'Ahluwalia', 'Ahmadiyya', 'Ashkenazi', 'Baniya', 'Baptist', 'Dawoodi Bohra', 'Gaur',
    'Gupta', 'Hanafi', 'Hanbali', 'Ismaili', 'Iyer', 'Iyengar', 'Jat', 'Kamma', 'Kanyakubj',
    'Khandelwal', 'Khoja', 'Konkani', 'Kurmi', 'Lingayat', 'Lutheran', 'Maheshwari', 'Maithil',
    'Majhbi', 'Malankara Orthodox', 'Maliki', 'Maratha', 'Methodist', 'Murtipujak', 'Nair',
    'Namboodiri', 'Oswal', 'Patel', 'Pentecostal', 'Presbyterian', 'Pure Land', 'Rajput',
    'Ramgarhia', 'Reddy', 'Roman Catholic', 'Saraswat', 'Shafi', 'Shwetambar', 'Sthanakvasi',
    'Syrian Orthodox', 'Syro Malabar', 'Syro Malankara', 'Terapanthi', 'Tibetan',
    'Twelver (Ithna Ashari)', 'Vokkaliga', 'Yadav', 'Zen'
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        setErrors(prev => ({ ...prev, profileImage: 'Please upload a valid image (JPG, PNG, WEBP)' }));
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, profileImage: 'Image size should be less than 5MB' }));
        return;
      }

      setFormData(prev => ({ ...prev, profileImage: file }));
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
      
      if (errors.profileImage) {
        setErrors(prev => ({ ...prev, profileImage: '' }));
      }
    }
  };

  const handleRemoveImage = () => {
    setFormData(prev => ({ ...prev, profileImage: null }));
    setImagePreview(null);
  };

  const handleLanguageChange = (e) => {
    const value = e.target.value;
    const languages = value.split(',').map(lang => lang.trim()).filter(lang => lang);
    setFormData(prev => ({ ...prev, languagesKnown: languages }));
  };

  const validateStep = (step) => {
    const newErrors = {};
    
    if (step === 1) {
      if (!formData.profileFor) newErrors.profileFor = 'Required';
      if (!formData.firstName) newErrors.firstName = 'Required';
      if (!formData.lastName) newErrors.lastName = 'Required';
      if (!formData.gender) newErrors.gender = 'Required';
      if (!formData.dob) newErrors.dob = 'Required';
      if (!formData.maritalStatus) newErrors.maritalStatus = 'Required';
      if (!formData.religion) newErrors.religion = 'Required';
      if (!formData.community) newErrors.community = 'Required';
      if (!formData.city) newErrors.city = 'Required';
      if (!formData.state) newErrors.state = 'Required';
    }
    
    if (step === 2) {
      if (!formData.email) newErrors.email = 'Required';
      else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email';
      if (!formData.mobile) newErrors.mobile = 'Required';
      else if (!/^\d{10}$/.test(formData.mobile)) newErrors.mobile = 'Invalid mobile';
      if (!formData.password) newErrors.password = 'Required';
      else if (formData.password.length < 6) newErrors.password = 'Min 6 characters';
    }

    if (step === 4) {
      if (!formData.profileImage) newErrors.profileImage = 'Please upload a profile photo';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = () => {
    if (validateStep(currentStep)) {
      if (currentStep < 4) {
        setCurrentStep(prev => prev + 1);
      } else {
        handleSubmit();
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    try {
      const formDataToSend = new FormData();
      
      Object.keys(formData).forEach(key => {
        if (key === 'profileImage' && formData[key]) {
          formDataToSend.append('profileImage', formData[key], formData[key].name);
        } else if (key === 'languagesKnown') {
          formDataToSend.append(key, JSON.stringify(formData[key]));
        } else if (formData[key] !== null && formData[key] !== '' && formData[key] !== undefined) {
          formDataToSend.append(key, formData[key]);
        }
      });

      console.log('Form Data being sent:');
      for (let pair of formDataToSend.entries()) {
        console.log(pair[0], pair[1]);
      }

      const res = await fetch('http://localhost:4000/api/signup', {
        method: 'POST',
        body: formDataToSend,
      });

      if (!res.ok) {
        let errorMessage = 'Server error';
        try {
          const errorData = await res.json();
          errorMessage = errorData.message || errorData.error || `Server error: ${res.status}`;
          console.error('Server response:', errorData);
        } catch (e) {
          const errorText = await res.text();
          console.error('Server response (text):', errorText);
          errorMessage = errorText || `Server error: ${res.status}`;
        }
        throw new Error(errorMessage);
      }

      const data = await res.json();
      
      setSuccessMsg(data.message || "Profile created successfully!");
      setErrorMsg("");
      console.log('Signup successful:', data);
      
      setTimeout(() => {
        alert('Profile created successfully!');
      }, 1500);
      
    } catch (err) {
      const errorMessage = err.message || "Something went wrong. Please try again.";
      setErrorMsg(errorMessage);
      setSuccessMsg("");
      console.error('Signup error details:', err);
      
      if (errorMessage.includes('Failed to fetch')) {
        setErrorMsg('Cannot connect to server. Please check if backend is running.');
      }
    }
  };

  const renderField = (label, name, type = 'text', options = null, required = false) => {
    if (type === 'select') {
      return (
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700 mb-1.5">
            {label} {required && <span className="text-red-600">*</span>}
          </label>
          <select
            name={name}
            value={formData[name]}
            onChange={handleInputChange}
            className={`px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-900/20 ${
              errors[name] ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">Select {label}</option>
            {options.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
          {errors[name] && <span className="text-xs text-red-600 mt-1">{errors[name]}</span>}
        </div>
      );
    }

    return (
      <div className="flex flex-col">
        <label className="text-sm font-medium text-gray-700 mb-1.5">
          {label} {required && <span className="text-red-600">*</span>}
        </label>
        <input
          type={type}
          name={name}
          value={formData[name]}
          onChange={handleInputChange}
          placeholder={label}
          className={`px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-900/20 ${
            errors[name] ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errors[name] && <span className="text-xs text-red-600 mt-1">{errors[name]}</span>}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-900/30 via-gray-200 to-red-800/20 flex items-center justify-center p-2 sm:p-4 relative overflow-hidden">
      {/* Background blur circles */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-red-500/40 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-red-600/30 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-400/25 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
      <div className="absolute top-10 right-1/4 w-64 h-64 bg-orange-400/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-10 left-1/4 w-72 h-72 bg-red-700/25 rounded-full blur-3xl"></div>
      
      <div className="flex flex-col lg:flex-row bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl overflow-hidden max-w-5xl w-full relative z-10">
        {/* Left Sidebar */}
        <div className="w-full lg:w-2/5 bg-gradient-to-b from-red-900 to-red-800 p-6 sm:p-8 text-white">
          <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8">Create Your Profile</h1>
          
          <div className="space-y-3 sm:space-y-4">
            {steps.map((step) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.num}
                  className={`flex items-start gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg transition-all ${
                    currentStep === step.num
                      ? 'bg-white/20 border-2 border-white/40'
                      : 'bg-white/5 border-2 border-transparent'
                  }`}
                >
                  <div className={`p-1.5 sm:p-2 rounded-lg flex-shrink-0 ${
                    currentStep === step.num ? 'bg-white text-red-900' : 'bg-white/10'
                  }`}>
                    <Icon size={18} className="sm:w-5 sm:h-5" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-sm sm:text-base truncate">{step.title}</h3>
                    <p className="text-xs sm:text-sm text-white/80 line-clamp-1">{step.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-8 sm:mt-12 flex items-center gap-2 text-xs sm:text-sm">
            <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full border-2 border-white flex items-center justify-center flex-shrink-0">
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full"></div>
            </div>
            <span>Your data is 100% secure</span>
          </div>
        </div>

        {/* Right Content */}
        <div className="w-full lg:w-3/5 p-4 sm:p-6 lg:p-8 relative">
          <button 
            onClick={() => window.history.back()}
            className="absolute top-2 right-2 sm:top-4 sm:right-4 text-gray-400 hover:text-gray-600 z-10"
          >
            <X size={20} className="sm:w-6 sm:h-6" />
          </button>

          {/* Success/Error Message UI */}
          {(successMsg || errorMsg) && (
            <div className={`mb-3 sm:mb-4 px-3 sm:px-4 py-2 sm:py-3 rounded-lg text-center font-semibold transition-all text-sm sm:text-base ${
              successMsg
                ? "bg-green-100 text-green-800 border border-green-300"
                : "bg-red-100 text-red-800 border border-red-300"
            }`}>
              {successMsg || errorMsg}
            </div>
          )}

          <div className="mb-4 sm:mb-6">
            <p className="text-xs sm:text-sm text-gray-500 mb-1 sm:mb-2">Step {currentStep} of 4</p>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">
              {steps[currentStep - 1].title}
            </h2>
            <p className="text-sm sm:text-base text-gray-600">{steps[currentStep - 1].desc}</p>
          </div>

          <div className="overflow-y-auto max-h-[400px] sm:max-h-96 pr-1 sm:pr-2">
            {/* Step 1: Personal Details */}
            {currentStep === 1 && (
              <div className="space-y-3 sm:space-y-4">
                {renderField('Profile For', 'profileFor', 'select', ['Self', 'Son', 'Daughter', 'Brother', 'Sister', 'Relative', 'Friend'], true)}
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  {renderField('First Name', 'firstName', 'text', null, true)}
                  {renderField('Last Name', 'lastName', 'text', null, true)}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  {renderField('Date of Birth', 'dob', 'date', null, true)}
                  {renderField('Gender', 'gender', 'select', ['Male', 'Female', 'Other'], true)}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  {renderField('Marital Status', 'maritalStatus', 'select', ['Never Married', 'Divorced', 'Widowed', 'Separated'], true)}
                  {renderField('Height', 'height', 'text', null, true)}
                </div>

                {renderField('Diet', 'diet', 'select', ['Vegetarian', 'Non-Vegetarian', 'Eggetarian', 'Vegan', 'Other'], false)}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  {renderField('Religion', 'religion', 'select', religionOptions, true)}
                  {renderField('Community', 'community', 'select', communityOptions, true)}
                </div>

                {renderField('Sub Community', 'subCommunity', 'select', subCommunityOptions, false)}

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                  {renderField('City', 'city', 'text', null, true)}
                  {renderField('State', 'state', 'text', null, true)}
                  {renderField('country', 'country', 'text', null, true)}
                </div>
              </div>
            )}

            {/* Step 2: Contact Information */}
            {currentStep === 2 && (
              <div className="space-y-3 sm:space-y-4">
                {renderField('Email', 'email', 'email', null, true)}
                {renderField('Mobile', 'mobile', 'tel', null, true)}
                {renderField('Password', 'password', 'password', null, true)}
              </div>
            )}

            {/* Step 3: Family Background & Education */}
            {currentStep === 3 && (
              <div className="space-y-3 sm:space-y-4">
                <h3 className="font-semibold text-base sm:text-lg text-gray-800 mt-2">Family Background</h3>
                
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    name="liveWithFamily"
                    checked={formData.liveWithFamily}
                    onChange={handleInputChange}
                    className="w-4 h-4"
                  />
                  <label className="text-sm font-medium text-gray-700">Live With Family</label>
                </div>

                {renderField("Father's Name", 'fatherName', 'text', null, false)}
                {renderField("Mother's Name", 'motherName', 'text', null, false)}
                {renderField('Number of Family Members', 'familyMembers', 'number', null, false)}

                <h3 className="font-semibold text-base sm:text-lg text-gray-800 mt-6">Education & Career</h3>
                
                {renderField('Highest Qualification', 'highestQualification', 'text', null, false)}
                {renderField('College Name', 'collegeName', 'text', null, false)}
                {renderField('Work Details', 'workDetails', 'select', ['Private', 'Government', 'Business', 'Self Employed', 'Not Working'], false)}
                {renderField('Work As', 'workAs', 'text', null, false)}
                {renderField('Current Company', 'currentCompany', 'text', null, false)}
                {renderField('Annual Income', 'income', 'text', null, false)}
                
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-700 mb-1.5">
                    Languages Known (comma separated)
                  </label>
                  <input
                    type="text"
                    value={formData.languagesKnown.join(', ')}
                    onChange={handleLanguageChange}
                    placeholder="e.g., Hindi, English, Marathi"
                    className="px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-900/20"
                  />
                </div>

                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-700 mb-1.5">
                    About Yourself
                  </label>
                  <textarea
                    name="aboutYourself"
                    value={formData.aboutYourself}
                    onChange={handleInputChange}
                    rows="4"
                    placeholder="Tell us about yourself..."
                    className="px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-900/20"
                  />
                </div>
              </div>
            )}

            {/* Step 4: Profile Photo */}
            {currentStep === 4 && (
              <div className="space-y-3 sm:space-y-4">
                <div className="flex flex-col items-center justify-center p-4 sm:p-8">
                  {!imagePreview ? (
                    <label className="w-full cursor-pointer">
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 sm:p-8 text-center hover:border-red-900 transition-colors">
                        <Camera size={36} className="sm:w-12 sm:h-12 mx-auto mb-3 sm:mb-4 text-gray-400" />
                        <p className="text-base sm:text-lg font-medium text-gray-700 mb-1 sm:mb-2">Upload Profile Photo</p>
                        <p className="text-xs sm:text-sm text-gray-500 mb-2 sm:mb-4">Click to browse or drag and drop</p>
                        <p className="text-xs text-gray-400">JPG, PNG or WEBP (Max 5MB)</p>
                        <input
                          type="file"
                          accept="image/jpeg,image/jpg,image/png,image/webp"
                          onChange={handleImageChange}
                          className="hidden"
                        />
                      </div>
                    </label>
                  ) : (
                    <div className="relative">
                      <img
                        src={imagePreview}
                        alt="Profile preview"
                        className="w-48 h-48 sm:w-64 sm:h-64 object-cover rounded-lg border-4 border-red-900/20"
                      />
                      <button
                        onClick={handleRemoveImage}
                        type="button"
                        className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1.5 sm:p-2 hover:bg-red-700"
                      >
                        <X size={16} className="sm:w-5 sm:h-5" />
                      </button>
                      <p className="text-center mt-3 sm:mt-4 text-xs sm:text-sm text-gray-600 break-all px-2">
                        {formData.profileImage?.name}
                      </p>
                    </div>
                  )}
                  {errors.profileImage && (
                    <span className="text-xs sm:text-sm text-red-600 mt-2">{errors.profileImage}</span>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Footer Buttons */}
          <div className="mt-6 sm:mt-8 flex items-center justify-between gap-3">
            <button
              onClick={handleBack}
              disabled={currentStep === 1}
              className={`flex items-center gap-1.5 sm:gap-2 px-4 sm:px-6 py-2 sm:py-2.5 border border-gray-300 rounded-lg text-sm sm:text-base ${
                currentStep === 1
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <ChevronLeft size={18} className="sm:w-5 sm:h-5" />
              <span className="hidden sm:inline">Back</span>
            </button>

            <button
              type="button"
              onClick={handleContinue}
              className="flex items-center gap-1.5 sm:gap-2 px-6 sm:px-8 py-2 sm:py-2.5 bg-red-900 text-white rounded-lg hover:bg-red-800 text-sm sm:text-base"
            >
              {currentStep === 4 ? 'Submit' : 'Continue'}
              {currentStep < 4 && <ChevronRight size={18} className="sm:w-5 sm:h-5" />}
            </button>
          </div>

          <p className="text-center text-xs text-gray-500 mt-4 sm:mt-6">
            Your information is secure and encrypted
          </p>
        </div>
      </div>
    </div>
  );
};

export default Inquiry;