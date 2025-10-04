const express = require('express');
const router = express.Router();
const { getProfile, updateProfile, deleteProfile } = require('../controllers/profileController');
// const { protect } = require('../middlewares/authMiddleware'); // JWT auth

// Get user profile
// GET /api/profile
router.get('/',  getProfile);

// Update profile
// PUT /api/profile
router.put('/', updateProfile);

// Delete profile
// DELETE /api/profile
router.delete('/', deleteProfile);

module.exports = router;
