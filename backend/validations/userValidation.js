import { body } from "express-validator";

// Validation rules for user profile updates
export const profileValidation = [
  body("name")
    .notEmpty()
    .withMessage("Name is required")
    .matches(/^[A-Za-z\s]+$/)
    .withMessage("Name can only contain letters"),

  body("email")
    .isEmail()
    .withMessage("Valid email is required"),

  body("phone")
    .isLength({ min: 10, max: 10 })
    .withMessage("Phone number must be exactly 10 digits")
    .isNumeric()
    .withMessage("Phone number must contain only numbers"),
];
