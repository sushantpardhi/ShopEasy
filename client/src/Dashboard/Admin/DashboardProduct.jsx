import "./DashboardProduct.css";
import { useContext, useEffect, useState } from "react";
import { ProductContext } from "../../Context/ProductContext";
import Loader from "../../components/Loader/Loader";
import AddProductModal from "../Modal/AddProductModal";
import EditProductModal from "../Modal/EditProductModal";

function DashboardProduct() {
  const [products, setProducts] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [error, setError] = useState(null);
  const { loading, getAllProducts, deleteProduct } = useContext(ProductContext);

  const fetchProducts = async () => {
    try {
      setError(null);
      const response = await getAllProducts();
      console.log("Products response:", response); // Debug log
      if (response?.success && response?.products?.data?.products) {
        setProducts(response.products.data.products);
      } else {
        setError("Failed to fetch products data");
        console.error("Invalid products response:", response);
      }
    } catch (error) {
      setError(error.message || "Failed to fetch products");
      console.error("Failed to fetch products", error);
    }
  };

  useEffect(() => {
    fetchProducts();
    // Removing getAllProducts from dependencies to prevent infinite loop
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleOpenAddModal = () => {
    setShowAddModal(true);
  };

  const handleCloseAddModal = () => {
    setShowAddModal(false);
  };

  const handleOpenEditModal = (product) => {
    console.log("Opening edit modal with product:", product); // Debug log
    if (!product) {
      console.error("No product provided to edit");
      return;
    }
    setSelectedProduct(product);
    setShowEditModal(true);
  };

  const handleCloseEditModal = () => {
    setSelectedProduct(null);
    setShowEditModal(false);
  };

  const handleAddProduct = async (productData) => {
    try {
      await fetchProducts();
      setShowAddModal(false);
    } catch (error) {
      setError("Failed to refresh products after adding");
      console.error("Failed to refresh products after adding:", error);
    }
  };

  const handleEditProduct = async (updatedProduct) => {
    try {
      await fetchProducts();
      handleCloseEditModal();
    } catch (error) {
      setError("Failed to refresh products after updating");
      console.error("Failed to refresh products after updating:", error);
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        const result = await deleteProduct(productId);
        if (result.success) {
          await fetchProducts();
        } else {
          setError(result.error.message || "Failed to delete product");
        }
      } catch (error) {
        setError("Failed to delete product");
        console.error("Failed to delete product:", error);
      }
    }
  };

  return (
    <div className="dashboard-product">
      <div className="dashboard-header">
        <h2>Product Management</h2>
        <button className="add-product-button" onClick={handleOpenAddModal}>
          Add New Product
        </button>
      </div>

      {showAddModal && (
        <AddProductModal
          onClose={handleCloseAddModal}
          onAddProduct={handleAddProduct}
        />
      )}

      {showEditModal && selectedProduct && (
        <EditProductModal
          product={selectedProduct}
          onClose={handleCloseEditModal}
          onProductUpdated={handleEditProduct}
        />
      )}

      {error && (
        <div className="error-message">
          {error}
          <button onClick={fetchProducts} className="retry-btn">
            Retry
          </button>
        </div>
      )}

      {loading ? (
        <Loader />
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Price (₹)</th>
                <th>Description</th>
                <th>Category</th>
                <th>Stock</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.length > 0 ? (
                products.map((product) => (
                  <tr key={product._id}>
                    <td>{product.name}</td>
                    <td>₹{product.price?.toLocaleString()}</td>
                    <td>{product.description}</td>
                    <td>{product.category?.name || "-"}</td>
                    <td>
                      {typeof product.stock === "number" ? product.stock : "-"}
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="edit-button"
                          onClick={() => handleOpenEditModal(product)}
                        >
                          Edit
                        </button>
                        <button
                          className="delete-button"
                          onClick={() => handleDeleteProduct(product._id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="empty-message">
                    No products found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default DashboardProduct;
