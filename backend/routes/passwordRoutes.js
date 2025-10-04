const express = require('express');
const router = express.Router();
const { changePassword, forgotPassword, resetPassword } = require('../controllers/passwordController');
// const { protect } = require('../middlewares/authMiddleware');

// Change password (logged in)
// POST /api/password/change
router.post('/change', protect, changePassword);

// Forgot password (send reset link)
// POST /api/password/forgot
router.post('/forgot', forgotPassword);

// Reset password
// POST /api/password/reset/:token
router.post('/reset/:token', resetPassword);

module.exports = router;
 