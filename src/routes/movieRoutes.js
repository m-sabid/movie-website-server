const express = require("express");
const router = express.Router();
const movieController = require("../controllers/movieController");
const { authenticateToken, isAdmin } = require("../middleware/authMiddleware");

// GET all movies (requires authentication)
router.get("/", movieController.getAllMovies);

// GET a movie by ID (requires authentication)
router.get("/:id", movieController.getMovieById);

// POST create a new movie (requires authentication and admin)
router.post("/", authenticateToken, isAdmin, movieController.createMovie);

// PATCH update a movie by ID (requires authentication and admin)
router.patch("/:id", authenticateToken, isAdmin, movieController.updateMovie);

// DELETE a movie by ID (requires authentication and admin)
router.delete("/:id", authenticateToken, isAdmin, movieController.deleteMovie);

module.exports = router;
