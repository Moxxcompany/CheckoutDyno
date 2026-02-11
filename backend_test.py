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

    def test_configured_currencies(self):
        """Test configured currencies endpoint for new crypto additions"""
        success, response = self.run_test("Configured Currencies", "GET", "pay/configured-currencies")
        if success:
            try:
                data = response.get('data', response) if isinstance(response, dict) else response
                configured = data.get('configured_currencies', []) if isinstance(data, dict) else []
                
                # Check for new currencies
                expected_currencies = ['SOL', 'XRP', 'POLYGON', 'RLUSD', 'BCH']
                found_currencies = []
                missing_currencies = []
                
                for currency in expected_currencies:
                    # Check for exact match or with network suffix
                    found = any(c == currency or c.startswith(f"{currency}-") for c in configured)
                    if found:
                        found_currencies.append(currency)
                    else:
                        missing_currencies.append(currency)
                
                print(f"  ➤ Found currencies: {found_currencies}")
                print(f"  ➤ Missing currencies: {missing_currencies}")
                
                # Check USDT-POLYGON specifically
                usdt_polygon_found = 'USDT-POLYGON' in configured
                print(f"  ➤ USDT-POLYGON support: {'✅' if usdt_polygon_found else '❌'}")
                
                # Check RLUSD networks
                rlusd_xrpl = any('RLUSD-XRPL' in c for c in configured)
                rlusd_erc20 = any('RLUSD-ERC20' in c for c in configured)
                print(f"  ➤ RLUSD-XRPL support: {'✅' if rlusd_xrpl else '❌'}")
                print(f"  ➤ RLUSD-ERC20 support: {'✅' if rlusd_erc20 else '❌'}")
                
                return success and len(missing_currencies) == 0, {
                    'found': found_currencies,
                    'missing': missing_currencies,
                    'usdt_polygon': usdt_polygon_found,
                    'rlusd_networks': {'xrpl': rlusd_xrpl, 'erc20': rlusd_erc20}
                }
            except Exception as e:
                print(f"  ➤ Error parsing response: {e}")
                return False, {}
        return success, response

    def test_currency_rates(self):
        """Test currency rates endpoint with new cryptocurrencies"""
        test_data = {
            "source": "USD",
            "amount": 100,
            "currencyList": ["USDT", "BTC", "ETH", "SOL", "XRP", "POLYGON", "RLUSD"],
            "fixedDecimal": False
        }
        
        success, response = self.run_test(
            "Currency Rates for New Cryptos", 
            "POST", 
            "pay/getCurrencyRates",
            data=test_data
        )
        
        if success:
            try:
                data = response.get('data', response) if isinstance(response, dict) else response
                rates = data if isinstance(data, list) else []
                
                found_rates = [rate.get('currency') for rate in rates if isinstance(rate, dict)]
                print(f"  ➤ Available rates: {found_rates}")
                
                # Check for new currency rates
                new_currencies = ['SOL', 'XRP', 'POLYGON', 'RLUSD']
                available_new = [curr for curr in new_currencies if curr in found_rates]
                print(f"  ➤ New currencies with rates: {available_new}")
                
                return success, {'available_rates': found_rates, 'new_currencies': available_new}
            except Exception as e:
                print(f"  ➤ Error parsing rates response: {e}")
                return False, {}
        
        return success, response

    def test_payment_creation(self):
        """Test payment creation with new cryptocurrencies"""
        test_currencies = [
            {"currency": "SOL", "amount": 1.5},
            {"currency": "XRP", "amount": 100},
            {"currency": "POLYGON", "amount": 50},
            {"currency": "USDT-POLYGON", "amount": 100},
            {"currency": "RLUSD-XRPL", "amount": 100},
            {"currency": "RLUSD-ERC20", "amount": 100}
        ]
        
        results = {}
        for test_curr in test_currencies:
            payload = {
                "currency": test_curr["currency"],
                "amount": test_curr["amount"],
                "paymentType": "CRYPTO"
            }
            
            # Note: This might require encryption in real implementation
            success, response = self.run_test(
                f"Payment Creation - {test_curr['currency']}", 
                "POST", 
                "pay/addPayment",
                data={"data": payload},  # Simplified for testing
                expected_status=200  # May return different status codes
            )
            
            results[test_curr["currency"]] = success
            
        return any(results.values()), results

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