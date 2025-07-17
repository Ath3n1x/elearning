#!/usr/bin/env python3
"""
Test Quiz Generation API
"""

import requests
import json

def test_quiz_generation():
    """Test the quiz generation endpoint"""
    url = "http://localhost:8000/quizzes/generate"
    
    data = {
        "num_questions": 3,
        "chapter": "Chapter 1: Reproduction in Organisms",
        "question_type": "mcq",
        "difficulty": "medium"
    }
    
    try:
        print("🧪 Testing quiz generation...")
        print(f"📤 Sending request to: {url}")
        print(f"📋 Data: {json.dumps(data, indent=2)}")
        
        response = requests.post(url, json=data, headers={"Content-Type": "application/json"})
        
        print(f"📥 Response status: {response.status_code}")
        
        if response.status_code == 200:
            result = response.json()
            print("✅ Quiz generation successful!")
            print(f"📊 Generated {len(result.get('questions', []))} questions")
            print(f"📚 Chapter: {result.get('chapter')}")
            print(f"🔧 Source: {result.get('source')}")
            
            # Show all questions
            for i, q in enumerate(result.get('questions', [])):
                print(f"\n📝 Question {i+1}:")
                print(f"   Q: {q.get('question', 'N/A')}")
                print(f"   Options: {q.get('options', [])}")
                print(f"   Answer: {q.get('answer', 'N/A')}")
                if q.get('explanation'):
                    print(f"   Explanation: {q.get('explanation')}")
            
            return True
        else:
            print(f"❌ Quiz generation failed: {response.status_code}")
            print(f"Response: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Test failed: {e}")
        return False

if __name__ == "__main__":
    test_quiz_generation() 