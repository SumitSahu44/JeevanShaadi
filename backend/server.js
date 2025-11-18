const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/mongoDb");
const app = express();
app.use(express.json());
const allowedOrigins = [
  "https://jeevan-shaadi-yrnu.vercel.app",
  "http://localhost:5173",  "http://localhost:5174",
  "https://jeevanshaadi.com",
  "http://localhost:4000",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // origin null ho sakta hai (Postman ya server-tserver requests keoy- lie)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// Connect to MongoDB Atlas
connectDB();

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

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
