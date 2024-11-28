const express = require("express");
const router = express.Router();
const {
  getGlobalSettings,
  updateGlobalSettings,
  resetGlobalSettings,
} = require("../controllers/globalSettingsController.js");

// Route to fetch current global settings
router.get("/", getGlobalSettings);

// Route to update global settings
router.patch("/update", updateGlobalSettings);

// Route to reset global settings to default
router.post("/reset", resetGlobalSettings);

module.exports = router;
