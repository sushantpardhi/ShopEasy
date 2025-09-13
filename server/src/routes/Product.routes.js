import express from "express";
import ProductController from "../controllers/Product.controller.js";
import asyncHandler from "../middleware/asyncHandler.js";
import { isAdmin } from "../middleware/isAdmin.middleware.js";

const router = express.Router();

router.post("/add", isAdmin, asyncHandler(ProductController.add));
router.delete("/delete/:id", isAdmin, asyncHandler(ProductController.delete));
router.put("/update/:id", isAdmin, asyncHandler(ProductController.update));

router.get("/getAll", asyncHandler(ProductController.getAll));
router.get("/get/:id", asyncHandler(ProductController.getById));
router.get(
  "/getByCategory/:categoryId",
  asyncHandler(ProductController.getByCategory)
);
router.get("/search", asyncHandler(ProductController.searchProduct));
router.get(
  "/search-recommendations",
  asyncHandler(ProductController.getSearchRecommendations)
);

export default router;  