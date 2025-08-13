import WishListModel from "../models/Wishlist.model.js";
import logger from "../Utils/logger.js";

class WishlistService {
    createWishlist = async (userId, name, note) => {
        try {
            logger.info(`Creating wishlist`);
            if (!name || !userId) {
                throw new Error("Name and User ID are required.");
            }

            const wishlist = new WishListModel({
                name,
                userId,
                note,
                products: []
            });
            return await wishlist.save();
            logger.info("Wishlist Created")
        } catch (err) {
            logger.error(`Wishlist error: ${err}`)
            throw new Error(`Failed to create wishlist ${err}`)
        }
    }

    updateWishlist = async (wishlistId, name, note) => {
        if (!wishlistId) {
            throw new Error("Wishlist ID is required.");
        }

        const updatedWishlist = await WishListModel.findByIdAndUpdate(
            wishlistId,
            {name, note},
            {new: true}
        );

        if (!updatedWishlist) {
            throw new Error("Wishlist not found.");
        }

        return updatedWishlist;
    }

    deleteWishlist = async (wishlistId) => {
        if (!wishlistId) {
            throw new Error("Wishlist ID is required.");
        }

        const deletedWishlist = await WishListModel.findByIdAndDelete(wishlistId);

        if (!deletedWishlist) {
            throw new Error("Wishlist not found.");
        }

        return deletedWishlist;
    }

    getWishlistById = async (wishlistId) => {
        if (!wishlistId) {
            throw new Error("Wishlist ID is required.");
        }

        const wishlist = await WishListModel.findById(wishlistId).populate("products");

        if (!wishlist) {
            throw new Error("Wishlist not found.");
        }

        return wishlist;
    }

    getAllWishlistsByUserId = async (userId) => {
        if (!userId) {
            throw new Error("User ID is required.");
        }

        return await WishListModel.find({userId}).populate("products");


    }

    addToWishlist = async (wishlistId, productId) => {
        if (!wishlistId || !productId) {
            throw new Error("Wishlist ID and Product ID are required.");
        }

        const wishlist = await WishListModel.findByIdAndUpdate(
            wishlistId,
            {$addToSet: {products: productId}},
            {new: true}
        );

        if (!wishlist) {
            throw new Error("Wishlist not found.");
        }

        return wishlist;
    }

    removeFromWishlist = async (wishlistId, productId) => {
        if (!wishlistId || !productId) {
            throw new Error("Wishlist ID and Product ID are required.");
        }

        const wishlist = await WishListModel.findByIdAndUpdate(
            wishlistId,
            {$pull: {products: productId}},
            {new: true}
        );

        if (!wishlist) {
            throw new Error("Wishlist not found.");
        }

        return wishlist;
    }

    clearWishlist = async (wishlistId) => {
        if (!wishlistId) {
            throw new Error("Wishlist ID is required.");
        }

        const wishlist = await WishListModel.findByIdAndUpdate(
            wishlistId,
            {products: []},
            {new: true}
        );

        if (!wishlist) {
            throw new Error("Wishlist not found.");
        }

        return wishlist;
    }

    isInWishlist = async (wishlistId, productId) => {
        if (!wishlistId || !productId) {
            throw new Error("Wishlist ID and Product ID are required.");
        }

        const wishlist = await WishListModel.findById(wishlistId);

        if (!wishlist) {
            throw new Error("Wishlist not found.");
        }

        return wishlist.products.includes(productId);
    }

    deleteAllWishlistsByUserId = async (userId) => {
        if (!userId) {
            throw new Error("User ID is required.");
        }

        const result = await WishListModel.deleteMany({userId});

        if (result.deletedCount === 0) {
            throw new Error("No wishlists found for this user.");
        }

        return result;
    }
}

export default new WishlistService();