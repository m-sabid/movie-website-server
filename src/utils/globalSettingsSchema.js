// globalSettingsSchema.js
const Joi = require("joi");

const defaultColors = {
  mo_primary: "#6b7280",
  mo_secondary: "#1f2937",
  mo_tertiary: "#3B82F6",
  mo_quaternary: "#2563eb",
  mo_primaryText: "#ffffff",
  mo_heading: "#ffffff",
  mo_db_primary: "#4b5563",
  mo_badges_primary: "#3b82f6",
  mo_badges_secondary: "#d1d5db",
  mo_danger: "#ea1b40",
};

const defaultTypography = {
  fontFamily: "Arial, sans-serif",
  headingFont: "Arial, sans-serif",
  bodyFont: "Roboto, sans-serif",
  headingFontSize: "2rem",
  bodyFontSize: "1rem",
  primaryFontSize: "16px",
  fontWeightNormal: "400",   // Add default fontWeightNormal
  fontWeightBold: "700",     // Add default fontWeightBold
};

// Joi schema for global settings validation
const globalSettingsSchema = Joi.object({
  siteName: Joi.string().default("My Website"),
  logo: Joi.string().default("/default-logo.png"),
  colors: Joi.object({
    mo_primary: Joi.string().default(defaultColors.mo_primary),
    mo_secondary: Joi.string().default(defaultColors.mo_secondary),
    mo_tertiary: Joi.string().default(defaultColors.mo_tertiary),
    mo_quaternary: Joi.string().default(defaultColors.mo_quaternary),
    mo_primaryText: Joi.string().default(defaultColors.mo_primaryText),
    mo_heading: Joi.string().default(defaultColors.mo_heading),
    mo_db_primary: Joi.string().default(defaultColors.mo_db_primary),
    mo_badges_primary: Joi.string().default(defaultColors.mo_badges_primary),
    mo_badges_secondary: Joi.string().default(defaultColors.mo_badges_secondary),
    mo_danger: Joi.string().default(defaultColors.mo_danger),
  }),
  typography: Joi.object({
    fontFamily: Joi.string().default(defaultTypography.fontFamily),
    headingFont: Joi.string().default(defaultTypography.headingFont),
    bodyFont: Joi.string().default(defaultTypography.bodyFont),
    headingFontSize: Joi.string().default(defaultTypography.headingFontSize),
    bodyFontSize: Joi.string().default(defaultTypography.bodyFontSize),
    primaryFontSize: Joi.string().default(defaultTypography.primaryFontSize),
    fontWeightNormal: Joi.string().default(defaultTypography.fontWeightNormal), // Add validation for fontWeightNormal
    fontWeightBold: Joi.string().default(defaultTypography.fontWeightBold),     // Add validation for fontWeightBold
  }),
});

module.exports = { globalSettingsSchema, defaultColors, defaultTypography };
