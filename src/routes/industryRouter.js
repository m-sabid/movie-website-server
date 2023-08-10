const express = require("express");
const router = express.Router();
const industryController = require("../controllers/industryController");
// const { authenticateToken, isAdmin } = require("../middleware/authMiddleware");

// TODO: Add auth and admin

// GET all movies
router.get("/", industryController.getAllIndustry);

// POST create a new movie
router.post("/", industryController.createIndustry);

// PATCH update a movie by ID
router.patch("/:id", industryController.updateIndustry);

// DELETE a movie by ID
router.delete("/:id", industryController.deleteIndustry);

module.exports = router;
