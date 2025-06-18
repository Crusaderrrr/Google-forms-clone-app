import React, { useState, useContext, useEffect } from 'react';
import background_image from '../assets/background_image.webp';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useApp } from '../context/AppContext'

function LoginPage() {
  const navigate = useNavigate();
  const {setGuest, email, setEmail, setName, setTheme} = useApp()
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('');
  const [password, setPassword] = useState('');
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [isPasswordValid, setIsPasswordValid] = useState(false);

  useEffect(() => {
    setTheme('light')
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
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

      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email: email,
        password: password
      })

      if (response.status === 200) {
        console.log(response.data.user.name)
        setName(response.data.user.name);
        setGuest(false);
        navigate('/main');
      }

    } catch (err) {
      setAlertMessage('Invalid credentials');
      setAlertType('danger');
    }
  };

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const validatePassword = (password) => {
    return password.length >= 1;
  };

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

  const handleGuestSet = async () => {
    const response = await axios.post('http://localhost:5000/api/auth/guest', {
      guestState: true
    });

    if (response.status === 200) {
      setGuest(true);
      navigate('/main')
    }
  }

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
            <button onClick={handleGuestSet} className='mt-4 ms-3 position-absolute btn btn-light border border-2 rounded-pill'><i className="bi bi-person-circle"> Guest</i></button>

            <p className='mb-2 text-muted fs-5 text-center'>Start your journey!</p>
            <h1 className='display-6 mb-4 fw-normal text-center'>Login</h1>

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
                <div className="forgot">
                <small><a href="#">Forgot Password?</a></small>
                </div>
            </div>

            <button type="submit" onSubmit={handleSubmit} className="btn btn-primary w-100">Log In</button>

            <div className="text-center mt-3">
                <small className="text-muted">Don't have an account?
                <Link to='/signup' className='ms-1'>Sign Up</Link>
                </small>
            </div>
            </form>
        </div>
        </div>
    </div>
  );
}

export default LoginPage;