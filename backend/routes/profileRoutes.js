const express = require('express');
const router = express.Router();
const { getProfile, updateProfile, deleteProfile } = require('../controllers/profileController');
const { protect } = require('../middleware/authMiddleware');

// Get user profile
router.get('/', protect, getProfile);

// Update profile
router.put('/', protect, updateProfile);

// Delete profile
router.delete('/', protect, deleteProfile);

module.exports = router;
