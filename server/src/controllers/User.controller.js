import userService from "../Services/User.service.js";
import Validation from "../Utils/Validation.js";
import cartService from "../Services/Cart.service.js";
import Response from "../Utils/Response.js";
import wishlistService from "../Services/Wishlist.service.js";

class UserController {
    getAll = async (req, res) => {
        try {
            const users = await userService.getAllUsers();
            if (!users) {
                return Response.error(res, "No users found", {}, 404, "NOT_FOUND");
            }
            return Response.success(res, "Users fetched successfully", {users}, 200, "GET_USERS_SUCCESS");
        } catch (error) {
            return Response.error(res, "Failed to fetch users", {}, 500, "SERVER_ERROR", error.message);
        }
    };

    getById = async (req, res) => {
        try {
            if (!Validation.isObjectId(req.params.id)) {
                return Response.error(res, "Invalid user ID format", {}, 400, "VALIDATION_ERROR");
            }
            const user = await userService.getUserById(req.params.id);
            if (!user) {
                return Response.error(res, "User not found", {}, 404, "NOT_FOUND");
            }
            return Response.success(res, "User fetched successfully", {user}, 200, "GET_USER_SUCCESS");
        } catch (error) {
            return Response.error(res, "Failed to fetch user", {}, 500, "SERVER_ERROR", error.message);
        }
    };

    update = async (req, res) => {
        try {
            const updatedUser = await userService.updateUser(req.params.id, req.body);
            if (!updatedUser) {
                return Response.error(res, "User not found", {}, 404, "NOT_FOUND");
            }
            return Response.success(res, "User updated successfully", {updatedUser}, 200, "UPDATE_USER_SUCCESS");
        } catch (error) {
            return Response.error(res, "Failed to update user", {}, 500, "SERVER_ERROR", error.message);
        }
    };

    delete = async (req, res) => {
        try {
            if (!Validation.isObjectId(req.params.id)) {
                return Response.error(res, "Invalid user ID format", {}, 400, "VALIDATION_ERROR");
            }
            await cartService.deleteCart(req.params.id);
            await wishlistService.deleteAllWishlistsByUserId(req.params.id);

            const deletedUser = await userService.deleteUser(req.params.id);
            if (!deletedUser) {
                return Response.error(res, "User not found", {}, 404, "NOT_FOUND");
            }
            return Response.success(res, "User deleted successfully", {}, 200, "DELETE_USER_SUCCESS");
        } catch (error) {
            return Response.error(res, "Failed to delete user", {}, 500, "SERVER_ERROR", error.message);
        }
    };
}

export default new UserController();
