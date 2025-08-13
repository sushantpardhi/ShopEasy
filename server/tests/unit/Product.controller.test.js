import { describe, it, expect, vi, beforeEach } from "vitest";
import ProductController from "../../src/controllers/Product.controller.js";
import ProductService from "../../src/Services/Product.service.js";
import Validation from "../../src/Utils/Validation.js";
import Response from "../../src/Utils/Response.js";

vi.mock("../../src/Services/Product.service.js");
vi.mock("../../src/Utils/Validation.js");
vi.mock("../../src/Utils/Response.js");

const mockRes = {
    status: vi.fn().mockReturnThis(),
    json: vi.fn(),
};

beforeEach(() => {
    vi.clearAllMocks();
});

describe("ProductController", () => {
    describe("add", () => {
        it("should return validation error for missing fields", async () => {
            const req = { body: { name: "Test" } };
            await ProductController.add(req, mockRes);
            expect(Response.error).toHaveBeenCalledWith(mockRes, "All fields are required", {}, 400, "VALIDATION_ERROR");
        });

        it("should add product and return success", async () => {
            const product = { save: vi.fn() };
            ProductService.addProduct.mockResolvedValue(product);

            const req = {
                body: {
                    name: "Shirt",
                    price: 25,
                    description: "Cotton shirt",
                    category: "cat123",
                    stock: 10,
                },
            };

            await ProductController.add(req, mockRes);

            expect(product.save).toHaveBeenCalled();
            expect(Response.success).toHaveBeenCalledWith(
                mockRes,
                "Product added successfully",
                { product },
                201,
                "ADD_PRODUCT_SUCCESS"
            );
        });

        it("should handle add product error", async () => {
            ProductService.addProduct.mockRejectedValue(new Error("DB error"));
            const req = {
                body: {
                    name: "Shirt",
                    price: 25,
                    description: "Cotton shirt",
                    category: "cat123",
                    stock: 10,
                },
            };
            await ProductController.add(req, mockRes);
            expect(Response.error).toHaveBeenCalledWith(
                mockRes,
                "Failed to add product",
                {},
                500,
                "SERVER_ERROR",
                expect.any(String)
            );
        });
    });

    describe("getAll", () => {
        it("should return 404 if no products", async () => {
            ProductService.getAllProducts.mockResolvedValue([]);
            await ProductController.getAll({}, mockRes);
            expect(Response.error).toHaveBeenCalledWith(mockRes, "No products found", {}, 404, "NOT_FOUND");
        });

        it("should return products", async () => {
            const products = [{ name: "P1" }];
            ProductService.getAllProducts.mockResolvedValue(products);
            await ProductController.getAll({}, mockRes);
            expect(Response.success).toHaveBeenCalledWith(
                mockRes,
                "Products fetched successfully",
                { products },
                200,
                "GET_PRODUCTS_SUCCESS"
            );
        });

        it("should handle error", async () => {
            ProductService.getAllProducts.mockRejectedValue(new Error("fail"));
            await ProductController.getAll({}, mockRes);
            expect(Response.error).toHaveBeenCalled();
        });
    });

    describe("getById", () => {
        it("should return validation error for invalid ID", async () => {
            Validation.isObjectId.mockReturnValue(false);
            await ProductController.getById({ params: { id: "bad" } }, mockRes);
            expect(Response.error).toHaveBeenCalledWith(mockRes, "Invalid user ID format", {}, 400, "VALIDATION_ERROR");
        });

        it("should return 404 if product not found", async () => {
            Validation.isObjectId.mockReturnValue(true);
            ProductService.getProductById.mockResolvedValue(null);
            await ProductController.getById({ params: { id: "123" } }, mockRes);
            expect(Response.error).toHaveBeenCalledWith(mockRes, "Product not found", {}, 404, "NOT_FOUND");
        });

        it("should return product if found", async () => {
            Validation.isObjectId.mockReturnValue(true);
            ProductService.getProductById.mockResolvedValue({ name: "Shoes" });
            await ProductController.getById({ params: { id: "123" } }, mockRes);
            expect(Response.success).toHaveBeenCalled();
        });
    });

    describe("update", () => {
        it("should validate product ID", async () => {
            Validation.isObjectId.mockReturnValue(false);
            await ProductController.update({ params: { id: "bad" }, body: {} }, mockRes);
            expect(Response.error).toHaveBeenCalledWith(mockRes, "Invalid product ID format", {}, 400, "VALIDATION_ERROR");
        });

        it("should return not found if update fails", async () => {
            Validation.isObjectId.mockReturnValue(true);
            ProductService.updateProduct.mockResolvedValue(null);
            await ProductController.update({ params: { id: "123" }, body: {} }, mockRes);
            expect(Response.error).toHaveBeenCalledWith(mockRes, "Product not found", {}, 400, "NOT_FOUND");
        });

        it("should update product", async () => {
            Validation.isObjectId.mockReturnValue(true);
            ProductService.updateProduct.mockResolvedValue({ name: "Updated" });
            await ProductController.update({ params: { id: "123" }, body: {} }, mockRes);
            expect(Response.success).toHaveBeenCalledWith(
                mockRes,
                "Product updated successfully",
                { updatedProduct: { name: "Updated" } },
                200,
                "UPDATE_PRODUCT_SUCCESS"
            );
        });
    });

    describe("delete", () => {
        it("should return validation error", async () => {
            Validation.isObjectId.mockReturnValue(false);
            await ProductController.delete({ params: { id: "bad" } }, mockRes);
            expect(Response.error).toHaveBeenCalled();
        });

        it("should return not found", async () => {
            Validation.isObjectId.mockReturnValue(true);
            ProductService.deleteProduct.mockResolvedValue(null);
            await ProductController.delete({ params: { id: "123" } }, mockRes);
            expect(Response.error).toHaveBeenCalled();
        });

        it("should delete product", async () => {
            Validation.isObjectId.mockReturnValue(true);
            ProductService.deleteProduct.mockResolvedValue({ name: "Deleted" });
            await ProductController.delete({ params: { id: "123" } }, mockRes);
            expect(Response.success).toHaveBeenCalledWith(mockRes, "Product deleted successfully", {}, 200, "DELETE_PRODUCT_SUCCESS");
        });
    });

    describe("getByCategory", () => {
        it("should validate category ID", async () => {
            Validation.isObjectId.mockReturnValue(false);
            await ProductController.getByCategory({ params: { categoryId: "bad" } }, mockRes);
            expect(Response.error).toHaveBeenCalled();
        });

        it("should return not found", async () => {
            Validation.isObjectId.mockReturnValue(true);
            ProductService.getProductsByCategory.mockResolvedValue([]);
            await ProductController.getByCategory({ params: { categoryId: "123" } }, mockRes);
            expect(Response.error).toHaveBeenCalledWith(
                mockRes,
                "No products found in this category",
                {},
                404,
                "NOT_FOUND"
            );
        });

        it("should return products", async () => {
            Validation.isObjectId.mockReturnValue(true);
            ProductService.getProductsByCategory.mockResolvedValue([{ name: "Shirt" }]);
            await ProductController.getByCategory({ params: { categoryId: "123" } }, mockRes);
            expect(Response.success).toHaveBeenCalled();
        });
    });
});
