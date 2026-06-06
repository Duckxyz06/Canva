// api/download.js — Proxy tải file từ Canva export URL
export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "https://duckxyz06.github.io");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();

  const { url } = req.query;
  if (!url) return res.status(400).json({ error: "Missing url" });

  // Chỉ cho phép download từ Canva
  if (!url.startsWith("https://export-download.canva.com/")) {
    return res.status(403).json({ error: "URL không hợp lệ" });
  }

  try {
    const response = await fetch(decodeURIComponent(url));
    if (!response.ok) return res.status(response.status).json({ error: "Fetch failed" });

    const contentType = response.headers.get("content-type") || "image/png";
    const ext = contentType.includes("pdf") ? "pdf" : contentType.includes("jpg") ? "jpg" : "png";

    res.setHeader("Content-Type", contentType);
    res.setHeader("Content-Disposition", `attachment; filename="canva-export.${ext}"`);

    const buffer = await response.arrayBuffer();
    res.send(Buffer.from(buffer));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
