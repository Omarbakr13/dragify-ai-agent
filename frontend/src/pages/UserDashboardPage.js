import React, { useState } from 'react';
import { useAuth } from '../viewmodels/useAuth';
import { useWebhookData } from '../viewmodels/useWebhookData';
import Header from '../components/ui/Header';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import ErrorDisplay from '../components/ui/ErrorDisplay';
import StatCard from '../components/ui/StatCard';
import Chart from '../components/dashboard/Chart';
import LeadCard from '../components/dashboard/LeadCard';
import TriggerLog from '../components/dashboard/TriggerLog';

const UserDashboardPage = () => {
  const { user } = useAuth();
  const { logs, loading, error, stats, refresh } = useWebhookData();
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const handleSubmitMessage = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    setSubmitting(true);
    setSubmitError('');

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:8000'}/webhook/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: message.trim(),
          user_id: user?.email || 'default_user',
          session_id: `session_${Date.now()}`
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to process message');
      }

      const result = await response.json();
      console.log('Lead extracted:', result);
      
      // Show success or warning message
      if (result.save_status === 'no_contact_info') {
        setSubmitError('No contact information found. Please include a name, email, or company in your message.');
      } else if (result.save_status === 'success') {
        // Show success message briefly
        setSubmitError(''); // Clear any previous errors
        // You could add a success message here if needed
      } else {
        setSubmitError(result.message || 'Failed to process message');
      }
      
      // Clear the form and refresh data
      setMessage('');
      refresh();
      
    } catch (err) {
      setSubmitError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-page">
        <LoadingSpinner size="lg" className="dashboard-page__loading" />
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <Header
        title="Dragify AI Agent Dashboard"
        subtitle={`Welcome back, ${user?.full_name || 'User'}`}
        user={user}
      />

      <div className="dashboard-page__content">
        {/* Message Input Form */}
        <div className="dashboard-page__section">
          <h2 className="dashboard-page__section-title">
            <svg className="dashboard-page__section-icon dashboard-page__section-icon--blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Create New Lead
          </h2>
          <form onSubmit={handleSubmitMessage} className="dashboard-page__message-form">
            <div className="dashboard-page__form-group">
              <label htmlFor="message" className="dashboard-page__form-label">
                Enter message to extract lead information:
              </label>
              <textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Example: Hi, I am omar from Tech. My email is omar@tech.com and I'm interested in your services."
                className="dashboard-page__form-textarea"
                rows="4"
                required
                disabled={submitting}
              />
            </div>
            <button
              type="submit"
              disabled={submitting || !message.trim()}
              className="dashboard-page__submit-button"
            >
              {submitting ? (
                <div className="dashboard-page__button-content">
                  <LoadingSpinner size="sm" text="" />
                  <span>Processing...</span>
                </div>
              ) : (
                'Extract Lead'
              )}
            </button>
          </form>
          {submitError && (
            <ErrorDisplay error={submitError} className="dashboard-page__form-error" />
          )}
        </div>

        {/* Stats Cards */}
        <div className="dashboard-page__stats-grid">
          <StatCard
            title="Total Leads"
            value={stats.totalLeads}
            color="blue"
            icon={
              <svg className="stat-card__icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            }
          />
          
          <StatCard
            title="Success Rate"
            value={`${stats.successRate}%`}
            color="green"
            icon={
              <svg className="stat-card__icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          />
          
          <StatCard
            title="Today's Leads"
            value={stats.todayCount}
            color="purple"
            icon={
              <svg className="stat-card__icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
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
          {/* Lead Cards */}
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
                  <p>No leads found. Create your first lead using the form above.</p>
                </div>
              )}
            </div>
          </div>

          {/* Trigger Logs */}
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
                <p>No activity logs found. Activity will appear here once you start creating leads.</p>
              </div>
            )}
          </div>
        </div>

        {/* Error Display */}
        <ErrorDisplay error={error} className="dashboard-page__error" />
      </div>
    </div>
  );
};

export default UserDashboardPage; 