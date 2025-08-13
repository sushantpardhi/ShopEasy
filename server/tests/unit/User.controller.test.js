import { describe, it, expect, vi, beforeEach } from "vitest";
import UserController from "../../src/controllers/User.controller.js";
import userService from "../../src/Services/User.service.js";
import cartService from "../../src/Services/Cart.service.js";
import wishlistService from "../../src/Services/Wishlist.service.js";
import Validation from "../../src/Utils/Validation.js";
import Response from "../../src/Utils/Response.js";

vi.mock("../../src/Services/User.service.js");
vi.mock("../../src/Services/Cart.service.js");
vi.mock("../../src/Services/Wishlist.service.js");
vi.mock("../../src/Utils/Validation.js");
vi.mock("../../src/Utils/Response.js");

const mockRes = {
    status: vi.fn().mockReturnThis(),
    json: vi.fn(),
};

beforeEach(() => {
    vi.clearAllMocks();
});

describe("UserController", () => {
    describe("getAll", () => {
        it("should return success with users", async () => {
            userService.getAllUsers.mockResolvedValue([{ name: "Alice" }]);
            await UserController.getAll({}, mockRes);
            expect(Response.success).toHaveBeenCalledWith(
                mockRes,
                "Users fetched successfully",
                { users: [{ name: "Alice" }] },
                200,
                "GET_USERS_SUCCESS"
            );
        });

        it("should return error if no users", async () => {
            userService.getAllUsers.mockResolvedValue(null);
            await UserController.getAll({}, mockRes);
            expect(Response.error).toHaveBeenCalledWith(mockRes, "No users found", {}, 404, "NOT_FOUND");
        });

        it("should handle service failure", async () => {
            userService.getAllUsers.mockRejectedValue(new Error("DB error"));
            await UserController.getAll({}, mockRes);
            expect(Response.error).toHaveBeenCalledWith(
                mockRes,
                "Failed to fetch users",
                {},
                500,
                "SERVER_ERROR",
                expect.any(String)
            );
        });
    });

    describe("getById", () => {
        it("should return validation error for invalid ID", async () => {
            Validation.isObjectId.mockReturnValue(false);
            await UserController.getById({ params: { id: "badid" } }, mockRes);
            expect(Response.error).toHaveBeenCalledWith(mockRes, "Invalid user ID format", {}, 400, "VALIDATION_ERROR");
        });

        it("should return error if user not found", async () => {
            Validation.isObjectId.mockReturnValue(true);
            userService.getUserById.mockResolvedValue(null);
            await UserController.getById({ params: { id: "123" } }, mockRes);
            expect(Response.error).toHaveBeenCalledWith(mockRes, "User not found", {}, 404, "NOT_FOUND");
        });

        it("should return user if found", async () => {
            Validation.isObjectId.mockReturnValue(true);
            userService.getUserById.mockResolvedValue({ name: "Bob" });
            await UserController.getById({ params: { id: "123" } }, mockRes);
            expect(Response.success).toHaveBeenCalledWith(
                mockRes,
                "User fetched successfully",
                { user: { name: "Bob" } },
                200,
                "GET_USER_SUCCESS"
            );
        });

        it("should handle server error", async () => {
            Validation.isObjectId.mockReturnValue(true);
            userService.getUserById.mockRejectedValue(new Error("fail"));
            await UserController.getById({ params: { id: "123" } }, mockRes);
            expect(Response.error).toHaveBeenCalledWith(
                mockRes,
                "Failed to fetch user",
                {},
                500,
                "SERVER_ERROR",
                expect.any(String)
            );
        });
    });

    describe("update", () => {
        it("should return success if updated", async () => {
            userService.updateUser.mockResolvedValue({ name: "Updated" });
            await UserController.update({ params: { id: "123" }, body: {} }, mockRes);
            expect(Response.success).toHaveBeenCalledWith(
                mockRes,
                "User updated successfully",
                { updatedUser: { name: "Updated" } },
                200,
                "UPDATE_USER_SUCCESS"
            );
        });

        it("should return error if user not found", async () => {
            userService.updateUser.mockResolvedValue(null);
            await UserController.update({ params: { id: "123" }, body: {} }, mockRes);
            expect(Response.error).toHaveBeenCalledWith(mockRes, "User not found", {}, 404, "NOT_FOUND");
        });

        it("should handle update failure", async () => {
            userService.updateUser.mockRejectedValue(new Error("fail"));
            await UserController.update({ params: { id: "123" }, body: {} }, mockRes);
            expect(Response.error).toHaveBeenCalledWith(
                mockRes,
                "Failed to update user",
                {},
                500,
                "SERVER_ERROR",
                expect.any(String)
            );
        });
    });

    describe("delete", () => {
        it("should return validation error for bad ID", async () => {
            Validation.isObjectId.mockReturnValue(false);
            await UserController.delete({ params: { id: "bad" } }, mockRes);
            expect(Response.error).toHaveBeenCalledWith(mockRes, "Invalid user ID format", {}, 400, "VALIDATION_ERROR");
        });

        it("should return error if user not found", async () => {
            Validation.isObjectId.mockReturnValue(true);
            userService.deleteUser.mockResolvedValue(null);
            await UserController.delete({ params: { id: "123" } }, mockRes);
            expect(Response.error).toHaveBeenCalledWith(mockRes, "User not found", {}, 404, "NOT_FOUND");
        });

        it("should delete user, cart, and wishlists", async () => {
            Validation.isObjectId.mockReturnValue(true);
            cartService.deleteCart.mockResolvedValue();
            wishlistService.deleteAllWishlistsByUserId.mockResolvedValue();
            userService.deleteUser.mockResolvedValue({ name: "Deleted" });

            await UserController.delete({ params: { id: "123" } }, mockRes);

            expect(cartService.deleteCart).toHaveBeenCalledWith("123");
            expect(wishlistService.deleteAllWishlistsByUserId).toHaveBeenCalledWith("123");
            expect(userService.deleteUser).toHaveBeenCalledWith("123");

            expect(Response.success).toHaveBeenCalledWith(
                mockRes,
                "User deleted successfully",
                {},
                200,
                "DELETE_USER_SUCCESS"
            );
        });

        it("should handle delete failure", async () => {
            Validation.isObjectId.mockReturnValue(true);
            userService.deleteUser.mockRejectedValue(new Error("fail"));
            await UserController.delete({ params: { id: "123" } }, mockRes);
            expect(Response.error).toHaveBeenCalledWith(
                mockRes,
                "Failed to delete user",
                {},
                500,
                "SERVER_ERROR",
                expect.any(String)
            );
        });
    });
});
