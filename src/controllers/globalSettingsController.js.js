const { getDB } = require("../database"); // Assuming getDB connects to the MongoDB database
const { globalSettingsSchema, defaultColors, defaultTypography } = require("../utils/globalSettingsSchema");

// Fetch the current global settings
const getGlobalSettings = async (req, res) => {
  try {
    const db = getDB();
    const collection = db.collection("globalSettings");
    
    // Check if settings exist
    let settings = await collection.findOne({});
    
    // If no settings found, insert default settings
    if (!settings) {
      const defaultSettings = {
        colors: defaultColors,
        typography: defaultTypography,
        siteName: "My Website",
        logo: "/default-logo.png",
      };
      
      // Insert default settings into the database
      await collection.insertOne(defaultSettings);
      settings = defaultSettings; // Assign the default settings to `settings` variable
    }
    
    return res.status(200).json(settings);
  } catch (error) {
    console.error("Error fetching global settings:", error);
    return res.status(500).json({ message: "Error fetching global settings" });
  }
};

// Save or update global settings
const updateGlobalSettings = async (req, res) => {
  try {
    const db = getDB();
    const collection = db.collection("globalSettings");
    
    const { error, value } = globalSettingsSchema.validate(req.body);
    
    if (error) {
      return res.status(400).json({ message: "Validation error", details: error.details });
    }

    
    // Update the settings in the database
    const updatedSettings = await collection.updateOne(
      {}, // Assuming only one settings document
      { $set: value },
      { upsert: true }
    );
    
    // Return updated settings
    return res.status(200).json(updatedSettings);
  } catch (error) {
    console.error("Error updating global settings:", error);
    return res.status(500).json({ message: "Error updating global settings" });
  }
};

// Reset settings to default values
const resetGlobalSettings = async (req, res) => {
  try {
    const db = getDB();
    const collection = db.collection("globalSettings");
    
    // Reset settings to default values
    const resetSettings = {
      colors: defaultColors,
      typography: defaultTypography,
      siteName: "My Website",
      logo: "/default-logo.png",
    };
    
    // Update the settings in the database
    const reset = await collection.updateOne(
      {}, // Assuming only one settings document
      { $set: resetSettings },
      { upsert: true }
    );
    
    // Return reset settings
    return res.status(200).json(resetSettings);
  } catch (error) {
    console.error("Error resetting global settings:", error);
    return res.status(500).json({ message: "Error resetting global settings" });
  }
};

module.exports = {
  getGlobalSettings,
  updateGlobalSettings,
  resetGlobalSettings,
};
