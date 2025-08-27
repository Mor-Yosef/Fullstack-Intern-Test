#!/usr/bin/env python3
"""
Test script for the Chained Form API
Run this script to test various form submission scenarios
"""

import pytest
import requests
import json
from datetime import date, time

# API base URL - we'll test against a running server
BASE_URL = "http://localhost:8001"

class TestFormSubmission:
    """Test cases for form submission API"""
    
    def test_success_date_path_advanced(self):
        """Test successful submission for Advanced mode with Schedule category (Date path)"""
        payload = {
            "mode": "Advanced",
            "category": "Schedule",
            "choose_date": "2024-01-15",
            "budget": 5000
        }
        
        response = requests.post(f"{BASE_URL}/api/submit", json=payload)
        
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "ok"
        assert "id" in data
        assert len(data["id"]) > 0  # UUID should be present
    
    def test_success_time_path_basic(self):
        """Test successful submission for Basic mode with time topic (Time path)"""
        payload = {
            "mode": "Basic",
            "topic": "quick note",
            "choose_time": "14:30",
            "urgency": "High"
        }
        
        response = requests.post(f"{BASE_URL}/api/submit", json=payload)
        
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "ok"
        assert "id" in data
    
    def test_success_time_path_advanced_realtime(self):
        """Test successful submission for Advanced mode with Realtime category (Time path)"""
        payload = {
            "mode": "Advanced",
            "category": "Realtime",
            "choose_time": "09:15",
            "urgency": "Normal"
        }
        
        response = requests.post(f"{BASE_URL}/api/submit", json=payload)
        
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "ok"
        assert "id" in data
    
    def test_success_time_path_advanced_analytics(self):
        """Test successful submission for Advanced mode with Analytics category (Time path)"""
        payload = {
            "mode": "Advanced",
            "category": "Analytics",
            "choose_time": "16:45",
            "urgency": "Low"
        }
        
        response = requests.post(f"{BASE_URL}/api/submit", json=payload)
        
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "ok"
        assert "id" in data

class TestValidationErrors:
    """Test cases for validation errors"""
    
    def test_missing_mode(self):
        """Test missing required mode field"""
        payload = {
            "topic": "test topic",
            "choose_time": "12:00",
            "urgency": "High"
        }
        
        response = requests.post(f"{BASE_URL}/api/submit", json=payload)
        
        assert response.status_code == 422
        data = response.json()
        assert "detail" in data
    
    def test_basic_mode_missing_topic(self):
        """Test Basic mode missing required topic"""
        payload = {
            "mode": "Basic",
            "choose_time": "12:00",
            "urgency": "High"
        }
        
        response = requests.post(f"{BASE_URL}/api/submit", json=payload)
        
        assert response.status_code == 422
        data = response.json()
        assert "detail" in data
        assert "Topic is required" in data["detail"]
    
    def test_advanced_mode_missing_category(self):
        """Test Advanced mode missing required category"""
        payload = {
            "mode": "Advanced",
            "choose_time": "12:00",
            "urgency": "High"
        }
        
        response = requests.post(f"{BASE_URL}/api/submit", json=payload)
        
        assert response.status_code == 422
        data = response.json()
        assert "detail" in data
        assert "Category is required" in data["detail"]
    
    def test_basic_date_path_missing_date(self):
        """Test Basic mode with date topic but missing date"""
        payload = {
            "mode": "Basic",
            "topic": "date reminder",
            "budget": 1000
        }
        
        response = requests.post(f"{BASE_URL}/api/submit", json=payload)
        
        assert response.status_code == 422
        data = response.json()
        assert "detail" in data
        assert "Date is required" in data["detail"]
    
    def test_basic_time_path_missing_time(self):
        """Test Basic mode with non-date topic but missing time"""
        payload = {
            "mode": "Basic",
            "topic": "quick note",
            "urgency": "High"
        }
        
        response = requests.post(f"{BASE_URL}/api/submit", json=payload)
        
        assert response.status_code == 422
        data = response.json()
        assert "detail" in data
        assert "Time is required" in data["detail"]
    
    def test_advanced_schedule_missing_date(self):
        """Test Advanced mode with Schedule category but missing date"""
        payload = {
            "mode": "Advanced",
            "category": "Schedule",
            "budget": 1000
        }
        
        response = requests.post(f"{BASE_URL}/api/submit", json=payload)
        
        assert response.status_code == 422
        data = response.json()
        assert "detail" in data
        assert "Date is required" in data["detail"]
    
    def test_advanced_realtime_missing_time(self):
        """Test Advanced mode with Realtime category but missing time"""
        payload = {
            "mode": "Advanced",
            "category": "Realtime",
            "urgency": "High"
        }
        
        response = requests.post(f"{BASE_URL}/api/submit", json=payload)
        
        assert response.status_code == 422
        data = response.json()
        assert "detail" in data
        assert "Time is required" in data["detail"]
    
    def test_date_path_missing_budget(self):
        """Test date path missing required budget"""
        payload = {
            "mode": "Advanced",
            "category": "Schedule",
            "choose_date": "2024-01-15"
        }
        
        response = requests.post(f"{BASE_URL}/api/submit", json=payload)
        
        assert response.status_code == 422
        data = response.json()
        assert "detail" in data
        assert "Budget is required" in data["detail"]
    
    def test_time_path_missing_urgency(self):
        """Test time path missing required urgency"""
        payload = {
            "mode": "Basic",
            "topic": "quick note",
            "choose_time": "12:00"
        }
        
        response = requests.post(f"{BASE_URL}/api/submit", json=payload)
        
        assert response.status_code == 422
        data = response.json()
        assert "detail" in data
        assert "Urgency is required" in data["detail"]

class TestBudgetValidation:
    """Test cases for budget validation"""
    
    def test_budget_not_multiple_of_100(self):
        """Test budget not being a multiple of 100"""
        payload = {
            "mode": "Advanced",
            "category": "Schedule",
            "choose_date": "2024-01-15",
            "budget": 1234
        }
        
        response = requests.post(f"{BASE_URL}/api/submit", json=payload)
        
        assert response.status_code == 422
        data = response.json()
        assert "detail" in data
        # Check if any error message contains the expected text
        error_messages = [error.get('msg', '') for error in data["detail"]]
        assert any("multiple of 100" in msg for msg in error_messages)
    
    def test_budget_below_minimum(self):
        """Test budget below minimum value (0)"""
        payload = {
            "mode": "Advanced",
            "category": "Schedule",
            "choose_date": "2024-01-15",
            "budget": -100
        }
        
        response = requests.post(f"{BASE_URL}/api/submit", json=payload)
        
        assert response.status_code == 422
        data = response.json()
        assert "detail" in data
        # Check if any error message contains the expected text
        error_messages = [error.get('msg', '') for error in data["detail"]]
        assert any("between 0 and 5000" in msg for msg in error_messages)
    
    def test_budget_above_maximum(self):
        """Test budget above maximum value (5000)"""
        payload = {
            "mode": "Advanced",
            "category": "Schedule",
            "choose_date": "2024-01-15",
            "budget": 6000
        }
        
        response = requests.post(f"{BASE_URL}/api/submit", json=payload)
        
        assert response.status_code == 422
        data = response.json()
        assert "detail" in data
        # Check if any error message contains the expected text
        error_messages = [error.get('msg', '') for error in data["detail"]]
        assert any("between 0 and 5000" in msg for msg in error_messages)
    
    def test_budget_valid_values(self):
        """Test valid budget values"""
        valid_budgets = [0, 100, 500, 1000, 2500, 5000]
        
        for budget in valid_budgets:
            payload = {
                "mode": "Advanced",
                "category": "Schedule",
                "choose_date": "2024-01-15",
                "budget": budget
            }
            
            response = requests.post(f"{BASE_URL}/api/submit", json=payload)
            assert response.status_code == 200, f"Budget {budget} should be valid"

class TestUrgencyValidation:
    """Test cases for urgency validation"""
    
    def test_invalid_urgency_value(self):
        """Test invalid urgency value"""
        payload = {
            "mode": "Basic",
            "topic": "quick note",
            "choose_time": "12:00",
            "urgency": "Invalid"
        }
        
        response = requests.post(f"{BASE_URL}/api/submit", json=payload)
        
        assert response.status_code == 422
        data = response.json()
        assert "detail" in data
        # Check if any error message contains the expected text
        error_messages = [error.get('msg', '') for error in data["detail"]]
        assert any("Low" in msg and "Normal" in msg and "High" in msg for msg in error_messages)
    
    def test_valid_urgency_values(self):
        """Test valid urgency values"""
        valid_urgencies = ["Low", "Normal", "High"]
        
        for urgency in valid_urgencies:
            payload = {
                "mode": "Basic",
                "topic": "quick note",
                "choose_time": "12:00",
                "urgency": urgency
            }
            
            response = requests.post(f"{BASE_URL}/api/submit", json=payload)
            assert response.status_code == 200, f"Urgency {urgency} should be valid"

class TestHealthCheck:
    """Test cases for health check endpoint"""
    
    def test_health_check(self):
        """Test health check endpoint"""
        response = requests.get(f"{BASE_URL}/")
        
        assert response.status_code == 200
        data = response.json()
        assert "message" in data
        assert data["message"] == "Chained Form API is running"

if __name__ == "__main__":
    pytest.main([__file__, "-v"])
