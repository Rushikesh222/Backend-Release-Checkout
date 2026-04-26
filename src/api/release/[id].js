import connectDB from "../../lib/db.js";
import Release from "../../models/Release.js";

export default async function handler(req, res) {
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