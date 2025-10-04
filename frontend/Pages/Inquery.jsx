import React, { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify'; // <-- Add this line
import 'react-toastify/dist/ReactToastify.css'; // <-- Add this line
import { X, User, Phone, Users, Briefcase, ChevronRight, ChevronLeft } from 'lucide-react';

const baseUrl = import.meta.env.VITE_BACKEND_URL;

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
    Country: '', // Make sure Country field exists
    
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
    
    // Contact
    email: '',
    mobile: '',
    password: ''
  });

  const [errors, setErrors] = useState({});
  const [successMsg, setSuccessMsg] = useState(""); // <-- Add this line
  const [errorMsg, setErrorMsg] = useState("");     // <-- Add this line

  const steps = [
    { num: 1, title: 'Personal Details', desc: 'Basic information about you', icon: User },
    { num: 2, title: 'Contact Information', desc: 'How can we reach you', icon: Phone },
    { num: 3, title: 'Family Background', desc: 'Tell us about your family', icon: Users },
    { num: 4, title: 'Education & Career', desc: 'Your professional details', icon: Briefcase }
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
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
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
    
    // Step 3 and 4 are optional fields, no validation needed
    
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
    const res = await axios.post(`http://localhost:4000/api/signup`, formData, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    setSuccessMsg(res.data.message || "Profile created successfully!");
    setErrorMsg("");
    toast.success(res.data.message || "Signup successful!"); // <-- Show toast on success
  } catch (err) {
    setErrorMsg(err.response?.data?.message || "Something went wrong");
    setSuccessMsg("");
    toast.error(err.response?.data?.message || "Signup failed!"); // <-- Show toast on error
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
    <div className="min-h-screen bg-gradient-to-br from-red-900/30 via-gray-200 to-red-800/20 flex items-center justify-center p-4">
      <div className="flex bg-white rounded-2xl shadow-2xl overflow-hidden max-w-5xl w-full">
        {/* Left Sidebar */}
        <div className="w-2/5 bg-gradient-to-b from-red-900 to-red-800 p-8 text-white">
          <h1 className="text-3xl font-bold mb-8">Create Your Profile</h1>
          
          <div className="space-y-4">
            {steps.map((step) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.num}
                  className={`flex items-start gap-4 p-4 rounded-lg transition-all ${
                    currentStep === step.num
                      ? 'bg-white/20 border-2 border-white/40'
                      : 'bg-white/5 border-2 border-transparent'
                  }`}
                >
                  <div className={`p-2 rounded-lg ${
                    currentStep === step.num ? 'bg-white text-red-900' : 'bg-white/10'
                  }`}>
                    <Icon size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold">{step.title}</h3>
                    <p className="text-sm text-white/80">{step.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-12 flex items-center gap-2 text-sm">
            <div className="w-5 h-5 rounded-full border-2 border-white flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full"></div>
            </div>
            <span>Your data is 100% secure</span>
          </div>
        </div>

        {/* Right Content */}
        <div className="w-3/5 p-8 relative">
          <button 
            onClick={() => window.history.back()}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          >
            <X size={24} />
          </button>

          {/* Success/Error Message UI */}
          {(successMsg || errorMsg) && (
            <div className={`mb-4 px-4 py-3 rounded-lg text-center font-semibold transition-all ${
              successMsg
                ? "bg-green-100 text-green-800 border border-green-300"
                : "bg-red-100 text-red-800 border border-red-300"
            }`}>
              {successMsg || errorMsg}
            </div>
          )}

          <div className="mb-6">
            <p className="text-sm text-gray-500 mb-2">Step {currentStep} of 4</p>
            <h2 className="text-2xl font-bold text-gray-900 mb-1">{steps[currentStep - 1].title}</h2>
            <p className="text-gray-600">{steps[currentStep - 1].desc}</p>
          </div>

          <div className="overflow-y-auto max-h-96 pr-2">
            {/* Step 1: Personal Details */}
            {currentStep === 1 && (
              <div className="space-y-4">
                {renderField('Profile For', 'profileFor', 'select', ['Self', 'Son', 'Daughter', 'Brother', 'Sister', 'Relative', 'Friend'], true)}
                
                <div className="grid grid-cols-2 gap-4">
                  {renderField('First Name', 'firstName', 'text', null, true)}
                  {renderField('Last Name', 'lastName', 'text', null, true)}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {renderField('Date of Birth', 'dob', 'date', null, true)}
                  {renderField('Gender', 'gender', 'select', ['Male', 'Female', 'Other'], true)}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {renderField('Marital Status', 'maritalStatus', 'select', ['Never Married', 'Divorced', 'Widowed', 'Separated'], true)}
                  {renderField('Height', 'height', 'text', null, true)}
                </div>

                {renderField('Diet', 'diet', 'select', ['Vegetarian', 'Non-Vegetarian', 'Eggetarian', 'Vegan', 'Other'], false)}

                <div className="grid grid-cols-2 gap-4">
                  {renderField('Religion', 'religion', 'select', religionOptions, true)}
                  {renderField('Community', 'community', 'select', communityOptions, true)}
                </div>

                {renderField('Sub Community', 'subCommunity', 'select', subCommunityOptions, false)}

                <div className="grid grid-cols-3 gap-4">
                  {renderField('City', 'city', 'text', null, true)}
                  {renderField('State', 'state', 'text', null, true)}
                  {renderField('Country', 'Country', 'text', null, true)}
                </div>
              </div>
            )}

            {/* Step 2: Contact Information */}
            {currentStep === 2 && (
              <div className="space-y-4">
                {renderField('Email', 'email', 'email', null, true)}
                {renderField('Mobile', 'mobile', 'tel', null, true)}
                {renderField('Password', 'password', 'password', null, true)}
              </div>
            )}

            {/* Step 3: Family Background */}
            {currentStep === 3 && (
              <div className="space-y-4">
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
              </div>
            )}

            {/* Step 4: Education & Career */}
            {currentStep === 4 && (
              <div className="space-y-4">
                {renderField('Highest Qualification', 'highestQualification', 'text', null, true)}
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
          </div>

          {/* Footer Buttons */}
          <div className="mt-8 flex items-center justify-between">
            <button
              onClick={handleBack}
              disabled={currentStep === 1}
              className={`flex items-center gap-2 px-6 py-2.5 border border-gray-300 rounded-lg ${
                currentStep === 1
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <ChevronLeft size={20} />
              Back
            </button>

            <button
              type="button"
              onClick={handleContinue}
              className="flex items-center gap-2 px-8 py-2.5 bg-red-900 text-white rounded-lg hover:bg-red-800"
            >
              {currentStep === 4 ? 'Submit' : 'Continue'}
              {currentStep < 4 && <ChevronRight size={20} />}
            </button>
          </div>

          <p className="text-center text-xs text-gray-500 mt-6">
            Your information is secure and encrypted
          </p>
        </div>
      </div>
      <ToastContainer position="top-center" autoClose={3000} /> {/* <-- Add this line */}
    </div>
  );
};

export default Inquiry;