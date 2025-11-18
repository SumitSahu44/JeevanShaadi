const express = require('express');
const router = express.Router();
const Inquiry = require('../models/inquiry');
// const adminAuth = require('../middleware/authMiddleware');

// router.use(adminAuth);

// Get all inquiries
router.get('/', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const [inquiries, total] = await Promise.all([
            Inquiry.find()
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit),
            Inquiry.countDocuments()
        ]);

        const totalPages = Math.ceil(total / limit);

        res.json({
            status: 'success',
            inquiries,
            currentPage: page,
            totalPages,
            total
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
});

// Update inquiry status
router.patch('/:id/status', async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const inquiry = await Inquiry.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        );

        if (!inquiry) {
            return res.status(404).json({
                status: 'error',
                message: 'Inquiry not found'
            });
        }

        res.json({
            status: 'success',
            inquiry
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
});

// Delete inquiry
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const inquiry = await Inquiry.findByIdAndDelete(id);

        if (!inquiry) {
            return res.status(404).json({
                status: 'error',
                message: 'Inquiry not found'
            });
        }

        res.json({
            status: 'success',
            message: 'Inquiry deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
});
module.exports = router;