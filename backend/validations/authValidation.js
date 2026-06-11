// Import validation functions
import { body } from "express-validator";

// Validation rules for user registration
export const registerValidation = [
  // Name validation
  body("name").notEmpty().withMessage("Name is required"),

  // Email validation
  body("email").isEmail().withMessage("Valid email is required"),

  // Phone validation
  body("phone")
    .isLength({ min: 10, max: 10 })
    .withMessage("Phone number must be 10 digits"),

  // Password validation
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
];
