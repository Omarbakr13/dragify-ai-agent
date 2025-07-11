import React, { useState, useEffect } from 'react';
import LeadCard from './LeadCard';
import TriggerLog from './TriggerLog';
import Chart from './Chart';

const iconClass = "w-4 h-4 inline-block align-middle";

const Dashboard = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8000';
      const response = await fetch(`${apiUrl}/webhook/logs`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setLogs(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch logs');
      // For demo purposes, create mock data
      setLogs([
        {
          id: '1',
          timestamp: new Date().toISOString(),
          message: 'Hi, I am John Doe from TechCorp. My email is john@techcorp.com',
          extracted: {
            name: 'John Doe',
            email: 'john@techcorp.com',
            company: 'TechCorp'
          },
          save_status: 'success'
        },
        {
          id: '2',
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          message: 'Contact me at sarah@startup.io, I am Sarah from Startup Inc',
          extracted: {
            name: 'Sarah',
            email: 'sarah@startup.io',
            company: 'Startup Inc'
          },
          save_status: 'success'
        },
        {
          id: '3',
          timestamp: new Date(Date.now() - 7200000).toISOString(),
          message: 'Hello, I am Mike from BigCorp. Email: mike@bigcorp.com',
          extracted: {
            name: 'Mike',
            email: 'mike@bigcorp.com',
            company: 'BigCorp'
          },
          save_status: 'failure'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-sm text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-4">
        {/* Header */}
        <div className="mb-4 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">
            Dragify AI Agent Dashboard
          </h1>
          <p className="text-sm text-gray-600">
            Real-time lead extraction monitoring
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
          <div className="bg-white rounded-lg shadow p-3 border-l-3 border-blue-500">
            <div className="flex items-center">
              <div className="p-2 rounded bg-blue-100 text-blue-600">
                <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div className="ml-2">
                <h3 className="text-xs font-medium text-gray-600">Total Leads</h3>
                <p className="text-lg font-bold text-blue-600">{logs.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-3 border-l-3 border-green-500">
            <div className="flex items-center">
              <div className="p-2 rounded bg-green-100 text-green-600">
                <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-2">
                <h3 className="text-xs font-medium text-gray-600">Success Rate</h3>
                <p className="text-lg font-bold text-green-600">
                  {logs.length > 0 
                    ? Math.round((logs.filter(log => log.save_status === 'success').length / logs.length) * 100)
                    : 0}%
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-3 border-l-3 border-purple-500">
            <div className="flex items-center">
              <div className="p-2 rounded bg-purple-100 text-purple-600">
                <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="ml-2">
                <h3 className="text-xs font-medium text-gray-600">Today's Leads</h3>
                <p className="text-lg font-bold text-purple-600">
                  {logs.filter(log => {
                    const today = new Date().toDateString();
                    return new Date(log.timestamp).toDateString() === today;
                  }).length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Chart */}
        <div className="mb-4">
          <Chart logs={logs} />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Lead Cards */}
          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
              <svg className={iconClass + " mr-2 text-blue-600"} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Recent Leads
            </h2>
            <div className="space-y-2">
              {logs.slice(0, 5).map((log, index) => (
                <LeadCard key={log.id || index} log={log} />
              ))}
            </div>
          </div>

          {/* Trigger Logs */}
          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
              <svg className={iconClass + " mr-2 text-green-600"} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              Trigger Logs
            </h2>
            <TriggerLog logs={logs} />
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-3">
            <div className="flex items-center">
              <svg className={iconClass + " text-red-600 mr-2 max-w-[32px] max-h-[32px]"} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="text-red-800 text-sm font-medium">
                  <strong>Error:</strong> {error}
                </p>
                <p className="text-red-600 text-xs mt-1">
                  Showing mock data for demonstration.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard; 