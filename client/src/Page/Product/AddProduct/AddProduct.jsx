import { useContext, useState } from "react";
import { ProductContext } from "../../../Context/ProductContext";
import Loader from "../../../components/Loader/Loader";
import "./AppProduct.css";

function AddProduct() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [stock, setStock] = useState(0);

  const { addProduct, loading, authError } = useContext(ProductContext);

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handlePriceChange = (e) => {
    setPrice(e.target.value);
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
  };

  const handleStockChange = (e) => {
    setStock(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = await addProduct(name, price, description, category, stock);
  };

  return (
    <>
      {loading && <Loader text="Adding Product..." />}
      <div className="addProduct-container">
        <h1 className="addProduct-title">Add Product</h1>
        <form className="addProduct-form" onSubmit={handleSubmit}>
          {authError && (
            <div className="addProduct-error">{authError.message}</div>
          )}
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={handleNameChange}
            required
          />
          <input
            type="number"
            placeholder="Price"
            value={price}
            onChange={handlePriceChange}
            required
          />
          <textarea
            placeholder="Description"
            value={description}
            onChange={handleDescriptionChange}
            required
          />
          <input
            type="text"
            placeholder="Category"
            value={category}
            onChange={handleCategoryChange}
            required
          />
          <input
            type="number"
            placeholder="Stock"
            value={stock}
            onChange={handleStockChange}
            required
          />
          <button type="submit">Add Product</button>
        </form>
      </div>
    </>
  );
}

export default AddProduct;
