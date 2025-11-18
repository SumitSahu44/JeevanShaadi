const express = require('express');
const router = express.Router();
const {
  getMyProfile,      // नया
  updateProfile,
  deleteProfile,
  getAllProfiles,    // नया
} = require('../controllers/profileController');
const { protect } = require('../middleware/authMiddleware');

// अपना प्रोफाइल
router.get('/me', protect, getMyProfile);

// सभी यूज़र्स (matches के लिए)
router.get('/all', protect, getAllProfiles);

// अपडेट & डिलीट
router.put('/', protect, updateProfile);
router.delete('/', protect, deleteProfile);

module.exports = router;