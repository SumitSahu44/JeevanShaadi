const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  chatRoomId: { type: mongoose.Schema.Types.ObjectId, ref: 'Chat', required: true },
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
  type: { type: String, enum: ['text', 'image'], default: 'text' },
  isRead: { type: Boolean, default: false }
}, { timestamps: true });

messageSchema.index({ chatRoomId: 1, timestamp: -1 });

module.exports = mongoose.model('Message', messageSchema);