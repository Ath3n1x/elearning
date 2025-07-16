from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import uvicorn
from quiz_generator import generate_quiz_api

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"]
)

@app.post("/generate")
async def generate_quiz(request: Request):
    payload = await request.json()
    mapped = {
        "chapter": payload.get("chapter"),
        "question_type": payload.get("question_type"),
        "difficulty": payload.get("difficulty"),
        "count": payload.get("num_questions") or payload.get("count", 10)
    }
    result = generate_quiz_api(mapped)
    return JSONResponse(content=result)

@app.get("/")
def root():
    return {"message": "RAG Quiz Generator is ready"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000) 