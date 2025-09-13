import CategoryModel from "../models/Category.model.js";

class CategoryService {
    addCategory = async (name, description, parentCategory) => {
      const category = new CategoryModel({
        name,
        description,
        parentCategory,
      });
      await category.save();
      return category;
    };

    getAllCategories = async (includeChildren = false) => {
      const query = CategoryModel.find({}).populate({
        path: "parentCategory",
        select: "name description",
      });

      if (includeChildren) {
        query.populate({
          path: "children",
          select: "name description",
        });
      }

      return query.exec();
    };

    getRootCategories = async (includeChildren = false) => {
      const query = CategoryModel.find({ parentCategory: null }).select(
        "name description"
      );

      if (includeChildren) {
        query.populate({
          path: "children",
          select: "name description",
        });
      }

      return query.exec();
    };

    getCategoryById = async (id, includeChildren = false) => {
      const query = CategoryModel.findById(id).populate({
        path: "parentCategory",
        select: "name description",
      });

      if (includeChildren) {
        query.populate({
          path: "children",
          select: "name description",
        });
      }

      return query.exec();
    };

    getCategoryWithAncestors = async (id) => {
      const category = await this.getCategoryById(id);
      if (!category) return null;

      const ancestors = [];
      let currentCategory = category;

      while (currentCategory.parentCategory) {
        currentCategory = await this.getCategoryById(
          currentCategory.parentCategory
        );
        ancestors.unshift(currentCategory);
      }

      return { category, ancestors };
    };

    updateCategory = async (id, updatedData) => {
      return CategoryModel.findByIdAndUpdate(id, updatedData, {
        new: true,
      }).populate("children");
    };

    deleteCategory = async (id) => {
      // First, get all child categories
      const childCategories = await CategoryModel.find({ parentCategory: id });

      // Update all child categories to point to the parent of the category being deleted
      const categoryToDelete = await CategoryModel.findById(id);
      if (categoryToDelete) {
        await CategoryModel.updateMany(
          { parentCategory: id },
          { parentCategory: categoryToDelete.parentCategory }
        );
      }

      // Now delete the category
      return CategoryModel.findByIdAndDelete(id);
    };

    getCategoriesByParent = async (parentId) => {
      return CategoryModel.find({ parentCategory: parentId })
        .select("name description")
        .populate({
          path: "children",
          select: "name description",
        });
    };
}

export default new CategoryService();