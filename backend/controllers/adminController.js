const User = require('../models/user');
const Profile = require('../models/profile');
const jwt = require('jsonwebtoken');

// ADD calculateAge FUNCTION
const calculateAge = (dob) => {
  if (!dob) return 0;
  const birth = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
};

// Admin Login
exports.adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Admin Login Attempt:', email);
    if (email !== process.env.ADMIN_EMAIL || password !== process.env.ADMIN_PASSWORD) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign({ email, role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '24h' });
    res.json({ status: 'success', token, admin: { email, role: 'admin' } });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// Old Dashboard Stats (Keep if needed)
exports.getDashboardStats = async (req, res) => {
  try {
    const [totalUsers, totalProfiles] = await Promise.all([
      User.countDocuments(),
      Profile.countDocuments()
    ]);

    const recentUsers = await User.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name email createdAt');

    res.json({
      status: 'success',
      stats: { totalUsers, totalProfiles, recentUsers }
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// Get All Users (with Profile)
exports.getAllUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search?.trim();

    const query = search
      ? { $or: [{ name: { $regex: search, $options: 'i' } }, { email: { $regex: search, $options: 'i' } }] }
      : {};

    const users = await User.find(query)
      .select('-password')
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await User.countDocuments(query);

    const profileMap = {};
    if (users.length > 0) {
      const profiles = await Profile.find({ user: { $in: users.map(u => u._id) } });
      profiles.forEach(p => { profileMap[p.user.toString()] = p.toObject(); });
    }

    const usersWithProfile = users.map(user => ({
      ...user.toObject(),
      profile: profileMap[user._id.toString()] || null,
    }));

    res.json({
      status: 'success',
      users: usersWithProfile,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// Delete User
exports.deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findByIdAndDelete(userId);
    if (!user) return res.status(404).json({ status: 'error', message: 'User not found' });
    await Profile.findOneAndDelete({ user: userId });
    res.json({ status: 'success', message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// NEW: Dashboard Stats (No Payment)
exports.getStats = async (req, res) => {
  try {
    const [totalProfiles, activeUsers] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ lastLogin: { $gte: new Date(Date.now() - 24*60*60*1000) } })
    ]);

    const users = await User.find().select('dob');
    const avgAge = users.length > 0 
      ? Math.round(users.reduce((sum, u) => sum + calculateAge(u.dob), 0) / users.length)
      : 0;

    res.json({
      stats: {
        totalProfiles,
        activeUsers,
        avgAge
      }
    });
  } catch (error) {
    console.error('getStats Error:', error);
    res.status(500).json({ message: 'Server error in stats' });
  }
};

// City Distribution
exports.getCityDistribution = async (req, res) => {
  try {
    const cities = await User.aggregate([
      { $match: { city: { $exists: true, $ne: '' } } },
      { $group: { _id: '$city', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);
    res.json({ 
      cities: cities.map(c => ({ city: c._id, count: c.count })) 
    });
  } catch (error) {
    console.error('City Error:', error);
    res.status(500).json({ message: 'Server error in city distribution' });
  }
};

// Age Distribution
exports.getAgeDistribution = async (req, res) => {
  try {
    const users = await User.find().select('dob');
    const groups = { '18-25': 0, '26-30': 0, '31-35': 0, '36-40': 0, '40+': 0 };

    users.forEach(u => {
      const age = calculateAge(u.dob);
      if (age <= 25) groups['18-25']++;
      else if (age <= 30) groups['26-30']++;
      else if (age <= 35) groups['31-35']++;
      else if (age <= 40) groups['36-40']++;
      else groups['40+']++;
    });

    const data = Object.entries(groups).map(([range, count]) => ({ range, count }));
    res.json({ ages: data });
  } catch (error) {
    console.error('Age Distribution Error:', error);
    res.status(500).json({ message: 'Server error in age distribution' });
  }
};