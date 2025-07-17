#!/usr/bin/env python3
"""
Demo Setup Script for E-Learning Platform
Tests RAG API integration and provides demo data
"""

import asyncio
import httpx
import json
from datetime import datetime

# Configuration
RAG_API_URL = "https://cb5c7cf4995c.ngrok-free.app"
BACKEND_URL = "http://localhost:8000"

async def test_rag_api():
    """Test the RAG API connection"""
    print("🔍 Testing RAG API connection...")
    
    try:
        async with httpx.AsyncClient(timeout=30) as client:
            # Test basic connectivity
            response = await client.get(f"{RAG_API_URL}/health")
            if response.status_code == 200:
                print("✅ RAG API is accessible")
                return True
            else:
                print(f"⚠️ RAG API returned status {response.status_code}")
                return False
    except Exception as e:
        print(f"❌ RAG API connection failed: {e}")
        return False

async def test_quiz_generation():
    """Test quiz generation through our backend"""
    print("\n🎯 Testing quiz generation...")
    
    try:
        async with httpx.AsyncClient(timeout=30) as client:
            # Test quiz generation
            quiz_data = {
                "num_questions": 3,
                "chapter": "Chapter 1: Reproduction in Organisms",
                "question_type": "mcq",
                "difficulty": "medium"
            }
            
            response = await client.post(
                f"{BACKEND_URL}/quizzes/generate",
                json=quiz_data,
                headers={"Content-Type": "application/json"}
            )
            
            if response.status_code == 200:
                result = response.json()
                print("✅ Quiz generation successful!")
                print(f"📊 Generated {len(result.get('questions', []))} questions")
                print(f"📚 Chapter: {result.get('chapter')}")
                print(f"🔧 Source: {result.get('source')}")
                
                # Show first question as example
                if result.get('questions'):
                    q = result['questions'][0]
                    print(f"\n📝 Sample Question:")
                    print(f"   Q: {q.get('question', 'N/A')}")
                    print(f"   Options: {q.get('options', [])}")
                    print(f"   Answer: {q.get('answer', 'N/A')}")
                
                return True
            else:
                print(f"❌ Quiz generation failed: {response.status_code}")
                print(f"Response: {response.text}")
                return False
                
    except Exception as e:
        print(f"❌ Quiz generation test failed: {e}")
        return False

async def test_backend_health():
    """Test backend health"""
    print("\n🏥 Testing backend health...")
    
    try:
        async with httpx.AsyncClient(timeout=10) as client:
            response = await client.get(f"{BACKEND_URL}/health")
            if response.status_code == 200:
                print("✅ Backend is healthy")
                return True
            else:
                print(f"❌ Backend health check failed: {response.status_code}")
                return False
    except Exception as e:
        print(f"❌ Backend health check failed: {e}")
        return False

def print_demo_instructions():
    """Print demo instructions"""
    print("\n" + "="*60)
    print("🎓 E-LEARNING PLATFORM DEMO SETUP")
    print("="*60)
    print("\n📋 Demo Instructions:")
    print("1. Start the backend: uvicorn app.main:app --host localhost --port 8000 --reload")
    print("2. Start the frontend: npm run dev (in lore-frontend/)")
    print("3. Access the platform at: http://localhost:5173")
    print("4. Test quiz generation with RAG API")
    print("\n🔗 API Endpoints:")
    print(f"   - Backend: http://localhost:8000")
    print(f"   - RAG API: {RAG_API_URL}")
    print(f"   - API Docs: http://localhost:8000/docs")
    print("\n🎯 Demo Features:")
    print("   ✅ User Authentication")
    print("   ✅ Personalized Dashboard")
    print("   ✅ RAG-Powered Quiz Generation")
    print("   ✅ Video Progress Tracking")
    print("   ✅ Reminders & Calendar")
    print("   ✅ Chatbot Q&A")
    print("   ✅ Badge System")
    print("\n🚀 Ready for Demo!")

async def main():
    """Main demo setup function"""
    print("🚀 Starting E-Learning Platform Demo Setup...")
    print(f"📅 {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    
    # Test components
    rag_ok = await test_rag_api()
    backend_ok = await test_backend_health()
    quiz_ok = await test_quiz_generation()
    
    print("\n" + "="*60)
    print("📊 DEMO SETUP RESULTS")
    print("="*60)
    print(f"🔗 RAG API Connection: {'✅ OK' if rag_ok else '❌ FAILED'}")
    print(f"🏥 Backend Health: {'✅ OK' if backend_ok else '❌ FAILED'}")
    print(f"🎯 Quiz Generation: {'✅ OK' if quiz_ok else '❌ FAILED'}")
    
    if rag_ok and backend_ok and quiz_ok:
        print("\n🎉 All systems are ready for demo!")
    else:
        print("\n⚠️ Some components need attention before demo.")
    
    print_demo_instructions()

if __name__ == "__main__":
    asyncio.run(main()) 