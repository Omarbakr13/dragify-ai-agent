import React from 'react';

const LeadCard = ({ log }) => {
  const { extracted, save_status, timestamp } = log;
  
  return (
    <div className="lead-card">
      <div className="lead-card__header">
        <div className="lead-card__user-section">
          <div className="lead-card__avatar">
            {extracted.name ? extracted.name.charAt(0).toUpperCase() : '?'}
          </div>
          <div className="lead-card__user-info">
            <h3 className="lead-card__name">
              {extracted.name || 'Unknown Name'}
            </h3>
            <p className="lead-card__date">
              {new Date(timestamp).toLocaleDateString()}
            </p>
          </div>
        </div>
        <span className={`lead-card__status lead-card__status--${save_status}`}>
          {save_status === 'success' ? '✓' : '✗'}
        </span>
      </div>
      
      <div className="lead-card__details">
        <div className="lead-card__detail-row">
          <span className="lead-card__detail-label">Email:</span>
          <span className="lead-card__detail-value">{extracted.email}</span>
        </div>
        <div className="lead-card__detail-row">
          <span className="lead-card__detail-label">Company: </span>
          <span className="lead-card__detail-value">{extracted.company}</span>
        </div>
      </div>
    </div>
  );
};

export default LeadCard; 