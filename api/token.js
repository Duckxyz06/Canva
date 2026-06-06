// api/token.js — Đổi Authorization Code → Access Token (PKCE)
export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "https://duckxyz06.github.io");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const { code, code_verifier, redirect_uri } = req.body;
    if (!code || !code_verifier) {
      return res.status(400).json({ error: "Missing code or code_verifier" });
    }

    const clientId = process.env.CANVA_CLIENT_ID;
    const clientSecret = process.env.CANVA_CLIENT_SECRET;

    const body = new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: redirect_uri || "https://duckxyz06.github.io/Canva/",
      code_verifier,
      client_id: clientId,
      client_secret: clientSecret,
    });

    const response = await fetch("https://api.canva.com/rest/v1/oauth/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: body.toString(),
    });

    const data = await response.json();
    return res.status(response.ok ? 200 : 400).json(data);

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
