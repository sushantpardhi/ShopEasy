import "./App.css";
import Register from "./Page/Register/Register";
import Login from "./Page/Login/Login";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import Header from "./components/Header/Header";
import { useContext, useState } from "react";
import { AuthContext } from "./Context/AuthContext";
import Explore from "./Page/Explore/Explore";
import SingleProduct from "./Page/Product/SingleProduct/SingleProduct";
import Category from "./Page/Category/Category";
import Navigation from "./components/Navigation/Navigation";
import UserProfile from "./Page/UserProfile/UserProfile";

// Public Route Component (only accessible when not logged in)
const PublicRoute = ({ children }) => {
  const { user } = useContext(AuthContext);
  return user ? <Navigate to="/" replace /> : children;
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
        {/* <Route path="/" element={<Explore />} /> */}
        {/* <Route path="/product/:id" element={<SingleProduct />} />
          <Route path="/categories" element={<Category />} />
          <Route path='/profile/:id' element={<UserProfile/>} /> */}
      </Routes>
    </div>
  );
}

export default App;
