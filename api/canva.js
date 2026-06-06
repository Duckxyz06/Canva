// api/canva.js — Proxy Canva REST API
export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "https://duckxyz06.github.io");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Authorization, Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();

  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.status(401).json({ error: "Missing Authorization" });

  const { endpoint } = req.query;
  if (!endpoint) return res.status(400).json({ error: "Missing endpoint" });

  const allowed = ["users/me","designs","folders","assets","brand-templates","apps","exports"];
  if (!allowed.some(e => endpoint.startsWith(e))) {
    return res.status(403).json({ error: "Endpoint not allowed" });
  }

  try {
    const response = await fetch(`https://api.canva.com/rest/v1/${endpoint}`, {
      method: req.method === "POST" ? "POST" : "GET",
      headers: {
        "Authorization": authHeader,
        "Content-Type": "application/json",
      },
      ...(req.method === "POST" && req.body ? { body: JSON.stringify(req.body) } : {})
    });
    const data = await response.json();
    return res.status(response.status).json(data);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
