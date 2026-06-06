export default function handler(req, res) {
  res.status(200).json({
    hasClientId: !!process.env.CANVA_CLIENT_ID,
    hasSecret: !!process.env.CANVA_CLIENT_SECRET
  });
}
