import { useState, useEffect } from 'react';
import authService from '../services/authService';

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = () => {
    const token = authService.getToken();
    const userData = authService.getUser();
    
    if (token && userData) {
      setIsAuthenticated(true);
      setUser(userData);
    }
    setLoading(false);
  };

  const login = async (email, password, onSuccess) => {
    try {
      const data = await authService.login(email, password);
      setIsAuthenticated(true);
      setUser(data.user);
      
      // Call success callback if provided (for navigation)
      if (onSuccess) {
        onSuccess(data.user);
      }
      
      return data;
    } catch (error) {
      throw error;
    }
  };

  const register = async (email, password, full_name, role, onSuccess) => {
    try {
      const data = await authService.register(email, password, full_name, role);
      
      // Call success callback if provided (for navigation)
      if (onSuccess) {
        onSuccess(data.user);
      }
      
      return data;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    authService.logout();
    setIsAuthenticated(false);
    setUser(null);
  };

  const isAdmin = () => {
    return user && user.role === 'admin';
  };

  return {
    isAuthenticated,
    user,
    loading,
    login,
    register,
    logout,
    isAdmin,
    checkAuth
  };
}; 