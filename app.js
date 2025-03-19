import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import connectDB from "./Connection.js";  // Import the connectDB function
import customerRoutes from "./Routers/CustomerRouters.js";
import router from "./Routers/PortfolioRouter.js";
import Portfolio from "./Models/Portfolio.js";  // Import Portfolio model

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use((req, res, next) => {
  const host = req.headers.host;
  const subdomain = host.split('.')[0];  
  req.subdomain = subdomain;
  next();
});

app.get('/', async (req, res) => {
  try {
    const subdomain = req.subdomain;
    const portfolio = await Portfolio.findOne({ subdomain });
    if (!portfolio) return res.status(404).send('Portfolio not found');
    res.json(portfolio);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.use(express.json());
app.use(cookieParser());

app.use("/api/customers", customerRoutes);
app.use("/api/portfolios", router);

connectDB().then(() => {
  app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
});
