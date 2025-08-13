import express from "express";
import WishlistController from "../controllers/Wishlist.controller.js";
import asyncHandler from "../middleware/asyncHandler.js";

const router = express.Router({mergeParams: true});


router.post("/create", asyncHandler(WishlistController.createWishlist));
router.put("/update/:wishlistId", asyncHandler(WishlistController.updateWishlist));
router.get("/get/:wishlistId", asyncHandler(WishlistController.getWishlistById));
router.get("/getAll", asyncHandler(WishlistController.getAllWishlistsByUserId));
router.delete("/delete/:wishlistId", asyncHandler(WishlistController.deleteWishlist));


router.post("/:wishlistId/add", asyncHandler(WishlistController.addToWishlist));
router.get("/:wishlistId/is-in-wishlist/:productId", asyncHandler(WishlistController.isInWishlist));
router.delete("/:wishlistId/remove", asyncHandler(WishlistController.removeFromWishlist));
router.delete("/:wishlistId/clear", asyncHandler(WishlistController.clearWishlist));


export default router;