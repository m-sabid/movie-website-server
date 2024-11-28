const express = require("express");
const app = express();
const { connectDB } = require("./src/database");
require("dotenv").config(); // Load environment variables from .env file
const cors = require("cors");

const corsOptions = {
  origin: "*",
  credentials: true,
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));

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
app.use("/movies", movieRoutes);

// Use the genre routes
const genreRouter = require("./src/routes/genreRouter");
app.use("/genre", genreRouter);

// Use the industry routes
const industryRouter = require("./src/routes/industryRouter");
app.use("/industry", industryRouter);

// Use the language routes
const languageRouter = require("./src/routes/languageRouter");
app.use("/language", languageRouter);

// Global Settings Routes
const globalSettingsRoutes = require("./src/routes/globalSettingsRoutes");
app.use("/global-settings", globalSettingsRoutes)

// bug fixed
