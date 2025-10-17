const express = require('express');
const router = express.Router();
const { getMatches } = require('../controllers/matchesController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getMatches);

module.exports = router;
