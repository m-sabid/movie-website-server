const jwt = require("jsonwebtoken");
const { getDB } = require("../database");
const bcrypt = require("bcrypt");
const { userSchema } = require("../utils/userSchema"); // Import the Joi user schema

// Helper function to generate JWT token
const generateToken = (user) => {
  return jwt.sign(
    { userId: user._id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "12h" }
  );
};

// Signup Controller
const signup = async (req, res) => {
  const { email, password, displayName } = req.body;

  // Validate the request data using Joi
  const { error } = userSchema.validate({ email, password, displayName });
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  try {
    const db = getDB();
    const usersCollection = db.collection("users");

    const existingUser = await usersCollection.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = {
      email,
      password: hashedPassword,
      displayName,
    };

    const result = await usersCollection.insertOne(newUser); // Save the new user to MongoDB
    const token = generateToken(result.ops[0]);

    res.status(201).json({
      token,
      user: { email: newUser.email, displayName: newUser.displayName },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Login Controller
const login = async (req, res) => {
  const { email, password } = req.body;

  // Validate the request data using Joi
  const { error } = userSchema.validate({ email, password });
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  try {
    const db = getDB();
    const usersCollection = db.collection("users");

    const user = await usersCollection.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const token = generateToken(user);
    res.status(200).json({
      token,
      user: { email: user.email, displayName: user.displayName },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const googleLogin = async (req, res) => {
  const { name, email, profilePicture, role } = req.body;

  if (!name || !email || !profilePicture) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const db = getDB(); // Get the existing database connection
    const usersCollection = db.collection("users");

    // Check if user exists
    let user = await usersCollection.findOne({ email });

    if (!user) {
      // Insert new user if they don't exist
      const newUser = {
        name,
        email,
        profilePicture,
        createdAt: new Date(),
        role,
      };
      const result = await usersCollection.insertOne(newUser);
      user = await usersCollection.findOne({ _id: result.insertedId }); // Retrieve the inserted user
    }

    // Create a JWT token with user info
    const token = jwt.sign(
      {
        email: user.email,
        name: user.name,
        profilePicture: user.profilePicture,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "12h" }
    );

    // Send the user data and token separately in the response
    res.status(200).json({ user, token });
  } catch (error) {
    console.error("Error during Google login:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  signup,
  login,
  googleLogin,
};
