import Validation from "../Utils/Validation.js";
import ProductService from "../Services/Product.service.js";
import Response from "../Utils/Response.js";


class ProductController {
  add = async (req, res) => {
    const { name, price, description, category, stock } = req.body;
    try {
      if (!name || !price || !description || !category || !stock) {
        return Response.error(
          res,
          "All fields are required",
          {},
          400,
          "VALIDATION_ERROR"
        );
      }
      const newProduct = await ProductService.addProduct(
        name,
        price,
        description,
        category,
        stock
      );
      await newProduct.save();
      return Response.success(
        res,
        "Product added successfully",
        { product: newProduct },
        201,
        "ADD_PRODUCT_SUCCESS"
      );
    } catch (error) {
      return Response.error(
        res,
        "Failed to add product",
        {},
        500,
        "SERVER_ERROR",
        error.message
      );
    }
  };

  getAll = async (req, res) => {
    try {
      const products = await ProductService.getAllProducts();
      if (!products || products.length === 0) {
        return Response.error(res, "No products found", {}, 404, "NOT_FOUND");
      }
      return Response.success(
        res,
        "Products fetched successfully",
        { products },
        200,
        "GET_PRODUCTS_SUCCESS"
      );
    } catch (error) {
      return Response.error(
        res,
        "Failed to fetch products",
        {},
        500,
        "SERVER_ERROR",
        error.message
      );
    }
  };

  getById = async (req, res) => {
    try {
      if (!Validation.isObjectId(req.params.id)) {
        return Response.error(
          res,
          "Invalid user ID format",
          {},
          400,
          "VALIDATION_ERROR"
        );
      }
      const product = await ProductService.getProductById(req.params.id);
      if (!product) {
        return Response.error(res, "Product not found", {}, 404, "NOT_FOUND");
      }
      return Response.success(
        res,
        "Product fetched successfully",
        { product },
        200,
        "GET_PRODUCT_SUCCESS"
      );
    } catch (error) {
      return Response.error(
        res,
        "Failed to fetch product",
        {},
        500,
        "SERVER_ERROR",
        error.message
      );
    }
  };

  update = async (req, res) => {
    try {
      if (!Validation.isObjectId(req.params.id)) {
        return Response.error(
          res,
          "Invalid product ID format",
          {},
          400,
          "VALIDATION_ERROR"
        );
      }
      const updatedProduct = await ProductService.updateProduct(
        req.params.id,
        req.body
      );
      if (!updatedProduct) {
        return Response.error(res, "Product not found", {}, 400, "NOT_FOUND");
      }
      return Response.success(
        res,
        "Product updated successfully",
        { updatedProduct },
        200,
        "UPDATE_PRODUCT_SUCCESS"
      );
    } catch (error) {
      return Response.error(
        res,
        "Failed to update product",
        {},
        500,
        "SERVER_ERROR",
        error.message
      );
    }
  };

  delete = async (req, res) => {
    try {
      if (!Validation.isObjectId(req.params.id)) {
        return Response.error(
          res,
          "Invalid product ID format",
          {},
          400,
          "VALIDATION_ERROR"
        );
      }
      const deletedProduct = await ProductService.deleteProduct(req.params.id);
      if (!deletedProduct) {
        return Response.error(res, "Product not found", {}, 404, "NOT_FOUND");
      }
      return Response.success(
        res,
        "Product deleted successfully",
        {},
        200,
        "DELETE_PRODUCT_SUCCESS"
      );
    } catch (error) {
      return Response.error(
        res,
        "Failed to delete product",
        {},
        500,
        "SERVER_ERROR",
        error.message
      );
    }
  };

  getByCategory = async (req, res) => {
    try {
      if (!Validation.isObjectId(req.params.categoryId)) {
        return Response.error(
          res,
          "Invalid category ID format",
          {},
          400,
          "VALIDATION_ERROR"
        );
      }
      const products = await ProductService.getProductsByCategory(
        req.params.categoryId
      );
      if (!products || products.length === 0) {
        return Response.error(
          res,
          "No products found in this category",
          {},
          404,
          "NOT_FOUND"
        );
      }
      return Response.success(
        res,
        "Products fetched successfully",
        { products },
        200,
        "GET_PRODUCTS_BY_CATEGORY_SUCCESS"
      );
    } catch (error) {
      return Response.error(
        res,
        "Failed to fetch products by category",
        {},
        500,
        "SERVER_ERROR",
        error.message
      );
    }
  };

  searchProduct = async (req, res) => {
    const { query } = req.query;
    try {
      if (!query) {
        return Response.error(
          res,
          "Search query is required",
          {},
          400,
          "VALIDATION_ERROR"
        );
      }
      const products = await ProductService.searchProducts(query);
      if (!products || products.length === 0) {
        return Response.error(
          res,
          "No products found matching the search query",
          {},
          404,
          "NOT_FOUND"
        );
      }
      return Response.success(
        res,
        "Products fetched successfully",
        { products },
        200,
        "SEARCH_PRODUCT_SUCCESS"
      );
    } catch (error) {
      return Response.error(
        res,
        "Failed to search products",
        {},
        500,
        "SERVER_ERROR",
        error.message
      );
    }
  };
}

export default new ProductController();