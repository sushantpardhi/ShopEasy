import express from "express";
import CategoryController from "../controllers/Category.controller.js";
import asyncHandler from "../middleware/asyncHandler.js";
import {isAdmin} from "../middleware/isAdmin.middleware.js";

const router = express.Router();

// Public routes
router.get("/getAll", asyncHandler(CategoryController.getAll));
router.get("/root", asyncHandler(CategoryController.getRootCategories));
router.get("/:id", asyncHandler(CategoryController.getByID));
router.get(
  "/:id/ancestors",
  asyncHandler(CategoryController.getCategoryWithAncestors)
);
router.get(
  "/:id/children",
  asyncHandler(CategoryController.getChildCategories)
);

// Admin only routes
router.use(isAdmin);
router.post("/", asyncHandler(CategoryController.add));
router.put("/:id", asyncHandler(CategoryController.update));
router.delete("/:id", asyncHandler(CategoryController.deleteByID));

export default router;