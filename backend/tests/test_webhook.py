import pytest
from fastapi.testclient import TestClient
from unittest.mock import patch, AsyncMock
from main import app
from models.lead import WebhookMessage

client = TestClient(app)

class TestWebhookEndpoints:
    """Test cases for webhook endpoints"""

    def test_webhook_endpoint_success(self):
        """Test successful webhook processing"""
        test_payload = {
            "message": "Hi, I'm John Doe from TechCorp. My email is john@techcorp.com"
        }

        expected_extracted = {
            "name": "John Doe",
            "email": "john@techcorp.com",
            "company": "TechCorp"
        }

        with patch('routes.webhook.extract_lead_info') as mock_extract:
            mock_extract.return_value = expected_extracted
            
            with patch('routes.webhook.save_to_crm') as mock_save:
                mock_save.return_value = "success"

                response = client.post("/webhook/", json=test_payload)

                assert response.status_code == 200
                data = response.json()
                assert data["extracted"] == expected_extracted
                assert data["save_status"] == "success"

    def test_webhook_endpoint_invalid_payload(self):
        """Test webhook with invalid payload"""
        invalid_payload = {
            "invalid_field": "test"
        }

        response = client.post("/webhook/", json=invalid_payload)

        assert response.status_code == 422  # Validation error

    def test_webhook_endpoint_empty_message(self):
        """Test webhook with empty message"""
        test_payload = {
            "message": ""
        }

        with patch('routes.webhook.extract_lead_info') as mock_extract:
            mock_extract.return_value = {
                "name": "Unknown",
                "email": "unknown@example.com",
                "company": "Unknown"
            }
            
            with patch('routes.webhook.save_to_crm') as mock_save:
                mock_save.return_value = "success"

                response = client.post("/webhook/", json=test_payload)

                assert response.status_code == 200
                data = response.json()
                assert data["extracted"]["name"] == "Unknown"

    def test_webhook_endpoint_crm_failure(self):
        """Test webhook when CRM save fails"""
        test_payload = {
            "message": "Hi, I'm Sarah from Startup Inc. Email: sarah@startup.io"
        }

        expected_extracted = {
            "name": "Sarah",
            "email": "sarah@startup.io",
            "company": "Startup Inc"
        }

        with patch('routes.webhook.extract_lead_info') as mock_extract:
            mock_extract.return_value = expected_extracted
            
            with patch('routes.webhook.save_to_crm') as mock_save:
                mock_save.return_value = "failure"

                response = client.post("/webhook/", json=test_payload)

                assert response.status_code == 200
                data = response.json()
                assert data["extracted"] == expected_extracted
                assert data["save_status"] == "failure"

    def test_get_logs_endpoint(self):
        """Test retrieving webhook logs"""
        # First, create some test data
        test_payload = {
            "message": "Test message for logs"
        }

        with patch('routes.webhook.extract_lead_info') as mock_extract:
            mock_extract.return_value = {
                "name": "Test User",
                "email": "test@example.com",
                "company": "Test Company"
            }
            
            with patch('routes.webhook.save_to_crm') as mock_save:
                mock_save.return_value = "success"

                # Make a webhook call to generate logs
                client.post("/webhook/", json=test_payload)

        # Now test getting logs
        response = client.get("/webhook/logs")

        assert response.status_code == 200
        logs = response.json()
        assert isinstance(logs, list)
        
        if logs:  # If there are logs
            log_entry = logs[0]
            assert "id" in log_entry
            assert "timestamp" in log_entry
            assert "message" in log_entry
            assert "extracted" in log_entry
            assert "save_status" in log_entry

    def test_webhook_endpoint_large_message(self):
        """Test webhook with large message"""
        large_message = "A" * 1000  # 1000 character message
        
        test_payload = {
            "message": large_message
        }

        with patch('routes.webhook.extract_lead_info') as mock_extract:
            mock_extract.return_value = {
                "name": "Large Message User",
                "email": "large@example.com",
                "company": "Large Company"
            }
            
            with patch('routes.webhook.save_to_crm') as mock_save:
                mock_save.return_value = "success"

                response = client.post("/webhook/", json=test_payload)

                assert response.status_code == 200
                data = response.json()
                assert "extracted" in data
                assert "save_status" in data

    def test_webhook_endpoint_special_characters(self):
        """Test webhook with special characters in message"""
        test_payload = {
            "message": "Hi, I'm José María from Côte d'Azur Corp. Email: josé@côte-azur.com"
        }

        expected_extracted = {
            "name": "José María",
            "email": "josé@côte-azur.com",
            "company": "Côte d'Azur Corp"
        }

        with patch('routes.webhook.extract_lead_info') as mock_extract:
            mock_extract.return_value = expected_extracted
            
            with patch('routes.webhook.save_to_crm') as mock_save:
                mock_save.return_value = "success"

                response = client.post("/webhook/", json=test_payload)

                assert response.status_code == 200
                data = response.json()
                assert data["extracted"] == expected_extracted 