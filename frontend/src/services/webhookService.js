import apiService from './api';

class WebhookService {
  async getLogs() {
    try {
      return await apiService.get('/webhook/logs');
    } catch (error) {
      throw error;
    }
  }
}

export default new WebhookService(); 