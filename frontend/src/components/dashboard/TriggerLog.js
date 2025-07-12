import React, { useState } from 'react';

const TriggerLog = ({ logs }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState('');

  const handleViewMessage = (message) => {
    setSelectedMessage(message);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedMessage('');
  };

  return (
    <div className="trigger-log">
      <div className="trigger-log__header">
        <h3 className="trigger-log__title">Trigger Logs</h3>
      </div>
      <div className="trigger-log__table-container">
        <table className="trigger-log__table">
          <thead className="trigger-log__thead">
            <tr>
              <th className="trigger-log__th">Time</th>
              <th className="trigger-log__th">Message</th>
              <th className="trigger-log__th">Status</th>
            </tr>
          </thead>
          <tbody className="trigger-log__tbody">
            {logs.map((log, index) => (
              <tr key={index} className="trigger-log__tr">
                <td className="trigger-log__td trigger-log__td--time">
                  <div className="trigger-log__time">
                    {new Date(log.timestamp).toLocaleTimeString()}
                  </div>
                </td>
                <td className="trigger-log__td trigger-log__td--message">
                  <div className="trigger-log__message" style={{ display: 'flex', alignItems: 'center' }}>
                    <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 120, display: 'inline-block' }}>
                      {log.message}
                    </span>
                    <button
                      className="trigger-log__view-btn"
                      style={{ marginLeft: 8, background: 'none', border: 'none', color: '#2563eb', cursor: 'pointer', fontSize: 14, padding: '2px 8px', borderRadius: 4, textDecoration: 'underline', fontWeight: 500 }}
                      title="View full message"
                      onClick={() => handleViewMessage(log.message)}
                    >
                      See more
                    </button>
                  </div>
                </td>
                <td className="trigger-log__td trigger-log__td--status">
                  <span className={`trigger-log__status trigger-log__status--${log.save_status}`}>
                    {log.save_status === 'success' ? '✓' : '✗'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {modalOpen && (
        <div className="trigger-log__modal-overlay" style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }} onClick={closeModal}>
          <div className="trigger-log__modal" style={{ background: 'white', borderRadius: 8, padding: 24, minWidth: 320, maxWidth: 500, boxShadow: '0 4px 24px rgba(0,0,0,0.12)', position: 'relative' }} onClick={e => e.stopPropagation()}>
            <button onClick={closeModal} style={{ position: 'absolute', top: 8, right: 12, background: 'none', border: 'none', fontSize: 20, color: '#6b7280', cursor: 'pointer' }} title="Close">×</button>
            <h4 style={{ margin: 0, marginBottom: 12, fontWeight: 600, color: '#23272F' }}>Full Message</h4>
            <div style={{ color: '#374151', fontSize: 15, wordBreak: 'break-word' }}>{selectedMessage}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TriggerLog; 