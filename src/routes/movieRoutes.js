const express = require("express");
const router = express.Router();
const movieController = require("../controllers/movieController");

// Route to get all movies with pagination and category filtering
router.get("/", movieController.getAllMovies);

// 
// Search
router.get("/search", movieController.searchMovies);

//
//
// Route to get all unique industries
router.get("/release-years", movieController.getReleaseYears);

// Get unique release years
router.get("/industries", movieController.getIndustries);

// Route to get recent movies (filtered by last 5 years)
router.get("/recent", movieController.getSuggestedMovies);

// Route to get for you movies (filtered by last 5 years)
router.get("/forYou", movieController.getMoviesForYou);

// Route to get most watched movies (filtered by last 5 years)
router.get("/most-watched", movieController.getRecentMovies);

// Route to get a movie by ID
router.get("/:id", movieController.getMovieById);

// Route to create a new movie
router.post("/", movieController.createMovie);

// Route to update a movie by ID
router.patch("/:id", movieController.updateMovie);

// Route to delete a movie by ID
router.delete("/:id", movieController.deleteMovie);



module.exports = router;
