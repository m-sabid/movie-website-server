const { ObjectId } = require("mongodb");
const { getDB } = require("../database");

// Get all Industry
async function getAllIndustry(req, res) {
  try {
    const db = getDB();
    const industry = await db.collection("industry").find({}).toArray();
    res.json(industry);
  } catch (error) {
    console.error("Error fetching industry:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

// Create Industry
async function createIndustry(req, res) {
  try {
    const db = getDB();
    const newIndustry = req.body;

    // Check if the industryName already exists
    const existingIndustry = await db
      .collection("industry")
      .findOne({ industryName: newIndustry.industryName.toLowerCase() });
    if (existingIndustry) {
      console.error("Industry name already exists");
      return res
        .status(400)
        .json({ success: false, message: "Industry name already exists" });
    }

    const result = await db.collection("industry").insertOne(newIndustry);
    if (result.acknowledged) {
      return res.json({
        success: true,
        message: "Industry creation successful",
      });
    }
  } catch (error) {
    console.error("Error creating industry:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

// Edit Industry
async function updateIndustry(req, res) {
  try {
    const db = getDB();
    const industryId = req.params.id;
    const updatedIndustry = req.body;

    // Exclude the _id field from the update operation
    delete updatedIndustry._id;

    console.log(updatedIndustry);

    const result = await db
      .collection("industry")
      .updateOne({ _id: new ObjectId(industryId) }, { $set: updatedIndustry });

    if (result.modifiedCount > 0) {
      res.json({ message: "Industry updated successfully" });
    } else {
      res.status(404).json({ error: "Industry not found" });
    }
  } catch (error) {
    console.error("Error updating industry:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

// Delete Industry
async function deleteIndustry(req, res) {
  try {
    const db = getDB();
    const industryId = req.params.id;

    const result = await db
      .collection("industry")
      .deleteOne({ _id: new ObjectId(industryId) });

    if (result.deletedCount > 0) {
      res.json({ message: "Industry deleted successfully" });
    } else {
      res.status(404).json({ error: "Industry not found" });
    }
  } catch (error) {
    console.error("Error deleting Industry:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

module.exports = {
  getAllIndustry,
  createIndustry,
  updateIndustry,
  deleteIndustry,
};
