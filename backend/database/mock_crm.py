import json
import time
import random
from pathlib import Path
from typing import Optional

CRM_FILE = Path("database/crm.json")
MAX_RETRIES = 3
RETRY_DELAY = 1  # seconds

def save_to_crm(data: dict, retry_count: int = 0) -> str:
    """
    Save lead data to CRM with retry logic
    
    Args:
        data: Lead data to save
        retry_count: Current retry attempt (internal use)
    
    Returns:
        "success" or "failure"
    """
    try:
        # Simulate occasional failures for testing retry logic
        if random.random() < 0.1:  # 10% chance of failure
            raise Exception("Simulated CRM failure")
            
        if not CRM_FILE.exists():
            CRM_FILE.write_text("[]")
        
        leads = json.loads(CRM_FILE.read_text())
        leads.append(data)
        CRM_FILE.write_text(json.dumps(leads, indent=2))
        return "success"
        
    except Exception as e:
        print(f"CRM save attempt {retry_count + 1} failed: {e}")
        
        # Retry logic
        if retry_count < MAX_RETRIES:
            print(f"Retrying in {RETRY_DELAY} seconds... (attempt {retry_count + 2}/{MAX_RETRIES + 1})")
            time.sleep(RETRY_DELAY)
            return save_to_crm(data, retry_count + 1)
        else:
            print(f"All {MAX_RETRIES + 1} attempts failed. Giving up.")
            return "failure"

def get_crm_stats() -> dict:
    """
    Get CRM statistics
    
    Returns:
        Dictionary with CRM statistics
    """
    try:
        if not CRM_FILE.exists():
            return {
                "total_leads": 0,
                "last_updated": None,
                "file_size": 0
            }
        
        leads = json.loads(CRM_FILE.read_text())
        file_stats = CRM_FILE.stat()
        
        return {
            "total_leads": len(leads),
            "last_updated": file_stats.st_mtime,
            "file_size": file_stats.st_size
        }
    except Exception as e:
        print(f"Error getting CRM stats: {e}")
        return {
            "total_leads": 0,
            "last_updated": None,
            "file_size": 0,
            "error": str(e)
        }
