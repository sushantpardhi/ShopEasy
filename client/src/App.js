import "./App.css";
import Register from "./Page/Register/Register";
import Login from "./Page/Login/Login";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import Header from "./components/Header/Header";
import { useContext, useState } from "react";
import { AuthContext } from "./Context/AuthContext";
import Navigation from "./components/Navigation/Navigation";
import AddProduct from "./Page/Product/AddProduct/AddProduct";
import AdminDashboard from "./Dashboard/Admin/adminDashboard";

// Public Route Component (only accessible when not logged in)
const PublicRoute = ({ children }) => {
  const { user } = useContext(AuthContext);
  return user ? <Navigate to="/" replace /> : children;
};

const AdminRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);

  // Show nothing while checking authentication
  if (loading) {
    return null;
  }

  return user?.role === "admin" ? children : <Navigate to="/" replace />;
};

// Seller Route Component (only accessible by seller or admin users)
const SellerRoute = ({ children }) => {
  const { user } = useContext(AuthContext);
  return user?.role === "seller" || user?.role === "admin" ? (
    children
  ) : (
    <Navigate to="/" replace />
  );
};

function App() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleMobileMenuClose = () => {
    setIsMobileMenuOpen(false);
  };
  const location = useLocation();

  // Define routes where header should be hidden
  const hideHeaderRoutes = ["/login", "/register"];
  const shouldHideHeader = hideHeaderRoutes.includes(location.pathname);

  return (
    <div className="App">
      {!shouldHideHeader && (
        <>
          <Header
            onMobileMenuToggle={handleMobileMenuToggle}
            isMobileMenuOpen={isMobileMenuOpen}
          />
          <Navigation
            isMobileMenuOpen={isMobileMenuOpen}
            onMobileMenuClose={handleMobileMenuClose}
          />{" "}
        </>
      )}

      <Routes>
        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/addProduct"
          element={
            <AdminRoute>
              <AddProduct />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/dashboard"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
