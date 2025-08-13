import { describe, it, expect, vi, beforeEach } from "vitest";
import CartController from "../../src/controllers/Cart.controller.js";
import CartService from "../../src/Services/Cart.service.js";
import Validation from "../../src/Utils/Validation.js";

// Mock Express res object
const mockRes = () => {
    const res = {};
    res.status = vi.fn().mockReturnValue(res);
    res.json = vi.fn().mockReturnValue(res);
    return res;
};

// Mocks
vi.mock("../../src/Services/Cart.service.js");
vi.mock("../../src/Utils/Validation.js");

describe("CartController", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    // ------------------ addToCart ------------------
    describe("addToCart", () => {
        it("should return 400 if required fields are missing", async () => {
            const req = { params: { userId: "" }, body: { item: {} } };
            const res = mockRes();

            await CartController.addToCart(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    code: "VALIDATION_ERROR",
                    message: "Missing required item or user data",
                })
            );
        });

        it("should return 400 for invalid userId", async () => {
            const req = {
                params: { userId: "invalid" },
                body: {
                    item: {
                        productId: "prod123",
                        quantity: 1,
                        priceAtAddition: 9.99,
                    },
                },
            };
            const res = mockRes();

            Validation.isObjectId.mockReturnValue(false);

            await CartController.addToCart(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    message: "Invalid userId format",
                })
            );
        });

        it("should return 200 and updated cart on success", async () => {
            const req = {
                params: { userId: "validUserId" },
                body: {
                    item: {
                        productId: "prod123",
                        quantity: 1,
                        priceAtAddition: 10,
                    },
                },
            };
            const res = mockRes();

            Validation.isObjectId.mockReturnValue(true);
            const mockCart = { items: [{ productId: "prod123", quantity: 1 }] };
            CartService.addItemToCart.mockResolvedValue(mockCart);

            await CartController.addToCart(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    code: "ADD_TO_CART_SUCCESS",
                    data: { cart: mockCart },
                })
            );
        });

        it("should return 500 if service throws an error", async () => {
            const req = {
                params: { userId: "validUserId" },
                body: {
                    item: {
                        productId: "prod123",
                        quantity: 1,
                        priceAtAddition: 10,
                    },
                },
            };
            const res = mockRes();

            Validation.isObjectId.mockReturnValue(true);
            CartService.addItemToCart.mockRejectedValue(new Error("DB error"));

            await CartController.addToCart(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    message: "Failed to add item to cart",
                    error: "DB error",
                })
            );
        });
    });

    // ------------------ getCart ------------------
    describe("getCart", () => {
        it("should return 400 if userId is missing", async () => {
            const req = { params: {} };
            const res = mockRes();

            await CartController.getCart(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
        });

        it("should return 400 for invalid userId", async () => {
            const req = { params: { userId: "bad" } };
            const res = mockRes();

            Validation.isObjectId.mockReturnValue(false);

            await CartController.getCart(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
        });

        it("should return 404 if cart not found", async () => {
            const req = { params: { userId: "validId" } };
            const res = mockRes();

            Validation.isObjectId.mockReturnValue(true);
            CartService.getCartByUserId.mockResolvedValue(null);

            await CartController.getCart(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
        });

        it("should return 200 with cart if found", async () => {
            const req = { params: { userId: "validId" } };
            const res = mockRes();

            Validation.isObjectId.mockReturnValue(true);
            const cart = { items: [] };
            CartService.getCartByUserId.mockResolvedValue(cart);

            await CartController.getCart(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    code: "GET_CART_SUCCESS",
                    data: { cart },
                })
            );
        });
    });

    // ------------------ deleteCartItem ------------------
    describe("deleteCartItem", () => {
        it("should return 400 if userId or productId missing", async () => {
            const req = { params: { userId: "", productId: "" } };
            const res = mockRes();

            await CartController.deleteCartItem(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
        });

        it("should return 400 for invalid userId or productId", async () => {
            const req = { params: { userId: "bad", productId: "bad" } };
            const res = mockRes();

            Validation.isObjectId.mockReturnValue(false);

            await CartController.deleteCartItem(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
        });

        it("should return 200 on successful deletion", async () => {
            const req = { params: { userId: "valid", productId: "valid" } };
            const res = mockRes();

            Validation.isObjectId.mockReturnValue(true);
            const updatedCart = { items: [] };
            CartService.removeItemFromCart.mockResolvedValue(updatedCart);

            await CartController.deleteCartItem(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    code: "REMOVE_FROM_CART_SUCCESS",
                    data: { cart: updatedCart },
                })
            );
        });
    });

    // ------------------ clearCart ------------------
    describe("clearCart", () => {
        it("should return 400 if userId is missing", async () => {
            const req = { params: {} };
            const res = mockRes();

            await CartController.clearCart(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
        });

        it("should return 400 for invalid userId", async () => {
            const req = { params: { userId: "bad" } };
            const res = mockRes();

            Validation.isObjectId.mockReturnValue(false);

            await CartController.clearCart(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
        });

        it("should return 200 on successful clear", async () => {
            const req = { params: { userId: "valid" } };
            const res = mockRes();

            Validation.isObjectId.mockReturnValue(true);
            const clearedCart = { items: [] };
            CartService.clearCart.mockResolvedValue(clearedCart);

            await CartController.clearCart(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    code: "CLEAR_CART_SUCCESS",
                    data: { cart: clearedCart },
                })
            );
        });

        it("should return 500 if error occurs", async () => {
            const req = { params: { userId: "valid" } };
            const res = mockRes();

            Validation.isObjectId.mockReturnValue(true);
            CartService.clearCart.mockRejectedValue(new Error("Unexpected error"));

            await CartController.clearCart(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    message: "Failed to clear cart",
                    error: "Unexpected error",
                })
            );
        });
    });
});
