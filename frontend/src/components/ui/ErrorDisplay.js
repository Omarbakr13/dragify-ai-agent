import React from 'react';

const ErrorDisplay = ({ error, className = '' }) => {
  if (!error) return null;

  return (
    <div className={`error-display ${className}`}>
      <div className="error-display__container">
        <svg className="error-display__icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <div className="error-display__content">
          <p className="error-display__title">
            <strong>Error:</strong> {error}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ErrorDisplay; 