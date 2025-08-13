import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./Context/AuthContext";
import { ProductContext } from "./Context/ProductContext";
import { CategoryProvider } from "./Context/CategoryContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <CategoryProvider>
    <ProductContext>
      <AuthProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </AuthProvider>
    </ProductContext>
  </CategoryProvider>,
);
