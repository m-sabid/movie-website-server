function validateGlobal(req, res, next) {
    const { siteName, details, logo, colors, typography } = req.body;
  
    if (!siteName || typeof siteName !== "string") {
      return res.status(400).json({ error: "Invalid or missing siteName" });
    }
    if (!details || typeof details !== "string") {
      return res.status(400).json({ error: "Invalid or missing details" });
    }
    if (!logo || typeof logo !== "string") {
      return res.status(400).json({ error: "Invalid or missing logo" });
    }
    if (!colors || typeof colors !== "object") {
      return res.status(400).json({ error: "Invalid or missing colors" });
    }
    if (!typography || typeof typography !== "object") {
      return res.status(400).json({ error: "Invalid or missing typography" });
    }
  
    next();
  }
  
  module.exports = validateGlobal;
  