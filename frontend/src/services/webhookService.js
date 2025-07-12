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

const webhookService = new WebhookService();
export default webhookService; 