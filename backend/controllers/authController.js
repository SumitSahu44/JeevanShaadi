const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Signup
exports.signup = async (req, res) => {
    try {
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
            aboutYourself,
            profileImage
        } = req.body;
     console.log("Signup data received:", req.body); // Debug log
        // Check required fields
        if (!profileFor || !firstName || !lastName || !gender || !dob || !maritalStatus || !height ||
            !religion || !community || !city || !state || !highestQualification || !email || !mobile || !password) {
            return res.status(400).json({ message: "All required fields must be filled" });
        }

        // Check if user exists by email or mobile
        const existingUser = await User.findOne({ $or: [{ email }, { mobile }] });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists with this email or mobile' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user with all fields
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
            profileImage
        });

        // Create JWT token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.status(201).json({
            message: "User registered successfully",
            user,
            token
        });
    } catch (error) {
        console.error("Signup error:", error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Login
exports.login = async (req, res) => {
    try {
        const { email, mobile, password } = req.body;

        if ((!email && !mobile) || !password) {
            return res.status(400).json({ message: "Email or Mobile and Password are required" });
        }

        // Find user (either by email or mobile)
        const user = await User.findOne(email ? { email } : { mobile });
        if (!user) return res.status(404).json({ message: 'User not found' });

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        // Create token
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

// Logout
exports.logout = async (req, res) => {
    res.status(200).json({ message: 'Logged out successfully (token removed from client)' });
};
