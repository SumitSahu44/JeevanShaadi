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
    Name: "",
    dob: "",
    maritalStatus: "",
    //step-2
    gender: "",
    height: "",
    weight: "",
    diet: "",
    //step-3
    religion: "",
    community: "",
    subCommunity: "",
    noCasteBar: false,
    state: "",
    city: "",
    country: "",
    // step-4
    liveWithFamily: true,
    familyBackground: "",
    // step-5
    highestQualification: "",
    workDetails: "",
    income: "",
    // step-6
    motherTongue: "",
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

  // Geo data states
  const [states] = useState([
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
  ]);
  const [filteredCities, setFilteredCities] = useState([]);

  const citiesByState = {
    AP: ["Visakhapatnam", "Vijayawada", "Guntur", "Nellore", "Tirupati", "Kurnool", "Rajahmundry", "Kadapa"],
    AR: ["Itanagar", "Pasighat", "Ziro", "Naharlagun"],
    AS: ["Guwahati", "Dibrugarh", "Silchar", "Jorhat", "Tezpur", "Tinsukia"],
    BR: ["Patna", "Gaya", "Bhagalpur", "Muzaffarpur", "Darbhanga", "Purnia"],
    CT: ["Raipur", "Bilaspur", "Durg", "Korba", "Bhilai", "Raigarh"],
    GA: ["Panaji", "Vasco da Gama", "Mapusa", "Margao", "Ponda"],
    GJ: ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Jamnagar", "Bhavnagar", "Gandhinagar"],
    HR: ["Gurgaon", "Faridabad", "Panipat", "Ambala", "Hisar", "Rohtak"],
    HP: ["Shimla", "Mandi", "Solan", "Kangra", "Kullu", "Dharamshala"],
    JH: ["Ranchi", "Jamshedpur", "Dhanbad", "Bokaro Steel City", "Deoghar"],
    KA: ["Bengaluru", "Mysuru", "Hubli-Dharwad", "Mangaluru", "Belagavi", "Davanagere"],
    KL: ["Thiruvananthapuram", "Kochi", "Kozhikode", "Thrissur", "Kollam", "Kannur"],
    MP: ["Bhopal", "Indore", "Jabalpur", "Gwalior", "Ujjain", "Sagar"],
    MH: ["Mumbai", "Pune", "Nagpur", "Thane", "Nashik", "Aurangabad"],
    MN: ["Imphal", "Churachandpur", "Thoubal"],
    ML: ["Shillong", "Tura", "Jowai"],
    MZ: ["Aizawl", "Lunglei", "Serchhip"],
    NL: ["Kohima", "Dimapur", "Mokokchung"],
    OR: ["Bhubaneswar", "Cuttack", "Rourkela", "Brahmapur", "Sambalpur"],
    PB: ["Amritsar", "Ludhiana", "Jalandhar", "Patiala", "Bathinda"],
    RJ: ["Jaipur", "Jodhpur", "Udaipur", "Kota", "Ajmer", "Bikaner"],
    SK: ["Gangtok", "Namchi", "Gyalshing"],
    TN: ["Chennai", "Coimbatore", "Madurai", "Tiruchirappalli", "Salem", "Erode"],
    TS: ["Hyderabad", "Warangal", "Nizamabad", "Karimnagar", "Khammam"],
    TR: ["Agartala", "Udaipur", "Dharmanagar"],
    UP: ["Lucknow", "Kanpur", "Ghaziabad", "Agra", "Varanasi", "Meerut"],
    UK: ["Dehradun", "Haridwar", "Roorkee", "Haldwani", "Rudrapur"],
    WB: ["Kolkata", "Howrah", "Asansol", "Siliguri", "Durgapur"],
    AN: ["Port Blair"],
    CH: ["Chandigarh"],
    DN: ["Daman", "Silvassa", "Dadra"],
    DL: ["New Delhi"],
    JK: ["Srinagar", "Jammu", "Anantnag", "Baramulla"],
    LA: ["Leh", "Kargil"],
    LD: ["Kavaratti"],
    PY: ["Puducherry", "Karaikal", "Mahe", "Yanam"],
  };

  const heightOptions = (() => {
    const options = [];
    for (let feet = 4; feet <= 7; feet++) {
      for (let inches = 0; inches <= 11; inches++) {
        options.push(`${feet}'${inches}"`);
      }
    }
    options.push("8'0\"");
    return options;
  })();

  const weightOptions = (() => {
    const options = [];
    for (let i = 40; i <= 120; i += 5) {
      options.push(`${i}-${i + 4} kg`);
    }
    options.push(">120 kg");
    return options;
  })();

  const incomeOptions = [
    "<1 Lakh",
    "1-3 Lakh",
    "3-5 Lakh",
    "5-10 Lakh",
    "10-20 Lakh",
    ">20 Lakh"
  ];

  const motherTongueOptions = [
    "Hindi",
    "Bengali",
    "Telugu",
    "Marathi",
    "Tamil",
    "Urdu",
    "Gujarati",
    "Kannada",
    "Odia",
    "Malayalam",
    "Punjabi",
    "Assamese",
    "Maithili",
    "Other"
  ];

  const qualificationOptions = [
    "Less than 10th",
    "10th Pass",
    "12th Pass",
    "Diploma",
    "Graduate",
    "Post Graduate",
    "PhD",
    "Other"
  ];

  const religionOptions = [
    "Buddhist",
    "Christian",
    "Hindu",
    "Inter Religion",
    "Jain",
    "Jewish",
    "Muslim",
    "Muslim - Shia",
    "Muslim - Sunni",
    "Parsi ",
    "Sikh",
    "Others",
  ];

  // Dynamic mappings for religion -> communities -> subCommunities
  const religionCommunityMap = {
    "Hindu": {
      communities: [
        "Ad dharmi", "Adi Andhra", "Adi Dravida", "Adi Karnataka", "Agamudayar", "Agarwal", "Agnikula Kshatriya", "Agri",
        "Ahirwar", "Ahom", "Ambalavasi", "Arora", "Arunthathiyar", "Arya Vysya", "Badhai", "Baidya", "Bairwa",
        "Baishnab", "Baishya", "Balai", "Balija", "Balija Naidu", "Banik", "Baniya", "Banjara", "Bari", "Barujibi",
        "Besta", "Bhandari", "Bhatia", "Bhatia", "Bhatnagar", "Bhatraju", "Bhavasar Kshatriya", "Bhovi", "Billava",
        "Bishnoi/Vaishnoi", "Boyer", "Brahmbatt", "Brahmin", "Brahmin - Adi gaur", "Brahmin - Anavil", "Brahmin - Audichya",
        "Brahmin - Barendra", "Brahmin - Bhargava", "Brahmin - Bhatt", "Brahmin - Bhumihar", "Brahmin - Dadheechi",
        "Brahmin - Daivadnya", "Brahmin - Danua", "Brahmin - Deshastha", "Brahmin - Dhiman", "Brahmin - Dravida",
        "Brahmin - Garhwali", "Brahmin - Gaur", "Brahmin - Gaur Saraswat", "Brahmin - Goswami", "Brahmin - Gurjargour",
        "Brahmin - Gurukkal", "Brahmin - Halua", "Brahmin - Havyaka", "Brahmin - Hoysala", "Brahmin - Iyengar",
        "Brahmin - Iyer", "Brahmin - Jangid", "Brahmin - Jhadua", "Brahmin - Jijhoutiya", "Brahmin - Kanyakubj",
        "Brahmin - Karhade", "Brahmin - Kokanastha", "Brahmin - Kota", "Brahmin - Kulin", "Brahmin - Kumoani",
        "Brahmin - Madhwa", "Brahmin - Maithil", "Brahmin - Modh", "Brahmin - Mohyal", "Brahmin - Nagar",
        "Brahmin - Namboodiri", "Brahmin - Narmadiya", "Brahmin - Niyogi", "Brahmin - Paliwal", "Brahmin - Panda",
        "Brahmin - Pandit", "Brahmin - Pushkarna", "Brahmin - Rarhi", "Brahmin - Rigvedi", "Brahmin - Rudraj",
        "Brahmin - Sakaldwipi", "Brahmin - Sanadya", "Brahmin - Sanketi", "Brahmin - Saraswat", "Brahmin - Saryuparin",
        "Brahmin - Shivhalli", "Brahmin - Shri Gaur", "Brahmin - Shrimali", "Brahmin - Smartha", "Brahmin - Sri Vishnava",
        "Brahmin - Stanika", "Brahmin - Tyagi", "Brahmin - Vaidiki", "Brahmin - Vyas", "Brahmin -Kasmiri pandit",
        "Brahmin –Andra", "Brahmin –Bracharararam", "Brahmin –Jangara", "Brahmin –Jogi", "Brahmin –Kannada",
        "Brahmin –Rudraj", "Brahmin –Utkal", "Brahmin –Vishwa", "Brahmin –Yajurvedi", "Brahmin-6000 Niyogi",
        "Brahmo", "Chamar", "Chambhar", "Chandravanshi Kahar", "Chasa", "Chattada Sri Vaishnava", "Chaudary",
        "Chaurasia", "Chettiar", "Chhetri", "CKP", "Coorgi", "Devadiga", "Devandra Kula Vellalar", "Devang Koshthi",
        "Devanga", "Dhangar", "Dhanuk", "Dheevara", "Dhiman", "Dhiwar", "Dhoba", "Dhobi", "Dom", "Dumar", "Ediga",
        "Ezhava", "Ezhuthachan", "Gabit", "Gandla", "Ganiga", "Garhwali", "Garmani", "Gavali", "Gavara", "Ghumar",
        "Goala", "Goan", "Gomantak Maratha", "Gondhali", "Goud", "Gounder", "Gowda", "Gudia", "Gupta", "Gurjar",
        "Jaiswal", "Jangam", "Jat", "Jatav", "Jhariya", "Kadava Patel", "Kahar", "Kaibarta", "Kalar", "Kalinga",
        "Kalita", "Kalwar", "Kamboj", "Kamma", "Kanaujia", "Kansari", "kapol", "Kapu", "Karana", "Karmakar",
        "Karuneegar", "Kasar", "Kashyap", "Katiya", "Kayastha", "Kewat", "Khandayat", "Khandelwal", "Khashap Rajpoot",
        "Khatik", "Khatri", "Kirar Dhakad", "Koli", "Kongu Vellala Gounder", "Konkani", "Kori", "Kostha", "Kosthi",
        "Kshatriya", "Kudumbi", "Kulal", "Kulalar", "Kulita", "Kumbhakar", "Kumbhar", "Kumhar", "Kummari", "Kunbi",
        "Kureel", "Kurmi", "Kurmi Kshatriya", "Kuruba", "Kuruhina Shetty", "Kurumbar", "Kushwaha", "Kutchi",
        "Kutchi Gurjar", "Lambadi", "Leva patel", "Leva Patidar", "Leva patil", "Lingayath", "Lodhi", "Lodhi Rajput",
        "Lohana", "Lubana", "Luhar", "Madiga", "Mahajan", "Mahar", "Mahendra", "Maheshwari", "Mahishya", "Majabi",
        "Majhi", "Mala", "Mali", "Malla", "Mallah", "Mangalorean", "Manipuri", "Mapila", "Maratha", "Maruthuvar",
        "Marwari", "Matang", "Mathur", "Meena", "Meenavar", "Meghwal", "Mehra", "Meru Darji", "Mochi", "Modak",
        "Mogaveera", "Mourya", "Mudaliyar", "Mudiraj", "Mukkulathor", "Munnuru Kapu", "Muthuraja", "Nadar", "Nai",
        "Naicker", "Naidu", "Naik", "Nair", "Namdeo", "Namdeo Darji", "Namosudra", "Napit", "Nayaka", "Nema",
        "Nepali", "Nhavi", "Nishad", "Oswal", "Padmasali", "Pal", "Panchal", "Panicker", "Parkava Kulam", "Pasi",
        "Patel", "Patnaick", "Patra", "Patwa", "Pawar", "Pillai", "Porwal", "Pradhan", "Prajapati", "Raghuvanshi",
        "Raiger", "Raikwar", "Rajak", "Rajastani", "Rajbonshi", "Rajput", "Rajput -Negi", "Rajput- Kumouni",
        "Rajput- Rohella/Tank", "Rajput-Gharwali", "Ramdasia", "Ramgariah", "Ravidasia", "Rawat", "Reddy", "Rengar",
        "Sadgope", "Saha", "Sahu", "Saini", "Saliya", "Satnami", "Saubar Banik", "SC", "Sen", "Senai Thalaivar",
        "Settibalija", "Shetty", "Shimpi", "Sindhi", "Sindhi-Amil", "Sindhi-Baibhand", "Sindhi-Bhanusali",
        "Sindhi-Bhatia", "Sindhi-Chhapru", "Sindhi-Dadu", "Sindhi-Hyderabadi", "Sindhi-Larai", "Sindhi-Larkana",
        "Sindhi-Lohana", "Sindhi-Rohiri", "Sindhi-Sahiti", "Sindhi-Sakkhar", "Sindhi-Sehwani", "Sindhi-Shikarpuri",
        "Sindhi-Thatai", "SKP", "Somvanshi", "Somvanshi Kayastha", "Sonar", "Soni", "Sourashtra", "Sozhiya Vellalar",
        "Srisayani", "ST", "Sundhi", "Suthar", "Swakula Sali", "Tamboli", "Tanti", "Tantubai", "Telaga", "Teli",
        "Thakkar", "Thakur", "Thevar/Mukkala", "Thigala", "Thiyya", "Tili", "Turupu Kapu", "Uppara", "Vaddera",
        "Vaidiki Velangelu", "Vaish", "Vaishnav", "Vaishnava", "Vaishya", "Vaishya Vani", "Valluvar", "Valmiki",
        "Vania", "Vaniya", "Vanjara", "Vanjari", "Vankar", "Vannar", "Vannia Kula Kshatriyar", "Varman", "Varshney",
        "Veera Saivam", "Velama", "Vellalar", "Veluthedathu Nair", "Vilakkithala Nair", "Vishwabrahmin",
        "Vishwakarma", "Vokkaliga", "Vysya", "Yadav", "Yajurvedibrahmin"
      ],
      subCommunities: {
        "Brahmin": [
          "Brahmin - Adi gaur", "Brahmin - Anavil", "Brahmin - Audichya", "Brahmin - Barendra", "Brahmin - Bhargava",
          "Brahmin - Bhatt", "Brahmin - Bhumihar", "Brahmin - Dadheechi", "Brahmin - Daivadnya", "Brahmin - Danua",
          "Brahmin - Deshastha", "Brahmin - Dhiman", "Brahmin - Dravida", "Brahmin - Garhwali", "Brahmin - Gaur",
          "Brahmin - Gaur Saraswat", "Brahmin - Goswami", "Brahmin - Gurjargour", "Brahmin - Gurukkal",
          "Brahmin - Halua", "Brahmin - Havyaka", "Brahmin - Hoysala", "Brahmin - Iyengar", "Brahmin - Iyer",
          "Brahmin - Jangid", "Brahmin - Jhadua", "Brahmin - Jijhoutiya", "Brahmin - Kanyakubj",
          "Brahmin - Karhade", "Brahmin - Kokanastha", "Brahmin - Kota", "Brahmin - Kulin", "Brahmin - Kumoani",
          "Brahmin - Madhwa", "Brahmin - Maithil", "Brahmin - Modh", "Brahmin - Mohyal", "Brahmin - Nagar",
          "Brahmin - Namboodiri", "Brahmin - Narmadiya", "Brahmin - Niyogi", "Brahmin - Paliwal", "Brahmin - Panda",
          "Brahmin - Pandit", "Brahmin - Pushkarna", "Brahmin - Rarhi", "Brahmin - Rigvedi", "Brahmin - Rudraj",
          "Brahmin - Sakaldwipi", "Brahmin - Sanadya", "Brahmin - Sanketi", "Brahmin - Saraswat",
          "Brahmin - Saryuparin", "Brahmin - Shivhalli", "Brahmin - Shri Gaur", "Brahmin - Shrimali",
          "Brahmin - Smartha", "Brahmin - Sri Vishnava", "Brahmin - Stanika", "Brahmin - Tyagi", "Brahmin - Vaidiki",
          "Brahmin - Vyas", "Brahmin -Kasmiri pandit", "Brahmin –Andra", "Brahmin –Bracharararam",
          "Brahmin –Jangara", "Brahmin –Jogi", "Brahmin –Kannada", "Brahmin –Rudraj", "Brahmin –Utkal",
          "Brahmin –Vishwa", "Brahmin –Yajurvedi", "Brahmin-6000 Niyogi"
        ],
        "Kshatriya": [
          "Kshatriya", "Rajput", "Maratha", "Bhavasar Kshatriya", "Vannia Kula Kshatriyar", "Kurmi Kshatriya"
        ],
        "Vaishya": [
          "Vaishya", "Baniya", "Agarwal", "Gupta", "Maheshwari", "Oswal", "Khandelwal", "Vaishya Vani"
        ],
        "Shudra": [
          "Patel", "Yadav", "Jat", "Kurmi", "Nair", "Ezhava", "Vokkaliga", "Lingayat"
        ],
        "Other": [
          "Reddy", "Kamma", "Kayastha", "Brahmbhatt", "Brahmo", "Chamar", "Chambhar", "Chandravanshi Kahar",
          "Chasa", "Chattada Sri Vaishnava", "Chaudary", "Chaurasia", "Chettiar", "Chhetri", "CKP", "Coorgi",
          "Devadiga", "Devandra Kula Vellalar", "Devang Koshthi", "Devanga", "Dhangar", "Dhanuk", "Dheevara",
          "Dhiman", "Dhiwar", "Dhoba", "Dhobi", "Dom", "Dumar", "Ediga", "Ezhava", "Ezhuthachan", "Gabit",
          "Gandla", "Ganiga", "Garhwali", "Garmani", "Gavali", "Gavara", "Ghumar", "Goala", "Goan",
          "Gomantak Maratha", "Gondhali", "Goud", "Gounder", "Gowda", "Gudia", "Gurjar", "Jaiswal", "Jangam",
          "Jat", "Jatav", "Jhariya", "Kadava Patel", "Kahar", "Kaibarta", "Kalar", "Kalinga", "Kalita",
          "Kalwar", "Kamboj", "Kamma", "Kanaujia", "Kansari", "kapol", "Kapu", "Karana", "Karmakar",
          "Karuneegar", "Kasar", "Kashyap", "Katiya", "Kayastha", "Kewat", "Khandayat", "Khandelwal",
          "Khashap Rajpoot", "Khatik", "Khatri", "Kirar Dhakad", "Koli", "Kongu Vellala Gounder", "Konkani",
          "Kori", "Kostha", "Kosthi", "Kudumbi", "Kulal", "Kulalar", "Kulita", "Kumbhakar", "Kumbhar",
          "Kumhar", "Kummari", "Kunbi", "Kureel", "Kurmi", "Kuruba", "Kuruhina Shetty", "Kurumbar",
          "Kushwaha", "Kutchi", "Kutchi Gurjar", "Lambadi", "Leva patel", "Leva Patidar", "Leva patil",
          "Lingayath", "Lodhi", "Lodhi Rajput", "Lohana", "Lubana", "Luhar", "Madiga", "Mahajan", "Mahar",
          "Mahendra", "Maheshwari", "Mahishya", "Majabi", "Majhi", "Mala", "Mali", "Malla", "Mallah",
          "Mangalorean", "Manipuri", "Mapila", "Maratha", "Maruthuvar", "Marwari", "Matang", "Mathur",
          "Meena", "Meenavar", "Meghwal", "Mehra", "Meru Darji", "Mochi", "Modak", "Mogaveera", "Mourya",
          "Mudaliyar", "Mudiraj", "Mukkulathor", "Munnuru Kapu", "Muthuraja", "Nadar", "Nai", "Naicker",
          "Naidu", "Naik", "Nair", "Namdeo", "Namdeo Darji", "Namosudra", "Napit", "Nayaka", "Nema",
          "Nepali", "Nhavi", "Nishad", "Oswal", "Padmasali", "Pal", "Panchal", "Panicker", "Parkava Kulam",
          "Pasi", "Patel", "Patnaick", "Patra", "Patwa", "Pawar", "Pillai", "Porwal", "Pradhan", "Prajapati",
          "Raghuvanshi", "Raiger", "Raikwar", "Rajak", "Rajastani", "Rajbonshi", "Rajput", "Rajput -Negi",
          "Rajput- Kumouni", "Rajput- Rohella/Tank", "Rajput-Gharwali", "Ramdasia", "Ramgariah", "Ravidasia",
          "Rawat", "Reddy", "Rengar", "Sadgope", "Saha", "Sahu", "Saini", "Saliya", "Satnami", "Saubar Banik",
          "SC", "Sen", "Senai Thalaivar", "Settibalija", "Shetty", "Shimpi", "Sindhi", "Sindhi-Amil",
          "Sindhi-Baibhand", "Sindhi-Bhanusali", "Sindhi-Bhatia", "Sindhi-Chhapru", "Sindhi-Dadu",
          "Sindhi-Hyderabadi", "Sindhi-Larai", "Sindhi-Larkana", "Sindhi-Lohana", "Sindhi-Rohiri",
          "Sindhi-Sahiti", "Sindhi-Sakkhar", "Sindhi-Sehwani", "Sindhi-Shikarpuri", "Sindhi-Thatai", "SKP",
          "Somvanshi", "Somvanshi Kayastha", "Sonar", "Soni", "Sourashtra", "Sozhiya Vellalar", "Srisayani",
          "ST", "Sundhi", "Suthar", "Swakula Sali", "Tamboli", "Tanti", "Tantubai", "Telaga", "Teli",
          "Thakkar", "Thakur", "Thevar/Mukkala", "Thigala", "Thiyya", "Tili", "Turupu Kapu", "Uppara",
          "Vaddera", "Vaidiki Velangelu", "Vaish", "Vaishnav", "Vaishnava", "Vaishya", "Vaishya Vani",
          "Valluvar", "Valmiki", "Vania", "Vaniya", "Vanjara", "Vanjari", "Vankar", "Vannar",
          "Vannia Kula Kshatriyar", "Varman", "Varshney", "Veera Saivam", "Velama", "Vellalar",
          "Veluthedathu Nair", "Vilakkithala Nair", "Vishwabrahmin", "Vishwakarma", "Vokkaliga", "Vysya",
          "Yadav", "Yajurvedibrahmin"
        ]
      }
    },
    "Muslim": {
      communities: ["Muslim - Shia", "Muslim - Sunni"],
      subCommunities: {
        "Muslim - Shia": ["Twelver (Ithna Ashari)", "Ismaili", "Bohra", "Khoja"],
        "Muslim - Sunni": ["Hanafi", "Shafi", "Maliki"]
      }
    },
    "Muslim - Shia": {
      communities: ["Shia"],
      subCommunities: {
        "Shia": ["Twelver (Ithna Ashari)", "Ismaili", "Bohra", "Khoja"]
      }
    },
    "Muslim - Sunni": {
      communities: ["Sunni"],
      subCommunities: {
        "Sunni": ["Hanafi", "Shafi", "Maliki"]
      }
    },
    "Christian": {
      communities: ["Catholic", "Protestant", "Orthodox"],
      subCommunities: {
        "Catholic": ["Roman Catholic", "Syro Malabar", "Syro Malankara"],
        "Protestant": ["Baptist", "Methodist", "Pentecostal", "Lutheran"],
        "Orthodox": ["Malankara Orthodox", "Syrian Orthodox"]
      }
    },
    "Sikh": {
      communities: ["Jat Sikh", "Khatri Sikh", "Arora Sikh"],
      subCommunities: {
        "Jat Sikh": ["Majhbi"],
        "Khatri Sikh": ["Ramgarhia"],
        "Arora Sikh": []
      }
    },
    "Jain": {
      communities: ["Digambar", "Shwetambar"],
      subCommunities: {
        "Digambar": ["Murtipujak"],
        "Shwetambar": ["Sthanakvasi", "Terapanthi"]
      }
    },
    "Buddhist": {
      communities: ["Theravada", "Mahayana", "Navayana (Dalit Buddhist)", "Tibetan"],
      subCommunities: {
        "Mahayana": ["Pure Land", "Zen"],
        "Theravada": [],
        "Navayana (Dalit Buddhist)": [],
        "Tibetan": []
      }
    },
    "Parsi": {
      communities: ["Parsi"],
      subCommunities: {
        "Parsi": ["Irani"]
      }
    },
    "Jewish": {
      communities: ["Ashkenazi", "Sephardic"],
      subCommunities: {
        "Ashkenazi": ["Cochin Jews (India)"],
        "Sephardic": []
      }
    },
    "Inter Religion": {
      communities: ["Inter Religion"],
      subCommunities: {
        "Inter Religion": []
      }
    }
  };

  // Function to get community options based on religion
  const getCommunityOptions = (religion) => {
    if (!religion || !religionCommunityMap[religion]) {
      return [];
    }
    return religionCommunityMap[religion].communities || [];
  };

  // Function to get subCommunity options based on religion and community
  const getSubCommunityOptions = (religion, community) => {
    if (!religion || !community || !religionCommunityMap[religion]) {
      return [];
    }
    const subs = religionCommunityMap[religion].subCommunities || {};
    return subs[community] || [];
  };

  const steps = [
    {
      num: 1,
      title: "Personal Basics",
      desc: "Basic information about you",
      icon: User,
      fields: [
        { name: "profileFor", type: "select", options: ["Self", "Son", "Daughter", "Brother", "Sister", "Relative", "Friend"], required: true, label: "Profile For" },
        { name: "Name", type: "text", required: true, label: "Name" },
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
        { name: "gender", type: "radio", options: ["Male", "Female"], required: true, label: "Gender" },
        { name: "height", type: "select", options: heightOptions, required: false, label: "Height" },
        { name: "weight", type: "select", options: weightOptions, required: false, label: "Weight" },
        { name: "diet", type: "select", options: ["Vegetarian", "Non-Vegetarian", "Eggetarian", "Vegan", "Other"], required: true, label: "Diet" },
      ]
    },
    {
      num: 3,
      title: "Religion & Location",
      desc: "Your religious and location details",
      icon: Cross,
      fields: [
        { name: "religion", type: "select", options: religionOptions, required: false, label: "Religion" },
        { name: "community", type: "select", required: false, label: "Community" }, // Dynamic options
        { name: "subCommunity", type: "select", required: false, label: "Sub Community" }, // Dynamic options
        { name: "noCasteBar", type: "checkbox", required: false, label: "No Caste Bar" },
        { name: "state", type: "select", required: false, label: "State" }, // Static from array
        { name: "city", type: "select", required: false, label: "City" }, // Dynamic from citiesByState
        { name: "country", type: "text", required: false, label: "Country" },
      ]
    },
    {
      num: 4,
      title: "Family Background",
      desc: "Tell us about your family",
      icon: Home,
      fields: [
        { name: "liveWithFamily", type: "checkbox", required: false, label: "Live With Family" },
        { name: "familyBackground", type: "textarea", required: true, label: "Family Background" },
      ]
    },
    {
      num: 5,
      title: "Education & Career",
      desc: "Your education and professional background",
      icon: GraduationCap,
      fields: [
        { name: "highestQualification", type: "select", options: qualificationOptions, required: true, label: "Highest Qualification" },
        { name: "workDetails", type: "select", options: ["Private", "Government", "Business", "Self Employed", "Not Working"], required: true, label: "Work Details" },
        { name: "income", type: "select", options: incomeOptions, required: true, label: "Annual Income" },
      ]
    },
    {
      num: 6,
      title: "Additional Info & Contact",
      desc: "More about you and contact details",
      icon: Mail,
      fields: [
        { name: "motherTongue", type: "select", options: motherTongueOptions, required: false, label: "Mother Tongue" },
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

  // Reset errors when step changes
  useEffect(() => {
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
                : "" // Or a neutral avatar
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
         <label key={option} className="flex items-center space-x-2 cursor-pointer" >
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

  const renderTextareaField = (field) => {
    const wordCount = formData[field.name].trim().split(/\s+/).filter(word => word.length > 0).length;
    const maxWordsMsg = field.name === 'aboutYourself' ? ' (Max 25 words)' : '';
    return (
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
          placeholder={`Tell us about your ${field.label.toLowerCase()}${maxWordsMsg}...`}
          className={`px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-900/20 resize-none ${errors[field.name] ? "border-red-500" : "border-gray-300"}`}
        />
        {field.name === 'aboutYourself' && <p className="text-xs text-gray-500 mt-1">Words: {wordCount}</p>}
        {errors[field.name] && <span className="text-xs text-red-600 mt-1">{errors[field.name]}</span>}
      </div>
    );
  };

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

  // Helper to get dynamic options for specific fields
  const getDynamicOptions = (fieldName) => {
    switch (fieldName) {
      case "community":
        return getCommunityOptions(formData.religion);
      case "subCommunity":
        return getSubCommunityOptions(formData.religion, formData.community);
      case "city":
        return citiesByState[formData.state] || [];
      default:
        return [];
    }
  };

  const renderField = (field) => {
    const Icon = getFieldIcon(field.name);
    // Get dynamic options if applicable
    const dynamicOptions = getDynamicOptions(field.name);
    const options = dynamicOptions.length > 0 ? dynamicOptions : (field.options || []);
    switch (field.type) {
      case 'radio':
        return renderRadioField(field);
      case 'checkbox':
        return renderCheckboxField(field);
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
              disabled={
                (field.name === "community" && !formData.religion) ||
                (field.name === "subCommunity" && (!formData.religion || !formData.community)) ||
                (field.name === "city" && !formData.state)
              }
            >
              <option value="">
                {field.name === "community" && !formData.religion
                  ? "Select Religion First"
                  : field.name === "subCommunity" && (!formData.religion || !formData.community)
                  ? "Select Community First"
                  : field.name === "city" && !formData.state
                  ? "Select State First"
                  : `Select ${field.label}`}
              </option>
              {field.name === "state" 
                ? states.map((state) => (
                    <option key={state.iso2} value={state.iso2}>
                      {state.name}
                    </option>
                  ))
                : options.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))
              }
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
      Name: User,
      dob: Calendar,
      maritalStatus: Heart,
      gender: User,
      height: Ruler,
      weight: Ruler,
      diet: Utensils,
      religion: Cross,
      community: Users,
      subCommunity: Users,
      noCasteBar: Users,
      state: MapPin,
      city: MapPin,
      country: MapPin,
      liveWithFamily: Home,
      familyBackground: Home,
      highestQualification: GraduationCap,
      workDetails: Briefcase,
      income: DollarSign,
      motherTongue: Globe,
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
      // Special handling for step 3
      const religionCommunity = [
        <div key={0} className={getLayoutClass(3, 0)}>{renderField(step.fields[0])}</div>,
        <div key={1} className={getLayoutClass(3, 1)}>{renderField(step.fields[1])}</div>,
      ];
      const subCommunityNocaste = (
        <div key="sub-nocaste" className="md:col-span-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>{renderField(step.fields[2])}</div>
            <div>{renderField(step.fields[3])}</div>
          </div>
        </div>
      );
      const locationGrid = (
        <div key="location" className="md:col-span-2">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {step.fields.slice(4).map((field, locIndex) => (
              <div key={locIndex}>{renderField(field)}</div>
            ))}
          </div>
        </div>
      );
      fieldsRender = [...religionCommunity, subCommunityNocaste, locationGrid];
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
        break;
      case 2:
        className = 'md:col-span-2'; // all full
        break;
      case 3:
        // Handled specially
        break;
      case 4:
        className = 'md:col-span-2'; // all full
        break;
      case 5:
        if (index === 2) className = 'md:col-span-2'; // income full
        break;
      case 6:
        if (index === 0 || index === 1 || index === 4) className = 'md:col-span-2'; // motherTongue, about, password full
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
    // Filter cities if state changed
    if (name === "state") {
      setFormData((prev) => ({ ...prev, city: "" })); // Reset city
      setFilteredCities(citiesByState[value] || []);
    } else if (name === "religion") {
      setFormData((prev) => ({ ...prev, community: "", subCommunity: "" }));
      setErrors((prev) => ({ ...prev, community: "", subCommunity: "" }));
    } else if (name === "community") {
      setFormData((prev) => ({ ...prev, subCommunity: "" }));
      setErrors((prev) => ({ ...prev, subCommunity: "" }));
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
      } else if (field.name === 'aboutYourself' && value) {
        const words = value.trim().split(/\s+/).filter(word => word.length > 0).length;
        if (words > 25) {
          newErrors.aboutYourself = `Maximum 25 words allowed (current: ${words})`;
        }
      }
      // For community, check if religion is selected
      if (field.name === "community" && field.required && (!formData.religion || !value)) {
        newErrors[field.name] = `${field.label} is required (after selecting Religion)`;
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
        } else if (key === "liveWithFamily" || key === "noCasteBar") {
          formDataToSend.append(key, formData[key].toString());
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