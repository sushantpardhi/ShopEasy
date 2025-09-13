import { useEffect, useState, useCallback } from "react";
import { useCategory } from "../../hooks/useCategory";
import Loader from "../../components/Loader/Loader";
import CategoryFormModal from "../Modal/CategoryFormModal";
import "./DashboardCategory.css";

function DashboardCategory() {
  const [categories, setCategories] = useState([]);
  const [editingCategory, setEditingCategory] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    parentId: "",
  });

  const {
    fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    loading,
    error,
  } = useCategory();

  const loadCategories = useCallback(async () => {
    console.log("Fetching categories...");
    const data = await fetchCategories(true);
    console.log("Received data:", data);
    if (data?.categories) {
      console.log("Setting categories:", data.categories);
      // Debug parent relationships
      data.categories.forEach((cat) => {
        if (cat.parentCategory) {
          const parent = data.categories.find(
            (c) => c._id === cat.parentCategory
          );
          console.log(
            `Category ${cat.name} parent ID:`,
            cat.parentCategory.name
          );
          console.log(`Found parent:`, parent);
        }
      });
      setCategories(data.categories);
    } else {
      console.log("No categories found in response");
    }
  }, [fetchCategories]);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      console.log("Form data before submission:", formData);
      const categoryData = {
        name: formData.name,
        description: formData.description,
        parentCategory: formData.parentId || null,
      };
      console.log("Category data being sent to API:", categoryData);

      let result;
      if (editingCategory) {
        console.log("Updating category:", editingCategory._id);
        result = await updateCategory(editingCategory._id, categoryData);
      } else {
        console.log("Creating new category");
        result = await createCategory(categoryData);
      }
      console.log("API response:", result);

      // Reset form and reload categories
      setFormData({ name: "", description: "", parentId: "" });
      setEditingCategory(null);
      setIsModalOpen(false); // Close the modal
      await loadCategories();
    } catch (err) {
      console.error("Error saving category:", err);
    }
  };

  const startEdit = (category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description || "",
      parentId: category.parentCategory || "",
    });
    setIsModalOpen(true); // Open the modal when editing
  };

  const openAddCategoryModal = () => {
    setEditingCategory(null);
    setFormData({ name: "", description: "", parentId: "" });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
    setFormData({ name: "", description: "", parentId: "" });
  };

  const handleDelete = async (categoryId) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      try {
        await deleteCategory(categoryId);
        await loadCategories();
      } catch (err) {
        console.error("Error deleting category:", err);
      }
    }
  };

  // Create a map of categories for faster parent lookups
  const categoryMap = categories.reduce((map, category) => {
    map[category._id] = category;
    return map;
  }, {});

  return (
    <div className="dashboard-category">
      <div className="dashboard-header">
        <h2>Category Management</h2>
        <button className="add-category-button" onClick={openAddCategoryModal}>
          Add New Category
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      <CategoryFormModal
        isOpen={isModalOpen}
        onClose={closeModal}
        formData={formData}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
        editingCategory={editingCategory}
        categories={categories}
      />

      {loading ? (
        <Loader />
      ) : (
        <div className="categories-list">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Description</th>
                <th>Parent Category</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr key={category._id}>
                  <td>{category.name}</td>
                  <td>{category.description}</td>
                  <td>
                    {category.parentCategory
                      ? category.parentCategory.name || "Unknown"
                      : "None"}
                  </td>
                  <td className="action-buttons">
                    <button
                      className="edit-button"
                      onClick={() => startEdit(category)}
                    >
                      Edit
                    </button>
                    <button
                      className="delete-button"
                      onClick={() => handleDelete(category._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default DashboardCategory;
