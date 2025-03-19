import express from "express";
import {
  createPortfolio,
  updatePortfolio,
  deletePortfolio
} from "../Controllers/PortfolioController.js";
import { authMiddleware } from "../Middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, createPortfolio);
router.put("/:portfolioId", authMiddleware, updatePortfolio);
router.delete("/:portfolioId", authMiddleware, deletePortfolio);

export default router;
