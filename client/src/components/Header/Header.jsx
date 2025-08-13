import React, { useContext, useEffect, useRef, useState } from "react";
import "./Header.css";
import { AuthContext } from "../../Context/AuthContext";
import { useNavigate } from "react-router-dom";

const Header = ({ onMobileMenuToggle, isMobileMenuOpen }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [cartCount, setCartCount] = useState(3);
  const [wishlistCount, setWishlistCount] = useState(5);
  const [showAccountDropdown, setShowAccountDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // Get authentication data from context
  const { user, logout, loading } = useContext(AuthContext);
  const isLoggedIn = !!user;
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    console.log("Searching for:", searchQuery);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleAccountClick = () => {
    setShowAccountDropdown(!showAccountDropdown);
  };

  const handleMobileMenuToggle = () => {
    onMobileMenuToggle();
    // Close account dropdown when mobile menu opens
    if (!isMobileMenuOpen) {
      setShowAccountDropdown(false);
    }
  };

  const handleLogout = async () => {
    setShowAccountDropdown(false);
    try {
      const result = await logout();
      if (result.success) {
        console.log("User logged out successfully");
        navigate("/");
      } else {
        console.error("Logout failed:", result.error);
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handleLogin = () => {
    setShowAccountDropdown(false);
    navigate("/login");
  };

  const handleRegister = () => {
    setShowAccountDropdown(false);
    navigate("/register");
  };

  const handleWishlistClick = () => {
    setShowAccountDropdown(false);
    navigate("/wishlist");
    console.log("Redirect to wishlist page");
  }

  const handleCartClick = () => {
    setShowAccountDropdown(false);
    navigate(`/user/${user.id}/cart`);
    console.log("Redirect to cart page");
  }

  const handleProfileClick = () => {
    setShowAccountDropdown(false);
    navigate(`/profile/${user.id}`);
    console.log("Redirect to profile page");
  };


  const handleOrdersClick = () => {
    setShowAccountDropdown(false);
    navigate(`/user/${user.id}/orders`);
    console.log("Redirect to orders page");
  };

  const handleSettingsClick = () => {
    setShowAccountDropdown(false);
    navigate(`/user/${user.id}/settings`);
    console.log("Redirect to settings page");
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowAccountDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Get user initials for avatar placeholder
  const getUserInitials = () => {
    if (!user?.name) return "U";
    return user.name
      .split(" ")
      .map((name) => name.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header className="header">
      <div className="header-container">
        {/* Site Logo/Name */}
        <div className="logo-section">
          <h1 className="site-name" onClick={() => navigate("/")}>
            ShopEasy
          </h1>
        </div>

        {/* Search Bar */}
        <div className="search-section">
          <form className="search-form" onSubmit={handleSearch}>
            <div className="search-container">
              <input
                type="text"
                placeholder="Search for products..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="search-input"
              />
              <button type="submit" className="search-btn">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <circle cx="11" cy="11" r="8"></circle>
                  <path d="m21 21-4.35-4.35"></path>
                </svg>
              </button>
            </div>
          </form>
        </div>

        {/* User Actions */}
        <div className="user-actions">
          {/* Mobile Menu Toggle */}
          <button
            className="mobile-menu-toggle"
            onClick={handleMobileMenuToggle}
            aria-label="Toggle menu"
          >
            <span
              className={`hamburger-line ${isMobileMenuOpen ? "open" : ""}`}
            ></span>
            <span
              className={`hamburger-line ${isMobileMenuOpen ? "open" : ""}`}
            ></span>
            <span
              className={`hamburger-line ${isMobileMenuOpen ? "open" : ""}`}
            ></span>
          </button>

          {/* Desktop Actions */}
          <div className="desktop-actions">
            {/* Wishlist */}
            <button className="action-btn wishlist-btn" onClick={handleWishlistClick}>
              <div className="btn-content">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                </svg>
                {wishlistCount > 0 && (
                  <span className="badge wishlist-badge">{wishlistCount}</span>
                )}
              </div>
              <span className="btn-label">Wishlist</span>
            </button>

            {/* Cart */}
            <button className="action-btn cart-btn">
              <div className="btn-content" onClick={handleCartClick}>
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <path d="M9 22a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"></path>
                  <path d="M20 22a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"></path>
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                </svg>
                {cartCount > 0 && (
                  <span className="badge cart-badge">{cartCount}</span>
                )}
              </div>
              <span className="btn-label">Cart</span>
            </button>

            {/* Account */}
            <div className="account-section" ref={dropdownRef}>
              <button
                className="action-btn account-btn"
                onClick={handleAccountClick}
                disabled={loading}
              >
                <div className="btn-content">
                  {isLoggedIn && user.avatar ? (
                    <img
                      src={user.avatar}
                      alt="User Avatar"
                      className="account-avatar-small"
                    />
                  ) : (
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                    >
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                  )}
                </div>
                <span className="btn-label">
                  {isLoggedIn
                    ? user.name?.split(" ")[0] || "Account"
                    : "Account"}
                </span>
              </button>

              {/* Account Dropdown */}
              {showAccountDropdown && (
                <div className="account-dropdown">
                  {isLoggedIn ? (
                    <div className="dropdown-content">
                      <div className="user-info">
                        <div className="user-avatar">
                          {user.avatar ? (
                            <img src={user.avatar} alt="User Avatar" />
                          ) : (
                            <div className="avatar-placeholder">
                              {getUserInitials()}
                            </div>
                          )}
                        </div>
                        <div className="user-details">
                          <h4 className="user-name">{user.name}</h4>
                          <p className="user-email">{user.email}</p>
                        </div>
                      </div>

                      <div className="dropdown-divider"></div>

                      <div className="quick-links">
                        <button
                          className="dropdown-link"
                          onClick={handleProfileClick}
                        >
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                          >
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                            <circle cx="12" cy="7" r="4"></circle>
                          </svg>
                          My Profile
                        </button>
                        <button
                          className="dropdown-link"
                          onClick={handleOrdersClick}
                        >
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                          >
                            <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
                            <rect
                              x="8"
                              y="2"
                              width="8"
                              height="4"
                              rx="1"
                              ry="1"
                            ></rect>
                          </svg>
                          My Orders
                        </button>
                        <button
                          className="dropdown-link"
                          onClick={handleSettingsClick}
                        >
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                          >
                            <circle cx="12" cy="12" r="3"></circle>
                            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1 1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                          </svg>
                          Settings
                        </button>
                      </div>

                      <div className="dropdown-divider"></div>

                      <button
                        className="dropdown-link logout-btn"
                        onClick={handleLogout}
                        disabled={loading}
                      >
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                        >
                          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                          <polyline points="16,17 21,12 16,7"></polyline>
                          <line x1="21" y1="12" x2="9" y2="12"></line>
                        </svg>
                        {loading ? "Logging out..." : "Logout"}
                      </button>
                    </div>
                  ) : (
                    <div className="dropdown-content">
                      <div className="auth-section">
                        <p className="auth-message">
                          Welcome! Please sign in to your account
                        </p>
                        <button
                          className="auth-btn login-btn"
                          onClick={handleLogin}
                        >
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                          >
                            <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
                            <polyline points="10,17 15,12 10,7"></polyline>
                            <line x1="15" y1="12" x2="3" y2="12"></line>
                          </svg>
                          Login
                        </button>
                        <button
                          className="auth-btn register-btn"
                          onClick={handleRegister}
                        >
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                          >
                            <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                            <circle cx="8.5" cy="7" r="4"></circle>
                            <line x1="20" y1="8" x2="20" y2="14"></line>
                            <line x1="23" y1="11" x2="17" y2="11"></line>
                          </svg>
                          Create Account
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
