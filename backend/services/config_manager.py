import json
import os
from pathlib import Path
from typing import Dict, Any, Optional
from datetime import datetime
import logging

logger = logging.getLogger(__name__)

class ConfigManager:
    """Manages dynamic configuration for business logic"""
    
    def __init__(self):
        self.config_file = Path("backend/config/business_config.json")
        self.config_file.parent.mkdir(exist_ok=True)
        self.default_config = {
            "llm_settings": {
                "model": "llama3-70b-8192",
                "temperature": 0.2,
                "max_tokens": 200
            },
            "crm_settings": {
                "retry_attempts": 3,
                "retry_delay": 1,
                "failure_rate": 0.1
            },
            "webhook_settings": {
                "rate_limit": 100,  # requests per hour
                "message_max_length": 10000,
                "enable_retry": True
            },
            "extraction_settings": {
                "required_fields": ["name", "email", "company"],
                "fallback_values": {
                    "name": "Unknown",
                    "email": "unknown@example.com",
                    "company": "Unknown"
                }
            },
            "last_updated": datetime.now().isoformat()
        }
        self.load_config()
    
    def load_config(self) -> None:
        """Load configuration from file"""
        try:
            if self.config_file.exists():
                with open(self.config_file, 'r') as f:
                    self.config = json.load(f)
                logger.info("Configuration loaded successfully")
            else:
                self.config = self.default_config.copy()
                self.save_config()
                logger.info("Default configuration created")
        except Exception as e:
            logger.error(f"Error loading config: {e}")
            self.config = self.default_config.copy()
    
    def save_config(self) -> bool:
        """Save configuration to file"""
        try:
            self.config["last_updated"] = datetime.now().isoformat()
            with open(self.config_file, 'w') as f:
                json.dump(self.config, f, indent=2)
            logger.info("Configuration saved successfully")
            return True
        except Exception as e:
            logger.error(f"Error saving config: {e}")
            return False
    
    def get_config(self, section: Optional[str] = None) -> Dict[str, Any]:
        """Get configuration, optionally filtered by section"""
        if section:
            return self.config.get(section, {})
        return self.config
    
    def update_config(self, updates: Dict[str, Any]) -> bool:
        """Update configuration with new values"""
        try:
            for key, value in updates.items():
                if isinstance(value, dict) and key in self.config:
                    self.config[key].update(value)
                else:
                    self.config[key] = value
            
            return self.save_config()
        except Exception as e:
            logger.error(f"Error updating config: {e}")
            return False
    
    def update_llm_settings(self, model: Optional[str] = None, 
                          temperature: Optional[float] = None,
                          max_tokens: Optional[int] = None) -> bool:
        """Update LLM settings"""
        updates = {}
        if model:
            updates["model"] = model
        if temperature is not None:
            updates["temperature"] = temperature
        if max_tokens is not None:
            updates["max_tokens"] = max_tokens
        
        if updates:
            return self.update_config({"llm_settings": updates})
        return True
    
    def update_crm_settings(self, retry_attempts: Optional[int] = None,
                          retry_delay: Optional[int] = None,
                          failure_rate: Optional[float] = None) -> bool:
        """Update CRM settings"""
        updates = {}
        if retry_attempts is not None:
            updates["retry_attempts"] = retry_attempts
        if retry_delay is not None:
            updates["retry_delay"] = retry_delay
        if failure_rate is not None:
            updates["failure_rate"] = failure_rate
        
        if updates:
            return self.update_config({"crm_settings": updates})
        return True
    
    def update_webhook_settings(self, rate_limit: Optional[int] = None,
                              message_max_length: Optional[int] = None,
                              enable_retry: Optional[bool] = None) -> bool:
        """Update webhook settings"""
        updates = {}
        if rate_limit is not None:
            updates["rate_limit"] = rate_limit
        if message_max_length is not None:
            updates["message_max_length"] = message_max_length
        if enable_retry is not None:
            updates["enable_retry"] = enable_retry
        
        if updates:
            return self.update_config({"webhook_settings": updates})
        return True
    
    def reset_to_defaults(self) -> bool:
        """Reset configuration to default values"""
        self.config = self.default_config.copy()
        return self.save_config()
    
    def get_config_history(self) -> Dict[str, Any]:
        """Get configuration change history"""
        return {
            "last_updated": self.config.get("last_updated"),
            "config_file": str(self.config_file),
            "file_size": self.config_file.stat().st_size if self.config_file.exists() else 0
        }

# Global config manager instance
config_manager = ConfigManager() 