import express from "express";
import asyncHandler from "../middleware/asyncHandler.js";
import CartController from "../controllers/Cart.controller.js";

const router = express.Router({mergeParams: true});



router.post("/add", asyncHandler(CartController.addToCart));
router.get("/get", asyncHandler(CartController.getCart));
router.delete("/delete/:productId", asyncHandler(CartController.deleteCartItem));
router.delete("/clear", asyncHandler(CartController.clearCart));

export default router;