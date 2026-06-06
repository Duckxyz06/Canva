export default async function handler(req, res) {
  try {
    const { code } = req.query;

    if (!code) {
      return res.status(400).json({
        error: "Missing code"
      });
    }

    return res.status(200).json({
      receivedCode: true,
      codeLength: code.length
    });

  } catch (err) {
    return res.status(500).json({
      error: err.message
    });
  }
}
