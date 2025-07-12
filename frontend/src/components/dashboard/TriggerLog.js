import React from 'react';

const TriggerLog = ({ logs }) => {
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
                  <div className="trigger-log__message">
                    {log.message}
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
    </div>
  );
};

export default TriggerLog; 