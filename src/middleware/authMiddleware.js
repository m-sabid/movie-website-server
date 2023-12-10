const jwt = require("jsonwebtoken");
require("dotenv").config();

const jwtSecret = process.env.JWT_SECRET;

// Middleware to verify JWT token and add user to request object
function authenticateToken(req, res, next) {
//   const { authorization } = req.headers; // Use req.headers instead of req.header

//   if (!authorization || !authorization.startsWith("Bearer ")) {
//     return res.status(401).json({ error: "Unauthorized: Token missing or invalid" });
//   }

//   const token = authorization.split(" ")[1];

//   try {
//     const decoded = jwt.verify(token, jwtSecret);
//     req.user = decoded; // Set req.user to the decoded token
//     next();
//     console.log(decoded)
//   } catch (error) {
//     console.error(error);
//     return res.status(401).json({ error: "Unauthorized: Invalid token" });
//   }
// }

// // Middleware to check if the user is an admin
// function isAdmin(req, res, next) {
//   if (!req.user || req.user.role !== "admin") {
//     return res.status(403).json({ error: "Unauthorized: You are not an admin" });
//   }

  next();
}

module.exports = { authenticateToken, isAdmin };
