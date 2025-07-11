from fastapi import APIRouter, HTTPException
from typing import Dict, Any, Optional
from services.config_manager import config_manager
from pydantic import BaseModel

router = APIRouter()

class ConfigUpdateRequest(BaseModel):
    llm_settings: Optional[Dict[str, Any]] = None
    crm_settings: Optional[Dict[str, Any]] = None
    webhook_settings: Optional[Dict[str, Any]] = None
    extraction_settings: Optional[Dict[str, Any]] = None

class LLMUpdateRequest(BaseModel):
    model: Optional[str] = None
    temperature: Optional[float] = None
    max_tokens: Optional[int] = None

class CRMUpdateRequest(BaseModel):
    retry_attempts: Optional[int] = None
    retry_delay: Optional[int] = None
    failure_rate: Optional[float] = None

class WebhookUpdateRequest(BaseModel):
    rate_limit: Optional[int] = None
    message_max_length: Optional[int] = None
    enable_retry: Optional[bool] = None

@router.get("/")
async def get_configuration(section: Optional[str] = None):
    """Get current configuration, optionally filtered by section"""
    try:
        config = config_manager.get_config(section)
        return {
            "success": True,
            "config": config,
            "last_updated": config_manager.config.get("last_updated")
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving configuration: {str(e)}")

@router.put("/")
async def update_configuration(request: ConfigUpdateRequest):
    """Update configuration with new values"""
    try:
        updates = {}
        if request.llm_settings:
            updates["llm_settings"] = request.llm_settings
        if request.crm_settings:
            updates["crm_settings"] = request.crm_settings
        if request.webhook_settings:
            updates["webhook_settings"] = request.webhook_settings
        if request.extraction_settings:
            updates["extraction_settings"] = request.extraction_settings
        
        if not updates:
            raise HTTPException(status_code=400, detail="No updates provided")
        
        success = config_manager.update_config(updates)
        
        if success:
            return {
                "success": True,
                "message": "Configuration updated successfully",
                "updated_sections": list(updates.keys()),
                "last_updated": config_manager.config.get("last_updated")
            }
        else:
            raise HTTPException(status_code=500, detail="Failed to update configuration")
            
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error updating configuration: {str(e)}")

@router.put("/llm")
async def update_llm_settings(request: LLMUpdateRequest):
    """Update LLM-specific settings"""
    try:
        success = config_manager.update_llm_settings(
            model=request.model,
            temperature=request.temperature,
            max_tokens=request.max_tokens
        )
        
        if success:
            return {
                "success": True,
                "message": "LLM settings updated successfully",
                "current_settings": config_manager.get_config("llm_settings")
            }
        else:
            raise HTTPException(status_code=500, detail="Failed to update LLM settings")
            
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error updating LLM settings: {str(e)}")

@router.put("/crm")
async def update_crm_settings(request: CRMUpdateRequest):
    """Update CRM-specific settings"""
    try:
        success = config_manager.update_crm_settings(
            retry_attempts=request.retry_attempts,
            retry_delay=request.retry_delay,
            failure_rate=request.failure_rate
        )
        
        if success:
            return {
                "success": True,
                "message": "CRM settings updated successfully",
                "current_settings": config_manager.get_config("crm_settings")
            }
        else:
            raise HTTPException(status_code=500, detail="Failed to update CRM settings")
            
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error updating CRM settings: {str(e)}")

@router.put("/webhook")
async def update_webhook_settings(request: WebhookUpdateRequest):
    """Update webhook-specific settings"""
    try:
        success = config_manager.update_webhook_settings(
            rate_limit=request.rate_limit,
            message_max_length=request.message_max_length,
            enable_retry=request.enable_retry
        )
        
        if success:
            return {
                "success": True,
                "message": "Webhook settings updated successfully",
                "current_settings": config_manager.get_config("webhook_settings")
            }
        else:
            raise HTTPException(status_code=500, detail="Failed to update webhook settings")
            
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error updating webhook settings: {str(e)}")

@router.post("/reset")
async def reset_configuration():
    """Reset configuration to default values"""
    try:
        success = config_manager.reset_to_defaults()
        
        if success:
            return {
                "success": True,
                "message": "Configuration reset to defaults successfully",
                "default_config": config_manager.config
            }
        else:
            raise HTTPException(status_code=500, detail="Failed to reset configuration")
            
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error resetting configuration: {str(e)}")

@router.get("/history")
async def get_configuration_history():
    """Get configuration change history"""
    try:
        history = config_manager.get_config_history()
        return {
            "success": True,
            "history": history
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving configuration history: {str(e)}")

@router.get("/validate")
async def validate_configuration():
    """Validate current configuration"""
    try:
        config = config_manager.get_config()
        validation_results = {
            "llm_settings": {
                "valid": "model" in config.get("llm_settings", {}),
                "model": config.get("llm_settings", {}).get("model"),
                "temperature": config.get("llm_settings", {}).get("temperature")
            },
            "crm_settings": {
                "valid": "retry_attempts" in config.get("crm_settings", {}),
                "retry_attempts": config.get("crm_settings", {}).get("retry_attempts"),
                "retry_delay": config.get("crm_settings", {}).get("retry_delay")
            },
            "webhook_settings": {
                "valid": "rate_limit" in config.get("webhook_settings", {}),
                "rate_limit": config.get("webhook_settings", {}).get("rate_limit"),
                "message_max_length": config.get("webhook_settings", {}).get("message_max_length")
            }
        }
        
        return {
            "success": True,
            "validation": validation_results,
            "overall_valid": all(section["valid"] for section in validation_results.values())
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error validating configuration: {str(e)}") 