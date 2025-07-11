import React from 'react';

const TriggerLog = ({ logs }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="px-3 py-2 border-b border-gray-200 bg-gray-50">
        <h3 className="text-sm font-semibold text-gray-800">Trigger Logs</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Time
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Message
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {logs.map((log, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-3 py-2 whitespace-nowrap">
                  <div className="text-xs text-gray-900">
                    {new Date(log.timestamp).toLocaleTimeString()}
                  </div>
                </td>
                <td className="px-3 py-2">
                  <div className="text-xs text-gray-900 max-w-xs truncate">
                    {log.message}
                  </div>
                </td>
                <td className="px-3 py-2 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                    log.save_status === 'success'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'
                  }`}>
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