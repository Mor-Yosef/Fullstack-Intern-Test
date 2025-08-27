#!/usr/bin/env python3
"""
Test Runner for Chained Form Application
Runs both backend (FastAPI) and frontend (React) tests
"""

import subprocess
import sys
import os
from pathlib import Path

def run_backend_tests():
    """Run backend tests using pytest"""
    print("🧪 Running Backend Tests (FastAPI)")
    print("=" * 50)
    
    try:
        # Change to server directory
        server_dir = Path("server")
        if not server_dir.exists():
            print("❌ Server directory not found")
            return False
        
        # Install pytest if not available
        try:
            subprocess.run([sys.executable, "-m", "pytest", "--version"], 
                         check=True, capture_output=True)
        except subprocess.CalledProcessError:
            print("📦 Installing pytest...")
            subprocess.run([sys.executable, "-m", "pip", "install", "pytest"], 
                         check=True)
        
        # Run backend tests
        result = subprocess.run([
            sys.executable, "-m", "pytest", 
            "../test_api.py", 
            "-v", 
            "--tb=short"
        ], cwd=server_dir, capture_output=True, text=True)
        
        if result.returncode == 0:
            print("✅ Backend tests passed!")
            print(result.stdout)
        else:
            print("❌ Backend tests failed!")
            print(result.stdout)
            print(result.stderr)
            return False
            
    except Exception as e:
        print(f"❌ Error running backend tests: {e}")
        return False
    
    return True

def run_frontend_tests():
    """Run frontend tests using npm"""
    print("\n🧪 Running Frontend Tests (React)")
    print("=" * 50)
    
    try:
        # Change to client directory
        client_dir = Path("client")
        if not client_dir.exists():
            print("❌ Client directory not found")
            return False
        
        # Install dependencies if needed
        if not (client_dir / "node_modules").exists():
            print("📦 Installing frontend dependencies...")
            subprocess.run(["npm", "install"], cwd=client_dir, check=True)
        
        # Run frontend tests
        result = subprocess.run([
            "npm", "test", "--", 
            "--watchAll=false", 
            "--passWithNoTests",
            "--verbose"
        ], cwd=client_dir, capture_output=True, text=True)
        
        if result.returncode == 0:
            print("✅ Frontend tests passed!")
            print(result.stdout)
        else:
            print("❌ Frontend tests failed!")
            print(result.stdout)
            print(result.stderr)
            return False
            
    except Exception as e:
        print(f"❌ Error running frontend tests: {e}")
        return False
    
    return True

def run_coverage_tests():
    """Run tests with coverage reporting"""
    print("\n📊 Running Tests with Coverage")
    print("=" * 50)
    
    # Backend coverage
    print("Backend Coverage:")
    try:
        server_dir = Path("server")
        subprocess.run([
            sys.executable, "-m", "pytest", 
            "../test_api.py", 
            "--cov=main",
            "--cov-report=term-missing",
            "--cov-report=html:../coverage_backend"
        ], cwd=server_dir, check=True)
    except subprocess.CalledProcessError as e:
        print(f"❌ Backend coverage failed: {e}")
    
    # Frontend coverage
    print("\nFrontend Coverage:")
    try:
        client_dir = Path("client")
        subprocess.run([
            "npm", "run", "test:coverage"
        ], cwd=client_dir, check=True)
    except subprocess.CalledProcessError as e:
        print(f"❌ Frontend coverage failed: {e}")

def main():
    """Main test runner"""
    print("🚀 Chained Form Application Test Suite")
    print("=" * 60)
    
    backend_success = run_backend_tests()
    frontend_success = run_frontend_tests()
    
    print("\n" + "=" * 60)
    print("📋 Test Summary")
    print("=" * 60)
    
    if backend_success:
        print("✅ Backend Tests: PASSED")
    else:
        print("❌ Backend Tests: FAILED")
    
    if frontend_success:
        print("✅ Frontend Tests: PASSED")
    else:
        print("❌ Frontend Tests: FAILED")
    
    if backend_success and frontend_success:
        print("\n🎉 All tests passed!")
        
        # Ask if user wants coverage report
        try:
            response = input("\n📊 Would you like to run coverage tests? (y/n): ")
            if response.lower() in ['y', 'yes']:
                run_coverage_tests()
        except KeyboardInterrupt:
            print("\n👋 Coverage test cancelled")
    else:
        print("\n💥 Some tests failed. Please check the output above.")
        sys.exit(1)

if __name__ == "__main__":
    main()
