import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../viewmodels/useAuth';

const Header = ({ user, onLogout, showUserInfo = true, showNavigation = true, className = '' }) => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    if (onLogout) onLogout();
    navigate('/login');
  };

  return (
    <header className={`header ${className}`}>
      <div className="header__container">
        <div className="header__content">
          {/* Logo */}
          <Link to="/" className="header__logo-link">
            <img src="dragify-logo.png" alt="Dragify Logo" className="header__logo-img" />
          </Link>

          {/* Sign Out Button */}
          {user && (
            <button className="header__dashboard-btn" onClick={handleLogout}>
              Sign Out
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header; 