import connectDB from "../../src/config/db.js";
import Release from "../../src/models/release.model.js";

function setCors(res) {
  res.setHeader("Access-Control-Allow-Origin", "*"|| "http://localhost:5173/"); // or your frontend URL
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
}

export default async function handler(req, res) {
  setCors(res);
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }
  await connectDB();

  const { id } = req.query;

  if (req.method === "PUT") {
    const { steps, additionalInfo } = req.body;

    const updated = await Release.findByIdAndUpdate(
      id,
      { steps, additionalInfo },
      { new: true }
    );

    return res.status(200).json({
      ...updated.toObject(),
      status: updated.getStatus(),
    });
  }

  if (req.method === "DELETE") {
    await Release.findByIdAndDelete(id);
    return res.status(200).json({ message: "Deleted successfully" });
  }

  return res.status(405).json({ message: "Method not allowed" });
}