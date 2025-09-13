import { useState, useContext, useEffect } from "react";
import "./AddProductModal.css"; // Reuse the same CSS
import { CategoryContext } from "../../Context/CategoryContext";
import { ProductContext } from "../../Context/ProductContext";

function EditProductModal({ product, onClose, onProductUpdated }) {
  console.log("EditProductModal - received product:", product); // Debug log

  const [formData, setFormData] = useState(() => {
    if (!product) {
      console.error("No product provided to EditProductModal");
      return {
        name: "",
        description: "",
        price: "",
        category: "",
        stock: "",
      };
    }

    // Safe access to category ID
    let categoryId = "";
    if (product.category) {
      categoryId =
        typeof product.category === "object"
          ? product.category._id || product.category.id || ""
          : product.category;
    }

    console.log("EditProductModal - initializing with categoryId:", categoryId); // Debug log

    return {
      name: product.name || "",
      description: product.description || "",
      price: product.price || "",
      category: categoryId,
      stock: product.stock || "",
    };
  });

  const [errors, setErrors] = useState({});
  const {
    categories,
    loading: categoryLoading,
    error: categoryError,
    fetchCategories,
  } = useContext(CategoryContext);
  const { updateProduct, loading } = useContext(ProductContext);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.description.trim())
      newErrors.description = "Description is required";
    if (!formData.price) newErrors.price = "Price is required";
    else if (isNaN(formData.price) || Number(formData.price) <= 0)
      newErrors.price = "Enter valid price";
    if (!formData.category) newErrors.category = "Select a category";
    if (!formData.stock) newErrors.stock = "Stock is required";
    else if (isNaN(formData.stock) || Number(formData.stock) < 0)
      newErrors.stock = "Enter valid stock quantity";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submitted with data:", formData);

    if (!validate()) {
      console.log("Form validation failed");
      return;
    }

    console.log("Form validation passed, attempting to update product");
    try {
      const result = await updateProduct(product._id, {
        name: formData.name,
        description: formData.description,
        price: Number(formData.price),
        category: formData.category,
        stock: Number(formData.stock),
      });

      if (result.success) {
        if (onProductUpdated) {
          onProductUpdated(result.product);
        }
        onClose();
      } else {
        setErrors((prev) => ({
          ...prev,
          submit: result.error.message || "Failed to update product",
        }));
      }
    } catch (error) {
      console.error("Failed to update product:", error);
      setErrors((prev) => ({
        ...prev,
        submit: "Failed to update product. Please try again.",
      }));
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <h3>Edit Product</h3>
        <form onSubmit={handleSubmit} className="product-form" noValidate>
          <div className="form-group">
            <label htmlFor="name">Product Name</label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              className={errors.name ? "input-error" : ""}
            />
            {errors.name && <span className="error-text">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className={errors.description ? "input-error" : ""}
            ></textarea>
            {errors.description && (
              <span className="error-text">{errors.description}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="price">Price (in ₹)</label>
            <input
              id="price"
              name="price"
              type="number"
              step="0.01"
              value={formData.price}
              onChange={handleChange}
              className={errors.price ? "input-error" : ""}
            />
            {errors.price && <span className="error-text">{errors.price}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="category">Category</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className={errors.category ? "input-error" : ""}
              disabled={categoryLoading}
            >
              <option value="">-- Select category --</option>
              {!categoryLoading &&
                !categoryError &&
                Array.isArray(categories) &&
                categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name || "Unnamed Category"}
                  </option>
                ))}
            </select>
            {errors.category && (
              <span className="error-text">{errors.category}</span>
            )}
            {categoryLoading && (
              <span className="info-text">Loading categories...</span>
            )}
            {categoryError && (
              <span className="error-text">
                Error loading categories:{" "}
                {typeof categoryError === "string"
                  ? categoryError
                  : "Failed to load categories"}
              </span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="stock">Stock</label>
            <input
              id="stock"
              name="stock"
              type="number"
              step="1"
              value={formData.stock}
              onChange={handleChange}
              className={errors.stock ? "input-error" : ""}
            />
            {errors.stock && <span className="error-text">{errors.stock}</span>}
          </div>

          {errors.submit && (
            <div className="error-message">{errors.submit}</div>
          )}
          <div className="button-group">
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? "Updating Product..." : "Update Product"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="close-modal-btn"
              disabled={loading}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditProductModal;
