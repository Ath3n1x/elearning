# 📚 Lore – Adaptive AI-Powered E-Learning Platform

Note: This is an academic/hobby project developed for learning purposes.

![Python](https://img.shields.io/badge/Python-3.10+-blue?logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-009688?logo=fastapi&logoColor=white)
![Flask](https://img.shields.io/badge/Flask-2.x-black?logo=flask&logoColor=white)
![LangChain](https://img.shields.io/badge/LangChain-RAG-1C3C3C?logo=chainlink&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green)

> Lore is a personalized AI-driven e-learning platform aligned with the **NCERT curriculum (Grades 11–12)**. It leverages Retrieval-Augmented Generation (RAG), fine-tuned language models, and student performance analytics to deliver adaptive quizzes, chapter-specific Q&A, and structured video learning.

Designed with a modular architecture and optimized for low-resource environments, Lore makes curriculum-aligned learning intelligent, accessible, and scalable.

---

## 🚀 Key Features

| Feature | Description |
|---|---|
| 🔐 Auth & Profiles | OAuth2 login, grade-based personalization, persistent history |
| 📊 Dashboard | Weak chapter recommendations, quiz trends, video tracking |
| 🧠 Adaptive Quizzes | MCQs, fill-in-the-blanks, CoT prompting, self-consistency voting |
| 🤖 Q&A Chatbot | Fine-tuned DialogGPT with NCERT-aligned vector retrieval |
| 🎥 Video Learning | Chapter-tagged curated videos with watch history |
| 📅 Study Planner | Weekly scheduling with integrated reminders |

---

## 🏗️ System Architecture

Lore follows a modular client-server design:

```
Frontend (Flask)      ──►  Backend (FastAPI)  ──►  SQLite DB
                                  │
                    ┌─────────────┼─────────────┐
                    ▼             ▼             ▼
              Quiz Engine      Chatbot       RAG Pipeline
           (Qwen2-1.5B)   (DialogGPT+LoRA)  (FAISS+MiniLM)
```

### Stack

| Layer | Technology |
|---|---|
| Frontend | Flask (HTML/CSS/Jinja2 templates) |
| Backend | FastAPI |
| Database | SQLite |
| Embeddings | MiniLM (sentence-transformers) |
| Vector Store | FAISS |
| Quiz LLM | Qwen2-1.5B |
| Chatbot | DialoGPT-medium (LoRA fine-tuned) |
| RAG Framework | LangChain + FAISS |

### Adaptive Learning Workflow

```
Login → Quiz Attempt → Store Responses → Identify Weak Chapters
     → RAG Retrieval → LLM Generation → Dashboard Update
```

---

## 🧪 Quiz Generation Pipeline

- **Content Retrieval** — MiniLM + FAISS semantic search over NCERT content
- **Prompt Engineering** — Chain-of-Thought (CoT) for structured reasoning
- **Self-Consistency** — Majority voting across multiple generations
- **Answer Verification** — Cosine similarity-based validation
- **Deduplication** — Ensures unique question sets per session

---

## 🤖 Chatbot Fine-Tuning

| Parameter | Detail |
|---|---|
| Base Model | DialoGPT-medium (~82M parameters) |
| Fine-Tuning | LoRA (Low-Rank Adaptation via PEFT) |
| Dataset | ~3,200 NCERT Biology Q&A pairs |
| Training Environment | Kaggle T4 GPUs |
| Max Sequence Length | 256 tokens (memory optimized) |

---

## 📂 Project Structure

```
elearning/
│
├── backend/
│   ├── main.py
│   ├── routes/
│   ├── quiz_engine/
│   └── chatbot/
│
├── frontend/
│   ├── app.py
│   └── components/
│
├── vectorstore/
├── database/
├── requirements.txt
└── README.md
```

---

## ⚙️ Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/Ath3n1x/elearning.git
cd elearning
```

### 2. Create a Virtual Environment

```bash
python -m venv venv
source venv/bin/activate        # Mac/Linux
venv\Scripts\activate           # Windows
```

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

### 4. Run the Backend

```bash
uvicorn backend.main:app --reload
```

### 5. Run the Frontend

```bash
# Option 1 — Direct
python frontend/app.py

# Option 2 — Flask CLI (Mac/Linux)
export FLASK_APP=frontend/app.py
flask run

# Option 2 — Flask CLI (Windows)
set FLASK_APP=frontend/app.py
flask run
```

---

## 📊 Pilot Study Results

- **~30%** improvement in quiz retention scores
- **~50%** increase in overall student engagement
- Higher time-on-task for personalized quizzes vs. static content

---

## ⚠️ Known Challenges

- LLM output sanitization and robust JSON parsing
- GPU memory constraints during chatbot fine-tuning
- Maintaining strict curriculum fidelity in generated questions
- Minimizing hallucination through retrieval grounding

---

## 🔮 Future Roadmap

- [ ] Parent/Teacher analytics dashboard
- [ ] Gamification (XP, badges, streaks)
- [ ] Voice-based interaction (Speech-to-Text)
- [ ] Video-linked automated quiz generation
- [ ] Cloud deployment with scalable inference

---

## 👨‍💻 Authors

Developed at **Amrita Vishwa Vidyapeetham**

- Gadha S Menon

---

## 🛠 Tech Stack

`Python` `FastAPI` `Flask` `FAISS` `LangChain` `Sentence-Transformers` `Qwen2-1.5B` `DialoGPT` `LoRA (PEFT)` `SQLite`
