import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  X,
  ChevronRight,
  ChevronLeft,
  Camera,
  User,
  Ruler,
  Cross,
  MapPin,
  Home,
  GraduationCap,
  Briefcase,
  Mail,
  Calendar,
  Heart,
  Utensils,
  Users,
  Building,
  DollarSign,
  Globe,
  Edit3,
  Phone,
  Lock,
} from "lucide-react";

const Inquiry = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    //step-1
    profileFor: "",
    firstName: "",
    lastName: "",
    dob: "",
    maritalStatus: "",
    //step-2
    gender: "",
    height: "",
    diet: "",
    //step-3
    religion: "",
    community: "",
    subCommunity: "",
    city: "",
    state: "",
    country: "",
    // step-4
    liveWithFamily: true,
    fatherName: "",
    motherName: "",
    familyMembers: "",
    // step-5
    highestQualification: "",
    collegeName: "",
    workDetails: "",
    workAs: "",
    currentCompany: "",
    income: "",
    // step-6
    languagesKnown: [],
    aboutYourself: "",
    email: "",
    mobile: "",
    password: "",
    // step-7 // Profile Image
    profileImage: null,
  });
  const [errors, setErrors] = useState({});
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  const religionOptions = [
    "Buddhist",
    "Christian",
    "Hindu",
    "Jain",
    "Jewish",
    "Muslim",
    "Others / No Religion",
    "Parsi / Zoroastrian",
    "Sikh",
  ];
  const communityOptions = [
    "Agarwal",
    "Ahmadiyya",
    "Arora Sikh",
    "Ashkenazi",
    "Baniya",
    "Baptist",
    "Bohra",
    "Brahmin",
    "Catholic",
    "Cochin Jews (India)",
    "Digambar",
    "Ezhava",
    "Gupta",
    "Irani",
    "Ismaili",
    "Jat",
    "Jat Sikh",
    "Kamma",
    "Khandelwal",
    "Khatri Sikh",
    "Khoja",
    "Konkani",
    "Kshatriya",
    "Kurmi",
    "Lingayat",
    "Lutheran",
    "Maheshwari",
    "Mahayana",
    "Maliki",
    "Maratha",
    "Methodist",
    "Nair",
    "Namboodiri",
    "Navayana (Dalit Buddhist)",
    "Orthodox",
    "Oswal",
    "Patel",
    "Parsi",
    "Pentecostal",
    "Protestant",
    "Rajput",
    "Reddy",
    "Saraswat",
    "Sephardic",
    "Shia",
    "Shwetambar",
    "Spiritual but not religious",
    "Sufi",
    "Sunni",
    "Syro Malabar",
    "Syro Malankara",
    "Theravada",
    "Vaishya",
    "Vokkaliga",
    "Yadav",
  ];
  const subCommunityOptions = [
    "Agarwal",
    "Ahluwalia",
    "Ahmadiyya",
    "Ashkenazi",
    "Baniya",
    "Baptist",
    "Dawoodi Bohra",
    "Gaur",
    "Gupta",
    "Hanafi",
    "Hanbali",
    "Ismaili",
    "Iyer",
    "Iyengar",
    "Jat",
    "Kamma",
    "Kanyakubj",
    "Khandelwal",
    "Khoja",
    "Konkani",
    "Kurmi",
    "Lingayat",
    "Lutheran",
    "Maheshwari",
    "Maithil",
    "Majhbi",
    "Malankara Orthodox",
    "Maliki",
    "Maratha",
    "Methodist",
    "Murtipujak",
    "Nair",
    "Namboodiri",
    "Oswal",
    "Patel",
    "Pentecostal",
    "Presbyterian",
    "Pure Land",
    "Rajput",
    "Ramgarhia",
    "Reddy",
    "Roman Catholic",
    "Saraswat",
    "Shafi",
    "Shwetambar",
    "Sthanakvasi",
    "Syrian Orthodox",
    "Syro Malabar",
    "Syro Malankara",
    "Terapanthi",
    "Tibetan",
    "Twelver (Ithna Ashari)",
    "Vokkaliga",
    "Yadav",
    "Zen",
  ];

  const steps = [
    {
      num: 1,
      title: "Personal Basics",
      desc: "Basic information about you",
      icon: User,
      fields: [
        { name: "profileFor", type: "select", options: ["Self", "Son", "Daughter", "Brother", "Sister", "Relative", "Friend"], required: true, label: "Profile For" },
        { name: "firstName", type: "text", required: true, label: "First Name" },
        { name: "lastName", type: "text", required: true, label: "Last Name" },
        { name: "dob", type: "date", required: true, label: "Date of Birth" },
        { name: "maritalStatus", type: "select", options: ["Never Married", "Divorced", "Widowed", "Separated"], required: true, label: "Marital Status" },
      ]
    },
    {
      num: 2,
      title: "Physical Details",
      desc: "Your physical attributes",
      icon: Ruler,
      fields: [
        { name: "gender", type: "radio", options: ["Male", "Female", "Other"], required: true, label: "Gender" },
        { name: "height", type: "height", required: true, label: "Height" },
        { name: "diet", type: "select", options: ["Vegetarian", "Non-Vegetarian", "Eggetarian", "Vegan", "Other"], required: false, label: "Diet" },
      ]
    },
    {
      num: 3,
      title: "Religion & Location",
      desc: "Your religious and location details",
      icon: Cross,
      fields: [
        { name: "religion", type: "select", options: religionOptions, required: true, label: "Religion" },
        { name: "community", type: "select", options: communityOptions, required: true, label: "Community" },
        { name: "subCommunity", type: "select", options: subCommunityOptions, required: false, label: "Sub Community" },
        { name: "city", type: "text", required: true, label: "City" },
        { name: "state", type: "text", required: true, label: "State" },
        { name: "country", type: "text", required: true, label: "Country" },
      ]
    },
    {
      num: 4,
      title: "Family Background",
      desc: "Tell us about your family",
      icon: Home,
      fields: [
        { name: "liveWithFamily", type: "checkbox", required: false, label: "Live With Family" },
        { name: "fatherName", type: "text", required: false, label: "Father's Name" },
        { name: "motherName", type: "text", required: false, label: "Mother's Name" },
        { name: "familyMembers", type: "number", required: false, label: "Number of Family Members" },
      ]
    },
    {
      num: 5,
      title: "Education & Career",
      desc: "Your education and professional background",
      icon: GraduationCap,
      fields: [
        { name: "highestQualification", type: "text", required: false, label: "Highest Qualification" },
        { name: "collegeName", type: "text", required: false, label: "College Name" },
        { name: "workDetails", type: "select", options: ["Private", "Government", "Business", "Self Employed", "Not Working"], required: false, label: "Work Details" },
        { name: "workAs", type: "text", required: false, label: "Work As" },
        { name: "currentCompany", type: "text", required: false, label: "Current Company" },
        { name: "income", type: "text", required: false, label: "Annual Income" },
      ]
    },
    {
      num: 6,
      title: "Additional Info & Contact",
      desc: "More about you and contact details",
      icon: Mail,
      fields: [
        { name: "languagesKnown", type: "languages", required: false, label: "Languages Known" },
        { name: "aboutYourself", type: "textarea", required: false, label: "About Yourself" },
        { name: "email", type: "email", required: true, label: "Email" },
        { name: "mobile", type: "tel", required: true, label: "Mobile" },
        { name: "password", type: "password", required: true, label: "Password" },
      ]
    },
    {
      num: 7,
      title: "Profile Photo",
      desc: "Upload your profile picture",
      icon: Camera,
      fields: [
        { name: "profileImage", type: "image", required: false, label: "Profile Photo" },
      ]
    },
  ];

  // Set default height when entering step 2
  useEffect(() => {
    if (currentStep === 2 && formData.height === "") {
      setFormData((prev) => ({ ...prev, height: "5'6\"" }));
    }
    // Reset errors when step changes
    setErrors({});
    setErrorMsg("");
    // Check if button should be enabled for new step
    checkButtonState();
  }, [currentStep]);

  // Check button state based on required fields
  const checkButtonState = () => {
    const step = steps[currentStep - 1];
    const hasAllRequired = step.fields.every((field) => {
      if (!field.required) return true;
      const value = formData[field.name];
      return value && value !== "" && !(Array.isArray(value) && value.length === 0);
    });
    setIsButtonDisabled(!hasAllRequired);
  };

  useEffect(() => {
    checkButtonState();
  }, [formData, currentStep]);

  const parseHeight = (heightStr) => {
    if (!heightStr) return [5, 6];
    const match = heightStr.match(/(\d+)['’](\d+)["”]/);
    return match ? [parseInt(match[1]), parseInt(match[2])] : [5, 6];
  };

  const getTotalInches = () => {
    const [feet, inches] = parseHeight(formData.height);
    return feet * 12 + inches;
  };

  const renderHeightField = (field) => {
    const totalInches = getTotalInches();
    const [feet, inches] = parseHeight(formData.height);
    const handleTotalInchesChange = (e) => {
      const value = parseInt(e.target.value);
      const newFeet = Math.floor(value / 12);
      const newInches = value % 12;
      const newHeight = `${newFeet}'${newInches}"`;
      setFormData((prev) => ({ ...prev, height: newHeight }));
      if (errors.height) {
        setErrors((prev) => ({ ...prev, height: "" }));
      }
    };
    return (
      <div className="flex flex-col">
        <label className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
          <Ruler size={16} className="text-gray-800" />
          {field.label} {field.required && <span className="text-red-600">*</span>}
        </label>
        <div className="relative w-full mb-4">
          <input
            type="range"
            min="48"
            max="95"
            step="1"
            value={totalInches}
            onChange={handleTotalInchesChange}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-red-600 relative z-10"
            style={{
              background: `linear-gradient(to right, #f87171 ${((totalInches - 48) / (95 - 48)) * 100}%, #e5e7eb ${((totalInches - 48) / (95 - 48)) * 100}%)`,
            }}
          />
          <div className="absolute bottom-0 left-0 right-0 flex justify-between px-2 text-xs text-gray-500 -mb-2">
            <span>4'0"</span>
            <span className="text-transparent">7'11"</span>
            <span>7'11"</span>
          </div>
        </div>
        <div className="text-center">
          <span className="text-2xl font-bold text-gray-900 tracking-wide">
            {feet}'
          </span>
          <span className="text-xl font-semibold text-gray-700">{inches}"</span>
        </div>
        {errors[field.name] && (
          <span className="text-xs text-red-600 mt-2 text-center">{errors[field.name]}</span>
        )}
      </div>
    );
  };

  const renderCheckboxField = (field) => (
    <div className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg">
      <input
        type="checkbox"
        name={field.name}
        checked={formData[field.name]}
        onChange={handleInputChange}
        className="w-4 h-4 rounded"
      />
      <label className="text-sm font-medium text-gray-700 cursor-pointer flex-1">{field.label}</label>
    </div>
  );

  const renderRadioField = (field) => (
    <div className="flex flex-col">
      <label className="text-sm font-medium text-gray-700 mb-4 flex items-center gap-2">
        <User size={16} className="text-gray-800" />
        {field.label} {field.required && <span className="text-red-600">*</span>}
      </label>
      {/* Images above radios */}
      <div className="h-16 mb-4 flex justify-around items-center">
        {field.options.map((option) => (
          <img
            key={`img-${option}`}
            src={
              option === "Male"
                ? "/men-avatar.png" // Replace with actual image path (e.g., local asset or URL)
                : option === "Female"
                ? "/girl-avatar.png"
                : "/other-avatar.png" // Or a neutral avatar
            }
            alt={`${option} avatar`}
            className="w-16 h-16 rounded-full object-cover border-2 border-gray-200 hover:border-red-500 transition-colors cursor-pointer"
            onClick={() => {
              // Optional: Click image to select radio
              const radio = document.querySelector(`input[name="${field.name}"][value="${option}"]`);
              if (radio) radio.click();
            }}
          />
        ))}
      </div>
      <div className="flex justify-around space-x-8">
        {field.options.map((option) => (
          <label key={option} className="flex items-center space-x-2 cursor-pointer">
            <input
              type="radio"
              name={field.name}
              value={option}
              checked={formData[field.name] === option}
              onChange={handleInputChange}
              className="w-4 h-4 text-red-600 bg-gray-100 border-gray-300 focus:ring-red-500"
            />
            <span className="text-sm text-gray-700">{option}</span>
          </label>
        ))}
      </div>
      {errors[field.name] && (
        <span className="text-xs text-red-600 mt-2">{errors[field.name]}</span>
      )}
    </div>
  );

  const renderLanguagesField = (field) => (
    <div className="flex flex-col">
      <label className="text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-2">
        <Globe size={16} className="text-gray-800" />
        {field.label} {field.required && <span className="text-red-600">*</span>}
      </label>
      <input
        type="text"
        value={formData.languagesKnown.join(", ")}
        onChange={handleLanguageChange}
        placeholder="e.g., Hindi, English, Marathi"
        className={`px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-900/20 ${errors[field.name] ? "border-red-500" : "border-gray-300"}`}
      />
      {errors[field.name] && <span className="text-xs text-red-600 mt-1">{errors[field.name]}</span>}
    </div>
  );

  const renderTextareaField = (field) => (
    <div className="flex flex-col">
      <label className="text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-2">
        <Edit3 size={16} className="text-gray-800" />
        {field.label} {field.required && <span className="text-red-600">*</span>}
      </label>
      <textarea
        name={field.name}
        value={formData[field.name]}
        onChange={handleInputChange}
        rows="4"
        placeholder={`Tell us about your ${field.label.toLowerCase()}...`}
        className={`px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-900/20 resize-none ${errors[field.name] ? "border-red-500" : "border-gray-300"}`}
      />
      {errors[field.name] && <span className="text-xs text-red-600 mt-1">{errors[field.name]}</span>}
    </div>
  );

  const renderImageField = (field) => (
    <div className="flex flex-col items-center justify-center p-8 md:col-span-2">
      {!imagePreview ? (
        <label className="w-full cursor-pointer">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-red-900 transition-colors">
            <Camera
              size={48}
              className="mx-auto mb-4 text-gray-400"
            />
            <p className="text-lg font-medium text-gray-700 mb-2">
              Upload Profile Photo
            </p>
            <p className="text-sm text-gray-500 mb-4">
              Click to browse or drag and drop
            </p>
            <p className="text-xs text-gray-400">
              JPG, PNG or WEBP (Max 5MB)
            </p>
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
            className="w-64 h-64 object-cover rounded-lg border-4 border-red-900/20"
          />
          <button
            onClick={handleRemoveImage}
            type="button"
            className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-2 hover:bg-red-700"
          >
            <X size={16} />
          </button>
          <p className="text-center mt-4 text-sm text-gray-600 break-all px-2">
            {formData.profileImage?.name}
          </p>
        </div>
      )}
      {errors[field.name] && (
        <span className="text-sm text-red-600 mt-2">
          {errors[field.name]}
        </span>
      )}
    </div>
  );

  const renderField = (field) => {
    const Icon = getFieldIcon(field.name);
    switch (field.type) {
      case 'radio':
        return renderRadioField(field);
      case 'height':
        return renderHeightField(field);
      case 'checkbox':
        return renderCheckboxField(field);
      case 'languages':
        return renderLanguagesField(field);
      case 'textarea':
        return renderTextareaField(field);
      case 'image':
        return renderImageField(field);
      case 'select':
        return (
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-2">
              <Icon size={16} className="text-gray-800" />
              {field.label} {field.required && <span className="text-red-600">*</span>}
            </label>
            <select
              name={field.name}
              value={formData[field.name]}
              onChange={handleInputChange}
              className={`px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-900/20 ${
                errors[field.name] ? "border-red-500" : "border-gray-300"
              }`}
            >
              <option value="">Select {field.label}</option>
              {field.options.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
            {errors[field.name] && (
              <span className="text-xs text-red-600 mt-1">{errors[field.name]}</span>
            )}
          </div>
        );
      default:
        return (
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-2">
              <Icon size={16} className="text-gray-800" />
              {field.label} {field.required && <span className="text-red-600">*</span>}
            </label>
            <input
              type={field.type}
              name={field.name}
              value={formData[field.name]}
              onChange={handleInputChange}
              placeholder={field.label}
              className={`px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-900/20 ${
                errors[field.name] ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors[field.name] && (
              <span className="text-xs text-red-600 mt-1">{errors[field.name]}</span>
            )}
          </div>
        );
    }
  };

  const getFieldIcon = (name) => {
    const iconMap = {
      profileFor: User,
      firstName: User,
      lastName: User,
      dob: Calendar,
      maritalStatus: Heart,
      gender: User,
      height: Ruler,
      diet: Utensils,
      religion: Cross,
      community: Users,
      subCommunity: Users,
      city: MapPin,
      state: MapPin,
      country: MapPin,
      liveWithFamily: Home,
      fatherName: User,
      motherName: User,
      familyMembers: Users,
      highestQualification: GraduationCap,
      collegeName: GraduationCap,
      workDetails: Briefcase,
      workAs: Briefcase,
      currentCompany: Building,
      income: DollarSign,
      languagesKnown: Globe,
      aboutYourself: Edit3,
      email: Mail,
      mobile: Phone,
      password: Lock,
      profileImage: Camera,
    };
    return iconMap[name] || User; // Default to User
  };

  const renderCurrentStep = () => {
    const step = steps[currentStep - 1];
    let fieldsRender = step.fields.map((field, index) => (
      <div key={index} className={getLayoutClass(step.num, index)}>
        {renderField(field)}
      </div>
    ));
    if (step.num === 3) {
      // Special handling for location fields in 3 columns
      const religionCommunity = [
        <div key={0} className={getLayoutClass(3, 0)}>{renderField(step.fields[0])}</div>,
        <div key={1} className={getLayoutClass(3, 1)}>{renderField(step.fields[1])}</div>,
      ];
      const subCommunity = <div key={2} className={getLayoutClass(3, 2)}>{renderField(step.fields[2])}</div>;
      const locationGrid = (
        <div key="location" className="md:col-span-2">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {step.fields.slice(3).map((field, locIndex) => (
              <div key={locIndex}>{renderField(field)}</div>
            ))}
          </div>
        </div>
      );
      fieldsRender = [...religionCommunity, subCommunity, locationGrid];
    }
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {fieldsRender}
        </div>
      </div>
    );
  };

  const getLayoutClass = (stepNum, index) => {
    let className = '';
    switch (stepNum) {
      case 1:
        if (index === 0) className = 'md:col-span-2'; // profileFor full
        // names and dob/marital half by default
        break;
      case 2:
        className = 'md:col-span-2'; // all full
        break;
      case 3:
        if (index === 2) className = 'md:col-span-2'; // subCommunity full
        break;
      case 4:
        if (index === 0 || index === 3) className = 'md:col-span-2'; // checkbox and family members full
        // father mother half
        break;
      case 5:
        // all pairs half
        break;
      case 6:
        if (index === 0 || index === 1 || index === 4) className = 'md:col-span-2'; // languages, about, password full
        // email mobile half
        break;
      case 7:
        className = 'md:col-span-2'; // image full
        break;
      default:
        break;
    }
    return className;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleLanguageChange = (e) => {
    const value = e.target.value;
    const languages = value
      .split(",")
      .map((lang) => lang.trim())
      .filter((lang) => lang);
    setFormData((prev) => ({ ...prev, languagesKnown: languages }));
    if (errors.languagesKnown) {
      setErrors((prev) => ({ ...prev, languagesKnown: "" }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
      if (!validTypes.includes(file.type)) {
        setErrors((prev) => ({
          ...prev,
          profileImage: "Please upload a valid image (JPG, PNG, WEBP)",
        }));
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          profileImage: "Image size should be less than 5MB",
        }));
        return;
      }
      setFormData((prev) => ({ ...prev, profileImage: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
      if (errors.profileImage) {
        setErrors((prev) => ({ ...prev, profileImage: "" }));
      }
    }
  };

  const handleRemoveImage = () => {
    setFormData((prev) => ({ ...prev, profileImage: null }));
    setImagePreview(null);
    if (errors.profileImage) {
      setErrors((prev) => ({ ...prev, profileImage: "" }));
    }
  };

  const validateStep = (stepNum) => {
    const step = steps[stepNum - 1];
    const newErrors = {};
    step.fields.forEach((field) => {
      const value = formData[field.name];
      if (field.required && (!value || value === "" || (Array.isArray(value) && value.length === 0))) {
        newErrors[field.name] = `${field.label} is required`;
      } else if (field.name === 'email' && value && !/\S+@\S+\.\S+/.test(value)) {
        newErrors.email = "Invalid email address";
      } else if (field.name === 'mobile' && value && !/^\d{10}$/.test(value)) {
        newErrors.mobile = "Mobile number must be 10 digits";
      } else if (field.name === 'password' && value && value.length < 6) {
        newErrors.password = "Password must be at least 6 characters";
      } else if (field.name === 'dob' && value) {
        const dob = new Date(value);
        const today = new Date();
        let age = today.getFullYear() - dob.getFullYear();
        const monthDiff = today.getMonth() - dob.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
          age--;
        }
        if (age < 18) {
          newErrors.dob = "You must be at least 18 years old";
        }
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = () => {
    setErrorMsg("");
    if (validateStep(currentStep)) {
      if (currentStep < steps.length) {
        setCurrentStep((prev) => prev + 1);
      } else {
        handleSubmit();
      }
    } else {
      setErrorMsg("Please fill all required fields in this step.");
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
      Object.keys(formData).forEach((key) => {
        if (key === "profileImage" && formData[key]) {
          formDataToSend.append(
            "profileImage",
            formData[key],
            formData[key].name
          );
        } else if (key === "languagesKnown") {
          formDataToSend.append(key, JSON.stringify(formData[key]));
        } else if (
          formData[key] !== null &&
          formData[key] !== "" &&
          formData[key] !== undefined
        ) {
          formDataToSend.append(key, formData[key]);
        }
      });
      console.log("Form Data being sent:");
      for (let pair of formDataToSend.entries()) {
        console.log(pair[0], pair[1]);
      }
      const apiUrl = `${import.meta.env.VITE_BACKEND_URL}/api/signup`;
      console.log("Calling API:", apiUrl);
      const res = await fetch(apiUrl, {
        method: "POST",
        body: formDataToSend,
      });
      if (!res.ok) {
        let errorMessage = "Server error";
        try {
          const errorData = await res.json();
          errorMessage =
            errorData.message ||
            errorData.error ||
            `Server error: ${res.status}`;
          console.error("Server response:", errorData);
        } catch (e) {
          const errorText = await res.text();
          console.error("Server response (text):", errorText);
          errorMessage = errorText || `Server error: ${res.status}`;
        }
        throw new Error(errorMessage);
      }
      const data = await res.json();
      setSuccessMsg(data.message || "Profile created successfully!");
      setErrorMsg("");
      console.log("Signup successful:", data);
      // Redirect to dashboard after showing success message briefly
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (err) {
      const errorMessage =
        err.message || "Something went wrong. Please try again.";
      setErrorMsg(errorMessage);
      setSuccessMsg("");
      console.error("Signup error details:", err);
      if (errorMessage.includes("Failed to fetch")) {
        setErrorMsg(
          "Cannot connect to server. Please check if backend is running."
        );
      }
    }
  };

  const currentStepData = steps[currentStep - 1];
  return (
    <div className="h-screen bg-gradient-to-br from-red-900/30 via-gray-200 to-red-800/20 flex items-center justify-center p-2 sm:p-4 relative overflow-hidden">
      {/* Background blur circles */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-red-500/40 rounded-full blur-3xl animate-pulse"></div>
      <div
        className="absolute bottom-20 right-10 w-96 h-96 bg-red-600/30 rounded-full blur-3xl animate-pulse"
        style={{ animationDelay: "1s" }}
      ></div>
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-400/25 rounded-full blur-3xl animate-pulse"
        style={{ animationDelay: "2s" }}
      ></div>
      <div className="absolute top-10 right-1/4 w-64 h-64 bg-orange-400/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-10 left-1/4 w-72 h-72 bg-red-700/25 rounded-full blur-3xl"></div>
      <div className="w-full bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl overflow-hidden max-w-4xl relative z-10 h-full flex flex-col">
        {/* Content */}
        <div className="flex-1 p-6 sm:p-8 lg:p-10 relative overflow-y-auto">
          <button
            onClick={() => window.history.back()}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 z-10"
          >
            <X size={20} className="w-5 h-5" />
          </button>
          {/* Success/Error Message UI */}
          {(successMsg || errorMsg) && (
            <div
              className={`mb-6 px-4 py-3 rounded-lg text-center font-semibold transition-all text-sm ${
                successMsg
                  ? "bg-green-100 text-green-800 border border-green-300"
                  : "bg-red-100 text-red-800 border border-red-300"
              }`}
            >
              {successMsg || errorMsg}
            </div>
          )}
          {/* Main Heading */}
          <div className="text-center mb-8">
            <Heart size={48} className="mx-auto mb-4 text-red-600" />
            <h1 className="text-3xl font-bold text-gray-900">Create Your Profile</h1>
          </div>
          <div className="mb-6">
            <p className="text-sm text-gray-500 mb-2">Step {currentStep} of {steps.length}</p>
          </div>
          {renderCurrentStep()}
        </div>
        {/* Footer Buttons */}
        <div className="p-6 sm:p-8 border-t border-gray-200">
          <div className="flex items-center justify-between gap-3">
            <button
              onClick={handleBack}
              disabled={currentStep === 1}
              className={`flex items-center gap-2 px-6 py-2.5 border border-gray-300 rounded-lg text-base ${
                currentStep === 1
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              <ChevronLeft size={20} />
              <span>Back</span>
            </button>
            <button
              type="button"
              onClick={handleContinue}
              disabled={isButtonDisabled}
              className={`flex items-center gap-2 px-8 py-2.5 rounded-lg text-base disabled:opacity-50 disabled:cursor-not-allowed transition-all ${
                isButtonDisabled
                  ? "bg-gray-300 text-gray-500"
                  : "bg-red-900 text-white hover:bg-red-800"
              }`}
            >
              {currentStep === steps.length ? "Submit" : "Continue"}
              {currentStep < steps.length && <ChevronRight size={20} />}
            </button>
          </div>
          <p className="text-center text-xs text-gray-500 mt-6">
            Your information is secure and encrypted
          </p>
        </div>
      </div>
    </div>
  );
};

export default Inquiry;