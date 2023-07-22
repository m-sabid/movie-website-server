const express = require('express');
const app = express();
const { connectDB } = require('./database');
const userRoutes = require('./routes/userRoutes');
require('dotenv').config(); // Load environment variables from .env file

// Middleware to parse incoming JSON data
app.use(express.json());

// Connect to MongoDB using the MONGO_URI from the .env file
connectDB().then(() => {
  // Start the server after successful database connection
  const port = process.env.PORT || 5000;
  app.listen(port, () => {
    console.log(`Server started on http://localhost:${port}`);
  });
})
.catch((err) => {
  console.error('Error connecting to MongoDB:', err);
  process.exit(1); // Exit the process on connection error
});

// Use user routes
app.use('/users', userRoutes);
