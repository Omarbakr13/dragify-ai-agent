import { useState, useEffect } from 'react';
import userService from '../services/userService';

export const useUserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await userService.getUsers();
      setUsers(data);
    } catch (err) {
      setError(err.message);
      // Don't show fake data, just set empty array
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const toggleUserStatus = async (userId, isActive) => {
    try {
      await userService.toggleUserStatus(userId, isActive);
      setUsers(users.map(user => 
        user.id === userId ? { ...user, is_active: !isActive } : user
      ));
    } catch (err) {
      setError('Failed to update user status');
      throw err;
    }
  };

  const getSystemStats = () => {
    const totalUsers = users.length;
    const activeUsers = users.filter(user => user.is_active).length;
    const adminUsers = users.filter(user => user.role === 'admin').length;
    const regularUsers = users.filter(user => user.role === 'user').length;

    return {
      totalUsers,
      activeUsers,
      adminUsers,
      regularUsers,
      activeRate: totalUsers > 0 ? Math.round((activeUsers / totalUsers) * 100) : 0
    };
  };

  const refresh = () => {
    fetchUsers();
  };

  return {
    users,
    loading,
    error,
    stats: getSystemStats(),
    toggleUserStatus,
    refresh
  };
}; 