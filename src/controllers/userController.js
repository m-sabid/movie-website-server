const { getDB } = require("../database");
const { ObjectId } = require("mongodb");

// Get all users
const getAllUsers = async (req, res) => {
  try {
    const db = getDB();
    const usersCollection = db.collection("users");

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const users = await usersCollection.find({}).skip(skip).limit(limit).toArray();
    const totalUsers = await usersCollection.countDocuments();

    res.status(200).json({ users, totalUsers });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Update user role
const updateUserRole = async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;

  try {
    const db = getDB();
    const usersCollection = db.collection("users");

    const updatedUser = await usersCollection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { role } },
      { returnOriginal: false }
    );

    if (!updatedUser.value) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(updatedUser.value);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Delete user
const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const db = getDB();
    const usersCollection = db.collection("users");

    const deletedUser = await usersCollection.findOneAndDelete({
      _id: new ObjectId(id),
    });

    if (!deletedUser.value) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  getAllUsers,
  updateUserRole,
  deleteUser,
};