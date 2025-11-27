const express = require('express');
const Joi = require('joi');
const { protect } = require('../middleware/authMiddleware');
const User = require('../models/user');
const ChatRequest = require('../models/ChatRequestChat');
const Chat = require('../models/ChatChat');
const Message = require('../models/MessageChat');
const router = express.Router();

// Send Request
const sendSchema = Joi.object({ receiverId: Joi.string().required(), message: Joi.string().optional() });
router.post('/requests/send', protect, async (req, res) => {
  try {
    const { error } = sendSchema.validate(req.body);
    if (error) return res.status(400).json({ success: false, message: error.details[0].message });

    const { receiverId, message } = req.body;
    if (receiverId === req.user._id.toString()) return res.status(400).json({ success: false, message: 'Cannot request self' });

    const existing = await ChatRequest.findOne({ senderId: req.user._id, receiverId, status: { $in: ['pending', 'accepted'] } });
    if (existing) return res.status(400).json({ success: false, message: 'Request already sent' });

    const request = new ChatRequest({ senderId: req.user._id, receiverId, message });
    await request.save();

    // Targeted emit to receiver only
    const io = req.app.get('io');
    if (io) {
      io.to(receiverId).emit('newRequest', { senderId: req.user._id, requestId: request._id });
      console.log(`New request emitted to receiver ${receiverId} from sender ${req.user._id}`);
    }

    res.json({ success: true, data: { requestId: request._id } });
  } catch (err) {
    console.error('POST /requests/send error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Pending Requests
router.get('/requests/pending', protect, async (req, res) => {
  try {
    const requests = await ChatRequest.find({ receiverId: req.user._id, status: 'pending' })
      .populate('senderId', 'name Name profilePic')
      .sort({ createdAt: -1 });
    res.json({ success: true, data: requests });
  } catch (err) {
    console.error('GET /requests/pending error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Accept/Reject - KEY FIX: Emit to BOTH users on accept
const actionSchema = Joi.object({ action: Joi.string().valid('accept', 'reject').required() });
router.patch('/requests/:requestId/action', protect, async (req, res) => {
  try {
    const { error } = actionSchema.validate(req.body);
    if (error) return res.status(400).json({ success: false, message: error.details[0].message });

    const request = await ChatRequest.findById(req.params.requestId).populate('senderId');
    if (!request || request.receiverId.toString() !== req.user._id.toString()) {
      return res.status(404).json({ success: false, message: 'Request not found' });
    }

    if (request.status !== 'pending') {
      return res.status(400).json({ success: false, message: 'Request already processed' });
    }

    if (!request.senderId) {
      return res.status(404).json({ success: false, message: 'Sender not found' });
    }

    const statusMap = { accept: 'accepted', reject: 'rejected' };
    request.status = statusMap[req.body.action];

    let chatRoomId = null;
    if (req.body.action === 'accept') {
      const existingChat = await Chat.findOne({
        participants: { $all: [request.senderId._id, req.user._id], $size: 2 },
        isActive: true
      });
      if (existingChat) {
        chatRoomId = existingChat._id;
        request.chatRoomId = existingChat._id;
      } else {
        const chat = new Chat({ participants: [request.senderId._id, req.user._id], requestId: request._id });
        await chat.save();
        chatRoomId = chat._id;
        request.chatRoomId = chat._id;
      }

      await User.findByIdAndUpdate(request.senderId._id, { $push: { chatRooms: chatRoomId } });
      await User.findByIdAndUpdate(req.user._id, { $push: { chatRooms: chatRoomId } });

      const io = req.app.get('io');
      if (io) {
        // Emit to SENDER (user1)
        io.to(request.senderId._id.toString()).emit('requestAccepted', { roomId: chatRoomId });
        // Emit to RECEIVER (user3) TOO - THIS WAS MISSING!
        io.to(req.user._id.toString()).emit('requestAccepted', { roomId: chatRoomId });
        console.log(`Request accepted: Room ${chatRoomId} emitted to sender ${request.senderId._id} and receiver ${req.user._id}`);
      }
    }
    await request.save();

    if (req.body.action === 'reject') {
      const io = req.app.get('io');
      if (io) {
        io.to(request.senderId._id.toString()).emit('requestRejected', { senderId: request.senderId._id });
        console.log(`Request rejected: Emitted to sender ${request.senderId._id}`);
      }
    }

    res.json({ success: true, data: { status: request.status, chatRoomId } });
  } catch (err) {
    console.error('PATCH /requests/:id/action error:', err);
    if (err.name === 'ValidationError') {
      return res.status(400).json({ success: false, message: err.message });
    }
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Chat Rooms List
router.get('/rooms', protect, async (req, res) => {
  try {
    const rooms = await Chat.find({ participants: req.user._id, isActive: true })
      .populate('participants', 'name Name profilePic')
      .sort({ updatedAt: -1 });
    res.json({ success: true, data: rooms });
  } catch (err) {
    console.error('GET /rooms error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// DELETE /rooms/:roomId/messages/:msgId
router.delete('/rooms/:roomId/messages/:msgId', protect, async (req, res) => {
  try {
    const { roomId, msgId } = req.params;
    const message = await Message.findOne({ _id: msgId, chatRoomId: roomId, senderId: req.user._id });
    if (!message) return res.status(404).json({ success: false, message: 'Message not found' });
    await Message.findByIdAndDelete(msgId);
    const io = req.app.get('io');
    if (io) io.to(roomId).emit('messageDeleted', msgId);
    console.log(`Message ${msgId} deleted in room ${roomId}`);
    res.json({ success: true });
  } catch (err) {
    console.error('Delete message error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// PATCH /rooms/:roomId/messages/:msgId
router.patch('/rooms/:roomId/messages/:msgId', protect, async (req, res) => {
  try {
    const { roomId, msgId } = req.params;
    const { content } = req.body;
    const message = await Message.findOne({ _id: msgId, chatRoomId: roomId, senderId: req.user._id });
    if (!message) return res.status(404).json({ success: false, message: 'Message not found' });
    message.content = content;
    await message.save();
    const populatedMsg = await Message.findById(msgId).populate('senderId', 'name Name profilePic');
    const io = req.app.get('io');
    if (io) io.to(roomId).emit('messageUpdated', populatedMsg);
    console.log(`Message ${msgId} updated in room ${roomId}`);
    res.json({ success: true, data: populatedMsg });
  } catch (err) {
    console.error('Update message error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Messages GET
router.get('/rooms/:roomId/messages', protect, async (req, res) => {
  try {
    const room = await Chat.findOne({ _id: req.params.roomId, participants: req.user._id });
    if (!room) return res.status(403).json({ success: false, message: 'Access denied' });

    const messages = await Message.find({ chatRoomId: req.params.roomId })
      .populate('senderId', 'name Name profilePic')
      .sort({ createdAt: 1 })
      .limit(50);
    await Message.updateMany({ chatRoomId: req.params.roomId, senderId: { $ne: req.user._id } }, { isRead: true });

    res.json({ success: true, data: messages });
  } catch (err) {
    console.error('GET /rooms/:id/messages error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Messages POST (Fallback for non-socket)
router.post('/rooms/:roomId/messages', protect, async (req, res) => {
  try {
    const { content, type } = req.body;
    const room = await Chat.findOne({ _id: req.params.roomId, participants: req.user._id });
    if (!room) return res.status(403).json({ success: false, message: 'Access denied' });

    const message = new Message({ chatRoomId: req.params.roomId, senderId: req.user._id, content, type });
    await message.save();

    const io = req.app.get('io');
    if (io) {
      io.to(req.params.roomId).emit('newMessage', message);
    }

    res.json({ success: true, data: message });
  } catch (err) {
    console.error('POST /rooms/:id/messages error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;