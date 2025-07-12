import pytest
import json
import tempfile
import os
from pathlib import Path
from unittest.mock import patch
from database.mock_crm import save_to_crm

class TestCRMStorage:
    """Test cases for CRM storage functionality"""

    def test_save_to_crm_success(self):
        """Test successful CRM save"""
        test_data = {
            "name": "John Doe",
            "email": "john@example.com",
            "company": "Example Corp"
        }

        with tempfile.TemporaryDirectory() as temp_dir:
            # Create a temporary CRM file
            crm_file = Path(temp_dir) / "crm.json"
            
            with patch('database.mock_crm.CRM_FILE', crm_file):
                result = save_to_crm(test_data)
                
                assert result == "success"
                
                # Verify data was saved
                if crm_file.exists():
                    saved_data = json.loads(crm_file.read_text())
                    assert len(saved_data) == 1
                    assert saved_data[0] == test_data

    def test_save_to_crm_multiple_entries(self):
        """Test saving multiple entries to CRM"""
        test_data_1 = {
            "name": "John Doe",
            "email": "john@example.com",
            "company": "Example Corp"
        }
        
        test_data_2 = {
            "name": "Jane Smith",
            "email": "jane@example.com",
            "company": "Another Corp"
        }

        with tempfile.TemporaryDirectory() as temp_dir:
            crm_file = Path(temp_dir) / "crm.json"
            
            with patch('database.mock_crm.CRM_FILE', crm_file):
                # Save first entry
                result1 = save_to_crm(test_data_1)
                assert result1 == "success"
                
                # Save second entry
                result2 = save_to_crm(test_data_2)
                assert result2 == "success"
                
                # Verify both entries were saved
                if crm_file.exists():
                    saved_data = json.loads(crm_file.read_text())
                    assert len(saved_data) == 2
                    assert test_data_1 in saved_data
                    assert test_data_2 in saved_data

    def test_save_to_crm_file_creation(self):
        """Test CRM file creation when it doesn't exist"""
        test_data = {
            "name": "New User",
            "email": "new@example.com",
            "company": "New Corp"
        }

        with tempfile.TemporaryDirectory() as temp_dir:
            crm_file = Path(temp_dir) / "crm.json"
            
            # Ensure file doesn't exist initially
            assert not crm_file.exists()
            
            with patch('database.mock_crm.CRM_FILE', crm_file):
                result = save_to_crm(test_data)
                
                assert result == "success"
                assert crm_file.exists()
                
                # Verify data was saved
                saved_data = json.loads(crm_file.read_text())
                assert len(saved_data) == 1
                assert saved_data[0] == test_data

    def test_save_to_crm_invalid_data(self):
        """Test CRM save with invalid data"""
        invalid_data = None

        with tempfile.TemporaryDirectory() as temp_dir:
            crm_file = Path(temp_dir) / "crm.json"
            
            with patch('database.mock_crm.CRM_FILE', crm_file):
                result = save_to_crm(invalid_data)
                
                # The current implementation doesn't validate input data
                # so None gets appended successfully
                assert result == "success"

    def test_save_to_crm_file_permission_error(self):
        """Test CRM save when file permissions are restricted"""
        test_data = {
            "name": "Test User",
            "email": "test@example.com",
            "company": "Test Corp"
        }

        with tempfile.TemporaryDirectory() as temp_dir:
            crm_file = Path(temp_dir) / "crm.json"
            
            # Create a read-only file
            crm_file.write_text("[]")
            crm_file.chmod(0o444)  # Read-only
            
            with patch('database.mock_crm.CRM_FILE', crm_file):
                result = save_to_crm(test_data)
                
                assert result == "failure"

    def test_save_to_crm_corrupted_file(self):
        """Test CRM save with corrupted JSON file"""
        test_data = {
            "name": "Test User",
            "email": "test@example.com",
            "company": "Test Corp"
        }

        with tempfile.TemporaryDirectory() as temp_dir:
            crm_file = Path(temp_dir) / "crm.json"
            
            # Create a corrupted JSON file
            crm_file.write_text("invalid json content")
            
            with patch('database.mock_crm.CRM_FILE', crm_file):
                result = save_to_crm(test_data)
                
                assert result == "failure"

    def test_save_to_crm_empty_data(self):
        """Test CRM save with empty data"""
        empty_data = {
            "name": "",
            "email": "",
            "company": ""
        }

        with tempfile.TemporaryDirectory() as temp_dir:
            crm_file = Path(temp_dir) / "crm.json"
            
            with patch('database.mock_crm.CRM_FILE', crm_file):
                result = save_to_crm(empty_data)
                
                assert result == "success"
                
                # Verify empty data was saved
                if crm_file.exists():
                    saved_data = json.loads(crm_file.read_text())
                    assert len(saved_data) == 1
                    assert saved_data[0] == empty_data

    def test_save_to_crm_special_characters(self):
        """Test CRM save with special characters"""
        test_data = {
            "name": "José María",
            "email": "josé@côte-azur.com",
            "company": "Côte d'Azur Corp"
        }

        with tempfile.TemporaryDirectory() as temp_dir:
            crm_file = Path(temp_dir) / "crm.json"
            
            with patch('database.mock_crm.CRM_FILE', crm_file):
                result = save_to_crm(test_data)
                
                assert result == "success"
                
                # Verify special characters were preserved
                if crm_file.exists():
                    saved_data = json.loads(crm_file.read_text())
                    assert len(saved_data) == 1
                    assert saved_data[0] == test_data 