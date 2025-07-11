import pytest
import json
from unittest.mock import patch, AsyncMock
from services.agent import extract_lead_info

class TestAgentService:
    """Test cases for the AI agent service"""

    @pytest.mark.asyncio
    async def test_extract_lead_info_success(self):
        """Test successful lead information extraction"""
        test_message = "Hi, I'm John Doe from TechCorp. My email is john@techcorp.com"
        expected_result = {
            "name": "John Doe",
            "email": "john@techcorp.com",
            "company": "TechCorp"
        }

        mock_response = {
            "choices": [{
                "message": {
                    "content": json.dumps(expected_result)
                }
            }]
        }

        with patch('services.agent.httpx.AsyncClient') as mock_client:
            mock_client.return_value.__aenter__.return_value.post = AsyncMock()
            mock_client.return_value.__aenter__.return_value.post.return_value.json.return_value = mock_response

            result = await extract_lead_info(test_message)

            assert result == expected_result
            assert "name" in result
            assert "email" in result
            assert "company" in result

    @pytest.mark.asyncio
    async def test_extract_lead_info_with_extra_text(self):
        """Test extraction when LLM returns extra text with JSON"""
        test_message = "Contact me at sarah@startup.io, I am Sarah from Startup Inc"
        expected_result = {
            "name": "Sarah",
            "email": "sarah@startup.io",
            "company": "Startup Inc"
        }

        mock_response = {
            "choices": [{
                "message": {
                    "content": f"Here's the extracted data: {json.dumps(expected_result)}"
                }
            }]
        }

        with patch('services.agent.httpx.AsyncClient') as mock_client:
            mock_client.return_value.__aenter__.return_value.post = AsyncMock()
            mock_client.return_value.__aenter__.return_value.post.return_value.json.return_value = mock_response

            result = await extract_lead_info(test_message)

            assert result == expected_result

    @pytest.mark.asyncio
    async def test_extract_lead_info_invalid_json(self):
        """Test fallback when LLM returns invalid JSON"""
        test_message = "Hello, I'm Mike from BigCorp"

        mock_response = {
            "choices": [{
                "message": {
                    "content": "Invalid JSON response"
                }
            }]
        }

        with patch('services.agent.httpx.AsyncClient') as mock_client:
            mock_client.return_value.__aenter__.return_value.post = AsyncMock()
            mock_client.return_value.__aenter__.return_value.post.return_value.json.return_value = mock_response

            result = await extract_lead_info(test_message)

            # Should return fallback values
            assert result["name"] == "Unknown"
            assert result["email"] == "unknown@example.com"
            assert result["company"] == "Unknown"

    @pytest.mark.asyncio
    async def test_extract_lead_info_api_error(self):
        """Test handling of API errors"""
        test_message = "Test message"

        with patch('services.agent.httpx.AsyncClient') as mock_client:
            mock_client.return_value.__aenter__.return_value.post = AsyncMock()
            mock_client.return_value.__aenter__.return_value.post.side_effect = Exception("API Error")

            result = await extract_lead_info(test_message)

            # Should return fallback values on error
            assert result["name"] == "Unknown"
            assert result["email"] == "unknown@example.com"
            assert result["company"] == "Unknown"

    @pytest.mark.asyncio
    async def test_extract_lead_info_empty_message(self):
        """Test handling of empty messages"""
        test_message = ""

        mock_response = {
            "choices": [{
                "message": {
                    "content": json.dumps({
                        "name": "Unknown",
                        "email": "unknown@example.com",
                        "company": "Unknown"
                    })
                }
            }]
        }

        with patch('services.agent.httpx.AsyncClient') as mock_client:
            mock_client.return_value.__aenter__.return_value.post = AsyncMock()
            mock_client.return_value.__aenter__.return_value.post.return_value.json.return_value = mock_response

            result = await extract_lead_info(test_message)

            assert result["name"] == "Unknown"
            assert result["email"] == "unknown@example.com"
            assert result["company"] == "Unknown"

    @pytest.mark.asyncio
    async def test_extract_lead_info_complex_message(self):
        """Test extraction from complex, multi-line messages"""
        test_message = """
        Hi there, just following up on our previous conversation. 
        I'm Ahmed Bassyouni, co-founder of Cloudilic. 
        We're exploring AI solutions to automate our lead capture and onboarding process. 
        You can reach me at ahmed@cloudilic.com. 
        Looking forward to connecting further.
        """
        
        expected_result = {
            "name": "Ahmed Bassyouni",
            "email": "ahmed@cloudilic.com",
            "company": "Cloudilic"
        }

        mock_response = {
            "choices": [{
                "message": {
                    "content": json.dumps(expected_result)
                }
            }]
        }

        with patch('services.agent.httpx.AsyncClient') as mock_client:
            mock_client.return_value.__aenter__.return_value.post = AsyncMock()
            mock_client.return_value.__aenter__.return_value.post.return_value.json.return_value = mock_response

            result = await extract_lead_info(test_message)

            assert result == expected_result 