import express from "express";
import cors from "cors";
import connectDB from "./src/config/db.js";
import Release from "./src/models/release.model.js";
const dotenv = require("dotenv");
dotenv.config();


const app = express();

// Middleware
app.use(express.json());

const allowedOrigin = process.env.CORS_ORIGIN || "*";
app.use(
  cors({
    origin: allowedOrigin,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Connect DB once (not inside every request)
connectDB();

// Routes
app.get("/releases", async (req, res) => {
  try {
    const releases = await Release.find();

    const withStatus = releases.map((r) => ({
      ...r.toObject(),
      status: r.getStatus(),
    }));

    res.status(200).json(withStatus);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post("/releases", async (req, res) => {
  try {
    const { name, date, additionalInfo } = req.body;

    if (!name || !date) {
      return res.status(400).json({ message: "Name and date required" });
    }

    const steps = [
      "Code Complete",
      "QA Testing",
      "Security Check",
      "Deploy to Staging",
      "Approval",
      "Deploy to Production",
      "Monitoring",
    ].map((step) => ({ name: step }));

    const release = await Release.create({
      name,
      date,
      additionalInfo,
      steps,
    });

    res.status(201).json({
      ...release.toObject(),
      status: release.getStatus(),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Handle unsupported routes
app.use((req, res) => {
  res.status(405).json({ message: "Method not allowed" });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});