const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
// const {} = require('../middleware/authMiddleware');

router.post('/login', adminController.adminLogin);
router.get('/dashboard/stats', adminController.getStats);
router.get('/dashboard/city-distribution', adminController.getCityDistribution);
router.get('/dashboard/age-distribution', adminController.getAgeDistribution);
router.get('/users', adminController.getAllUsers);
router.delete('/users/:userId', adminController.deleteUser);

module.exports = router;