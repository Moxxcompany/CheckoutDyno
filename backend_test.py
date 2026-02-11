import requests
import sys
import json
from datetime import datetime

class DynoPayTester:
    def __init__(self, base_url="https://get-ready-2.preview.emergentagent.com"):
        self.base_url = base_url
        self.tests_run = 0
        self.tests_passed = 0

    def run_test(self, name, method, endpoint, expected_status=200, data=None, headers=None):
        """Run a single API test"""
        url = f"{self.base_url}/{endpoint}"
        default_headers = {'Content-Type': 'application/json'}
        if headers:
            default_headers.update(headers)

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=default_headers, timeout=10)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=default_headers, timeout=10)

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    return success, response.json()
                except:
                    return success, response.text
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                print(f"Response: {response.text[:200]}")
                return False, {}

        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            return False, {}

    def test_health_endpoint(self):
        """Test basic health endpoint"""
        return self.run_test("Health Check", "GET", "api/health")

    def test_frontend_pages(self):
        """Test that main frontend pages load without errors"""
        pages = [
            {"name": "Homepage", "path": "", "expected": 200},
            {"name": "Pay Page", "path": "pay", "expected": 200},
            {"name": "Pay Demo Page", "path": "pay/demo", "expected": 200}
        ]
        
        results = {}
        for page in pages:
            url = f"{self.base_url}/{page['path']}" if page['path'] else self.base_url
            try:
                response = requests.get(url, timeout=10)
                success = response.status_code == page['expected']
                results[page['name']] = success
                
                if success:
                    self.tests_passed += 1
                    print(f"✅ {page['name']} - Status: {response.status_code}")
                else:
                    print(f"❌ {page['name']} - Expected {page['expected']}, got {response.status_code}")
                
                self.tests_run += 1
                    
            except Exception as e:
                print(f"❌ {page['name']} - Error: {str(e)}")
                results[page['name']] = False
                self.tests_run += 1
                
        return all(results.values()), results

def main():
    print("🚀 Starting DynoPay Backend Testing...")
    print("=" * 60)
    
    tester = DynoPayTester()
    
    # Test 1: Basic health check
    health_success, _ = tester.test_health_endpoint()
    if not health_success:
        print("❌ Backend health check failed. Cannot proceed with testing.")
        return 1
    
    # Test 2: Configured currencies
    print("\n" + "="*60)
    print("Testing Configured Currencies...")
    currencies_success, currencies_data = tester.test_configured_currencies()
    
    # Test 3: Currency rates  
    print("\n" + "="*60)
    print("Testing Currency Rates...")
    rates_success, rates_data = tester.test_currency_rates()
    
    # Test 4: Payment creation
    print("\n" + "="*60)
    print("Testing Payment Creation...")
    payment_success, payment_data = tester.test_payment_creation()
    
    # Summary
    print("\n" + "="*60)
    print("📊 TEST SUMMARY")
    print("="*60)
    print(f"Tests passed: {tester.tests_passed}/{tester.tests_run}")
    print(f"Success rate: {(tester.tests_passed/tester.tests_run)*100:.1f}%")
    
    # Specific results
    print(f"\n🔸 Health Check: {'✅ PASS' if health_success else '❌ FAIL'}")
    print(f"🔸 Configured Currencies: {'✅ PASS' if currencies_success else '❌ FAIL'}")
    print(f"🔸 Currency Rates: {'✅ PASS' if rates_success else '❌ FAIL'}")  
    print(f"🔸 Payment Creation: {'✅ PASS' if payment_success else '❌ FAIL'}")
    
    # Return appropriate exit code
    return 0 if tester.tests_passed == tester.tests_run else 1

if __name__ == "__main__":
    sys.exit(main())