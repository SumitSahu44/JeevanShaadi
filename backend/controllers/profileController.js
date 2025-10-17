const User = require('../models/user');

// Get logged-in user profile
exports.getProfile = async (req, res) => {
  try {
    const profiles = await User.find().select('-password'); // exclude password
    res.status(200).json(profiles);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// Update profile
exports.updateProfile = async (req, res) => {
    try {
        const updates = req.body;
        const user = await User.findByIdAndUpdate(req.user.id, updates, { new: true }).select('-password');
        res.status(200).json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Delete profile
exports.deleteProfile = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.user.id);
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
