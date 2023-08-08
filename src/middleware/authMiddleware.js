const jwt = require("jsonwebtoken");
require("dotenv").config();

const jwtSecret = process.env.JWT_SECRET;

// Middleware to verify JWT token and add user to request object
function authenticateToken(req, res, next) {
  const { authorization } = req.header;


  console.log(req, "authorization")

  const token = authorization.split(" ")[1];

  const decoded = jwt.verify(token, jwtSecret);

  console.log(decoded);

  const {} = decoded

    next();
  };

// Middleware to check if the user is an admin
function isAdmin(req, res, next) {
  if (req.user.role !== "admin") {
    return res
      .status(403)
      .json({ error: "Unauthorized: You are not an admin" });
  }

  next();
}

module.exports = { authenticateToken, isAdmin };
