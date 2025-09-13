import React, { useContext, useState, useEffect } from "react";
import "./Login.css";
import Loader from "../../components/Loader/Loader";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../../Context/AuthContext";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [validationError, setValidationError] = useState("");

  const navigate = useNavigate();
  const location = useLocation();
  const { login, loading, authError, user } = useContext(AuthContext);

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      const returnTo = location.state?.from || "/";
      navigate(returnTo, { replace: true });
    }
  }, [user, navigate, location]);

  const validateForm = () => {
    if (!email) {
      setValidationError("Email is required");
      return false;
    }
    if (!password) {
      setValidationError("Password is required");
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setValidationError("Please enter a valid email address");
      return false;
    }
    setValidationError("");
    return true;
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setValidationError("");
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setValidationError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const result = await login(email, password, rememberMe);
    if (result.success) {
      const returnTo = location.state?.from || "/";
      navigate(returnTo, { replace: true });
    }
  };
  return (
    <div className="login-container">
      {loading && <Loader text="Logging in..." />}

      <h1 className="login-title">Login</h1>
      <form className="login-form" onSubmit={handleSubmit}>
        {(validationError || authError) && (
          <div className="login-error">
            {validationError || authError?.message}
          </div>
        )}
        <label className="login-label">
          Email:
          <input
            className="login-input"
            type="email"
            name="email"
            value={email}
            onChange={handleEmailChange}
            disabled={loading}
            placeholder="Enter your email"
            required
          />
        </label>
        <label className="login-label">
          Password:
          <input
            className="login-input"
            type="password"
            name="password"
            value={password}
            onChange={handlePasswordChange}
            disabled={loading}
            placeholder="Enter your password"
            required
          />
        </label>
        <label className="remember-me-label">
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            disabled={loading}
          />
          Remember me
        </label>
        <button className="login-button" type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
      <div className="login-extra">
        <p>
          Don't have an account?{" "}
          <a className="login-link" href="/register">
            Register here
          </a>
          .
        </p>
      </div>
    </div>
  );
}

export default Login;
