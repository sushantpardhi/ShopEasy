import WishlistService from "../Services/Wishlist.service.js";
import Validation from "../Utils/Validation.js";
import Response from "../Utils/Response.js";
import UserService from "../Services/User.service.js";
import ProductService from "../Services/Product.service.js";

class WishListController {
    createWishlist = async (req, res) => {
        const userId = req.params.userId;
        const {name, note} = req.body;

        // Check required fields
        if (!name) {
            return Response.error(res, "Name is required.", {}, 400, "VALIDATION_ERROR");
        }

        await this._userCheck(res, userId);

        const wishlist = await WishlistService.createWishlist(userId, name, note);

        return Response.success(res, "Wishlist created successfully.", wishlist, 201);

    };

    updateWishlist = async (req, res) => {
        const wishlistId = req.params.wishlistId;
        const {name, note} = req.body;

        console.log(wishlistId, name, note);

        await this._wishlistCheck(res, wishlistId);

        // // Prevent duplicate name on update
        // if (name) {
        //     const wishlist = await WishlistService.getWishlistById(wishlistId);
        //     if (!wishlist) {
        //         return Response.error(res, "Wishlist not found.", {}, 404, "NOT_FOUND");
        //     }
        //     const duplicate = await WishlistService.findWishlistByName(wishlist.userId, name);
        //     if (duplicate && duplicate._id.toString() !== wishlistId) {
        //         return Response.error(res, "Wishlist name already exists for this user.", {}, 409, "DUPLICATE_ERROR");
        //     }
        // }

        const updatedWishlist = await WishlistService.updateWishlist(wishlistId, name, note);
        return Response.success(res, "Wishlist updated successfully.", updatedWishlist, 200);
    };

    deleteWishlist = async (req, res) => {
        const {userId, wishlistId} = req.params;

        await this._userCheck(res, userId);
        await this._wishlistCheck(res, wishlistId);

        const wishlist = await WishlistService.getWishlistById(wishlistId);
        if (!wishlist) {
            return Response.error(res, "Wishlist not found.", {}, 404, "NOT_FOUND");
        }
        try {
            const deletedWishlist = await WishlistService.deleteWishlist(wishlistId);
            return Response.success(res, "Wishlist deleted successfully.", deletedWishlist, 200);
        } catch (error) {
            return Response.error(res, error.message, {}, 500, "SERVER_ERROR");
        }
    };

    getWishlistById = async (req, res) => {
        const {userId, wishlistId} = req.params;

        await this._userCheck(res, userId);
        await this._wishlistCheck(res, wishlistId);

        const wishlist = await WishlistService.getWishlistById(wishlistId);
        if (!wishlist) {
            return Response.error(res, "Wishlist not found.", {}, 404, "NOT_FOUND");
        }
        return Response.success(res, "Wishlist fetched successfully.", wishlist, 200);
    };

    getAllWishlistsByUserId = async (req, res) => {
        const userId = req.params.userId;
        if (!userId) {
            return Response.error(res, "User ID is required.", {}, 400, "VALIDATION_ERROR");
        }
        if (!Validation.isObjectId(userId)) {
            return Response.error(res, "Invalid userId", {}, 400, "VALIDATION_ERROR");
        }
        const user = await UserService.getUserById(userId);
        if (!user) {
            return Response.error(res, "User not found.", {}, 404, "NOT_FOUND");
        }
        try {
            const wishlists = await WishlistService.getAllWishlistsByUserId(userId);
            return Response.success(res, "Wishlists fetched successfully.", wishlists, 200);
        } catch (error) {
            return Response.error(res, error.message, {}, 500, "SERVER_ERROR");
        }
    };

    addToWishlist = async (req, res) => {
        const {userId, wishlistId} = req.params;
        const {productId} = req.body;

        await this._userCheck(res, userId);
        await this._wishlistCheck(res, wishlistId);
        if (!(await this._productCheck(res, productId))) return;

        const wishlist = await WishlistService.getWishlistById(wishlistId);
        if (!wishlist) {
            return Response.error(res, "Wishlist not found.", {}, 404, "NOT_FOUND");
        }
        try {
            const updatedWishlist = await WishlistService.addToWishlist(wishlistId, productId);
            return Response.success(res, "Product added to wishlist.", updatedWishlist, 200);
        } catch (error) {
            return Response.error(res, error.message, {}, 500, "SERVER_ERROR");
        }
    };

    removeFromWishlist = async (req, res) => {
        const {userId, wishlistId} = req.params;
        const {productId} = req.body;

        await this._userCheck(res, userId);
        await this._wishlistCheck(res, wishlistId);
        if (!(await this._productCheck(res, productId))) return;

        const wishlist = await WishlistService.getWishlistById(wishlistId);
        if (!wishlist) {
            return Response.error(res, "Wishlist not found.", {}, 404, "NOT_FOUND");
        }

        const isAvailableInWishlist = await WishlistService.isInWishlist(wishlistId, productId);
        if (!isAvailableInWishlist) {
            return Response.error(res, "Product not found in wishlist.", {}, 404, "NOT_FOUND");
        }

        try {
            const updatedWishlist = await WishlistService.removeFromWishlist(wishlistId, productId);
            return Response.success(res, "Product removed from wishlist.", updatedWishlist, 200);
        } catch (error) {
            return Response.error(res, error.message, {}, 500, "SERVER_ERROR");
        }
    };

    clearWishlist = async (req, res) => {
        const {userId, wishlistId} = req.params;

        await this._userCheck(res, userId);
        await this._wishlistCheck(res, wishlistId);

        const wishlist = await WishlistService.getWishlistById(wishlistId);
        if (!wishlist) {
            return Response.error(res, "Wishlist not found.", {}, 404, "NOT_FOUND");
        }
        try {
            const updatedWishlist = await WishlistService.clearWishlist(wishlistId);
            return Response.success(res, "Wishlist cleared successfully.", updatedWishlist, 200);
        } catch (error) {
            return Response.error(res, error.message, {}, 500, "SERVER_ERROR");
        }
    };

    isInWishlist = async (req, res) => {
        const {userId, wishlistId, productId} = req.params;

        await this._userCheck(res, userId);
        await this._wishlistCheck(res, wishlistId);
        if (!(await this._productCheck(res, productId))) return;

        const wishlist = await WishlistService.getWishlistById(wishlistId);
        if (!wishlist) {
            return Response.error(res, "Wishlist not found.", {}, 404, "NOT_FOUND");
        }
        try {
            const isInWishlist = await WishlistService.isInWishlist(wishlistId, productId);
            return Response.success(res, "Product presence checked.", {isInWishlist}, 200);
        } catch (error) {
            return Response.error(res, error.message, {}, 500, "SERVER_ERROR");
        }
    };

    _wishlistCheck = async (res, wishlistId) => {
        if (!wishlistId) {
            return Response.error(res, "Wishlist ID is required.", {}, 400, "VALIDATION_ERROR");
        }
        if (!Validation.isObjectId(wishlistId)) {
            return Response.error(res, "Invalid wishlistId", {}, 400, "VALIDATION_ERROR");
        }
    }

    _productCheck = async (res, productId) => {
        if (!productId) {
            await Response.error(res, "Product ID is required.", {}, 400, "VALIDATION_ERROR");
            return false;
        }
        if (!Validation.isObjectId(productId)) {
            await Response.error(res, "Invalid productId", {}, 400, "VALIDATION_ERROR");
            return false;
        }

        const product = await ProductService.getProductById(productId);
        if (!product) {
            await Response.error(res, "Product not found.", {}, 404, "NOT_FOUND");
            return false;
        }
        return true;
    }


    _userCheck = async (res, userId) => {
        if (!userId) {
            return Response.error(res, "User ID is required.", {}, 400, "VALIDATION_ERROR");
        }
        if (!Validation.isObjectId(userId)) {
            return Response.error(res, "Invalid userId", {}, 400, "VALIDATION_ERROR");
        }
        const user = await UserService.getUserById(userId);
        if (!user) {
            return Response.error(res, "User not found.", {}, 404, "NOT_FOUND");
        }
    }
}

export default new WishListController();