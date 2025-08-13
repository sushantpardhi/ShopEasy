import CartModel from "../models/Cart.model.js";
import Validation from "../Utils/Validation.js";
import logger from "../Utils/logger.js";

class CartService {
    async createCart(userId) {
        try {
            logger.info("Creating cart");
            const cart = new CartModel({userId, items: []});
            return await cart.save();
            logger.info("Cart Created");
        } catch (error) {
            logger.error(`Cart error: ${error}`)
            throw new Error(`Failed to create cart: ${error}`)
        }
    }

    async getCartByUserId(userId) {
        return CartModel.findOne({userId})
            .populate({
                path: 'items.productId',
                select: '-__v' // Exclude internal fields, add more if needed
            });
    }

    async addItemToCart(userId, item) {
        // Validate item
        if (!item?.productId || !item?.quantity || !item?.priceAtAddition) {
            throw new Error("Invalid product item");
        }

        if (!Validation.isObjectId(item.productId)) {
            throw new Error("Invalid productId format");
        }

        if (item.quantity <= 0) {
            throw new Error("Quantity must be greater than zero");
        }

        // Get user's cart
        const cart = await this.getCartByUserId(userId);
        if (!cart) {
            throw new Error("Cart not found");
        }

        // Check if the product is already in the cart
        const existingItem = cart.items.find(i => i.productId.toString() === item.productId);

        if (existingItem) {
            existingItem.quantity += item.quantity;
        } else {
            cart.items.push(item);
        }

        return await cart.save();
    }

    async removeItemFromCart(userId, productId) {
        if (!Validation.isObjectId(productId)) {
            throw new Error("Invalid productId format");
        }

        const cart = await this.getCartByUserId(userId);
        if (!cart) {
            throw new Error("Cart not found");
        }

        // Find the item by productId
        const item = cart.items.find(i => i.productId.toString() === productId);
        if (!item) {
            throw new Error("Item not found in cart");
        }

        // Decrement quantity
        item.quantity -= 1;

        // Remove item if quantity hits 0
        if (item.quantity <= 0) {
            cart.items = cart.items.filter(i => i.productId.toString() !== productId);
        }

        return await cart.save();
    }


    async clearCart(userId) {
        const cart = await this.getCartByUserId(userId);
        if (!cart) {
            throw new Error("Cart not found");
        }
        cart.items = [];
        return await cart.save();
    }

    async deleteCart(userId) {
        const cart = await this.getCartByUserId(userId);
        if (!cart) {
            throw new Error("Cart not found");
        }
        return CartModel.deleteOne({userId: userId});
    }
}

export default new CartService();