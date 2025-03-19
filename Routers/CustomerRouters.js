import express from "express";
import {
  registerCustomer,
  loginCustomer,
  updateSubscription,
  checkSubscription,
  logoutCustomer
} from "../Controllers/CustomerController.js";
import { authMiddleware } from "../Middleware/authMiddleware.js";

const router = express.Router();
router.post("/register", registerCustomer);
router.post("/login", loginCustomer);
router.put("/update-subscription", authMiddleware, updateSubscription);
router.get("/check-subscription", authMiddleware, checkSubscription);
router.post("/logout", logoutCustomer);

export default router;

