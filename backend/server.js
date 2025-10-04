
const dotenv = require('dotenv');
dotenv.config();
const express = require('express');

const cors = require("cors");
const connectDB = require('./config/mongoDb');


const app = express();
app.use(express.json());
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));


// Connect to MongoDB Atlas
connectDB();

// Routes (example)
const authRoutes = require('./routes/authRoutes');
app.use('/api', authRoutes);


const profileRoutes = require('./routes/profileRoutes');
app.use('/api/profile', profileRoutes);


const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
