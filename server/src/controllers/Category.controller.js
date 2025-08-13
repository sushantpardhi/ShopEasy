import categoryService from "../Services/Category.service.js";
import Validation from "../Utils/Validation.js";
import Response from "../Utils/Response.js";

class CategoryController {
    add = async (req, res) => {
        const {name, description, parentCategory} = req.body;
        try {
            if (!name || !description) {
                return Response.error(res, "Name and description are required", {}, 400, "VALIDATION_ERROR");
            }
            const newCategory = await categoryService.addCategory(name, description, parentCategory);
            await newCategory.save();
            return Response.success(res, "Category added successfully", {category: newCategory}, 201, "ADD_CATEGORY_SUCCESS");
        } catch (error) {
            return Response.error(res, "Failed to add category", {}, 500, "SERVER_ERROR", error.message);
        }
    }

    getAll = async (req, res) => {
        try {
            const categories = await categoryService.getAllCategories();
            if (!categories) {
                return Response.error(res, "No Category found", {}, 404, "NOT_FOUND");
            }
            return Response.success(res, "Categories fetched successfully", {categories}, 200, "GET_CATEGORIES_SUCCESS");
        } catch (error) {
            return Response.error(res, "Failed to fetch categories", {}, 500, "SERVER_ERROR", error.message);
        }
    }

    getByID = async (req, res) => {
        try {
            if (!Validation.isObjectId(req.params.id)) {
                return Response.error(res, "Invalid user ID format", {}, 400, "VALIDATION_ERROR");
            }
            const category = await categoryService.getCategoryById(req.params.id);
            if (!category) {
                return Response.error(res, "Category not found", {}, 404, "NOT_FOUND");
            }
            return Response.success(res, "Category fetched successfully", {category}, 200, "GET_CATEGORY_SUCCESS");
        } catch (error) {
            return Response.error(res, "Failed to fetch category", {}, 500, "SERVER_ERROR", error.message);
        }
    }

    update = async (req, res) => {
        try {
            if (!Validation.isObjectId(req.params.id)) {
                return Response.error(res, "Invalid category ID format", {}, 400, "VALIDATION_ERROR");
            }
            const updatedCategory = await categoryService.updateCategory(req.params.id, req.body);
            if (!updatedCategory) {
                return Response.error(res, "Category not found", {}, 400, "NOT_FOUND");
            }
            return Response.success(res, "Category updated successfully", {updatedCategory}, 200, "UPDATE_CATEGORY_SUCCESS");
        } catch (error) {
            return Response.error(res, "Failed to update category", {}, 500, "SERVER_ERROR", error.message);
        }
    }

    delete = async (req, res) => {
        try {
            if (!Validation.isObjectId(req.params.id)) {
                return Response.error(res, "Invalid category ID format", {}, 400, "VALIDATION_ERROR");
            }
            const deletedCategory = await categoryService.deleteCategory(req.params.id);
            if (!deletedCategory) {
                return Response.error(res, "Category not found", {}, 404, "NOT_FOUND");
            }
            return Response.success(res, "Category deleted successfully", {}, 200, "DELETE_CATEGORY_SUCCESS");
        } catch (error) {
            return Response.error(res, "Failed to delete category", {}, 500, "SERVER_ERROR", error.message);
        }
    }

    getByParent = async (req, res) => {
        try {
            if (!Validation.isObjectId(req.params.parentId)) {
                return Response.error(res, "Invalid parent category ID format", {}, 400, "VALIDATION_ERROR");
            }
            const categories = await categoryService.getCategoriesByParent(req.params.parentId);
            if (!categories || categories.length === 0) {
                return Response.error(res, "No categories found for this parent category", {}, 404, "NOT_FOUND");
            }
            return Response.success(res, "Categories fetched successfully", {categories}, 200, "GET_CATEGORIES_BY_PARENT_SUCCESS");
        } catch (error) {
            return Response.error(res, "Failed to fetch categories by parent", {}, 500, "SERVER_ERROR", error.message);
        }
    }
}

export default new CategoryController();