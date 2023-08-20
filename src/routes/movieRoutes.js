const express = require("express");
const router = express.Router();
const movieController = require("../controllers/movieController");
// const { authenticateToken, isAdmin } = require("../middleware/authMiddleware");

// TODO: Add auth and admin

// GET all movies
router.get("/", movieController.getAllMovies);

// GET a movie by ID
router.get("/:id", movieController.getMovieById);

// POST create a new movie
router.post("/", movieController.createMovie);

// PATCH update a movie by ID
router.patch("/:id", movieController.updateMovie);

// DELETE a movie by ID
router.delete("/:id", movieController.deleteMovie);

module.exports = router;
