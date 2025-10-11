const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');

// ===== Multer setup (memory storage) =====
const storage = multer.memoryStorage(); // image memory me aayegi
const upload = multer({ storage });

// ===== Signup =====
exports.signup = async (req, res) => {
    try {
        const body = req.body || {};
        const {
            profileFor,
            firstName,
            lastName,
            gender,
            dob,
            maritalStatus,
            height,
            diet,
            religion,
            community,
            subCommunity,
            livingIn,
            city,
            state,
            liveWithFamily,
            fatherName,
            motherName,
            familyMembers,
            highestQualification,
            collegeName,
            workDetails,
            workAs,
            currentCompany,
            income,
            languagesKnown,
            email,
            mobile,
            password,
            aboutYourself
        } = body;

        // Required fields check
        if (!profileFor || !firstName || !lastName || !gender || !dob || !maritalStatus || !height ||
            !religion || !community || !city || !state || !highestQualification || !email || !mobile || !password) {
            return res.status(400).json({ message: "All required fields must be filled" });
        }

        // Check if user exists
        const existingUser = await User.findOne({ $or: [{ email }, { mobile }] });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists with this email or mobile' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Prepare profileImage
        let profileImageData = null;
        if (req.file) {
            profileImageData = {
                data: req.file.buffer,
                contentType: req.file.mimetype
            };
        }

        // Create user
        const user = await User.create({
            profileFor,
            firstName,
            lastName,
            gender,
            dob,
            maritalStatus,
            height,
            diet,
            religion,
            community,
            subCommunity,
            livingIn,
            city,
            state,
            liveWithFamily,
            fatherName,
            motherName,
            familyMembers,
            highestQualification,
            collegeName,
            workDetails,
            workAs,
            currentCompany,
            income,
            languagesKnown,
            email,
            mobile,
            password: hashedPassword,
            aboutYourself,
            profileImage: profileImageData
        });

        // JWT token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.status(201).json({
            message: "User registered successfully",
            user,
            token
        });

    }  catch (error) {
    console.error("Signup error:", error.message);
    console.error(error.stack);
    res.status(500).json({ message: 'Server error', error: error.message });
}

};

// ===== Login =====
exports.login = async (req, res) => {
    try {
        const { email, mobile, password } = req.body || {};
  console.log('Login request body:', req.body);
        if ((!email && !mobile) || !password) {
            return res.status(400).json({ message: "Email or Mobile and Password are required" });
        }

        // Find user
        const user = await User.findOne(email ? { email } : { mobile });
        if (!user) return res.status(404).json({ message: 'User not found' });

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        // JWT token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.status(200).json({
            message: "Login successful",
            user,
            token
        });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: 'Server error' });
    }
};

// ===== Logout =====
exports.logout = async (req, res) => {
    res.status(200).json({ message: 'Logged out successfully (token removed from client)' });
};

// ===== Export multer upload for route usage =====
exports.upload = upload;
