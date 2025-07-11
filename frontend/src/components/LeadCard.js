import React from 'react';

const LeadCard = ({ log }) => {
  const { extracted, save_status, timestamp } = log;
  
  return (
    <div className="bg-white rounded-lg shadow-sm p-3 border-l-2 border-blue-500 hover:shadow-md transition-shadow duration-200">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm mr-2">
            {extracted.name ? extracted.name.charAt(0).toUpperCase() : '?'}
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-800">
              {extracted.name || 'Unknown Name'}
            </h3>
            <p className="text-xs text-gray-500">
              {new Date(timestamp).toLocaleDateString()}
            </p>
          </div>
        </div>
        <span className={`px-2 py-1 rounded text-xs font-medium ${
          save_status === 'success' 
            ? 'bg-green-100 text-green-700' 
            : 'bg-red-100 text-red-700'
        }`}>
          {save_status === 'success' ? '✓' : '✗'}
        </span>
      </div>
      
      <div className="space-y-1">
        <div className="flex items-center text-xs">
          <span className="text-gray-500 w-12">Email:</span>
          <span className="text-gray-700 font-medium truncate">{extracted.email}</span>
        </div>
        <div className="flex items-center text-xs">
          <span className="text-gray-500 w-12">Company:</span>
          <span className="text-gray-700 font-medium truncate">{extracted.company}</span>
        </div>
      </div>
    </div>
  );
};

export default LeadCard; 