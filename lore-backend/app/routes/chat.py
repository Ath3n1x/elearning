from fastapi import APIRouter, Request, HTTPException
import httpx
import os
from ..config import RAG_API_URL, RAG_API_TIMEOUT

router = APIRouter(prefix="/chat", tags=["chat"])

@router.post("/ask")
async def chat_ask(request: Request):
    """
    General chatbot endpoint
    """
    data = await request.json()
    question = data.get("question")
    if not question:
        raise HTTPException(status_code=400, detail="Missing 'question' in request body")
    
    try:
        # Try to use RAG API for general questions
        async with httpx.AsyncClient(timeout=RAG_API_TIMEOUT) as client:
            response = await client.post(
                f"{RAG_API_URL}/qa",
                json={"question": question},
                headers={"Content-Type": "application/json"}
            )
            
            if response.status_code == 200:
                return response.json()
            else:
                # Fallback response
                return {
                    "answer": f"I understand you're asking about: '{question}'. This is a placeholder response while the AI model is being set up.",
                    "source": "fallback"
                }
    except Exception as e:
        # Fallback response if RAG API is unavailable
        return {
            "answer": f"I understand you're asking about: '{question}'. This is a placeholder response while the AI model is being set up.",
            "source": "fallback",
            "error": str(e)
        }

@router.post("/qa")
async def chat_qa(request: Request):
    """
    Q&A endpoint for specific chapters/subjects
    """
    data = await request.json()
    question = data.get("question")
    chapter = data.get("chapter")
    difficulty = data.get("difficulty")
    
    if not question:
        raise HTTPException(status_code=400, detail="Missing 'question' in request body")
    
    try:
        # Prepare payload for RAG API
        payload = {"question": question}
        if chapter:
            payload["chapter"] = chapter
        if difficulty:
            payload["difficulty"] = difficulty
            
        async with httpx.AsyncClient(timeout=RAG_API_TIMEOUT) as client:
            response = await client.post(
                f"{RAG_API_URL}/qa",
                json=payload,
                headers={"Content-Type": "application/json"}
            )
            
            if response.status_code == 200:
                return response.json()
            else:
                # Fallback response
                return {
                    "answer": f"Q&A for '{question}' in chapter '{chapter or 'general'}': This is a placeholder response while the RAG model is being set up.",
                    "source": "fallback",
                    "chapter": chapter,
                    "difficulty": difficulty
                }
    except Exception as e:
        # Fallback response if RAG API is unavailable
        return {
            "answer": f"Q&A for '{question}' in chapter '{chapter or 'general'}': This is a placeholder response while the RAG model is being set up.",
            "source": "fallback",
            "chapter": chapter,
            "difficulty": difficulty,
            "error": str(e)
        }

@router.get("/test")
async def test_chat():
    """
    Test endpoint to check if chat functionality is working
    """
    return {
        "status": "chat_system_ready",
        "rag_api_url": RAG_API_URL,
        "endpoints": {
            "/chat/ask": "General chatbot questions",
            "/chat/qa": "Chapter-specific Q&A",
            "/chat/test": "Test endpoint"
        }
    } 