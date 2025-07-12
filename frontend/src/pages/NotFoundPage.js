import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../viewmodels/useAuth';

const NotFoundPage = () => {
  const { isAuthenticated, isAdmin } = useAuth();

  return (
    <div className="not-found-page">
      <div className="not-found-page__container">
        <div className="not-found-page__content">
          <div className="not-found-page__icon">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.47-.881-6.08-2.33" />
            </svg>
          </div>
          
          <h1 className="not-found-page__title">404</h1>
          <h2 className="not-found-page__subtitle">Page Not Found</h2>
          <p className="not-found-page__description">
            The page you're looking for doesn't exist or has been moved.
          </p>
          
          <div className="not-found-page__actions">
            <Link 
              to={isAuthenticated ? (isAdmin ? "/admin" : "/dashboard") : "/login"}
              className="not-found-page__button not-found-page__button--primary"
            >
              {isAuthenticated ? 'Go to Dashboard' : 'Go to Login'}
            </Link>
            
            <button 
              onClick={() => window.history.back()}
              className="not-found-page__button not-found-page__button--secondary"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage; 