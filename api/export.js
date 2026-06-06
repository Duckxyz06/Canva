// api/export.js — Tạo export job cho design
export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "https://duckxyz06.github.io");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Authorization, Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.status(401).json({ error: "Missing Authorization" });

  const { design_id, format = "png" } = req.body;
  if (!design_id) return res.status(400).json({ error: "Missing design_id" });

  const formatMap = {
    png:  { type: "png" },
    jpg:  { type: "jpg" },
    pdf:  { type: "pdf", export_quality: "regular" }
  };

  try {
    const response = await fetch("https://api.canva.com/rest/v1/exports", {
      method: "POST",
      headers: { "Authorization": authHeader, "Content-Type": "application/json" },
      body: JSON.stringify({
        design_id,
        format: formatMap[format] || formatMap.png
      })
    });
    const data = await response.json();
    return res.status(response.status).json(data);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
