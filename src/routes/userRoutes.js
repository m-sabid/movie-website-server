const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { authenticateToken, isAdmin } = require("../middleware/authMiddleware");

// Route to login user and get JWT token
router.post("/login", userController.loginUser);

// GET all users
router.get("/", userController.getAllUsers);

// GET a user by ID
router.get("/:id", authenticateToken, isAdmin, userController.getUserById);

// POST create a new user
router.post("/sing_up", userController.createUserWithPassword);
// POST create a new user
router.post("/singUp", userController.createUserWithoutPassword);

// PUT update a user by ID
router.put("/:id", authenticateToken, userController.updateUser);

// DELETE a user by ID
router.delete("/:id", authenticateToken, isAdmin, userController.deleteUser);

module.exports = router;
