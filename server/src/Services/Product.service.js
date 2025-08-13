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