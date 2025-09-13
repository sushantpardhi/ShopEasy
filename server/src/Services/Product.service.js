import ProductModel from "../models/Product.model.js";

class ProductService {
  addProduct = async (name, price, description, category, stock) => {
    return new ProductModel({
      name,
      price,
      description,
      category,
      stock,
    });
  };

  getAllProducts = async () => {
    return ProductModel.find({}).populate({
      path: "category",
      select: "-__v", // Exclude internal fields
    });
  };

  getSearchRecommendations = async (query) => {
    // Create a case-insensitive regex pattern for the search query
    const searchPattern = new RegExp(query, "i");

    // Search in both name and description, limit to 5 suggestions
    return ProductModel.find({
      $or: [
        { name: { $regex: searchPattern } },
        { description: { $regex: searchPattern } },
      ],
    })
      .select("name description price") // Only return necessary fields
      .limit(5)
      .populate({
        path: "category",
        select: "name",
      });
  };

  getProductById = async (id) => {
    return ProductModel.findById(id).populate({
      path: "category",
      select: "-__v",
    });
  };

  updateProduct = async (id, updatedData) => {
    return ProductModel.findByIdAndUpdate(id, updatedData, { new: true });
  };

  deleteProduct = async (id) => {
    return ProductModel.findByIdAndDelete(id);
  };

  getProductsByCategory = async (categoryId) => {
    return ProductModel.find({ category: categoryId }).populate({
      path: "category",
      select: "-__v",
    });
  };

  searchProducts = async (query) => {
    return ProductModel.find({
      $or: [
        { name: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
      ],
    }).populate({
      path: "category",
      select: "-__v",
    });
  };
}

export default new ProductService();