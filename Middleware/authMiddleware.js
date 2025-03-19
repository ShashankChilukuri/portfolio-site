import jwt from "jsonwebtoken";

const secret = process.env.JWT_SECRET||"Shashank";

export const authMiddleware = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: "Access Denied. No token provided." });

  try {
    const verified = jwt.verify(token, secret);
    req.customerId = verified.id;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};
