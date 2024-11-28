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
    // Step 1: Connect to the database and select the collection
    const db = getDB();
    const collection = db.collection("globalSettings");

    // Step 2: Update or insert the global settings document
    const result = await collection.updateOne(
      {}, // Match any document, assuming only one settings document exists
      { $set: req.body }, // Update the document with the incoming request body
      { upsert: true } // Insert if no document exists
    );

    // Step 3: Return the response with the update result
    if (result.acknowledged) {
      return res.status(200).json({
        message: "Global settings updated successfully",
        modifiedCount: result.modifiedCount,
        upsertedId: result.upsertedId || null,
      });
    } else {
      return res.status(500).json({
        message: "Failed to update global settings",
      });
    }
  } catch (error) {
    console.error("Error in updateGlobalSettings:", error);
    return res.status(500).json({
      message: "An unexpected error occurred while updating global settings",
    });
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
