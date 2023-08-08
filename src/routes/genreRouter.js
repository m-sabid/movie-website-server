const express = require("express");
const router = express.Router();
const genreController = require("../controllers/genreController");
// const { authenticateToken, isAdmin } = require("../middleware/authMiddleware");

// TODO: Add auth and admin

// GET all movies
router.get("/", genreController.getAllGenre);

// POST create a new movie
router.post("/", genreController.createGenre);

// PATCH update a movie by ID
router.patch("/:id", genreController.updateGenre);

// DELETE a movie by ID
router.delete("/:id", genreController.deleteGenre);

module.exports = router;
