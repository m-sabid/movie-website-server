const express = require("express");
const router = express.Router();
const {
  getGlobalSettings,
  updateGlobalSettings,
  resetGlobalSettings,
} = require("../controllers/globalSettingsController.js");

// Route to fetch current global settings
router.get("/global-settings", getGlobalSettings);

// Route to update global settings
router.put("/global-settings", updateGlobalSettings);

// Route to reset global settings to default
router.post("/reset-global-settings", resetGlobalSettings);

module.exports = router;
