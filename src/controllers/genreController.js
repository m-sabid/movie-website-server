const { ObjectId } = require("mongodb");
const { getDB } = require("../database");

// Get all Genre
async function getAllGenre(req, res) {
  try {
    const db = getDB();
    const genre = await db.collection("genre").find({}).toArray();
    res.json(genre);
  } catch (error) {
    console.error("Error fetching genre:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

// Create Genre
async function createGenre(req, res) {
  try {
    const db = getDB();
    const newGenre = req.body;

    // Check if the genreName already exists
    const existingGenre = await db
      .collection("genre")
      .findOne({ genreName: newGenre.genreName.toLowerCase() });
    if (existingGenre) {
      console.error("Genre name already exists");
      return res
        .status(400)
        .json({ success: false, message: "Genre name already exists" });
    }

    const result = await db.collection("genre").insertOne(newGenre);
    if (result.acknowledged) {
      return res.json({ success: true, message: "Genre creation successful" });
    }
  } catch (error) {
    console.error("Error creating genre:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

// Edit Genre
async function updateGenre(req, res) {
  try {
    const db = getDB();
    const genreId = req.params.id;
    const updatedGenre = req.body;

    // Exclude the _id field from the update operation
    delete updatedGenre._id;

    const result = await db
      .collection("genre")
      .updateOne({ _id: new ObjectId(genreId) }, { $set: updatedGenre });

    if (result.modifiedCount > 0) {
      res.json({ message: "Genre updated successfully" });
    } else {
      res.status(404).json({ error: "Genre not found" });
    }
  } catch (error) {
    console.error("Error updating genre:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

// Delete Genre
async function deleteGenre(req, res) {
  try {
    const db = getDB();
    const genreId = req.params.id;

    const result = await db
      .collection("genre")
      .deleteOne({ _id: new ObjectId(genreId) });

    if (result.deletedCount > 0) {
      res.json({ message: "Genre deleted successfully" });
    } else {
      res.status(404).json({ error: "Genre not found" });
    }
  } catch (error) {
    console.error("Error deleting genre:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

module.exports = {
  getAllGenre,
  createGenre,
  updateGenre,
  deleteGenre,
};
