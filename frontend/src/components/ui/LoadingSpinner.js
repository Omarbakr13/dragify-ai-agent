import React from 'react';

const LoadingSpinner = ({ size = 'md', text = 'Loading...', className = '' }) => {
  const sizeClass = `loading-spinner__spinner--${size}`;

  return (
    <div className={`loading-spinner ${className}`}>
      <div className="loading-spinner__container">
        <div className={`loading-spinner__spinner ${sizeClass}`}></div>
        {text && <p className="loading-spinner__text">{text}</p>}
      </div>
    </div>
  );
};

export default LoadingSpinner; 