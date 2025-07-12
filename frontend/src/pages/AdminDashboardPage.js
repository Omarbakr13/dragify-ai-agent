import React, { useState } from 'react';
import { useAuth } from '../viewmodels/useAuth';
import { useWebhookData } from '../viewmodels/useWebhookData';
import { useUserManagement } from '../viewmodels/useUserManagement';
import Header from '../components/ui/Header';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import ErrorDisplay from '../components/ui/ErrorDisplay';
import StatCard from '../components/ui/StatCard';
import Chart from '../components/dashboard/Chart';
import LeadCard from '../components/dashboard/LeadCard';
import TriggerLog from '../components/dashboard/TriggerLog';

const AdminDashboardPage = () => {
  const { user } = useAuth();
  const { logs, loading: webhookLoading, error: webhookError, stats: webhookStats } = useWebhookData();
  const { users, loading: userLoading, error: userError, stats: userStats, toggleUserStatus } = useUserManagement();
  const [activeTab, setActiveTab] = useState('overview');

  const handleUserToggle = async (userId, isActive) => {
    try {
      await toggleUserStatus(userId, isActive);
    } catch (err) {
      console.error('Failed to toggle user status:', err);
    }
  };

  if (webhookLoading || userLoading) {
    return (
      <div className="dashboard-page">
        <LoadingSpinner size="lg" className="dashboard-page__loading" />
      </div>
    );
  }

  const systemStats = {
    totalUsers: userStats.totalUsers,
    activeUsers: userStats.activeUsers,
    totalLeads: webhookStats.totalLeads,
    successRate: webhookStats.successRate,
  };

  const navTabs = [
    { id: 'overview', label: 'Overview', icon: 'M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z' },
    { id: 'users', label: 'User Management', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z' },
    { id: 'analytics', label: 'Analytics', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
    { id: 'settings', label: 'Settings', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' }
  ];

  return (
    <div className="dashboard-page">
      <Header
        title="Dragify AI Agent - Admin Dashboard"
        subtitle={`Welcome back, ${user?.full_name || 'Admin'}`}
        user={user}
      />

      {/* Navigation Tabs */}
      <div className="dashboard-page__nav">
        <div className="dashboard-page__nav-container">
          <nav className="dashboard-page__nav-list">
            {navTabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`dashboard-page__nav-item ${activeTab === tab.id ? 'dashboard-page__nav-item--active' : ''}`}
              >
                <svg className="dashboard-page__nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={tab.icon} />
                </svg>
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      <div className="dashboard-page__content">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <>
            {/* Enhanced Stats Cards */}
            <div className="dashboard-page__stats-grid dashboard-page__stats-grid--admin">
              <StatCard
                title="Total Leads"
                value={systemStats.totalLeads}
                color="blue"
                icon={
                  <svg className="stat-card__icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                }
              />
              
              <StatCard
                title="Success Rate"
                value={`${systemStats.successRate}%`}
                color="green"
                icon={
                  <svg className="stat-card__icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                }
              />
              
              <StatCard
                title="Total Users"
                value={systemStats.totalUsers}
                color="purple"
                icon={
                  <svg className="stat-card__icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                  </svg>
                }
              />

              <StatCard
                title="Active Users"
                value={systemStats.activeUsers}
                color="yellow"
                icon={
                  <svg className="stat-card__icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                }
              />

          
            </div>

            {/* Chart */}
            <div className="dashboard-page__chart-section">
              <Chart logs={logs} />
            </div>

            {/* Main Content Grid */}
            <div className="dashboard-page__main-grid">
              <div className="dashboard-page__section">
                <h2 className="dashboard-page__section-title">
                  <svg className="dashboard-page__section-icon dashboard-page__section-icon--blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Recent Leads
                </h2>
                <div className="dashboard-page__leads-list">
                  {logs.length > 0 ? (
                    logs.slice(0, 5).map((log, index) => (
                      <LeadCard key={log.id || index} log={log} />
                    ))
                  ) : (
                    <div className="dashboard-page__empty-state">
                      <p>No leads found in the system.</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="dashboard-page__section">
                <h2 className="dashboard-page__section-title">
                  <svg className="dashboard-page__section-icon dashboard-page__section-icon--green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  Activity Logs
                </h2>
                {logs.length > 0 ? (
                  <TriggerLog logs={logs} />
                ) : (
                  <div className="dashboard-page__empty-state">
                    <p>No activity logs found in the system.</p>
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="dashboard-page__section">
            <div className="dashboard-page__section-header">
              <h2 className="dashboard-page__section-title">User Management</h2>
              <p className="dashboard-page__section-subtitle">Manage user accounts and permissions</p>
            </div>
            <div className="dashboard-page__table-container">
              {users.length > 0 ? (
                <table className="dashboard-page__table">
                  <thead className="dashboard-page__table-header">
                    <tr>
                      <th className="dashboard-page__table-th">User</th>
                      <th className="dashboard-page__table-th">Role</th>
                      <th className="dashboard-page__table-th">Status</th>
                      <th className="dashboard-page__table-th">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="dashboard-page__table-body">
                    {users.map((user) => (
                      <tr key={user.id} className="dashboard-page__table-tr">
                        <td className="dashboard-page__table-td dashboard-page__table-td--user">
                          <div>
                            <div className="dashboard-page__user-name">{user.full_name}</div>
                            <div className="dashboard-page__user-email">{user.email}</div>
                          </div>
                        </td>
                        <td className="dashboard-page__table-td">
                          <span className={`dashboard-page__badge dashboard-page__badge--${user.role}`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="dashboard-page__table-td">
                          <span className={`dashboard-page__badge ${user.is_active ? 'dashboard-page__badge--active' : 'dashboard-page__badge--inactive'}`}>
                            {user.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="dashboard-page__table-td">
                          <button
                            onClick={() => handleUserToggle(user.id, user.is_active)}
                            disabled={user.role === 'admin'}
                            className={`dashboard-page__action-button ${
                              user.role === 'admin'
                                ? 'dashboard-page__action-button--disabled'
                                : user.is_active
                                  ? 'dashboard-page__action-button--deactivate'
                                  : 'dashboard-page__action-button--activate'
                            }`}
                          >
                            {user.is_active ? 'Deactivate' : 'Activate'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="dashboard-page__empty-state">
                  <p>No users found in the system.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="dashboard-page__analytics-grid">
            <div className="dashboard-page__analytics-card">
              <h3 className="dashboard-page__analytics-title">Lead Conversion Rate</h3>
              <div className="dashboard-page__analytics-value dashboard-page__analytics-value--green">{systemStats.successRate}%</div>
              <p className="dashboard-page__analytics-description">Successfully processed leads</p>
            </div>
            <div className="dashboard-page__analytics-card">
              <h3 className="dashboard-page__analytics-title">Detailed Analytics</h3>
              <p className="dashboard-page__analytics-description">Advanced analytics and reporting features would be implemented here.</p>
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="dashboard-page__analytics-grid">
            <div className="dashboard-page__settings-section">
              <h3 className="dashboard-page__settings-title">System Configuration</h3>
              <div className="dashboard-page__settings-form">
                <div className="dashboard-page__settings-group">
                  <label className="dashboard-page__settings-label">API Endpoint</label>
                  <input
                    type="text"
                    value={process.env.REACT_APP_API_URL || 'http://localhost:8000'}
                    readOnly
                    className="dashboard-page__settings-input"
                  />
                </div>
                <div className="dashboard-page__settings-group">
                  <label className="dashboard-page__settings-label">Environment</label>
                  <input
                    type="text"
                    value={process.env.NODE_ENV || 'development'}
                    readOnly
                    className="dashboard-page__settings-input"
                  />
                </div>
              </div>
            </div>
            <div className="dashboard-page__settings-section">
              <h3 className="dashboard-page__settings-title">Security Settings</h3>
              <p className="dashboard-page__settings-text">Security and authentication settings would be configured here.</p>
            </div>
          </div>
        )}

        {/* Error Display */}
        <ErrorDisplay error={webhookError || userError} className="dashboard-page__error" />
      </div>
    </div>
  );
};

export default AdminDashboardPage; 