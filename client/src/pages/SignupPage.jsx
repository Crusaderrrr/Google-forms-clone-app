import React, { useState, useContext, useEffect } from 'react';
import background_image from '../assets/background_image.webp'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useApp } from '../context/AppContext'

function SignupPage() {
  const navigate = useNavigate();
  const {setRole, setTheme, email, setEmail, setName, setIsBlocked, setIsAdmin} = useApp();
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isUsernameValid, setIsUsernameValid] = useState('');
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const SERVER_URL = import.meta.env.VITE_API_URL;

    useEffect(() => {
      setTheme('light')
    }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (!username || !isUsernameValid) {
        setAlertMessage('The username is required');
        setAlertType('danger');
        return;
      }

      if (!email || !isEmailValid) {
        setAlertMessage('The email is required');
        setAlertType('danger');
        return;
      }

      if (!password || !isPasswordValid) {
        setAlertMessage('The password is required');
        setAlertType('danger');
        return;
      }

      const response = await axios.post(`${SERVER_URL}/api/auth/signup`, {
        name: username,
        email: email,
        password: password
      }, { withCredentials: true });
      if (response.status === 201) {
        console.log(response.status, response.data);
        setRole('user');
        setIsAdmin(false);
        setIsBlocked(false);
        setEmail(email);
        setName(username);
        navigate('/main');
      }

    } catch (err) {
      setAlertMessage(err.response?.data?.message || 'Registration failed');
      setAlertType('danger');
    }
  };

  const validateUsername = (username) => {
    return username.length > 0;
  }

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const validatePassword = (password) => {
    return password.length >= 1; 
  };

  const handleUsernameChange = (e) => {
    const value = e.target.value;
    setUsername(value);
    setIsUsernameValid(validateUsername(value));
  }

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    setIsEmailValid(validateEmail(value));
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    setIsPasswordValid(validatePassword(value));
  };

  return (
    <div className='container-fluid'>
            <div
            className="row min-vh-100 d-flex justify-content-center align-items-center"
            style={{
                backgroundImage: `url(${background_image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
            }}
            >
        <div className="col-6 p-4 shadow-lg rounded" style={{ width: '100%', maxWidth: '650px', backgroundColor: 'rgba(255, 255, 255, 0.95)' }}>
            <form className='mx-3' onSubmit={handleSubmit}>
            {alertMessage && (
                <div className={`alert alert-${alertType} alert-dismissible fade show mb-4`} role="alert">
                {alertMessage}
                <button
                    type="button"
                    className="btn-close"
                    onClick={() => setAlertMessage('')}
                    aria-label="Close"
                ></button>
                </div>
            )}

            <p className='mb-2 text-muted fs-5 text-center'>Welcome!</p>
            <h1 className='display-6 mb-4 fw-normal text-center'>Create an Account</h1>

            <div className="mb-3">
                <label className="form-label">User Name</label>
                <div className="input-group">
                    <input 
                    type="text" 
                    className={`form-control ${username ? (isUsernameValid ? 'is-valid' : 'is-invalid'): ''}`} 
                    id="username"
                    value={username}
                    onChange={handleUsernameChange}
                    />
                    <span className="input-group-text">
                    <i className="bi bi-person"></i>
                    </span>
                </div>
            </div>

            <div className="mb-3">
                <label className="form-label">Email</label>
                <div className="input-group">
                <input
                    type="email"
                    className={`form-control ${email ? (isEmailValid ? 'is-valid' : 'is-invalid') : ''}`}
                    id="email"
                    value={email}
                    onChange={handleEmailChange}
                />
                <span className="input-group-text">
                    <i className="bi bi-envelope"></i>
                </span>
                </div>
            </div>

            <div className="mb-2">
                <label className="form-label">Password</label>
                <div className="input-group">
                <input
                    type="password"
                    className={`form-control ${password ? (isPasswordValid ? 'is-valid' : 'is-invalid') : ''}`}
                    id="password"
                    value={password}
                    onChange={handlePasswordChange}
                />
                <span className="input-group-text">
                    <i className="bi bi-lock"></i>
                </span>
                </div>
            </div>

            <div className="input-group mb-4 d-flex justify-content-between">
                <div className="form-check">
                <input type="checkbox" className="form-check-input" id="remember_me" />
                <label className="form-check-label text-secondary" htmlFor="remember_me">Remember me</label>
                </div>
            </div>

            <button type="submit" onSubmit={handleSubmit} className="btn btn-primary w-100">Sign Up</button>

            </form>
        </div>
        </div>
    </div>
  )
}

export default SignupPage;