const express = require('express');
const router = express.Router();

// Controller functions (logic separate kar sakte ho)
const { signup, login, logout } = require('../controllers/authController');

// Signup
// POST /api/auth/signup
router.post('/signup', signup);

// Login
// POST /api/auth/login
router.post('/login', login);

// Logout
// POST /api/auth/logout
router.post('/logout', logout);

module.exports = router;
