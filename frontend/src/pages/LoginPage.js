import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../viewmodels/useAuth';
import ErrorDisplay from '../components/ui/ErrorDisplay';
import '../styles/pages/LoginPage.css';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(formData.email, formData.password, (user) => {
        if (user.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/dashboard');
        }
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-split-root">
      {/* Left: Login Form */}
      <div className="login-split-left">
        <div className="login-split-form-container">
          {/* Logo */}
          <div className="login-split-logo">
            <img src="/dragify-logo.png" alt="Dragify Logo" className="login-split-logo-img" />
          </div>
          <h2 className="login-split-title">Log in to your account</h2>
          <p className="login-split-welcome">Welcome back! Please enter your details below.</p>
          <form className="login-split-form" onSubmit={handleLogin}>
            <div className="login-split-field-group">
              <label htmlFor="email" className="login-split-label">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="login-split-input"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleInputChange}
              />
            </div>
            <div className="login-split-field-group">
              <label htmlFor="password" className="login-split-label">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="login-split-input"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleInputChange}
              />
            </div>
            <ErrorDisplay error={error} className="login-split-error" />
            <button
              type="submit"
              className="login-split-submit"
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>
        </div>
      </div>
      {/* Right: Marketing/Info */}
      <div className="login-split-right">
        <div className="login-split-right-content">
          <h1 className="login-split-headline">
            <span className="login-split-headline-line">AI-Powered Dashboard</span>
            <span className="login-split-headline-line login-split-headline-second">for Your Team</span>
          </h1>
          <p className="login-split-desc">
            Streamline workflows, manage your AI agents, analyze data, and gain valuable insights – all in one powerful platform designed for teams of all sizes.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage; 