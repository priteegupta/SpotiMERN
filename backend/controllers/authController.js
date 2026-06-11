// Import required packages
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { validationResult } from "express-validator";
import jwt from "jsonwebtoken";

//  REGISTER USER 
export const registerUser = async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);

    
// If validation fails
if (!errors.isEmpty()) {
  return res.status(400).json({
    errors: errors.array(),
  });
}

// Extract user data from request body
const { name, email, phone, password, role } = req.body;

// Check if user already exists
const existingUser = await User.findOne({ email });

if (existingUser) {
  return res.status(400).json({
    message: "User already exists",
  });
}

// Hash password before saving
const hashedPassword = await bcrypt.hash(password, 10);

// Create new user object
const newUser = new User({
  name,
  email,
  phone,
  password: hashedPassword,
  role: role || "user",
});

// Save user into MongoDB
await newUser.save();

// Success response
res.status(201).json({
  message: "User registered successfully",
});

  } catch (error) {
    // Server error handling
    res.status(500).json({
      message: error.message,
    });
  }
};

//  LOGIN USER 
export const loginUser = async (req, res) => {
  try {

    // Get email and password from request
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });

    // If user not found
    if (!user) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    // Compare entered password with hashed password
    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    // If password incorrect
    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    // Success response
    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

