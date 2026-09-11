const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const courseRoutes = require("./routes/courseRoutes");
const progressRoutes = require("./routes/progressRoutes");
const attestationRoutes = require("./routes/attestationRoutes");
const resourceRoutes = require("./routes/resourceRoutes");

dotenv.config();

const app = express();

app.disable("x-powered-by");
app.use(cors({ origin: process.env.FRONTEND_URL || "http://localhost:5173" }));
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "Water Quality Champion API is running"
  });
});

app.use("/api/auth", authRoutes);
app.use("/api", courseRoutes);
app.use("/api", progressRoutes);
app.use("/api", attestationRoutes);
app.use("/api", resourceRoutes);

app.use((error, _req, res, _next) => {
  console.error(error);
  res.status(error.status || 500).json({ message: "Something went wrong on the server." });
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not configured. Add it to backend/.env.");
    }
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error(`Unable to start server: ${error.message}`);
    process.exit(1);
  }
};

startServer();