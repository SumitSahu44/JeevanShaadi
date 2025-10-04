const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    plan: { type: String, enum: ['Free', 'Silver', 'Gold', 'Platinum'], default: 'Free' },
    startDate: { type: Date, default: Date.now },
    endDate: Date,
    paymentId: String, // Stripe / Razorpay payment id
    status: { type: String, enum: ['Active', 'Expired', 'Cancelled'], default: 'Active' }
});

module.exports = mongoose.model('Subscription', subscriptionSchema);
