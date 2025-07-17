const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  updateUserRole,
  deleteUser,
} = require("../controllers/userController");

// Get all users
router.get("/", getAllUsers);

// Update user role
router.put("/:id/role", updateUserRole);

// Delete user
router.delete("/:id", deleteUser);

module.exports = router;