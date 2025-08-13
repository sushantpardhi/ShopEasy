import { useLocation, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../Context/AuthContext";
import "./Navigation.css";

const Navigation = ({ isMobileMenuOpen, onMobileMenuClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, loading } = useContext(AuthContext);
  const isLoggedIn = !!user;

  const handleItemClick = (path) => {
    navigate(path);
    onMobileMenuClose();
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const navigationItems = [
    { path: "/", label: "Explore" },
    { path: "/products", label: "Products" },
    { path: "/categories", label: "Categories" },
    { path: "/about", label: "About" },
    { path: "/contact", label: "Contact" },
  ];

  const handleLogout = async () => {
    onMobileMenuClose();
    try {
      const result = await logout();
      if (result.success) {
        console.log("User logged out successfully");
      } else {
        console.error("Logout failed:", result.error);
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handleLogin = () => {
    onMobileMenuClose();
    navigate("/login");
  };

  const handleRegister = () => {
    onMobileMenuClose();
    navigate("/register");
  };

  const handleProfileClick = () => {
    onMobileMenuClose();
    console.log("Redirect to profile page");
  };

  const handleOrdersClick = () => {
    onMobileMenuClose();
    console.log("Redirect to orders page");
  };

  const handleSettingsClick = () => {
    onMobileMenuClose();
    console.log("Redirect to settings page");
  };

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
    <>
      {/* Desktop Navigation */}
      <nav className="navigation">
        <div className="navigation-container">
          <div className="nav-menu">
            <ul className="nav-list">
              {navigationItems.map((item) => (
                <li key={item.path} className="nav-item">
                  <button
                    className={`nav-link ${isActive(item.path) ? "active" : ""}`}
                    onClick={() => handleItemClick(item.path)}
                    aria-current={isActive(item.path) ? "page" : undefined}
                  >
                    <span className="nav-text">{item.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <>
          <div className="mobile-menu">
            {/* Mobile Menu Header with Close Button */}
            <div className="mobile-menu-header">
              <h2 className="mobile-menu-title">Menu</h2>
              <button
                className="mobile-menu-close"
                onClick={onMobileMenuClose}
                aria-label="Close menu"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            <div className="mobile-menu-content">
              {/* Navigation Links */}
              <div className="mobile-nav-section">
                <h3 className="mobile-section-title">Navigation</h3>
                <div className="mobile-nav-links">
                  {navigationItems.map((item) => (
                    <button
                      key={item.path}
                      className={`mobile-nav-link ${isActive(item.path) ? "active" : ""}`}
                      onClick={() => handleItemClick(item.path)}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mobile-divider"></div>

              {/* User Actions */}
              <div className="mobile-actions-section">
                <h3 className="mobile-section-title">Quick Actions</h3>
                <div className="mobile-action-buttons">
                  <button className="mobile-action-btn wishlist-btn">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                    >
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                    </svg>
                    <span>Wishlist</span>
                    <span className="mobile-badge wishlist-badge">5</span>
                  </button>

                  <button className="mobile-action-btn cart-btn">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                    >
                      <path d="M9 22a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"></path>
                      <path d="M20 22a1 1 0 1 0 0-2 1 1 0 0 0 2z"></path>
                      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                    </svg>
                    <span>Cart</span>
                    <span className="mobile-badge cart-badge">3</span>
                  </button>
                </div>
              </div>

              <div className="mobile-divider"></div>

              {/* Account Section */}
              <div className="mobile-account-section">
                <h3 className="mobile-section-title">Account</h3>
                {isLoggedIn ? (
                  <div className="mobile-user-info">
                    <div className="mobile-user-avatar">
                      {user.avatar ? (
                        <img src={user.avatar} alt="User Avatar" />
                      ) : (
                        <div className="mobile-avatar-placeholder">
                          {getUserInitials()}
                        </div>
                      )}
                    </div>
                    <div className="mobile-user-details">
                      <h4 className="mobile-user-name">{user.name}</h4>
                      <p className="mobile-user-email">{user.email}</p>
                    </div>
                    <div className="mobile-account-links">
                      <button
                        className="mobile-account-link"
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
                        className="mobile-account-link"
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
                        className="mobile-account-link"
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
                      <button
                        className="mobile-account-link logout-link"
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
                  </div>
                ) : (
                  <div className="mobile-auth-section">
                    <p className="mobile-auth-message">
                      Welcome! Please sign in to your account
                    </p>
                    <div className="mobile-auth-buttons">
                      <button
                        className="mobile-auth-btn login-btn"
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
                        className="mobile-auth-btn register-btn"
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
            </div>
          </div>

          {/* Mobile Overlay */}
          <div className="mobile-overlay" onClick={onMobileMenuClose}></div>
        </>
      )}
    </>
  );
};

export default Navigation;
