import CartService from "../Services/Cart.service.js";
import Validation from "../Utils/Validation.js";
import Response from "../Utils/Response.js";

class CartController {
    addToCart = async (req, res) => {
        const userId = req.params.userId;
        const {item} = req.body;
        try {
            if (!userId || !item?.productId || !item?.quantity || !item?.priceAtAddition) {
                return Response.error(res, "Missing required item or user data", {}, 400, "VALIDATION_ERROR");
            }
            if (!Validation.isObjectId(userId)) {
                return Response.error(res, "Invalid userId format", {}, 400, "VALIDATION_ERROR");
            }
            const updatedCart = await CartService.addItemToCart(userId, item);
            return Response.success(res, "Item added to cart successfully", {cart: updatedCart}, 200, "ADD_TO_CART_SUCCESS");
        } catch (error) {
            return Response.error(res, "Failed to add item to cart", {}, 500, "SERVER_ERROR", error.message);
        }
    }

    getCart = async (req, res) => {
        const userId = req.params.userId;
        try {
            if (!userId) {
                return Response.error(res, "Missing userId", {}, 400, "VALIDATION_ERROR");
            }
            if (!Validation.isObjectId(userId)) {
                return Response.error(res, "Invalid userId format", {}, 400, "VALIDATION_ERROR");
            }
            const cart = await CartService.getCartByUserId(userId);
            if (!cart) {
                return Response.error(res, "Cart not found", {}, 404, "NOT_FOUND");
            }
            return Response.success(res, "Cart fetched successfully", {cart}, 200, "GET_CART_SUCCESS");
        } catch (error) {
            return Response.error(res, "Failed to fetch cart", {}, 500, "SERVER_ERROR", error.message);
        }
    }

    deleteCartItem = async (req, res) => {
        const userId = req.params.userId;
        const productId = req.params.productId;
        try {
            if (!userId || !productId) {
                return Response.error(res, "Missing userId or productId", {}, 400, "VALIDATION_ERROR");
            }
            if (!Validation.isObjectId(userId)) {
                return Response.error(res, "Invalid userId format", {}, 400, "VALIDATION_ERROR");
            }
            if (!Validation.isObjectId(productId)) {
                return Response.error(res, "Invalid productId format", {}, 400, "VALIDATION_ERROR");
            }
            const updatedCart = await CartService.removeItemFromCart(userId, productId);
            return Response.success(res, "Item removed from cart successfully", {cart: updatedCart}, 200, "REMOVE_FROM_CART_SUCCESS");
        } catch (error) {
            return Response.error(res, "Failed to remove item from cart", {}, 500, "SERVER_ERROR", error.message);
        }
    }

    clearCart = async (req, res) => {
        const userId = req.params.userId;
        try {
            if (!userId) {
                return Response.error(res, "Missing userId", {}, 400, "VALIDATION_ERROR");
            }
            if (!Validation.isObjectId(userId)) {
                return Response.error(res, "Invalid userId format", {}, 400, "VALIDATION_ERROR");
            }
            const clearedCart = await CartService.clearCart(userId);
            return Response.success(res, "Cart cleared successfully", {cart: clearedCart}, 200, "CLEAR_CART_SUCCESS");
        } catch (error) {
            return Response.error(res, "Failed to clear cart", {}, 500, "SERVER_ERROR", error.message);
        }
    }
}

export default new CartController();