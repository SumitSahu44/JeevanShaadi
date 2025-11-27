const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/mongoDb");
const http = require('http');  // Added for Socket.io
const socketIo = require('socket.io');  // Added for real-time chat
const app = express();
const server = http.createServer(app);  // Wrap app in HTTP server for Socket.io

// Updated Socket.io CORS (tighter match with explicit methods/headers)
const io = socketIo(server, {
  cors: {
    origin: function (origin, callback) {
      const allowedOrigins = [
        "https://jeevan-shaadi-yrnu.vercel.app",
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:5175",
        "https://jeevanshaadi.com",
        "http://localhost:4000",
        "http://127.0.0.1:5173",  // Added localhost IP variant
        "http://127.0.0.1:5174",
        "http://127.0.0.1:5175"
      ];
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.log('Socket CORS blocked origin:', origin);  // Debug log
        callback(new Error("Socket not allowed by CORS"));
      }
    },
    methods: ["GET", "POST"],  // Explicit methods
    credentials: true
  }
});

app.use(express.json());

// Updated Express CORS (explicit methods/headers + debug log)
const allowedOrigins = [
  "https://jeevan-shaadi-yrnu.vercel.app",
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:5175",
  "https://jeevanshaadi.com",
  "http://localhost:4000",
  "http://127.0.0.1:5173",  // Added localhost IP variant
  "http://127.0.0.1:5174",
  "http://127.0.0.1:5175"
];

app.use(
  cors({
    origin: function (origin, callback) {
      // origin null ho sakta hai (Postman ya server-to-server requests ke liye)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.log('CORS blocked origin:', origin);  // Debug log added
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],  // Explicit methods
    allowedHeaders: ['Content-Type', 'Authorization']  // Explicit headers
  })
);

// Connect to MongoDB Atlas
connectDB();

// Set io for routes
app.set('io', io);

// Set onlineUsers for routes (to enable targeted emits)
const onlineUsers = new Map(); // userId -> socketId
app.set('onlineUsers', onlineUsers);

// Require models at top (for efficiency, avoid repeated requires)
const User = require('./models/user'); 
const Chat = require('./models/ChatChat');
const Message = require('./models/MessageChat');

// Routes
const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");

app.use("/api", authRoutes);
app.use("/api/admin", adminRoutes);

const profileRoutes = require("./routes/profileRoutes");
app.use("/api/profile", profileRoutes);

const matchesRoutes = require("./routes/matchesRoutes");
app.use("/api/matches", matchesRoutes);

const inquiryRoutes = require("./routes/inquiryRoutes");
app.use("/api/admin/inquiries", inquiryRoutes);

// New: Chat Routes (with "Chat" suffix)
const chatRoutes = require("./routes/chatRoutesChat");
app.use("/api/chat", chatRoutes);

// Socket.io Auth Middleware (JWT from your auth)
const jwt = require('jsonwebtoken');
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) return next(new Error('Auth required'));
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.userId = decoded.id;  // Assume your JWT has { id: userId }
    next();
  } catch (err) { next(new Error('Invalid token')); }
});

// Socket.io Events (Real-time chat logic) - Single connection handler
io.on('connection', (socket) => {
  console.log(`User ${socket.userId} connected`);
  onlineUsers.set(socket.userId, socket.id);
  
  // Update isOnline in DB
  User.findByIdAndUpdate(socket.userId, { isOnline: true }).catch(console.error);

  // Join user's own room for targeted notifications
  socket.join(socket.userId.toString());

  // Join chat room
  socket.on('joinRoom', async (roomId) => {
    try {
      const room = await Chat.findOne({ _id: roomId, participants: socket.userId });
      if (!room) {
        socket.emit('error', { message: 'Room not found or access denied' });
        return;
      }
      socket.join(roomId);
      console.log(`User ${socket.userId} joined room ${roomId}`);
    } catch (err) {
      console.error('Join room error:', err);
      socket.emit('error', { message: 'Error joining room' });
    }
  });

  // Send message
  socket.on('sendMessage', async ({ roomId, content, type = 'text' }) => {
    try {
      const room = await Chat.findOne({ _id: roomId, participants: socket.userId });
      if (!room) {
        socket.emit('error', { message: 'Room not found or access denied' });
        return;
      }
      const msg = new Message({ chatRoomId: roomId, senderId: socket.userId, content, type });
      await msg.save();
      
      // Populate sender for client (consistent fields)
      const populatedMsg = await Message.findById(msg._id).populate('senderId', 'name Name profilePic');
      io.to(roomId).emit('newMessage', populatedMsg);
      console.log(`Message sent to room ${roomId} by ${socket.userId}: ${content}`);
    } catch (err) {
      console.error('Send message error:', err);
      socket.emit('error', { message: 'Error sending message' });
    }
  });

  // Typing indicator (excludes sender)
  socket.on('typing', ({ roomId, isTyping }) => {
    socket.to(roomId).emit('typing', { isTyping, roomId });
    console.log(`Typing in ${roomId}: ${isTyping ? 'started' : 'stopped'} by ${socket.userId}`);
  });

  // Update message
  socket.on('updateMessage', async ({ roomId, messageId, content }) => {
    try {
      const room = await Chat.findOne({ _id: roomId, participants: socket.userId });
      if (!room) return socket.emit('error', { message: 'Access denied' });
      const msg = await Message.findOne({ _id: messageId, chatRoomId: roomId, senderId: socket.userId });
      if (!msg) return socket.emit('error', { message: 'Message not found' });
      msg.content = content;
      await msg.save();
      const populatedMsg = await Message.findById(msg._id).populate('senderId', 'name Name profilePic');
      io.to(roomId).emit('messageUpdated', populatedMsg);
      console.log(`Message updated in ${roomId} by ${socket.userId}`);
    } catch (err) {
      console.error('Update message error:', err);
      socket.emit('error', { message: 'Error updating message' });
    }
  });

  // Delete message
  socket.on('deleteMessage', async ({ roomId, messageId }) => {
    try {
      const room = await Chat.findOne({ _id: roomId, participants: socket.userId });
      if (!room) return socket.emit('error', { message: 'Access denied' });
      const msg = await Message.findOne({ _id: messageId, chatRoomId: roomId, senderId: socket.userId });
      if (!msg) return socket.emit('error', { message: 'Message not found' });
      await Message.findByIdAndDelete(messageId);
      io.to(roomId).emit('messageDeleted', messageId);
      console.log(`Message deleted in ${roomId} by ${socket.userId}`);
    } catch (err) {
      console.error('Delete message error:', err);
      socket.emit('error', { message: 'Error deleting message' });
    }
  });

  socket.on('disconnect', () => {
    console.log(`User ${socket.userId} disconnected`);
    onlineUsers.delete(socket.userId);
    User.findByIdAndUpdate(socket.userId, { isOnline: false }).catch(console.error);
  });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));