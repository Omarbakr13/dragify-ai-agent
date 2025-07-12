import React from 'react';

const StatCard = ({ 
  title, 
  value, 
  icon, 
  color = 'blue', 
  className = '' 
}) => {
  return (
    <div className={`stat-card stat-card--${color} ${className}`}>
      <div className="stat-card__container">
        <div className={`stat-card__icon-container stat-card__icon-container--${color}`}>
          {icon}
        </div>
        <div className="stat-card__content">
          <h3 className="stat-card__title">{title}</h3>
          <p className={`stat-card__value stat-card__value--${color}`}>{value}</p>
        </div>
      </div>
    </div>
  );
};

export default StatCard; 