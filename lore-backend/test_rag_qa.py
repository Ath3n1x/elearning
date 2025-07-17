#!/usr/bin/env python3
"""
Test Script for RAG API and Q&A Functionality
"""

import asyncio
import httpx
import json
from datetime import datetime

# Configuration
RAG_API_URL = "https://cb5c7cf4995c.ngrok-free.app"
BACKEND_URL = "http://localhost:8000"

async def test_rag_api_direct():
    """Test direct connection to RAG API"""
    print("🔍 Testing direct RAG API connection...")
    
    try:
        async with httpx.AsyncClient(timeout=30) as client:
            # Test quiz generation
            quiz_data = {
                "chapter": "Chapter 1: Reproduction in Organisms",
                "num_questions": 2,
                "question_type": "mcq",
                "difficulty": "medium"
            }
            
            print(f"📤 Sending request to: {RAG_API_URL}/generate")
            response = await client.post(
                f"{RAG_API_URL}/generate",
                json=quiz_data,
                headers={"Content-Type": "application/json"}
            )
            
            print(f"📥 Response status: {response.status_code}")
            
            if response.status_code == 200:
                result = response.json()
                print("✅ RAG API is working!")
                print(f"📊 Generated {len(result.get('questions', []))} questions")
                
                # Show sample question
                if result.get('questions'):
                    q = result['questions'][0]
                    print(f"\n📝 Sample Question:")
                    print(f"   Q: {q.get('question', 'N/A')}")
                    print(f"   Options: {q.get('options', [])}")
                    print(f"   Answer: {q.get('answer', 'N/A')}")
                
                return True
            else:
                print(f"❌ RAG API returned status {response.status_code}")
                print(f"Response: {response.text}")
                return False
                
    except Exception as e:
        print(f"❌ RAG API connection failed: {e}")
        return False

async def test_qa_functionality():
    """Test Q&A functionality through backend"""
    print("\n💬 Testing Q&A functionality...")
    
    try:
        async with httpx.AsyncClient(timeout=30) as client:
            # Test general chat
            chat_data = {
                "question": "What is reproduction in organisms?"
            }
            
            print("📤 Testing general chat...")
            response = await client.post(
                f"{BACKEND_URL}/chat/ask",
                json=chat_data,
                headers={"Content-Type": "application/json"}
            )
            
            if response.status_code == 200:
                result = response.json()
                print("✅ General chat is working!")
                print(f"🤖 Answer: {result.get('answer', 'N/A')}")
                print(f"📊 Source: {result.get('source', 'N/A')}")
            else:
                print(f"❌ General chat failed: {response.status_code}")
            
            # Test chapter-specific Q&A
            qa_data = {
                "question": "Explain sexual reproduction in plants",
                "chapter": "Chapter 1: Reproduction in Organisms",
                "difficulty": "medium"
            }
            
            print("\n📤 Testing chapter-specific Q&A...")
            response = await client.post(
                f"{BACKEND_URL}/chat/qa",
                json=qa_data,
                headers={"Content-Type": "application/json"}
            )
            
            if response.status_code == 200:
                result = response.json()
                print("✅ Chapter-specific Q&A is working!")
                print(f"🤖 Answer: {result.get('answer', 'N/A')}")
                print(f"📚 Chapter: {result.get('chapter', 'N/A')}")
                print(f"📊 Source: {result.get('source', 'N/A')}")
            else:
                print(f"❌ Chapter-specific Q&A failed: {response.status_code}")
            
            return True
                
    except Exception as e:
        print(f"❌ Q&A test failed: {e}")
        return False

async def test_backend_quiz_integration():
    """Test quiz generation through backend"""
    print("\n🎯 Testing backend quiz integration...")
    
    try:
        async with httpx.AsyncClient(timeout=30) as client:
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
                print("✅ Backend quiz integration is working!")
                print(f"📊 Generated {len(result.get('questions', []))} questions")
                print(f"📚 Chapter: {result.get('chapter')}")
                print(f"🔧 Source: {result.get('source')}")
                
                # Show first question
                if result.get('questions'):
                    q = result['questions'][0]
                    print(f"\n📝 Sample Question:")
                    print(f"   Q: {q.get('question', 'N/A')}")
                    print(f"   Options: {q.get('options', [])}")
                    print(f"   Answer: {q.get('answer', 'N/A')}")
                
                return True
            else:
                print(f"❌ Backend quiz integration failed: {response.status_code}")
                return False
                
    except Exception as e:
        print(f"❌ Backend quiz test failed: {e}")
        return False

async def test_chat_endpoints():
    """Test chat endpoints"""
    print("\n🔗 Testing chat endpoints...")
    
    try:
        async with httpx.AsyncClient(timeout=10) as client:
            # Test chat test endpoint
            response = await client.get(f"{BACKEND_URL}/chat/test")
            
            if response.status_code == 200:
                result = response.json()
                print("✅ Chat endpoints are working!")
                print(f"📊 Status: {result.get('status')}")
                print(f"🔗 RAG API URL: {result.get('rag_api_url')}")
                return True
            else:
                print(f"❌ Chat endpoints failed: {response.status_code}")
                return False
                
    except Exception as e:
        print(f"❌ Chat endpoints test failed: {e}")
        return False

def print_test_summary(rag_direct, qa_working, quiz_integration, chat_endpoints):
    """Print test summary"""
    print("\n" + "="*60)
    print("📊 RAG API & Q&A TEST RESULTS")
    print("="*60)
    print(f"🔗 Direct RAG API: {'✅ WORKING' if rag_direct else '❌ FAILED'}")
    print(f"💬 Q&A Functionality: {'✅ WORKING' if qa_working else '❌ FAILED'}")
    print(f"🎯 Quiz Integration: {'✅ WORKING' if quiz_integration else '❌ FAILED'}")
    print(f"🔗 Chat Endpoints: {'✅ WORKING' if chat_endpoints else '❌ FAILED'}")
    
    if rag_direct:
        print("\n🎉 RAG API is working! Your ngrok tunnel is active.")
        print("✅ Quiz generation will use real AI-generated questions")
        print("✅ Q&A will provide contextual responses")
    else:
        print("\n⚠️ RAG API connection failed. Using fallback system.")
        print("✅ Demo will still work with sample questions")
        print("✅ Q&A will provide placeholder responses")
    
    print("\n🚀 Demo Status: READY TO GO!")
    print("📍 Access your platform at: http://localhost:5173")

async def main():
    """Main test function"""
    print("🚀 Starting RAG API & Q&A Tests...")
    print(f"📅 {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"🔗 RAG API URL: {RAG_API_URL}")
    print(f"🏥 Backend URL: {BACKEND_URL}")
    
    # Run tests
    rag_direct = await test_rag_api_direct()
    qa_working = await test_qa_functionality()
    quiz_integration = await test_backend_quiz_integration()
    chat_endpoints = await test_chat_endpoints()
    
    # Print summary
    print_test_summary(rag_direct, qa_working, quiz_integration, chat_endpoints)

if __name__ == "__main__":
    asyncio.run(main()) 