
const dotenv = require('dotenv');
dotenv.config();
const express = require('express');

const cors = require("cors");
const connectDB = require('./config/mongoDb');

const app = express();
app.use(express.json());
const allowedOrigins = ["http://localhost:5173","https://jeevan-shaadi-yrnu.vercel.app", "https://jeevanshaadi.com"];

app.use(cors({
  origin: function(origin, callback){
    // origin null ho sakta hai (Postman ya server-to-server requests ke liye)
    if(!origin || allowedOrigins.includes(origin)){
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
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
