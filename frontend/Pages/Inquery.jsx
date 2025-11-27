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
    // Step 1
    profileFor: "",
    Name: "",
    dob: "",
    maritalStatus: "",
    // Step 2
    gender: "",
    height: "",
    weight: "",
    diet: "",
    // Step 3
    religion: "",
    community: "",
    subCommunity: "",
    noCasteBar: false,
    country: "",
    state: "",
    city: "",
    // Step 4 - Family Background (UPDATED)
    liveWithFamily: true,
    familyBackground: "",
    motherOccupation: "",
    fatherOccupation: "",
    siblings: "",
    maritalStatusFamily: "",
    // Step 5
    highestQualification: "",
    occupation: "",
    income: "",
    // Step 6
    motherTongue: "",
    aboutYourself: "",
    email: "",
    mobile: "",
    password: "",
    // Step 7
    profileImage: null,
  });

  // --- Occupation Options ---
  const occupationOptions = [
    "Homemaker",
    "Teacher",
    "Doctor",
    "Engineer",
    "Business Owner",
    "Government Employee",
    "Private Employee",
    "Retired",
    "Other",
  ];
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
  "Muslim - Shia": { communities: ["Shia"], subCommunities: { "Shia": ["Twelver (Ithna Ashari)", "Ismaili", "Bohra", "Khoja"] } },
  "Muslim - Sunni": { communities: ["Sunni"], subCommunities: { "Sunni": ["Hanafi", "Shafi", "Maliki"] } },
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
  "Parsi": { communities: ["Parsi"], subCommunities: { "Parsi": ["Irani"] } },
  "Jewish": {
    communities: ["Ashkenazi", "Sephardic"],
    subCommunities: { "Ashkenazi": ["Cochin Jews (India)"], "Sephardic": [] }
  },
  "Inter Religion": { communities: ["Inter Religion"], subCommunities: { "Inter Religion": [] } }
};
  // --- Countries ---
  const countries = [
    { name: "India", code: "IN" },
    { name: "United States", code: "US" },
    { name: "United Kingdom", code: "GB" },
    { name: "Canada", code: "CA" },
    { name: "Australia", code: "AU" },
  ];

  // --- States by Country ---
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

  const statesByCountry = {
    IN: states,
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

  const citiesByState = {
    AP: ["Visakhapatnam", "Vijayawada", "Guntur", "Nellore", "Tirupati", "Kurnool", "Rajahmundry", "Kadapa", "Kakinada", "Eluru", "Vizianagaram", "Anantapur", "Ongole", "Adoni", "Machilipatnam"],
    AR: ["Itanagar", "Pasighat", "Ziro", "Naharlagun", "Tawang", "Bomdila", "Tezu", "Jairampur"],
    AS: ["Guwahati", "Dibrugarh", "Silchar", "Jorhat", "Tezpur", "Tinsukia", "Nagaon", "Bongaigaon", "Goalpara", "North Lakhimpur"],
    BR: ["Patna", "Gaya", "Bhagalpur", "Muzaffarpur", "Darbhanga", "Purnia", "Arrah", "Begusarai", "Bihar Sharif", "Katihar", "Munger", "Saharsa", "Siwan", "Bettiah", "Chhapra"],
    CT: ["Raipur", "Bhilai", "Bilaspur", "Korba", "Durg", "Raigarh", "Rajnandgaon", "Jagdalpur", "Chandrapur", "Ambikapur"],
    GA: ["Panaji", "Vasco da Gama", "Mapusa", "Margao", "Ponda", "Goa Velha"],
    GJ: ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Jamnagar", "Bhavnagar", "Gandhinagar", "Junagadh", "Gandhidham", "Porbandar", "Anand", "Nadiad", "Surendranagar", "Botad", "Gondal"],
    HR: ["Gurgaon", "Faridabad", "Panipat", "Ambala", "Hisar", "Rohtak", "Sonipat", "Yamunanagar", "Karnal", "Bhiwani"],
    HP: ["Shimla", "Mandi", "Solan", "Kangra", "Kullu", "Dharamshala", "Baddi", "Nahan", "Palampur", "Una", "Hamirpur", "Bilaspur", "Chamba", "Kullu"],
    JH: ["Ranchi", "Jamshedpur", "Dhanbad", "Bokaro Steel City", "Deoghar", "Giridih", "Hazaribagh", "Ramgarh", "Medininagar", "Phusro", "Chaibasa"],
    KA: ["Bengaluru", "Mysuru", "Hubli-Dharwad", "Mangaluru", "Belagavi", "Davanagere", "Gulbarga", "Shimoga", "Tumkur", "Bijapur", "Udupi", "Hospet", "Hassan", "Haveri"],
    KL: ["Thiruvananthapuram", "Kochi", "Kozhikode", "Thrissur", "Kollam", "Kannur", "Tirur", "Alappuzha", "Palakkad", "Kottayam", "Kasaragod", "Kannur"],
    MP: ["Bhopal", "Indore", "Jabalpur", "Gwalior", "Ujjain", "Sagar", "Ratlam", "Rewa", "Satna", "Dewas", "Murwara", "Singrauli", "Burhanpur", "Khandwa"],
    MH: ["Mumbai", "Pune", "Nagpur", "Thane", "Nashik", "Aurangabad", "Kalyan-Dombivali", "Vasai-Virar", "Solapur", "Bhiwandi", "Amravati", "Nanded", "Akola", "Latur", "Kolhapur", "Sangli-Miraj & Kupwad", "Navi Mumbai", "Pimpri-Chinchwad", "Chandrapur", "Jalgaon"],
    MN: ["Imphal", "Churachandpur", "Thoubal", "Bishnupur", "Ukhrul"],
    ML: ["Shillong", "Tura", "Jowai", "Cherrapunji", "Baghmara", "Nongpoh"],
    MZ: ["Aizawl", "Lunglei", "Serchhip", "Champhai", "Tuipang", "Mamit"],
    NL: ["Kohima", "Dimapur", "Mokokchung", "Tuensang", "Zunheboto", "Kiphire Sadar", "Phek"],
    OR: ["Bhubaneswar", "Cuttack", "Rourkela", "Brahmapur", "Sambalpur", "Puri", "Balasore", "Bhadrak", "Chatrapur", "Jatani", "Baripada", "Kendrapara", "Paradip"],
    PB: ["Amritsar", "Ludhiana", "Jalandhar", "Patiala", "Bathinda", "Mohali", "Pathankot", "Moga", "Firozpur", "Gurdaspur", "Khanna", "Phagwara", "Abohar"],
    RJ: ["Jaipur", "Jodhpur", "Udaipur", "Kota", "Ajmer", "Bikaner", "Alwar", "Bharatpur", "Bhilwara", "Sikar", "Sri Ganganagar", "Pali"],
    SK: ["Gangtok", "Namchi", "Gyalshing", "Mangan", "Rabdents"],
    TN: ["Chennai", "Coimbatore", "Madurai", "Tiruchirappalli", "Salem", "Erode", "Tirunelveli", "Tiruppur", "Vellore", "Thoothukudi", "Thanjavur", "Dindigul", "Theni", "Nagercoil"],
    TS: ["Hyderabad", "Warangal", "Nizamabad", "Karimnagar", "Khammam", "Ramagundam", "Mahbubnagar", "Nalgonda", "Adilabad", "Suryapet", "Miryalguda", "Kamareddy"],
    TR: ["Agartala", "Udaipur", "Dharmanagar", "Amarpur", "Kumarghat", "Gakulnagar", "Kunjaban"],
    UP: ["Lucknow", "Kanpur", "Ghaziabad", "Agra", "Varanasi", "Meerut", "Prayagraj", "Bareilly", "Moradabad", "Aligarh", "Saharanpur", "Gorakhpur", "Firozabad", "Faizabad"],
    UK: ["Dehradun", "Haridwar", "Roorkee", "Haldwani", "Rudrapur", "Kashipur", "Rishikesh", "Pithoragarh", "Almora", "Bageshwar"],
    WB: ["Kolkata", "Howrah", "Asansol", "Siliguri", "Durgapur", "Bardhaman", "Kharagpur", "Bally", "Baharampur", "Medinipur", "Hugli-Chinsurah", "Shantipur"],
    AN: ["Port Blair"],
    CH: ["Chandigarh"],
    DN: ["Daman", "Silvassa", "Dadra"],
    DL: ["New Delhi"],
    JK: ["Srinagar", "Jammu", "Anantnag", "Baramulla"],
    LA: ["Leh", "Kargil"],
    LD: ["Kavaratti"],
    PY: ["Puducherry", "Karaikal", "Mahe", "Yanam"],
  };

  const citiesByCountryState = {
    IN: citiesByState,
    US: {
      CA: ["Los Angeles", "San Francisco", "San Diego", "Sacramento"],
      NY: ["New York City", "Buffalo", "Rochester", "Albany"],
      TX: ["Houston", "Dallas", "Austin", "San Antonio"],
      FL: ["Miami", "Tampa", "Orlando", "Jacksonville"],
    },
    GB: {
      ENG: ["London", "Manchester", "Birmingham", "Liverpool"],
      SCO: ["Edinburgh", "Glasgow", "Aberdeen", "Dundee"],
      WAL: ["Cardiff", "Swansea", "Newport"],
      NIR: ["Belfast", "Derry"],
    },
    CA: {
      ON: ["Toronto", "Ottawa", "Hamilton", "London"],
      QC: ["Montreal", "Quebec City", "Gatineau"],
      BC: ["Vancouver", "Victoria", "Surrey"],
      AB: ["Calgary", "Edmonton"],
    },
    AU: {
      NSW: ["Sydney", "Newcastle", "Wollongong"],
      VIC: ["Melbourne", "Geelong", "Ballarat"],
      QLD: ["Brisbane", "Gold Coast", "Cairns"],
      WA: ["Perth", "Mandurah"],
    },
  };
  const [errors, setErrors] = useState({});
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);


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
    "Nill",
    "Under Rs.50,000",
    "Rs.50,001 - 1,00,000",
    "Rs.1,00,001 - 1,50,000",
    "Rs.1,50,001 - 2,00,000",
    "Rs.2,00,001 - 2,50,000",
    "Rs.2,50,001 - 3,00,000",
    "Rs.3,00,001 - 5,00,000",
    "Rs.5,00,001 - 7,00,000",
    "Rs.7,00,001 - 10,00,000",
    "Rs.10,00,001 - 20,00,000",
    "Rs.20,00,001 - 30,00,000",
    "Rs.30,00,001 - 50,00,000",
    "Rs.50,00,001 and above",
    "Under $25,000",
    "$25,001 - 50,000",
    "$50,001 - 75,000",
    "$75,001 - 100,000",
    "$100,001 - 150,000",
    "$150,001 - 200,000",
    "$200,001 and above"
  ];

  const motherTongueOptions = [
    "Hindi", "Bengali", "Telugu", "Marathi", "Tamil", "Urdu", "Gujarati",
    "Kannada", "Odia", "Malayalam", "Punjabi", "Assamese", "Maithili", "Other"
  ];

  const qualificationOptions = [
    "10+2/Senior Secondary School",
    "B.A.",
    "B.Arch",
    "B.Com",
    "B.Ed",
    "B.Pharm",
    "B.Sc",
    "Bachelor",
    "Bachelors - Arts/ Science/ Commerce/ Others",
    "Bachelors - Engineering/ Computers",
    "BBA",
    "BCA",
    "BDS",
    "BE B.Tech",
    "BHM",
    "BL LLB",
    "CA",
    "CS",
    "Diploma",
    "High school",
    "Higher Secondary/ Secondary",
    "ICWA",
    "Integrated PG",
    "Intermediate",
    "Legal - BL/ ML/ LLB/ LLM/ Others",
    "LLB",
    "M.Arch",
    "M.Com",
    "M.Ed",
    "M.Pharm",
    "M.Phil",
    "M.Sc",
    "M.Tech",
    "MA",
    "Management - BBA/ MBA/ Others",
    "Masters",
    "Masters - Arts/ Science/ Commerce/ Others",
    "Masters - Engineering/ Computers",
    "MBA PGDM",
    "MBBS",
    "MCA PGDCA",
    "MD MS",
    "ME M.Tech",
    "Medicine - General/ Dental/ Surgeon/ Others",
    "ML LLM",
    "MS",
    "Others",
    "PGDBM",
    "PhD",
    "Post graduation",
    "Service - IAS/ IPS/ Others",
    "Undergraduate"
  ];

  const occupationwork = [
    "Accounts/Finance Professional ",
    "Administrative Professional ",
    "Advertising / PR Professional ",
    "Agriculture & Farming Professional ",
    "Air Hostess ",
    "Airforce",
    "Airline Professional ",
    "Architect ",
    "Army",
    "Arts & Craftsman ",
    "Auditor ",
    "Banking Service Professional ",
    "Beautician ",
    "BPO/ Call Centre/ ITES/ Telecalling",
    "Buisness",
    "Chartered Accountant ",
    "Clerk ",
    "Company Secretary ",
    "Consultant ",
    "Corporate Planning/ Consulting ",
    "Customer Care Professional ",
    "CXO / President, Director, Chairman ",
    "Dentist ",
    "dermatologist",
    "Doctor ",
    "Education Professional ",
    "Engineer - Non IT ",
    "Entertainment Professional ",
    "Event Management Professional ",
    "Executive ",
    "Fashion Designer ",
    "Front Office/ Secretarial Staff/ Export/ Import",
    "Graphic Designer ",
    "Hardware Professional ",
    "Health Care Professional ",
    "Hotel / Hospitality Professional ",
    "HR/ Admin/ PM/ IR/ Training ",
    "IAS/IES/IFS/IPS/Others",
    "Interior Designer ",
    "Journalist ",
    "Lawyer & Legal Professional ",
    "Logistics/ Purchase/ SCM ",
    "Manager ",
    "Mariner / Merchant Navy ",
    "Marketing Professional ",
    "Media Professional ",
    "Navy",
    "Not Working",
    "Nurse ",
    "Officer ",
    "Others ",
    "Paramedical Professional ",
    "Pilot ",
    "Production/ Maintenance/ Service Engg. ",
    "Professor / Lecturer ",
    "Sales Professional ",
    "Scientist / Researcher ",
    "Social Worker ",
    "Software Professional ",
    "Sportsman ",
    "Supervisors ",
    "Teaching / Academician ",
    "Technician ",
    "Unemployed"
  ];

  const siblingsOptions = [
    "",
    "No Siblings",
    "1",
    "2",
    "3",
    "4",
    "5+"
  ];

  const religionOptions = [
    "Buddhist", "Christian", "Hindu", "Inter Religion", "Jain", "Jewish",
    "Muslim", "Muslim - Shia", "Muslim - Sunni", "Parsi", "Sikh", "Others",
  ];



  const getCommunityOptions = (religion) => {
    if (!religion || !religionCommunityMap[religion]) return [];
    return religionCommunityMap[religion].communities || [];
  };

  const getSubCommunityOptions = (religion, community) => {
    if (!religion || !community || !religionCommunityMap[religion]) return [];
    const subs = religionCommunityMap[religion].subCommunities || {};
    return subs[community] || [];
  };

  // --- Calculate Age ---
  const calculateAge = (dob) => {
    if (!dob) return "";
    const birth = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
    return age;
  };
            
  //-- Steps Definition (UPDATED STEP 4) ---
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
        { name: "religion", type: "select", options: religionOptions, required: true, label: "Religion" },
        { name: "community", type: "select", required: true, label: "Community" },
        { name: "subCommunity", type: "select", required: false, label: "Sub Community" },
        { name: "noCasteBar", type: "checkbox", required: false, label: "No Caste Bar" },
        { name: "country", type: "select", required: true, label: "Country" },
        { name: "state", type: "select", required: true, label: "State" },
        { name: "city", type: "select", required: true, label: "City" },
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
        { name: "motherOccupation", type: "select", options: occupationOptions, required: false, label: "Mother’s Occupation" },
        { name: "fatherOccupation", type: "select", options: occupationOptions, required: false, label: "Father’s Occupation" },
        { name: "siblings", type: "select", options: siblingsOptions, required: false, label: "Number of Siblings" },
        { name: "maritalStatusFamily", type: "select", options: ["Married", "Unmarried"], required: false, label: "Marital Status" },
      ]
    },
    {
      num: 5,
      title: "Education & Career",
      desc: "Your education and professional background",
      icon: GraduationCap,
      fields: [
        { name: "highestQualification", type: "select", options: qualificationOptions, required: true, label: "Highest Qualification" },
        { name: "occupation", type: "select", options: occupationwork, required: true, label: "Occupation" },
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

  // --- Effects ---
  useEffect(() => {
    setErrors({});
    setErrorMsg("");
    checkButtonState();
  }, [currentStep]);

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

  // --- Render Field Functions ---
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
      <div className="h-16 mb-4 flex justify-around items-center">
        {field.options.map((option) => (
          <img
            key={`img-${option}`}
            src={option === "Male" ? "/men-avatar.png" : "/girl-avatar.png"}
            alt={`${option} avatar`}
            className="w-16 h-16 rounded-full object-cover border-2 border-gray-200 hover:border-red-500 transition-colors cursor-pointer"
            onClick={() => {
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
      {errors[field.name] && <span className="text-xs text-red-600 mt-2">{errors[field.name]}</span>}
    </div>
  );

  const renderTextareaField = (field) => {
    const wordCount = formData[field.name].trim().split(/\s+/).filter(word => word.length > 0).length;
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
          placeholder={`Tell us about your ${field.label.toLowerCase()}...`}
          className={`px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-900/20 resize-none ${errors[field.name] ? "border-red-500" : "border-gray-300"}`}
        />
        {field.name === 'aboutYourself' && <p className="text-xs text-gray-500 mt-1">Words: {wordCount} (Max 25)</p>}
        {errors[field.name] && <span className="text-xs text-red-600 mt-1">{errors[field.name]}</span>}
      </div>
    );
  };

  const renderImageField = (field) => (
    <div className="flex flex-col items-center justify-center p-8 md:col-span-2">
      {!imagePreview ? (
        <label className="w-full cursor-pointer">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-red-900 transition-colors">
            <Camera size={48} className="mx-auto mb-4 text-gray-400" />
            <p className="text-lg font-medium text-gray-700 mb-2">Upload Profile Photo</p>
            <p className="text-sm text-gray-500 mb-4">Click to browse or drag and drop</p>
            <p className="text-xs text-gray-400">JPG, PNG or WEBP (Max 5MB)</p>
            <input type="file" accept="image/jpeg,image/jpg,image/png,image/webp" onChange={handleImageChange} className="hidden" />
          </div>
        </label>
      ) : (
        <div className="relative">
          <img src={imagePreview} alt="Profile preview" className="w-64 h-64 object-cover rounded-lg border-4 border-red-900/20" />
          <button onClick={handleRemoveImage} type="button" className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-2 hover:bg-red-700">
            <X size={16} />
          </button>
          <p className="text-center mt-4 text-sm text-gray-600 break-all px-2">{formData.profileImage?.name}</p>
        </div>
      )}
      {errors[field.name] && <span className="text-sm text-red-600 mt-2">{errors[field.name]}</span>}
    </div>
  );

  const getDynamicOptions = (fieldName) => {
    switch (fieldName) {
      case "country": return countries;
      case "state": return statesByCountry[formData.country] || [];
      case "city": return citiesByCountryState[formData.country]?.[formData.state] || [];
      case "community": return getCommunityOptions(formData.religion);
      case "subCommunity": return getSubCommunityOptions(formData.religion, formData.community);
      default: return [];
    }
  };

  const renderField = (field) => {
    const Icon = getFieldIcon(field.name);
    const dynamicOptions = getDynamicOptions(field.name);
    const options = dynamicOptions.length > 0 ? dynamicOptions : (field.options || []);

    switch (field.type) {
      case 'radio': return renderRadioField(field);
      case 'checkbox': return renderCheckboxField(field);
      case 'textarea': return renderTextareaField(field);
      case 'image': return renderImageField(field);
      case 'select':
        const isDisabled = 
          (field.name === "community" && !formData.religion) ||
          (field.name === "subCommunity" && (!formData.religion || !formData.community)) ||
          (field.name === "state" && !formData.country) ||
          (field.name === "city" && !formData.state);
        const placeholderText = 
          field.name === "community" && !formData.religion ? "Select Religion First"
          : field.name === "subCommunity" && (!formData.religion || !formData.community) ? "Select Community First"
          : field.name === "state" && !formData.country ? "Select Country First"
          : field.name === "city" && !formData.state ? "Select State First"
          : `Select ${field.label}`;
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
              className={`px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-900/20 ${errors[field.name] ? "border-red-500" : "border-gray-300"}`}
              disabled={isDisabled}
            >
              <option value="">{placeholderText}</option>
              {options.map((opt, idx) => {
                if (typeof opt === 'object') {
                  const val = opt.iso2 || opt.code;
                  const display = opt.name;
                  return <option key={val || idx} value={val}>{display}</option>;
                } else {
                  return <option key={`${opt}-${idx}`} value={opt}>{opt}</option>;
                }
              })}
            </select>
            {errors[field.name] && <span className="text-xs text-red-600 mt-1">{errors[field.name]}</span>}
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
              className={`px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-900/20 ${errors[field.name] ? "border-red-500" : "border-gray-300"}`}
            />
            {errors[field.name] && <span className="text-xs text-red-600 mt-1">{errors[field.name]}</span>}
          </div>
        );
    }
  };

  const getFieldIcon = (name) => {
    const iconMap = {
      profileFor: User, Name: User, dob: Calendar, maritalStatus: Heart,
      gender: User, height: Ruler, weight: Ruler, diet: Utensils,
      religion: Cross, community: Users, subCommunity: Users, noCasteBar: Users,
      country: MapPin, state: MapPin, city: MapPin,
      liveWithFamily: Home, familyBackground: Home,
      motherOccupation: Users, fatherOccupation: Users, siblings: Users, maritalStatusFamily: Heart,
      highestQualification: GraduationCap, occupation: Briefcase, income: DollarSign,
      motherTongue: Globe, aboutYourself: Edit3, email: Mail, mobile: Phone, password: Lock,
      profileImage: Camera,
    };
    return iconMap[name] || User;
  };

  // --- Render Current Step ---
  const renderCurrentStep = () => {
    const step = steps[currentStep - 1];
    let fieldsRender = step.fields.map((field, index) => (
      <div key={index} className={getLayoutClass(step.num, index)}>
        {renderField(field)}
      </div>
    ));

    // Add Age Display after DOB in Step 1
    if (step.num === 1 && formData.dob) {
      fieldsRender.splice(3, 0, (
        <div key="age-display" className="md:col-span-2 text-sm text-gray-600">
          Age: <strong>{calculateAge(formData.dob)}</strong> years
        </div>
      ));
    }

    if (step.num === 3) {
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
      case 1: if (index === 0) className = 'md:col-span-2'; break;
      case 2: className = 'md:col-span-2'; break;
      case 4: className = 'md:col-span-2'; break;
      case 5: if (index === 2) className = 'md:col-span-2'; break;
      case 6: if (index === 0 || index === 1 || index === 4) className = 'md:col-span-2'; break;
      case 7: className = 'md:col-span-2'; break;
      default: break;
    }
    return className;
  };

  // --- Handlers ---
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
    if (name === "country") {
      setFormData((prev) => ({ ...prev, state: "", city: "" }));
    } else if (name === "state") {
      setFormData((prev) => ({ ...prev, city: "" }));
    } else if (name === "religion") {
      setFormData((prev) => ({ ...prev, community: "", subCommunity: "" }));
    } else if (name === "community") {
      setFormData((prev) => ({ ...prev, subCommunity: "" }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
      if (!validTypes.includes(file.type)) {
        setErrors((prev) => ({ ...prev, profileImage: "Please upload a valid image (JPG, PNG, WEBP)" }));
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({ ...prev, profileImage: "Image size should be less than 5MB" }));
        return;
      }
      setFormData((prev) => ({ ...prev, profileImage: file }));
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
      if (errors.profileImage) setErrors((prev) => ({ ...prev, profileImage: "" }));
    }
  };

  const handleRemoveImage = () => {
    setFormData((prev) => ({ ...prev, profileImage: null }));
    setImagePreview(null);
  };

  const validateStep = (stepNum) => {
    const step = steps[stepNum - 1];
    const newErrors = {};
    step.fields.forEach((field) => {
      const value = formData[field.name];
      if (field.required && (!value || value === "")) {
        newErrors[field.name] = `${field.label} is required`;
      } else if (field.name === 'email' && value && !/\S+@\S+\.\S+/.test(value)) {
        newErrors.email = "Invalid email address";
      } else if (field.name === 'mobile' && value && !/^\d{10}$/.test(value)) {
        newErrors.mobile = "Mobile number must be 10 digits";
      } else if (field.name === 'password' && value && value.length < 6) {
        newErrors.password = "Password must be at least 6 characters";
      } else if (field.name === 'dob' && value) {
        const age = calculateAge(value);
        if (age < 18) newErrors.dob = "You must be at least 18 years old";
      } else if (field.name === 'aboutYourself' && value) {
        const words = value.trim().split(/\s+/).filter(w => w.length > 0).length;
        if (words > 25) newErrors.aboutYourself = `Maximum 25 words allowed (current: ${words})`;
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
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async () => {
    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach((key) => {
        if (key === "profileImage" && formData[key]) {
          formDataToSend.append("profileImage", formData[key], formData[key].name);
        } else if (key === "liveWithFamily" || key === "noCasteBar") {
          formDataToSend.append(key, formData[key].toString());
        } else if (formData[key] !== null && formData[key] !== "" && formData[key] !== undefined) {
          formDataToSend.append(key, formData[key]);
        }
      });

      const apiUrl = `${import.meta.env.VITE_BACKEND_URL}/api/signup`;
      const res = await fetch(apiUrl, { method: "POST", body: formDataToSend });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || `Server error: ${res.status}`);
      }

      const data = await res.json();
      setSuccessMsg(data.message || "Profile created successfully!");
      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (err) {
      setErrorMsg(err.message || "Something went wrong. Please try again.");
    }
  };

  const currentStepData = steps[currentStep - 1];
  return (
    <div className="h-screen bg-gradient-to-br from-red-900/30 via-gray-200 to-red-800/20 flex items-center justify-center p-2 sm:p-4 relative overflow-hidden">
      {/* Background blur circles */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-red-500/40 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-red-600/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }}></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-400/25 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "2s" }}></div>
      <div className="absolute top-10 right-1/4 w-64 h-64 bg-orange-400/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-10 left-1/4 w-72 h-72 bg-red-700/25 rounded-full blur-3xl"></div>

      <div className="w-full bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl overflow-hidden max-w-4xl relative z-10 h-full flex flex-col">
        <div className="flex-1 p-6 sm:p-8 lg:p-10 relative overflow-y-auto">
          <button onClick={() => window.history.back()} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 z-10">
            <X size={20} className="w-5 h-5" />
          </button>

          {(successMsg || errorMsg) && (
            <div className={`mb-6 px-4 py-3 rounded-lg text-center font-semibold transition-all text-sm ${successMsg ? "bg-green-100 text-green-800 border border-green-300" : "bg-red-100 text-red-800 border border-red-300"}`}>
              {successMsg || errorMsg}
            </div>
          )}

          <div className="text-center mb-8">
            <Heart size={48} className="mx-auto mb-4 text-red-600" />
            <h1 className="text-3xl font-bold text-gray-900">Create Your Profile</h1>
          </div>
          <div className="mb-6">
            <p className="text-sm text-gray-500 mb-2">Step {currentStep} of {steps.length}</p>
          </div>
          {renderCurrentStep()}
        </div>

        <div className="p-6 sm:p-8 border-t border-gray-200">
          <div className="flex items-center justify-between gap-3">
            <button onClick={handleBack} disabled={currentStep === 1} className={`flex items-center gap-2 px-6 py-2.5 border border-gray-300 rounded-lg text-base ${currentStep === 1 ? "text-gray-400 cursor-not-allowed" : "text-gray-700 hover:bg-gray-50"}`}>
              <ChevronLeft size={20} /> <span>Back</span>
            </button>
            <button type="button" onClick={handleContinue} disabled={isButtonDisabled} className={`flex items-center gap-2 px-8 py-2.5 rounded-lg text-base disabled:opacity-50 disabled:cursor-not-allowed transition-all ${isButtonDisabled ? "bg-gray-300 text-gray-500" : "bg-red-900 text-white hover:bg-red-800"}`}>
              {currentStep === steps.length ? "Submit" : "Continue"}
              {currentStep < steps.length && <ChevronRight size={20} />}
            </button>
          </div>
          <p className="text-center text-xs text-gray-500 mt-6">Your information is secure and encrypted</p>
        </div>
      </div>
    </div>
  );
};

export default Inquiry;