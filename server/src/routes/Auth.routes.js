import express from "express";
import {authMiddleware} from "../middleware/Auth.middleware.js";
import AuthController from "../controllers/Auth.controller.js";
import asyncHandler from "../middleware/asyncHandler.js";

const router = express.Router();


router.post("/login", asyncHandler(AuthController.login));
router.post("/register", asyncHandler(AuthController.register));
router.post("/logout", asyncHandler(AuthController.logout));

export default router;
