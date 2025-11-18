const User = require('../models/user');
const Profile = require('../models/profile'); // <-- your separate Profile model
const multer = require('multer');
const path = require('path');

// Multer config
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (!['.jpg', '.jpeg', '.png'].includes(ext)) {
      return cb(new Error('Only JPG/JPEG/PNG allowed'));
    }
    cb(null, true);
  },
}).single('profileImage');

// Get **logged-in** user's profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Also fetch the separate Profile if it exists
    const profile = await Profile.findOne({ user: req.user.id });
    res.status(200).json({ ...user.toObject(), profile });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Update profile
exports.updateProfile = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) return res.status(400).json({ message: err.message });

    try {
      const updates = req.body;

      // Update User fields
      const user = await User.findByIdAndUpdate(
        req.user.id,
        { $set: updates },
        { new: true, runValidators: true }
      ).select('-password');

      if (!user) return res.status(404).json({ message: 'User not found' });

      // Update or create Profile
      let profile = await Profile.findOne({ user: req.user.id });
      if (profile) {
        Object.assign(profile, updates);
      } else {
        profile = new Profile({ user: req.user.id, ...updates });
      }

      // Handle image
      if (req.file) {
        profile.photos = profile.photos || [];
        profile.photos[0] = {
          data: req.file.buffer,
          contentType: req.file.mimetype,
        };
      }

      await profile.save();

      res.status(200).json({ ...user.toObject(), profile });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  });
};
// ==== नया: अपना प्रोफाइल (GET /api/profile/me) ====
exports.getMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    const profile = await Profile.findOne({ user: req.user.id });
    res.json({
      ...user.toObject(),
      profile: profile || {},
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// ==== नया: सभी यूज़र्स (GET /api/profile/all) ====
exports.getAllProfiles = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    const profiles = await Profile.find();

    const combined = users.map(user => {
      const profile = profiles.find(p => p.user.toString() === user._id.toString());
      return {
        ...user.toObject(),
        profile: profile || {},
      };
    });

    res.json(combined);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Delete profile
exports.deleteProfile = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.user.id);
    await Profile.deleteOne({ user: req.user.id });
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};