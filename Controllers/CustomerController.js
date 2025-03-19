import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Customer from "../Models/Customer.js";

// JWT Secret Key (Move to .env in production)
const secret = process.env.JWT_SECRET||"Shashank";

// 🛡️ Middleware to Verify Token and Extract Customer ID
export const verifyToken = (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ message: "Access Denied. No token provided." });
    }

    // Verify the token and attach customerId to req
    const decoded = jwt.verify(token, secret);
    req.customerId = decoded.id;
    next();
  } catch (error) {
    return res.status(403).json({ message: "Invalid Token." });
  }
};

// 📌 Register a new customer
export const registerCustomer = async (req, res) => {
  try {
    const { fullName, email, mobileNumber, password } = req.body;

    // Check if email already exists
    const existingCustomer = await Customer.findOne({ email });
    if (existingCustomer) {
      return res.status(400).json({ message: "Email already in use" });
    }

    const newCustomer = new Customer({
      fullName,
      email,
      mobileNumber,
      password,
    });
    await newCustomer.save();

    res.status(201).json({ message: "Customer registered successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 📌 Login customer and set token in cookie
export const loginCustomer = async (req, res) => {
  try {
    const { email, password } = req.body;

    const customer = await Customer.findOne({ email });
    if (!customer) {
      return res.status(404).json({ message: "User not found" });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, customer.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign({ id: customer._id }, secret, { expiresIn: "7d" });

    // Set cookie (HTTP-only for security)
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(200).json({ message: "Login successful", customer });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateSubscription = async (req, res) => {
  try {
    const { subscriptionPlan } = req.body;
    const validPlans = ["1 Month", "3 Months", "6 Months", "12 Months"];

    if (!validPlans.includes(subscriptionPlan)) {
      return res.status(400).json({ message: "Invalid subscription plan" });
    }

    // Calculate end date based on plan duration
    let months = parseInt(subscriptionPlan.split(" ")[0]);
    let startDate = new Date();
    let endDate = new Date();
    endDate.setMonth(endDate.getMonth() + months);

    // Update customer subscription
    const customer = await Customer.findByIdAndUpdate(
      req.customerId,
      { subscriptionPlan, subscriptionStartDate: startDate, subscriptionEndDate: endDate },
      { new: true }
    );

    res.status(200).json({ message: "Subscription updated", customer });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const checkSubscription = async (req, res) => {
    try {
      const customer = await Customer.findById(req.customerId);
  
      if (!customer) {
        return res.status(404).json({ message: "Customer not found" });
      }
  
      // Check if subscription exists and is still active
      const isActive =
        customer.subscriptionEndDate &&
        new Date() <= customer.subscriptionEndDate;
  
      res.status(200).json({ isActive: !!isActive });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

export const logoutCustomer = (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ message: "Logged out successfully" });
};
