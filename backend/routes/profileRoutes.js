const express = require('express');
const router = express.Router();
const { getProfile, updateProfile, deleteProfile } = require('../controllers/profileController');
const { protect } = require('../middleware/authMiddleware');

// Get user profile
// GET /api/profile
router.get('/',protect,  getProfile);

// Update profile
// PUT /api/profile
router.put('/',protect, updateProfile);

// Delete profile
// DELETE /api/profile
router.delete('/', deleteProfile);

module.exports = router;
