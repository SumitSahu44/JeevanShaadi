const express = require('express');
const router = express.Router();
const { signup, login, logout, upload } = require('../controllers/authController');



// Signup (with optional profile image)
router.post("/signup", upload.single("profileImage"), signup);

// Login
router.post("/login", login);

// Logout
router.post("/logout", logout);

module.exports = router;