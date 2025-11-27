const mongoose = require('mongoose');

const chatRequestSchema = new mongoose.Schema({
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  receiverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
  message: { type: String },
  chatRoomId: { type: mongoose.Schema.Types.ObjectId, ref: 'Chat' }  // Fixed ref to 'Chat'
}, { timestamps: true });

chatRequestSchema.index({ senderId: 1, receiverId: 1 }, { unique: true });
module.exports = mongoose.model('ChatRequest', chatRequestSchema);