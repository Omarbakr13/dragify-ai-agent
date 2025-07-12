import { useState, useEffect } from 'react';
import webhookService from '../services/webhookService';

export const useWebhookData = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await webhookService.getLogs();
      setLogs(data);
    } catch (err) {
      setError(err.message);
      // Don't show fake data, just set empty array
      setLogs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const getStats = () => {
    const totalLeads = logs.length;
    const successCount = logs.filter(log => log.save_status === 'success').length;
    const successRate = totalLeads > 0 ? Math.round((successCount / totalLeads) * 100) : 0;
    const todayCount = logs.filter(log => {
      const today = new Date().toDateString();
      return new Date(log.timestamp).toDateString() === today;
    }).length;

    return {
      totalLeads,
      successCount,
      successRate,
      todayCount
    };
  };

  const refresh = () => {
    fetchLogs();
  };

  return {
    logs,
    loading,
    error,
    stats: getStats(),
    refresh
  };
}; 