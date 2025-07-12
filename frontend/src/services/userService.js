import apiService from './api';

class UserService {
  async getUsers() {
    try {
      return await apiService.get('/auth/users');
    } catch (error) {
      throw error;
    }
  }

  async toggleUserStatus(userId, isActive) {
    try {
      return await apiService.put(`/auth/users/${userId}/toggle`, { 
        is_active: !isActive 
      });
    } catch (error) {
      throw error;
    }
  }
}

const userService = new UserService();
export default userService; 