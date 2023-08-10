const express = require("express");
const router = express.Router();
const languageController = require("../controllers/languageController");
// const { authenticateToken, isAdmin } = require("../middleware/authMiddleware");

// TODO: Add auth and admin

// GET all movies
router.get("/", languageController.getAllLanguage);

// POST create a new movie
router.post("/", languageController.createLanguage);

// PATCH update a movie by ID
router.patch("/:id", languageController.updateLanguage);

// DELETE a movie by ID
router.delete("/:id", languageController.deleteLanguage);

module.exports = router;
