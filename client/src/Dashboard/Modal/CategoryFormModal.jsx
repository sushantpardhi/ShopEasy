import React from "react";
import "./CategoryFormModal.css";

function CategoryFormModal({
  isOpen,
  onClose,
  formData,
  handleInputChange,
  handleSubmit,
  editingCategory,
  categories,
}) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3>{editingCategory ? "Edit Category" : "Add New Category"}</h3>
          <button className="close-button" onClick={onClose}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="category-form">
          <div className="form-group">
            <label htmlFor="name">Category Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description:</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="parentId">Parent Category:</label>
            <select
              id="parentId"
              name="parentId"
              value={formData.parentId}
              onChange={handleInputChange}
            >
              <option value="">None (Root Category)</option>
              {categories.map((category) => (
                <option
                  key={category._id}
                  value={category._id}
                  disabled={
                    editingCategory && category._id === editingCategory._id
                  }
                >
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div className="modal-footer">
            <button type="submit" className="submit-button">
              {editingCategory ? "Update Category" : "Create Category"}
            </button>
            <button type="button" className="cancel-button" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CategoryFormModal;
