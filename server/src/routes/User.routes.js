import express from "express";
import asyncHandler from "../middleware/asyncHandler.js";
import UserController from "../controllers/User.controller.js";
import {isAdmin} from "../middleware/isAdmin.middleware.js";

const router = express.Router();



router.get("/getAll", isAdmin, asyncHandler(UserController.getAll));
router.get("/get/:id", isAdmin, asyncHandler(UserController.getById));

// User Routes
router.put("/update/:id", asyncHandler(UserController.update));
router.delete("/delete/:id", asyncHandler(UserController.delete));


export default router;