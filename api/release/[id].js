import express from "express";
import connectDB from "../config/db.js";
import Release from "../models/release.model.js";
const dotenv = require("dotenv");
dotenv.config();

const router = express.Router();

// Connect DB (do this once in your main server ideally)
connectDB();

// CORS middleware (simpler in Express)
router.use((req, res, next) => {
  res.header(
    "Access-Control-Allow-Origin",
    process.env.CORS_ORIGIN || "http://localhost:5173"
  );
  res.header(
    "Access-Control-Allow-Methods",
    "GET,POST,PUT,DELETE,OPTIONS"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );

  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
});


// ✅ UPDATE (PUT)
router.put("/releases/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { steps, additionalInfo } = req.body;

    if (!id) {
      return res.status(400).json({ message: "ID is required" });
    }

    const updated = await Release.findByIdAndUpdate(
      id,
      { steps, additionalInfo },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Release not found" });
    }

    res.status(200).json({
      ...updated.toObject(),
      status: updated.getStatus(),
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// ✅ DELETE
router.delete("/releases/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Release.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: "Release not found" });
    }

    res.status(200).json({ message: "Deleted successfully" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;