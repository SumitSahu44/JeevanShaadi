const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');

// ===== Multer setup (memory storage) =====
const storage = multer.memoryStorage();
const upload = multer({ storage });

// ===== Signup =====
const signup = async (req, res) => {
  try {
    const { profileFor, Name, gender, dob, maritalStatus, height, weight, diet,
      religion, community, subCommunity, noCasteBar, city, state, country, liveWithFamily,
      familyBackground, highestQualification,
      workDetails, income, motherTongue, email, mobile,
      password, aboutYourself } = req.body;

    const existingUser = await User.findOne({ $or: [{ email }, { mobile }] });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    let profileImage = undefined;
    if (req.file) {
      profileImage = { data: req.file.buffer, contentType: req.file.mimetype };
    }

    const newUser = await User.create({
      profileFor, Name, gender, dob, maritalStatus, height, weight, diet,
      religion, community, subCommunity, noCasteBar: noCasteBar === 'true', city, state, livingIn: country, liveWithFamily: liveWithFamily === 'true',
      familyBackground, highestQualification,
      workDetails, income, motherTongue, email, mobile, password: hashedPassword, aboutYourself, profileImage
    });

    res.status(201).json({
      message: "User registered successfully",
      user: { _id: newUser._id,Name: newUser.Name, email: newUser.email }
    });

  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ===== Login =====
const login = async (req, res) => {
  try {
    const { email, mobile, password } = req.body;
    const user = await User.findOne(email ? { email } : { mobile });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    let profileImageBase64 = null;
    if (user.profileImage?.data) {
      const base64 = user.profileImage.data.toString("base64");
      profileImageBase64 = `data:${user.profileImage.contentType};base64,${base64}`;
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.json({
      message: "Login successful",
      user: { _id: user._id, Name: user.Name,  email: user.email, profileImage: profileImageBase64 },
      token
    });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ===== Logout =====
const logout = async (req, res) => {
  res.status(200).json({ message: 'Logged out successfully (token removed from client)' });
};

// ===== Exports =====
module.exports = { signup, login, logout, upload };