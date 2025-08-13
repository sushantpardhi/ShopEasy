import CategoryModel from "../models/Category.model.js";

class CategoryService {
    addCategory = async (name, description, parentCategory) => {
        return new CategoryModel({
            name,
            description,
            parentCategory
        });
    }

    getAllCategories = async () => {
        return CategoryModel.find({})
            .populate({
                path: 'parentCategory',
                select: '-__v' // Exclude internal fields
            });
    }

    getCategoryById = async (id) => {
        return CategoryModel.findById(id)
            .populate({
                path: 'parentCategory',
                select: '-__v'
            });
    }

    updateCategory = async (id, updatedData) => {
        return CategoryModel.findByIdAndUpdate(id, updatedData, {new: true})
    }

    deleteCategory = async (id) => {
        return CategoryModel.findByIdAndDelete(id);
    }

    getCategoriesByParent = async (parentId) => {
        return CategoryModel.find({parentCategory: parentId});
    }
}

export default new CategoryService();