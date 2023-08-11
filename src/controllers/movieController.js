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

    // Upload poster image to ImageBB and get the URL
    const posterFormData = new FormData();
    posterFormData.append("image", newMovie.poster);

    const imageUploadToken = "01f1da67b6a17d75237a16f95e14bfed";
    const imageHostingUrl = `https://api.imgbb.com/1/upload?key=${imageUploadToken}`;

    const posterImageBbResponse = await fetch(imageHostingUrl, {
      method: "POST",
      body: posterFormData,
    });

    const posterImageBbData = await posterImageBbResponse.json();

    if (posterImageBbData.status !== 200) {
      return res
        .status(500)
        .json({ error: "Poster image upload to ImageBB failed" });
    }

    const posterImageUrl = posterImageBbData.data.url;

    // Upload screenShort image to ImageBB and get the URL
    const screenShortFormData = new FormData();
    screenShortFormData.append("image", newMovie.screenShort);

    const screenShortImageBbResponse = await fetch(imageHostingUrl, {
      method: "POST",
      body: screenShortFormData,
    });

    const screenShortImageBbData = await screenShortImageBbResponse.json();

    if (screenShortImageBbData.status !== 200) {
      return res
        .status(500)
        .json({ error: "ScreenShort image upload to ImageBB failed" });
    }

    const screenShortImageUrl = screenShortImageBbData.data.url;

    // Update the newMovie object with the ImageBB URLs
    newMovie.poster = posterImageUrl;
    newMovie.screenShort = screenShortImageUrl;

    // Insert the new movie with the ImageBB URLs into the database
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
    const movie = await db
      .collection("movies")
      .findOne({ _id: ObjectId(movieId) });
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
    const result = await db
      .collection("movies")
      .updateOne({ _id: ObjectId(movieId) }, { $set: updatedMovie });
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
    const result = await db
      .collection("movies")
      .deleteOne({ _id: new ObjectId(movieId) });
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
