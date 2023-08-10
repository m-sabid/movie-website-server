const { ObjectId } = require("mongodb");
const { getDB } = require("../database");

// Get all Language
async function getAllLanguage(req, res) {
  try {
    const db = getDB();
    const language = await db.collection("language").find({}).toArray();
    res.json(language);
  } catch (error) {
    console.error("Error fetching language:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

// Create Language
async function createLanguage(req, res) {
  try {
    const db = getDB();
    const newLanguage = req.body;

    // Check if the languageName already exists
    const existingLanguage = await db
      .collection("language")
      .findOne({ languageName: newLanguage.languageName.toLowerCase() });
    if (existingLanguage) {
      console.error("Language name already exists");
      return res
        .status(400)
        .json({ success: false, message: "Language name already exists" });
    }

    const result = await db.collection("language").insertOne(newLanguage);
    if (result.acknowledged) {
      return res.json({
        success: true,
        message: "Language creation successful",
      });
    }
  } catch (error) {
    console.error("Error creating language:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

// Edit Language
async function updateLanguage(req, res) {
  try {
    const db = getDB();
    const languageId = req.params.id;
    const updatedLanguage = req.body;

    // Exclude the _id field from the update operation
    delete updatedLanguage._id;

    const result = await db
      .collection("language")
      .updateOne({ _id: new ObjectId(languageId) }, { $set: updatedLanguage });

    if (result.modifiedCount > 0) {
      res.json({ message: "Language updated successfully" });
    } else {
      res.status(404).json({ error: "Language not found" });
    }
  } catch (error) {
    console.error("Error updating language:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

// Delete Language
async function deleteLanguage(req, res) {
  try {
    const db = getDB();
    const languageId = req.params.id;

    const result = await db
      .collection("language")
      .deleteOne({ _id: new ObjectId(languageId) });

    if (result.deletedCount > 0) {
      res.json({ message: "Language deleted successfully" });
    } else {
      res.status(404).json({ error: "Language not found" });
    }
  } catch (error) {
    console.error("Error deleting language:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

module.exports = {
  getAllLanguage,
  createLanguage,
  updateLanguage,
  deleteLanguage,
};
