import connectDB from "../../../src/config/db.js";
import Release from "../../../src/models/release.model.js";

// CORS helper
function setCors(res) {
  res.setHeader(
    "Access-Control-Allow-Origin",
    process.env.CORS_ORIGIN || "*"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,POST,PUT,DELETE,OPTIONS"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );
}

export default async function handler(req, res) {
  setCors(res);

  // Handle preflight
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  await connectDB();

  const { id } = req.query;

  // ✅ UPDATE (PUT)
  if (req.method === "PUT") {
    try {
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

      return res.status(200).json({
        ...updated.toObject(),
        status: updated.getStatus(),
      });

    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  // ✅ DELETE
  if (req.method === "DELETE") {
    try {
      const deleted = await Release.findByIdAndDelete(id);

      if (!deleted) {
        return res.status(404).json({ message: "Release not found" });
      }

      return res.status(200).json({ message: "Deleted successfully" });

    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  return res.status(405).json({ message: "Method not allowed" });
}