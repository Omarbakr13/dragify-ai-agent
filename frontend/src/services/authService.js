import apiService from './api';

class AuthService {
  constructor() {
    this.token = localStorage.getItem('token');
    this.user = JSON.parse(localStorage.getItem('user') || 'null');
  }

  async login(email, password) {
    try {
      // Backend now accepts email directly
      const data = await apiService.post('/auth/login', { 
        email, // Backend now expects 'email' field
        password 
      });
      
      // Get user details from /me endpoint
      const userData = await this.getUserDetails(data.access_token);
      
      this.setSession(data.access_token, userData);
      return { ...data, user: userData };
    } catch (error) {
      throw error;
    }
  }

  async register(email, password, full_name, role = 'user') {
    try {
      // For registration, we'll use email as username
      const data = await apiService.post('/auth/register', { 
        username: email, // Backend expects 'username' field
        email,
        password, 
        full_name, 
        role 
      });
      
      // Get user details from /me endpoint
      const userData = await this.getUserDetails(data.access_token);
      
      this.setSession(data.access_token, userData);
      return { ...data, user: userData };
    } catch (error) {
      throw error;
    }
  }

  async getUserDetails(token) {
    try {
      // Temporarily set token to get user details
      const originalToken = this.token;
      this.token = token;
      localStorage.setItem('token', token);
      
      const userData = await apiService.get('/auth/me');
      
      // Restore original token if it was different
      if (originalToken !== token) {
        this.token = originalToken;
        localStorage.setItem('token', originalToken || '');
      }
      
      return userData;
    } catch (error) {
      console.error('Failed to get user details:', error);
      throw new Error('Failed to get user details');
    }
  }

  logout() {
    this.token = null;
    this.user = null;
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  setSession(token, user) {
    this.token = token;
    this.user = user;
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
  }

  getToken() {
    return this.token;
  }

  getUser() {
    return this.user;
  }

  isAuthenticated() {
    return !!this.token;
  }

  isAdmin() {
    return this.user && this.user.role === 'admin';
  }

  // Refresh user data from localStorage
  refreshUser() {
    this.user = JSON.parse(localStorage.getItem('user') || 'null');
    return this.user;
  }
}

export default new AuthService(); 