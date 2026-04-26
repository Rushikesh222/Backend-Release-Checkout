import connectDB from "../../src/config/db.js";
import Release from "../../src/models/release.model.js";
import cors from "cors";
require("dotenv").config();

export default async function handler(req, res) {
  await connectDB();

const allowedOrigin = process.env.CORS_ORIGIN || '*';
app.use(cors({
	origin: allowedOrigin,
	credentials: true,
	methods: ['GET','POST','PUT','DELETE','OPTIONS'],
	allowedHeaders: ['Content-Type','Authorization']
}));

   if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method === "GET") {
    const releases = await Release.find();

    const withStatus = releases.map(r => ({
      ...r.toObject(),
      status: r.getStatus(),
    }));

    return res.status(200).json(withStatus);
  }

  if (req.method === "POST") {
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
    ].map(step => ({ name: step }));

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
  }

  return res.status(405).json({ message: "Method not allowed" });
}