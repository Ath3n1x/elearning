from fastapi import APIRouter, Request, HTTPException
import httpx
import os

router = APIRouter(prefix="/chat", tags=["chat"])

# Set these to your model endpoints
FINETUNED_MODEL_URL = os.getenv("FINETUNED_MODEL_URL", None)
RAG_API_URL = os.getenv("RAG_API_URL", None)

@router.post("/ask")
async def chat_ask(request: Request):
    data = await request.json()
    question = data.get("question")
    if not question:
        raise HTTPException(status_code=400, detail="Missing 'question' in request body")
    if FINETUNED_MODEL_URL:
        async with httpx.AsyncClient() as client:
            try:
                response = await client.post(FINETUNED_MODEL_URL, json={"question": question})
                response.raise_for_status()
                return response.json()
            except httpx.HTTPError as e:
                raise HTTPException(status_code=502, detail=f"Error contacting finetuned model: {str(e)}")
    # Placeholder response if model is not ready
    return {"answer": "[Finetuned chatbot model not available. This is a placeholder response.]"}

@router.post("/qa")
async def chat_qa(request: Request):
    data = await request.json()
    question = data.get("question")
    chapter = data.get("chapter")
    difficulty = data.get("difficulty")
    if not question:
        raise HTTPException(status_code=400, detail="Missing 'question' in request body")
    payload = {"question": question}
    if chapter:
        payload["chapter"] = chapter
    if difficulty:
        payload["difficulty"] = difficulty
    if RAG_API_URL:
        async with httpx.AsyncClient() as client:
            try:
                response = await client.post(RAG_API_URL, json=payload)
                response.raise_for_status()
                return response.json()
            except httpx.HTTPError as e:
                raise HTTPException(status_code=502, detail=f"Error contacting RAG model: {str(e)}")
    # Placeholder response if RAG is not ready
    return {"answer": "[RAG Q&A model not available. This is a placeholder response.]"} 