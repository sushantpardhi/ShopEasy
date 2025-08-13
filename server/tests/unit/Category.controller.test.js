import { describe, it, expect, vi, beforeEach } from "vitest";
import CategoryController from "../../src/controllers/Category.controller.js";
import categoryService from "../../src/Services/Category.service.js";
import Validation from "../../src/Utils/Validation.js";

// Mock Express res object
const mockRes = () => {
    const res = {};
    res.status = vi.fn().mockReturnValue(res);
    res.json = vi.fn().mockReturnValue(res);
    return res;
};

// Mocks
vi.mock("../../src/Services/Category.service.js");
vi.mock("../../src/Utils/Validation.js");

describe("CategoryController", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    // ------------------ add ------------------
    describe("add", () => {
        it("should return 400 if name or description is missing", async () => {
            const req = { body: {} };
            const res = mockRes();

            await CategoryController.add(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
        });

        it("should return 201 on successful add", async () => {
            const req = {
                body: { name: "Electronics", description: "Gadgets", parentCategory: null },
            };
            const res = mockRes();

            const mockCategory = {
                name: "Electronics",
                save: vi.fn().mockResolvedValue(),
            };

            categoryService.addCategory.mockResolvedValue(mockCategory);

            await CategoryController.add(req, res);

            expect(mockCategory.save).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    code: "ADD_CATEGORY_SUCCESS",
                    data: { category: mockCategory },
                })
            );
        });

        it("should return 500 on error", async () => {
            const req = {
                body: { name: "A", description: "B" },
            };
            const res = mockRes();

            categoryService.addCategory.mockRejectedValue(new Error("Fail"));

            await CategoryController.add(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
        });
    });

    // ------------------ getAll ------------------
    describe("getAll", () => {
        it("should return 200 with categories", async () => {
            const req = {};
            const res = mockRes();

            const mockCategories = [{ name: "Electronics" }];
            categoryService.getAllCategories.mockResolvedValue(mockCategories);

            await CategoryController.getAll(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    code: "GET_CATEGORIES_SUCCESS",
                })
            );
        });

        it("should return 404 if no categories found", async () => {
            const req = {};
            const res = mockRes();

            categoryService.getAllCategories.mockResolvedValue(null);

            await CategoryController.getAll(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
        });

        it("should return 500 on error", async () => {
            const req = {};
            const res = mockRes();

            categoryService.getAllCategories.mockRejectedValue(new Error("Error"));

            await CategoryController.getAll(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
        });
    });

    // ------------------ getByID ------------------
    describe("getByID", () => {
        it("should return 400 for invalid ID", async () => {
            const req = { params: { id: "invalid" } };
            const res = mockRes();

            Validation.isObjectId.mockReturnValue(false);

            await CategoryController.getByID(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
        });

        it("should return 200 if category found", async () => {
            const req = { params: { id: "validId" } };
            const res = mockRes();

            Validation.isObjectId.mockReturnValue(true);
            const mockCategory = { name: "Phones" };
            categoryService.getCategoryById.mockResolvedValue(mockCategory);

            await CategoryController.getByID(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    code: "GET_CATEGORY_SUCCESS",
                    data: { category: mockCategory },
                })
            );
        });

        it("should return 404 if not found", async () => {
            const req = { params: { id: "validId" } };
            const res = mockRes();

            Validation.isObjectId.mockReturnValue(true);
            categoryService.getCategoryById.mockResolvedValue(null);

            await CategoryController.getByID(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
        });

        it("should return 500 on error", async () => {
            const req = { params: { id: "validId" } };
            const res = mockRes();

            Validation.isObjectId.mockReturnValue(true);
            categoryService.getCategoryById.mockRejectedValue(new Error("Error"));

            await CategoryController.getByID(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
        });
    });

    // ------------------ update ------------------
    describe("update", () => {
        it("should return 400 for invalid ID", async () => {
            const req = { params: { id: "bad" }, body: {} };
            const res = mockRes();

            Validation.isObjectId.mockReturnValue(false);

            await CategoryController.update(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
        });

        it("should return 200 on successful update", async () => {
            const req = { params: { id: "validId" }, body: { name: "New Name" } };
            const res = mockRes();

            Validation.isObjectId.mockReturnValue(true);
            const updated = { name: "New Name" };
            categoryService.updateCategory.mockResolvedValue(updated);

            await CategoryController.update(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    code: "UPDATE_CATEGORY_SUCCESS",
                    data: { updatedCategory: updated },
                })
            );
        });

        it("should return 400 if not found", async () => {
            const req = { params: { id: "validId" }, body: {} };
            const res = mockRes();

            Validation.isObjectId.mockReturnValue(true);
            categoryService.updateCategory.mockResolvedValue(null);

            await CategoryController.update(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
        });

        it("should return 500 on error", async () => {
            const req = { params: { id: "validId" }, body: {} };
            const res = mockRes();

            Validation.isObjectId.mockReturnValue(true);
            categoryService.updateCategory.mockRejectedValue(new Error("Fail"));

            await CategoryController.update(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
        });
    });

    // ------------------ delete ------------------
    describe("delete", () => {
        it("should return 400 for invalid ID", async () => {
            const req = { params: { id: "bad" } };
            const res = mockRes();

            Validation.isObjectId.mockReturnValue(false);

            await CategoryController.delete(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
        });

        it("should return 404 if not found", async () => {
            const req = { params: { id: "valid" } };
            const res = mockRes();

            Validation.isObjectId.mockReturnValue(true);
            categoryService.deleteCategory.mockResolvedValue(null);

            await CategoryController.delete(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
        });

        it("should return 200 on successful delete", async () => {
            const req = { params: { id: "valid" } };
            const res = mockRes();

            Validation.isObjectId.mockReturnValue(true);
            categoryService.deleteCategory.mockResolvedValue({});

            await CategoryController.delete(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    code: "DELETE_CATEGORY_SUCCESS",
                })
            );
        });

        it("should return 500 on error", async () => {
            const req = { params: { id: "valid" } };
            const res = mockRes();

            Validation.isObjectId.mockReturnValue(true);
            categoryService.deleteCategory.mockRejectedValue(new Error("Fail"));

            await CategoryController.delete(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
        });
    });

    // ------------------ getByParent ------------------
    describe("getByParent", () => {
        it("should return 400 for invalid parentId", async () => {
            const req = { params: { parentId: "bad" } };
            const res = mockRes();

            Validation.isObjectId.mockReturnValue(false);

            await CategoryController.getByParent(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
        });

        it("should return 404 if no categories found", async () => {
            const req = { params: { parentId: "valid" } };
            const res = mockRes();

            Validation.isObjectId.mockReturnValue(true);
            categoryService.getCategoriesByParent.mockResolvedValue([]);

            await CategoryController.getByParent(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
        });

        it("should return 200 with categories", async () => {
            const req = { params: { parentId: "valid" } };
            const res = mockRes();

            Validation.isObjectId.mockReturnValue(true);
            const mockCategories = [{ name: "SubCat" }];
            categoryService.getCategoriesByParent.mockResolvedValue(mockCategories);

            await CategoryController.getByParent(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    code: "GET_CATEGORIES_BY_PARENT_SUCCESS",
                })
            );
        });

        it("should return 500 on error", async () => {
            const req = { params: { parentId: "valid" } };
            const res = mockRes();

            Validation.isObjectId.mockReturnValue(true);
            categoryService.getCategoriesByParent.mockRejectedValue(new Error("Fail"));

            await CategoryController.getByParent(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
        });
    });
});
