import httpx
import os
import json
import re
import logging
from typing import Dict, Optional
from dotenv import load_dotenv
from models.lead import LeadResponse

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

load_dotenv()

# Environment variable validation
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
if not GROQ_API_KEY:
    logger.error("GROQ_API_KEY environment variable is not set!")
    raise ValueError("GROQ_API_KEY environment variable is required")

async def extract_lead_info(message: str) -> Dict[str, str]:
    """
    Extract lead information from unstructured message using LLM
    
    Args:
        message: The unstructured message to process
        
    Returns:
        Dictionary containing name, email, and company
        
    Raises:
        ValueError: If message is empty or invalid
        httpx.HTTPError: If API request fails
    """
    # Input validation
    if not message or not message.strip():
        logger.warning("Empty message provided to extract_lead_info")
        return {"name": "Unknown", "email": "unknown@example.com", "company": "Unknown"}
    
    # Sanitize input
    message = message.strip()
    if len(message) > 10000:  # Limit message length
        logger.warning(f"Message too long ({len(message)} chars), truncating")
        message = message[:10000]
    
    prompt = f"""
Extract the full name, email, and company name from the following message:
\"\"\"{message}\"\"\"

Return ONLY valid JSON in this exact format without any additional text:
{{ "name": "...", "email": "...", "company": "..." }}
"""

    headers = {
        "Authorization": f"Bearer {GROQ_API_KEY}",
        "Content-Type": "application/json"
    }

    data = {
        "messages": [
            {"role": "user", "content": prompt}
        ],
        "model": "llama3-70b-8192",
        "temperature": 0.2,
        "max_tokens": 200
    }

    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.post(
                "https://api.groq.com/openai/v1/chat/completions",
                headers=headers,
                json=data
            )
            
            # Check for HTTP errors
            response.raise_for_status()
            
            result = response.json()
            
            # Validate response structure
            if "choices" not in result or not result["choices"]:
                logger.error("Invalid API response structure")
                raise ValueError("Invalid API response")
            
            content = result["choices"][0]["message"]["content"]
            
            # Extract JSON from response using regex
            json_match = re.search(r'\{.*\}', content, re.DOTALL)
            if json_match:
                try:
                    extracted_data = json.loads(json_match.group())
                    
                    # Validate extracted data structure
                    required_fields = ["name", "email", "company"]
                    if all(field in extracted_data for field in required_fields):
                        logger.info(f"Successfully extracted lead data: {extracted_data['name']}")
                        return extracted_data
                    else:
                        logger.warning("Extracted data missing required fields")
                        
                except json.JSONDecodeError as e:
                    logger.error(f"Failed to parse JSON from LLM response: {e}")
            
            # Fallback: return default structure
            logger.warning("Using fallback values due to extraction failure")
            return {"name": "Unknown", "email": "unknown@example.com", "company": "Unknown"}
            
    except httpx.TimeoutException:
        logger.error("API request timed out")
        return {"name": "Unknown", "email": "unknown@example.com", "company": "Unknown"}
    except httpx.HTTPStatusError as e:
        logger.error(f"HTTP error {e.response.status_code}: {e.response.text}")
        return {"name": "Unknown", "email": "unknown@example.com", "company": "Unknown"}
    except httpx.RequestError as e:
        logger.error(f"Request error: {e}")
        return {"name": "Unknown", "email": "unknown@example.com", "company": "Unknown"}
    except Exception as e:
        logger.error(f"Unexpected error in extract_lead_info: {e}")
        return {"name": "Unknown", "email": "unknown@example.com", "company": "Unknown"}

def validate_lead_data(data: Dict[str, str]) -> bool:
    """
    Validate extracted lead data
    
    Args:
        data: Lead data to validate
        
    Returns:
        True if valid, False otherwise
    """
    if not isinstance(data, dict):
        return False
    
    required_fields = ["name", "email", "company"]
    if not all(field in data for field in required_fields):
        return False
    
    # Basic email validation
    email = data.get("email", "")
    if email and "@" not in email:
        return False
    
    return True
