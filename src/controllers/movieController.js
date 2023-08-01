const { getDB } = require("../database");
const { ObjectId } = require("mongodb");

// Function to get all movies
async function getAllMovies(req, res) {
  try {
    const db = getDB();
    const movies = await db.collection("movies").find({}).toArray();
    res.json(movies);
  } catch (err) {
    console.error("Error fetching movies:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

// Function to create a new movie
async function createMovie(req, res) {
  try {
    const db = getDB();
    const newMovie = req.body;
    const result = await db.collection("movies").insertOne(newMovie);
    if (result.acknowledged) {
      return res.json({ success: true, message: "Movie creation successful" });
    }
  } catch (err) {
    console.error("Error creating movie:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

// Function to get a movie by ID
async function getMovieById(req, res) {
  try {
    const db = getDB();
    const movieId = req.params.id;
    const movie = await db.collection("movies").findOne({ _id: ObjectId(movieId) });
    if (movie) {
      res.json(movie);
    } else {
      res.status(404).json({ error: "Movie not found" });
    }
  } catch (err) {
    console.error("Error fetching movie by ID:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

// Function to update a movie by ID
async function updateMovie(req, res) {
  try {
    const db = getDB();
    const movieId = req.params.id;
    const updatedMovie = req.body;
    const result = await db.collection("movies").updateOne({ _id: ObjectId(movieId) }, { $set: updatedMovie });
    if (result.modifiedCount > 0) {
      res.json({ message: "Movie updated successfully" });
    } else {
      res.status(404).json({ error: "Movie not found" });
    }
  } catch (err) {
    console.error("Error updating movie by ID:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

// Function to delete a movie by ID
async function deleteMovie(req, res) {
  try {
    const db = getDB();
    const movieId = req.params.id;
    const result = await db.collection("movies").deleteOne({ _id: ObjectId(movieId) });
    if (result.deletedCount > 0) {
      res.json({ message: "Movie deleted successfully" });
    } else {
      res.status(404).json({ error: "Movie not found" });
    }
  } catch (err) {
    console.error("Error deleting movie by ID:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

module.exports = {
  getAllMovies,
  createMovie,
  getMovieById,
  updateMovie,
  deleteMovie,
};
