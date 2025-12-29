// controllers/authController.js
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { upload } = require("../config/cloudinary");

/* ---------- Helper: generate unique JSxxxxxx ---------- */
const generateUserId = async () => {
  let userId;
  let exists = true;
  while (exists) {
    const random = Math.floor(10000 + Math.random() * 90000); // 5-digit
    userId = `JS${random}`;
    exists = await User.exists({ userId });
  }
  return userId;
};

/* ---------- SIGNUP ---------- */
const signup = async (req, res) => {
  try {
    const {
      profileFor,
      Name,
      gender,
      dob,
      maritalStatus,
      height,
      weight,
      diet,
      religion,
      community,
      subCommunity,
      noCasteBar,
      city,
      state,
      country,
      liveWithFamily,
      familyBackground,
      motherOccupation,
      fatherOccupation,
      siblings,
      maritalStatusFamily, // NEW
      highestQualification,
      workDetails,
      income,
      motherTongue,
      email,
      mobile,
      password,
      aboutYourself,
    } = req.body;

    // ---- existence check ----
    const existing = await User.findOne({ $or: [{ email }, { mobile }] });
    if (existing)
      return res.status(400).json({ message: "User already exists" });

    // ---- password hash ----
    const hashedPassword = await bcrypt.hash(password, 10);

    // ---- generate unique userId ----
    const userId = await generateUserId();

    // ---- profile image (optional) ----
    let profileImage = undefined;
    if (req.file) {
      profileImage = { url: req.file.path, publicId: req.file.filename };
    }

    // ---- create user ----
    const newUser = await User.create({
      userId, // NEW
      profileFor,
      Name,
      gender,
      dob,
      maritalStatus,
      height,
      weight,
      diet,
      religion,
      community,
      subCommunity,
      noCasteBar: noCasteBar === "true",
      city,
      state,
      livingIn: country,
      liveWithFamily: liveWithFamily === "true",
      familyBackground,
      motherOccupation,
      fatherOccupation,
      siblings,
      maritalStatusFamily, // NEW
      highestQualification,
      workDetails,
      income,
      motherTongue,
      email,
      mobile,
      password: hashedPassword,
      aboutYourself,
      profileImage,
    });

    res.status(201).json({
      message: "User registered successfully",
      user: {
        _id: newUser._id,
        userId: newUser.userId,
        Name: newUser.Name,
        email: newUser.email,
      },
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// POST /api/login
const login = async (req, res) => {
  const { identifier, password } = req.body;

  try {
    const user = await User.findOne({
      $or: [
        { email: identifier },
        { mobile: identifier },
        { userId: identifier }, // JSxxxxx
      ],
    });

    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid password" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({
      token,
      user: {
        id: user._id,
        userId: user.userId,
        name: user.Name,
        email: user.email,
        mobile: user.mobile,
        profileImage: user.profileImage,
      },
      message: "Login successful",
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

/* ---------- LOGOUT (unchanged) ---------- */
const logout = async (req, res) => {
  res
    .status(200)
    .json({ message: "Logged out successfully (token removed from client)" });
};

module.exports = { signup, login, logout, upload };
