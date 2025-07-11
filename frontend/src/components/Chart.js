import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Chart = ({ logs }) => {
  const processData = (logs) => {
    const hourlyData = {};
    
    logs.forEach(log => {
      const date = new Date(log.timestamp);
      const hour = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:00`;
      
      hourlyData[hour] = (hourlyData[hour] || 0) + 1;
    });
    
    return Object.entries(hourlyData)
      .map(([time, count]) => ({ time, count }))
      .sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime())
      .slice(-24); // Show last 24 hours
  };

  const chartData = processData(logs);

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-sm font-semibold text-gray-800">Leads per Hour</h3>
          <p className="text-xs text-gray-600">Last 24 hours</p>
        </div>
      </div>
      
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 20, left: 10, bottom: 40 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
            <XAxis 
              dataKey="time" 
              tick={{ fontSize: 10, fill: '#6b7280' }}
              angle={-45}
              textAnchor="end"
              height={60}
              stroke="#e5e7eb"
            />
            <YAxis 
              tick={{ fontSize: 10, fill: '#6b7280' }}
              stroke="#e5e7eb"
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '6px',
                fontSize: '12px'
              }}
              formatter={(value) => [value, 'Leads']}
              labelFormatter={(label) => `Time: ${label}`}
            />
            <Bar 
              dataKey="count" 
              fill="#3b82f6"
              radius={[2, 2, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      {chartData.length === 0 && (
        <div className="text-center py-6">
          <svg className="w-8 h-8 text-gray-300 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <p className="text-xs text-gray-500">No data available</p>
        </div>
      )}
    </div>
  );
};

export default Chart; 