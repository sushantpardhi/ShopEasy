import express from "express";
import dotenv from "dotenv";
dotenv.config();

import cors from "cors";

const app = express();
import connectDB from "./src/config/db.js";

import authRoutes from "./src/routes/Auth.routes.js";
import userRoutes from "./src/routes/User.routes.js";
import productRoutes from "./src/routes/Product.routes.js";
import categoryRoutes from "./src/routes/Category.routes.js";
import cartRoutes from "./src/routes/Cart.routes.js";
import wishlistRoutes from "./src/routes/Wishlist.routes.js";

import { authMiddleware } from "./src/middleware/Auth.middleware.js";
import cookieParser from "cookie-parser";
import { errorHandler } from "./src/middleware/errorHandler.js";
import Response from "./src/Utils/Response.js";
import rateLimiter from "./src/middleware/RateLimiter.js";
import mongoose from "mongoose";


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.set("trust proxy", 1);
app.use(rateLimiter);
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use("/api/auth", authRoutes);
app.use("/api/user", authMiddleware, userRoutes);
app.use("/api/product", authMiddleware, productRoutes);
app.use("/api/category", authMiddleware, categoryRoutes);
app.use("/api/user/:userId/cart", authMiddleware, cartRoutes);
app.use("/api/user/:userId/wishlist", authMiddleware, wishlistRoutes);

app.get("/api/health", async (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? "up" : "down";

  if (dbStatus === "down") {
    return res.status(500).json({ message: "Database disconnected" });
  }

  res.json({ Server: "OK", DB: dbStatus });
});


app.use((req, res) => {
  Response.error(res, "Route Not Found", {}, 404, "NOT_FOUND");
});

connectDB();

app.use(errorHandler);

export default app;
