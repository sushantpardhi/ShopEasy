import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./Context/AuthContext";
import { ProductProvider } from "./Context/ProductContext";
import { CategoryProvider } from "./Context/CategoryContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <AuthProvider>
    <BrowserRouter>
      <CategoryProvider>
        <ProductProvider>
          <App />
        </ProductProvider>
      </CategoryProvider>
    </BrowserRouter>
  </AuthProvider>
);
