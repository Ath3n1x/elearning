import requests
import json

def test_rag_api():
    """Test the RAG API with proper error handling"""
    
    # Test URL - update this with your current ngrok URL
    url = "https://cb5c7cf4995c.ngrok-free.app"
    
    # Test endpoints
    endpoints = [
        "/test",
        "/health", 
        "/generate"
    ]
    
    print("🧪 Testing RAG API endpoints...")
    print(f"📍 Base URL: {url}")
    print("-" * 50)
    
    for endpoint in endpoints:
        try:
            if endpoint == "/generate":
                # Test POST request
                payload = {
                    "chapter": "Human Reproduction",
                    "question_type": "mcq",
                    "difficulty": "intermediate", 
                    "count": 2
                }
                
                print(f"📤 POST {endpoint}")
                print(f"📋 Payload: {json.dumps(payload, indent=2)}")
                
                response = requests.post(
                    f"{url}{endpoint}",
                    json=payload,
                    headers={"Content-Type": "application/json"},
                    timeout=30
                )
            else:
                # Test GET request
                print(f"📤 GET {endpoint}")
                response = requests.get(f"{url}{endpoint}", timeout=10)
            
            print(f"📊 Status: {response.status_code}")
            print(f"📄 Response: {response.text[:500]}...")
            
            if response.status_code == 200:
                print("✅ SUCCESS")
            else:
                print("❌ FAILED")
                
        except requests.exceptions.RequestException as e:
            print(f"❌ ERROR: {e}")
        except Exception as e:
            print(f"❌ UNEXPECTED ERROR: {e}")
        
        print("-" * 50)

if __name__ == "__main__":
    test_rag_api() 