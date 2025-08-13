import { describe, it, expect, vi, beforeEach } from "vitest";
import WishlistController from "../../src/controllers/Wishlist.controller.js";
import WishlistService from "../../src/Services/Wishlist.service.js";
import Validation from "../../src/Utils/Validation.js";
import Response from "../../src/Utils/Response.js";
import UserService from "../../src/Services/User.service.js";
import ProductService from "../../src/Services/Product.service.js";

const mockRes = () => {
    const res = {};
    res.status = vi.fn().mockReturnValue(res);
    res.json = vi.fn().mockReturnValue(res);
    return res;
};

vi.mock("../../src/Services/Wishlist.service.js");
vi.mock("../../src/Services/User.service.js");
vi.mock("../../src/Services/Product.service.js");
vi.mock("../../src/Utils/Validation.js");
vi.mock("../../src/Utils/Response.js");

describe("WishListController", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe("createWishlist", () => {
        it("should return 400 if name is missing", async () => {
            const req = { params: { userId: "user1" }, body: { note: "note" } };
            const res = mockRes();

            await WishlistController.createWishlist(req, res);

            expect(Response.error).toHaveBeenCalledWith(res, "Name is required.", {}, 400, "VALIDATION_ERROR");
        });

        it("should create a wishlist", async () => {
            const req = { params: { userId: "user1" }, body: { name: "New Wishlist", note: "note" } };
            const res = mockRes();

            Validation.isObjectId.mockReturnValue(true);
            UserService.getUserById.mockResolvedValue({ _id: "user1" });
            WishlistService.createWishlist.mockResolvedValue({ _id: "wishlist1", name: "New Wishlist" });

            await WishlistController.createWishlist(req, res);

            expect(Response.success).toHaveBeenCalledWith(res, "Wishlist created successfully.", { _id: "wishlist1", name: "New Wishlist" }, 201);
        });
    });

    describe("updateWishlist", () => {
        it("should update the wishlist", async () => {
            const req = { params: { wishlistId: "wl123" }, body: { name: "Updated Name", note: "Updated Note" } };
            const res = mockRes();

            Validation.isObjectId.mockReturnValue(true);
            WishlistService.getWishlistById.mockResolvedValue({ _id: "wl123", userId: "user1" });
            WishlistService.updateWishlist.mockResolvedValue({ _id: "wl123", name: "Updated Name", note: "Updated Note" });

            await WishlistController.updateWishlist(req, res);

            expect(Response.success).toHaveBeenCalledWith(res, "Wishlist updated successfully.", { _id: "wl123", name: "Updated Name", note: "Updated Note" }, 200);
        });
    });

    describe("deleteWishlist", () => {
        it("should return 404 if wishlist is not found", async () => {
            const req = { params: { userId: "user1", wishlistId: "wl1" } };
            const res = mockRes();

            Validation.isObjectId.mockReturnValue(true);
            UserService.getUserById.mockResolvedValue({});
            WishlistService.getWishlistById.mockResolvedValue(null);

            await WishlistController.deleteWishlist(req, res);

            expect(Response.error).toHaveBeenCalledWith(res, "Wishlist not found.", {}, 404, "NOT_FOUND");
        });

        it("should delete wishlist", async () => {
            const req = { params: { userId: "user1", wishlistId: "wl1" } };
            const res = mockRes();

            Validation.isObjectId.mockReturnValue(true);
            UserService.getUserById.mockResolvedValue({});
            WishlistService.getWishlistById.mockResolvedValue({ _id: "wl1" });
            WishlistService.deleteWishlist.mockResolvedValue({ _id: "wl1", deleted: true });

            await WishlistController.deleteWishlist(req, res);

            expect(Response.success).toHaveBeenCalledWith(res, "Wishlist deleted successfully.", { _id: "wl1", deleted: true }, 200);
        });
    });

    describe("getWishlistById", () => {
        it("should return wishlist", async () => {
            const req = { params: { userId: "user1", wishlistId: "wl1" } };
            const res = mockRes();

            Validation.isObjectId.mockReturnValue(true);
            UserService.getUserById.mockResolvedValue({});
            WishlistService.getWishlistById.mockResolvedValue({ _id: "wl1", name: "Sample" });

            await WishlistController.getWishlistById(req, res);

            expect(Response.success).toHaveBeenCalledWith(res, "Wishlist fetched successfully.", { _id: "wl1", name: "Sample" }, 200);
        });
    });

    describe("getAllWishlistsByUserId", () => {
        it("should return 400 if userId is invalid", async () => {
            const req = { params: { userId: "invalid" } };
            const res = mockRes();

            Validation.isObjectId.mockReturnValue(false);

            await WishlistController.getAllWishlistsByUserId(req, res);

            expect(Response.error).toHaveBeenCalledWith(res, "Invalid userId", {}, 400, "VALIDATION_ERROR");
        });

        it("should return all wishlists", async () => {
            const req = { params: { userId: "user1" } };
            const res = mockRes();

            Validation.isObjectId.mockReturnValue(true);
            UserService.getUserById.mockResolvedValue({});
            WishlistService.getAllWishlistsByUserId.mockResolvedValue([{ name: "W1" }, { name: "W2" }]);

            await WishlistController.getAllWishlistsByUserId(req, res);

            expect(Response.success).toHaveBeenCalledWith(res, "Wishlists fetched successfully.", [{ name: "W1" }, { name: "W2" }], 200);
        });
    });

    describe("addToWishlist", () => {
        it("should add product to wishlist", async () => {
            const req = {
                params: { userId: "user1", wishlistId: "wl1" },
                body: { productId: "prod1" }
            };
            const res = mockRes();

            Validation.isObjectId.mockReturnValue(true);
            UserService.getUserById.mockResolvedValue({});
            WishlistService.getWishlistById.mockResolvedValue({ _id: "wl1" });
            ProductService.getProductById.mockResolvedValue({ _id: "prod1" });
            WishlistService.addToWishlist.mockResolvedValue({ name: "W", products: ["prod1"] });

            await WishlistController.addToWishlist(req, res);

            expect(Response.success).toHaveBeenCalledWith(res, "Product added to wishlist.", { name: "W", products: ["prod1"] }, 200);
        });
    });

    describe("removeFromWishlist", () => {
        it("should return 404 if product not in wishlist", async () => {
            const req = {
                params: { userId: "user1", wishlistId: "wl1" },
                body: { productId: "prod1" }
            };
            const res = mockRes();

            Validation.isObjectId.mockReturnValue(true);
            UserService.getUserById.mockResolvedValue({});
            WishlistService.getWishlistById.mockResolvedValue({ _id: "wl1" });
            ProductService.getProductById.mockResolvedValue({ _id: "prod1" });
            WishlistService.isInWishlist.mockResolvedValue(false);

            await WishlistController.removeFromWishlist(req, res);

            expect(Response.error).toHaveBeenCalledWith(res, "Product not found in wishlist.", {}, 404, "NOT_FOUND");
        });

        it("should remove product from wishlist", async () => {
            const req = {
                params: { userId: "user1", wishlistId: "wl1" },
                body: { productId: "prod1" }
            };
            const res = mockRes();

            Validation.isObjectId.mockReturnValue(true);
            UserService.getUserById.mockResolvedValue({});
            WishlistService.getWishlistById.mockResolvedValue({ _id: "wl1" });
            ProductService.getProductById.mockResolvedValue({ _id: "prod1" });
            WishlistService.isInWishlist.mockResolvedValue(true);
            WishlistService.removeFromWishlist.mockResolvedValue({ name: "Updated", products: [] });

            await WishlistController.removeFromWishlist(req, res);

            expect(Response.success).toHaveBeenCalledWith(res, "Product removed from wishlist.", { name: "Updated", products: [] }, 200);
        });
    });

    describe("clearWishlist", () => {
        it("should clear wishlist", async () => {
            const req = { params: { userId: "user1", wishlistId: "wl1" } };
            const res = mockRes();

            Validation.isObjectId.mockReturnValue(true);
            UserService.getUserById.mockResolvedValue({});
            WishlistService.getWishlistById.mockResolvedValue({ _id: "wl1" });
            WishlistService.clearWishlist.mockResolvedValue({ _id: "wl1", products: [] });

            await WishlistController.clearWishlist(req, res);

            expect(Response.success).toHaveBeenCalledWith(res, "Wishlist cleared successfully.", { _id: "wl1", products: [] }, 200);
        });
    });

    describe("isInWishlist", () => {
        it("should return product presence", async () => {
            const req = { params: { userId: "user1", wishlistId: "wl1", productId: "prod1" } };
            const res = mockRes();

            Validation.isObjectId.mockReturnValue(true);
            UserService.getUserById.mockResolvedValue({});
            ProductService.getProductById.mockResolvedValue({});
            WishlistService.getWishlistById.mockResolvedValue({});
            WishlistService.isInWishlist.mockResolvedValue(true);

            await WishlistController.isInWishlist(req, res);

            expect(Response.success).toHaveBeenCalledWith(res, "Product presence checked.", { isInWishlist: true }, 200);
        });
    });
});
