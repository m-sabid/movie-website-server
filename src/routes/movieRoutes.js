const express = require("express");
const router = express.Router();
const movieController = require("../controllers/movieController");
const { authenticateToken, isAdmin } = require("../middleware/authMiddleware");

// GET all movies
router.get("/", authenticateToken, movieController.getAllMovies);

// GET a movie by ID
router.get("/:id", authenticateToken, movieController.getMovieById);

// POST create a new movie
router.post("/", authenticateToken, isAdmin, movieController.createMovie);

// PUT update a movie by ID
router.put("/:id", authenticateToken, isAdmin, movieController.updateMovie);

// DELETE a movie by ID
router.delete("/:id", authenticateToken, isAdmin, movieController.deleteMovie);

module.exports = router;
