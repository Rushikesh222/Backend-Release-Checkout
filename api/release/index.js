import connectDB from "../../src/config/db.js";
import Release from "../../src/models/release.model.js";


export default async function handler(req, res) {
  await connectDB();

  res.setHeader("Access-Control-Allow-Origin", "*"); 
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

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