const { getDB } = require("../database");
const { ObjectId } = require("mongodb");

// Get all movies with pagination and category filtering
async function getAllMovies(req, res) {
  try {
    const db = getDB();
    const {
      industry,
      genre,
      language,
      releaseYearFrom,
      releaseYearTo,
      page = 1,
      limit = 12,
    } = req.query;

    const skip = (page - 1) * limit;

    // Build the filter query dynamically
    const query = {};

    if (industry) query.industry = { $regex: new RegExp(industry, "i") }; // Case-insensitive
    if (genre) query.genre = { $regex: new RegExp(genre, "i") }; // Case-insensitive
    if (language) query.language = { $regex: new RegExp(language, "i") }; // Case-insensitive
 // Log for debugging purposes
 console.log(genre);
    // Add release year filtering if provided
    if (releaseYearFrom || releaseYearTo) {
      query.releaseYear = {};
      if (releaseYearFrom) query.releaseYear.$gte = parseInt(releaseYearFrom);
      if (releaseYearTo) query.releaseYear.$lte = parseInt(releaseYearTo);
    }

    // Fetch movies based on the query
    const movies = await db
      .collection("movies")
      .find(query)
      .skip(skip)
      .limit(Number(limit))
      .toArray();

    // Get the total number of movies for pagination
    const totalMovies = await db.collection("movies").countDocuments(query);
    const totalPages = Math.ceil(totalMovies / limit);

    res.json({
      movies,
      pagination: {
        currentPage: Number(page),
        totalPages,
        totalItems: totalMovies,
      },
    });
  } catch (err) {
    console.error("Error fetching movies:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
}



//  /
//  /
// Get unique industries
async function getIndustries(req, res) {
  try {
    const db = getDB();
    const industries = await db.collection("movies").distinct("industry");

    res.json({ industries });
  } catch (err) {
    console.error("Error fetching industries:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

// Fetch recent movies
async function getRecentMovies(req, res) {
  try {
    const db = getDB();

    // Calculate the cutoff year for recent movies
    const currentYear = new Date().getFullYear();
    const cutoffYear = currentYear - 5;

    // Fetch recent movies released in the last 5 years, sorted by release year
    const recentMovies = await db
      .collection("movies")
      .find({
        $expr: {
          $gte: [{ $toInt: "$releaseYear" }, cutoffYear],
        },
      })
      .sort({ releaseYear: -1 })
      .limit(5)
      .toArray();

    res.json({ movies: recentMovies });
  } catch (err) {
    console.error("Error fetching recent movies:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

// Suggested most watched
async function getSuggestedMovies(req, res) {
  try {
    const db = getDB();

    // Randomly select 5 movies from the "movies" collection
    const randomMovies = await db
      .collection("movies")
      .aggregate([{ $sample: { size: 5 } }]) // Randomly select 5 movies
      .toArray();

    res.json({ movies: randomMovies });
  } catch (err) {
    console.error("Error fetching random movies:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

// Suggested for you
async function getMoviesForYou(req, res) {
  try {
    const db = getDB();

    // Randomly select 5 movies from the "movies" collection
    const randomMovies = await db
      .collection("movies")
      .aggregate([{ $sample: { size: 10 } }])
      .toArray();

    res.json({ movies: randomMovies });
  } catch (err) {
    console.error("Error fetching random movies:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

// Function to create a new movie
async function createMovie(req, res) {
  try {
    const db = getDB();
    const newMovie = req.body;

    // Image upload logic with ImageBB API, followed by updating movie object with URLs
    const posterImageUrl = await uploadImageToImgBB(newMovie.poster);
    const screenShortImageUrl = await uploadImageToImgBB(newMovie.screenShort);

    newMovie.poster = posterImageUrl;
    newMovie.screenShort = screenShortImageUrl;
    newMovie.status = "draft";

    const result = await db.collection("movies").insertOne(newMovie);
    res.json({
      success: result.acknowledged,
      message: "Movie creation successful",
    });
  } catch (err) {
    console.error("Error creating movie:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

// Helper function to upload images to ImageBB
async function uploadImageToImgBB(image) {
  const formData = new FormData();
  formData.append("image", image);
  const imageUploadToken = "01f1da67b6a17d75237a16f95e14bfed";
  const imageHostingUrl = `https://api.imgbb.com/1/upload?key=${imageUploadToken}`;

  const response = await fetch(imageHostingUrl, {
    method: "POST",
    body: formData,
  });
  const data = await response.json();

  if (data.status !== 200) throw new Error("Image upload to ImageBB failed");
  return data.data.url;
}

// Function to get a movie by ID
async function getMovieById(req, res) {
  try {
    const db = getDB();
    const movie = await db
      .collection("movies")
      .findOne({ _id: new ObjectId(req.params.id) });
    res.json(movie || { error: "Movie not found" });
  } catch (err) {
    console.error("Error fetching movie by ID:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

// Function to update a movie by ID
async function updateMovie(req, res) {
  try {
    const db = getDB();
    const updatedMovie = req.body;

    // Update poster image if provided
    if (req.files && req.files.poster)
      updatedMovie.poster = await uploadImageToImgBB(req.files.poster);

    // Update screenShort image if provided
    if (req.files && req.files.screenShort)
      updatedMovie.screenShort = await uploadImageToImgBB(
        req.files.screenShort
      );

    const result = await db
      .collection("movies")
      .updateOne({ _id: new ObjectId(req.params.id) }, { $set: updatedMovie });

    res.json({
      message:
        result.modifiedCount > 0
          ? "Movie updated successfully"
          : "Movie not found",
    });
  } catch (err) {
    console.error("Error updating movie by ID:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

// Function to delete a movie by ID
async function deleteMovie(req, res) {
  try {
    const db = getDB();
    const result = await db
      .collection("movies")
      .deleteOne({ _id: new ObjectId(req.params.id) });
    res.json({
      message:
        result.deletedCount > 0
          ? "Movie deleted successfully"
          : "Movie not found",
    });
  } catch (err) {
    console.error("Error deleting movie by ID:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

// Function to search for movies by movieName
async function searchMovies(req, res) {
  try {
    const db = getDB();
    const { movieName } = req.query;

    // Check if the movieName is provided
    if (!movieName) {
      return res.status(400).json({ error: "movieName parameter is required" });
    }

    // Build the query object for searching by movieName
    const query = {
      movieName: { $regex: movieName, $options: "i" }, // Case-insensitive search
    };

    // Fetch all movies that match the query
    const movies = await db.collection("movies").find(query).toArray();

    res.json({
      movies,
      totalItems: movies.length, // Include the total count of results
    });
  } catch (err) {
    console.error("Error searching for movies:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
}



module.exports = {
  getAllMovies,
  getRecentMovies,
  createMovie,
  getMovieById,
  updateMovie,
  deleteMovie,
  //
  getIndustries,
  getSuggestedMovies,
  getMoviesForYou,
  // Search
  searchMovies,
};
