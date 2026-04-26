import connectDB from "../../src/config/db.js";
import Release from "../../src/models/release.model.js";
import cors from "cors";

// Run CORS as middleware
function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) return reject(result);
      return resolve(result);
    });
  });
}

const corsMiddleware = cors({
  origin: process.env.CORS_ORIGIN || "*",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
});

export default async function handler(req, res) {
  await runMiddleware(req, res, corsMiddleware);

  await connectDB();

  if (req.method === "GET") {
    try {
      const releases = await Release.find();

      const withStatus = releases.map((r) => ({
        ...r.toObject(),
        status: r.getStatus(),
      }));

      return res.status(200).json(withStatus);
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  }

  if (req.method === "POST") {
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

      return res.status(201).json({
        ...release.toObject(),
        status: release.getStatus(),
      });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  }

  return res.status(405).json({ message: "Method not allowed" });
}