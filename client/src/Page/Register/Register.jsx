import React, {useContext, useEffect, useState} from 'react';
import './Register.css'
import Loader from '../../components/Loader/Loader';
import {useNavigate} from "react-router-dom";
import Cookies from 'js-cookie';
import {AuthContext} from "../../Context/AuthContext";


function Register() {
    const [name,setName] = useState("");
    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");


    const navigate = useNavigate();
    const {register, loading, authError} = useContext(AuthContext)

    useEffect(() => {
        const token = Cookies.get('token');
        if (token) {
            navigate('/');
        }
    }, [navigate]);

    const handleNameChange = (e) => {
        setName(e.target.value);
    };
    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    }
    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    }

    useEffect(() => {
        const token = Cookies.get('token');
        if (token) {
            navigate('/');
        }
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await register(name, email, password);
        if (result.success) {
            navigate("/login");
        }
    };


    return (
        <>
            {loading && <Loader text="Registering..." />}
            <div className="register-container">

                    <h1 className="register-title">Register</h1>
                    <form className="register-form" onSubmit={handleSubmit}>
                        {authError && (
                            <div className="register-error">
                                {authError.message}
                            </div>
                        )}
                        <label className="register-label">
                            Name:
                            <input className="register-input" type="text" name="name" value={name} onChange={handleNameChange} required />
                        </label>
                        <label className="register-label">
                            Email:
                            <input className="register-input" type="text" name="username" value={email} onChange={handleEmailChange} required />
                        </label>

                        <label className="register-label">
                            Password:
                            <input className="register-input" type="password" name="password" value={password} onChange={handlePasswordChange} required />
                        </label>
                        <button className="register-button" type="submit">Register</button>
                    </form>
                    <div className="register-extra">
                        <p>Already have an account? <a className="register-link" href="/login">Login here</a>.</p>
                    </div>
            </div>
        </>
    )
}

export default Register;