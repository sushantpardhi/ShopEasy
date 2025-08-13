import React, {useContext, useState} from "react";
import './Login.css'
import Loader from "../../components/Loader/Loader";
import {useNavigate} from "react-router-dom";
import {AuthContext} from "../../Context/AuthContext";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();
    const {login, loading, authError} = useContext(AuthContext);

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    }

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await login(email, password);
        if (result.success) {
            navigate("/");
        } else {
            console.error("Login failed:", result.error);
        }
    }
    return (
        <div className="login-container">
            {loading && <Loader text = "Logging in..." /> }

                <h1 className="login-title">Login</h1>
                <form className="login-form" onSubmit={handleSubmit}>
                    {authError && (
                        <div className="register-error">
                            {authError.message}
                        </div>
                    )}
                    <label className="login-label">
                        Email:
                        <input className="login-input" type="text" name="email" value={email} onChange={handleEmailChange} required />
                    </label>
                    <label className="login-label">
                        Password:
                        <input className="login-input" type="password" name="password" value={password} onChange={handlePasswordChange} required />
                    </label>
                    <button className="login-button" type="submit">Login</button>
                </form>
                <div className="login-extra">
                    <p>Don't have an account? <a className="login-link" href="/register">Register here</a>.</p>
                </div>
            </div>
    );
}

export default Login;