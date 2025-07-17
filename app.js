const express = require("express");
const app = express();
const { connectDB } = require("./src/database");
require("dotenv").config(); // Load environment variables from .env file
const cors = require("cors");

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  if (req.method === 'OPTIONS') {
    return res.status(200).json({});
  }
  next();
});

// Middleware to parse incoming JSON data
app.use(express.json());

// Connect to MongoDB using the MONGO_URI from the .env file
connectDB()
  .then(() => {
    // Start the server after successful database connection
    const port = process.env.PORT || 5000;
    app.listen(port, () => {
      console.log(`Server started on http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
    process.exit(1); // Exit the process on connection error
  });

// Use authentication routes
const authRoutes = require("./src/routes/authRoutes");
app.use("/api/auth", authRoutes);

// Use the movie routes
const movieRoutes = require("./src/routes/movieRoutes");
app.use("/api/movies", movieRoutes);

// Use the genre routes
const genreRouter = require("./src/routes/genreRouter");
app.use("/api/genre", genreRouter);

// Use the industry routes
const industryRouter = require("./src/routes/industryRouter");
app.use("/api/industry", industryRouter);

// Use the language routes
const languageRouter = require("./src/routes/languageRouter");
app.use("/api/language", languageRouter);

// Global Settings Routes
const globalSettingsRoutes = require("./src/routes/globalSettingsRoutes");
app.use("/api/global-settings", globalSettingsRoutes);

// User management routes
const userRoutes = require("./src/routes/userRoutes");
app.use("/api/users", userRoutes);

// bug fixed
