const express = require('express');
const router = express.Router();

// Controller functions
const authController = require('../controllers/authController');

// Signup (profileFor + image)
router.post('/signup', authController.upload.single('profileImage'), authController.signup);

// Login
router.post('/login', authController.login);

// Logout
router.post('/logout', authController.logout);

module.exports = router;
