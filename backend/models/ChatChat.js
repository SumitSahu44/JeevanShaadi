const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],  // Exactly 2
  requestId: { type: mongoose.Schema.Types.ObjectId, ref: 'ChatRequest' },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });
module.exports = mongoose.model('Chat', chatSchema);