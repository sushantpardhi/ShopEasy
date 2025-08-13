import express from "express";
import CategoryController from "../controllers/Category.controller.js";
import asyncHandler from "../middleware/asyncHandler.js";
import {isAdmin} from "../middleware/isAdmin.middleware.js";

const router = express.Router();

router.use(isAdmin);

router.post("/add", asyncHandler(CategoryController.add));
router.get("/getAll", asyncHandler(CategoryController.getAll));
router.get("/get/:id", asyncHandler(CategoryController.getByID));
router.put("/update/:id", asyncHandler(CategoryController.update));
router.delete("/delete/:id", asyncHandler(CategoryController.delete));
router.get("/getByParent/:parentId", asyncHandler(CategoryController.getByParent));

export default router;