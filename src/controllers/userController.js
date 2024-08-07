const jwt = require("jsonwebtoken");
require("dotenv").config();
const { getDB } = require("../database");
const bcrypt = require("bcrypt");
const { validateUser } = require("../utils/regularUserSchema");
const thirdPartyUserSchema = require("../utils/thirdPartyUserSchema");
const { ObjectId } = require("mongodb");

const jwtSecret = process.env.JWT_SECRET;

// Get all users
async function getAllUsers(req, res) {
  try {
    const db = getDB();
    const users = await db.collection("users").find({}).toArray();
    res.json(users);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

// Create a new user
// Function to handle regular user sign-up (with password)
async function createUserWithPassword(req, res) {
  try {
    const db = getDB();
    if (!db) {
      throw new Error("Failed to connect to the database");
    }

    const newUser = req.body;

    // Validate newUser against the user schema using the imported validateUser function
    const { errors, value: validatedUser } = validateUser(newUser);
    if (errors) {
      return res.status(400).json({ errors });
    }

    // Check if the user with the same email already exists in the database
    const existingUser = await db.collection("users").findOne({ email: validatedUser.email });
    if (existingUser) {
      return res.status(409).json({ error: "User with the same email already exists" });
    }

    // Set default value for the role field to 'user' if not present
    validatedUser.role = validatedUser.role || "user";

    // Check if the password is provided
    if (!validatedUser.password) {
      throw new Error("Password is required");
    }

    // Hash the password before saving it in the database
    const hashedPassword = await bcrypt.hash(validatedUser.password, 10);
    console.log("Hashed password:", hashedPassword); // Log hashed password for debugging

    // Replace the plain password with the hashed password in the newUser object
    validatedUser.password = hashedPassword;

    // Insert the new user into the database
    const result = await db.collection("users").insertOne(validatedUser);
    if (result.acknowledged) {
      return res.json({ success: true, message: "User creation successful" });
    } else {
      throw new Error("User creation failed");
    }
  } catch (err) {
    console.error("Error creating user:", err);
    res.status(500).json({ error: "Internal Server Error", details: err.message });
  }
}

// Function to handle third-party user sign-up (without password)
async function createUserWithoutPassword(req, res) {
  try {
    const db = getDB();
    if (!db) {
      throw new Error("Failed to connect to the database");
    }

    const newUser = req.body;

    // Validate newUser against the thirdPartyUserSchema
    const { error, value: validatedUser } = thirdPartyUserSchema.validate(newUser);
    if (error) {
      return res.status(400).json({ errors: error.details });
    }

    // Check if the user with the same email already exists in the database
    const existingUser = await db.collection("users").findOne({ email: validatedUser.email });
    if (existingUser) {
      return res.status(409).json({ error: "User with the same email already exists" });
    }

    // Set default value for the role field to 'user' if not present
    validatedUser.role = validatedUser.role || "user";

    // Remove password and confirmPassword fields if they exist
    delete validatedUser.password;
    delete validatedUser.confirmPassword;

    // Proceed with third-party user sign-up process and save to database
    const result = await db.collection("users").insertOne(validatedUser);
    if (result.acknowledged) {
      return res.json({ success: true, message: "User creation successful" });
    } else {
      throw new Error("User creation failed");
    }
  } catch (err) {
    console.error("Error creating user:", err);
    res.status(500).json({ error: "Internal Server Error", details: err.message });
  }
}

// Get a user by ID
async function getUserById(req, res) {
  try {
    const db = getDB();
    const userId = req.params.id; // Assuming the user ID is passed as a URL parameter
    const user = await db
      .collection("users")
      .findOne({ _id: ObjectId(userId) });
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (err) {
    console.error("Error fetching user by ID:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

// Update a user by ID
async function updateUser(req, res) {
  try {
    const db = getDB();
    const userId = req.params.id; // Assuming the user ID is passed as a URL parameter
    const updatedUser = req.body;
    const result = await db
      .collection("users")
      .updateOne({ _id: ObjectId(userId) }, { $set: updatedUser });
    if (result.modifiedCount > 0) {
      res.json({ message: "User updated successfully" });
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (err) {
    console.error("Error updating user by ID:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

// Delete a user by ID
async function deleteUser(req, res) {
  try {
    const db = getDB();
    const userId = req.params.id; // Assuming the user ID is passed as a URL parameter
    const result = await db
      .collection("users")
      .deleteOne({ _id: ObjectId(userId) });
    if (result.deletedCount > 0) {
      res.json({ message: "User deleted successfully" });
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (err) {
    console.error("Error deleting user by ID:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

// Function to handle user login and issue JWT token
async function loginUser(req, res) {
  const { email, password } = req.body;

  try {
    // Find user in the database
    const db = getDB();
    const user = await db.collection("users").findOne({ email });

    // Check if user exists and password matches
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        email: user.email,
        role: user.role,
        profilePicture: user.profilePicture,
      },
      jwtSecret
    );

    // Send the token in the response
    res.json({ token });
  } catch (error) {
    console.error("Error logging in user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

module.exports = {
  getAllUsers,
  createUserWithPassword,
  createUserWithoutPassword,
  getUserById,
  updateUser,
  deleteUser,
  loginUser,
};
