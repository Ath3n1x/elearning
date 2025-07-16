import os
import json
import hashlib
import torch
import numpy as np
import re
from sklearn.metrics.pairwise import cosine_similarity
from langchain_community.document_loaders import TextLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import FAISS
from langchain_huggingface import HuggingFacePipeline
from transformers import pipeline, AutoTokenizer, AutoModelForCausalLM, AutoModel
from huggingface_hub import login
import threading
import pickle
from functools import lru_cache
import warnings

warnings.filterwarnings("ignore", category=FutureWarning)
warnings.filterwarnings("ignore", category=UserWarning)
warnings.filterwarnings("ignore", category=DeprecationWarning)

os.environ["TOKENIZERS_PARALLELISM"] = "false"
os.environ["TRANSFORMERS_NO_ADVISORY_WARNINGS"] = "true"
os.environ["TRANSFORMERS_USE_TORCHVISION"] = "0"

def get_huggingface_token():
    return os.environ.get("HUGGINGFACE_TOKEN", None)

huggingface_token = get_huggingface_token()
if huggingface_token:
    login(token=huggingface_token)

CACHE_DIR = os.path.join(os.path.dirname(__file__), "cache")
os.makedirs(CACHE_DIR, exist_ok=True)

class CustomEmbeddings:
    def __init__(self, model_name="sentence-transformers/all-MiniLM-L6-v2", token=None):
        self.tokenizer = AutoTokenizer.from_pretrained(model_name, token=token)
        self.model = AutoModel.from_pretrained(model_name, token=token).to("cuda")
    def embed_texts(self, texts):
        inputs = self.tokenizer(texts, padding=True, truncation=True, return_tensors="pt", max_length=512).to("cuda")
        with torch.no_grad():
            embeddings = self.model(**inputs).last_hidden_state.mean(dim=1).cpu().numpy()
        return embeddings
    def embed_documents(self, texts):
        return self.embed_texts(texts)
    def embed_query(self, text):
        return self.embed_texts([text])[0]
    def __call__(self, text):
        return self.embed_query(text)

def validate_answer(question, answer, context, embeddings):
    context_emb = embeddings.embed_query(context)
    answer_emb = embeddings.embed_query(answer)
    return cosine_similarity([context_emb], [answer_emb])[0][0] > 0.7

@lru_cache(maxsize=10)
def load_dataset(chapter):
    dataset_dir = os.path.join(os.path.dirname(__file__), "biology_xii_txt")
    if not os.path.exists(dataset_dir):
        raise FileNotFoundError(f"Dataset directory not found: {dataset_dir}")
    chapter_map = {
        "Reproduction in Organisms": "chapter_01.txt",
        "Sexual Reproduction in Flowering Plants": "chapter_02.txt",
        "Human Reproduction": "chapter_03.txt",
        "Reproductive Health": "chapter_04.txt",
        "Principles of Inheritance and Variation": "chapter_05.txt",
        "Molecular Basis of Inheritance": "chapter_06.txt",
        "Evolution": "chapter_07.txt",
        "Human Health and Disease": "chapter_08.txt",
        "Microbes in Human Welfare": "chapter_09.txt",
        "Biotechnology: Principles and Processes": "chapter_10.txt",
        "Biotechnology and its Applications": "chapter_11.txt",
        "Organisms and Populations": "chapter_12.txt",
        "Ecosystem": "chapter_13.txt",
        "Biodiversity and Conservation": "chapter_14.txt"
    }
    chapter_file = chapter_map.get(chapter)
    if not chapter_file:
        raise ValueError(f"No file mapped for chapter: {chapter}")
    file_path = os.path.join(dataset_dir, chapter_file)
    if not os.path.exists(file_path):
        raise ValueError(f"File not found: {file_path}")
    cache_path = os.path.join(CACHE_DIR, f"{chapter}_vectorstore.pkl")
    if os.path.exists(cache_path):
        try:
            with open(cache_path, "rb") as f:
                vectorstore = pickle.load(f)
            embeddings = CustomEmbeddings(token=huggingface_token)
            return vectorstore, embeddings, f"Loaded cached vectorstore for {chapter}"
        except Exception as e:
            print(f"Cache loading failed: {e}, regenerating vectorstore...")
    try:
        loader = TextLoader(file_path, encoding='utf-8')
        docs = loader.load()
        for doc in docs:
            doc.metadata['chapter'] = chapter
    except Exception as e:
        raise ValueError(f"Error loading {chapter_file}: {e}")
    if not docs:
        raise ValueError("No valid documents loaded")
    splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=50)
    split_docs = splitter.split_documents(docs)
    embeddings = CustomEmbeddings(token=huggingface_token)
    vectorstore = FAISS.from_documents(split_docs, embeddings)
    try:
        with open(cache_path, "wb") as f:
            pickle.dump(vectorstore, f)
    except Exception as e:
        print(f"Cache saving failed: {e}, proceeding without cache...")
    return vectorstore, embeddings, f"Loaded {len(split_docs)} chunks for {chapter}"

model_id = "Qwen/Qwen2-1.5B-Instruct" if huggingface_token else "HuggingFaceH4/zephyr-7b-beta"
tokenizer = AutoTokenizer.from_pretrained(model_id, token=huggingface_token)
model = AutoModelForCausalLM.from_pretrained(
    model_id,
    token=huggingface_token,
    device_map="auto",
    torch_dtype=torch.float16,
    low_cpu_mem_usage=True
)
pipeline_llm = pipeline(
    "text-generation",
    model=model,
    tokenizer=tokenizer,
    max_new_tokens=2000,
    temperature=0.7,
    top_p=0.9,
    do_sample=True,
    return_full_text=False
)
llm = HuggingFacePipeline(pipeline=pipeline_llm)

def deduplicate_questions(questions, threshold=0.8):
    embeddings = CustomEmbeddings(token=huggingface_token)
    question_texts = [q["question"] for q in questions]
    embeddings_vectors = embeddings.embed_documents(question_texts)
    keep = []
    seen = set()
    for i, q in enumerate(questions):
        if i in seen:
            continue
        keep.append(q)
        for j in range(i + 1, len(questions)):
            if j in seen:
                continue
            sim = cosine_similarity([embeddings_vectors[i]], [embeddings_vectors[j]])[0][0]
            if sim > threshold:
                seen.add(j)
    return keep

def sanitize_json(raw_output):
    json_match = re.search(r'\[.*\]', raw_output, re.DOTALL)
    if not json_match:
        return None
    json_str = json_match.group(0)
    json_str = json_str.replace("'", '"')
    json_str = re.sub(r',\s*]', ']', json_str)
    json_str = re.sub(r',\s*}', '}', json_str)
    json_str = re.sub(r'"\s*,\s*"', '","', json_str)
    json_str = re.sub(r'"\s*,\s*]', '"]', json_str)
    json_str = re.sub(r'"questions"\s*:\s*', '', json_str)
    try:
        questions = json.loads(json_str)
        for q in questions:
            if q["type"] == "mcq" and "options" in q:
                q["options"] = [f"{chr(65+i)}) {opt.lstrip('ABCD)')}" if not opt.startswith(f"{chr(65+i)})") else opt for i, opt in enumerate(q["options"])]
                if q["answer"] in [opt.lstrip('ABCD)') for opt in q["options"]]:
                    q["answer"] = next(o for o in q["options"] if o.endswith(q["answer"]))
        return questions
    except json.JSONDecodeError:
        try:
            last_valid = re.search(r'(\[\s*(?:{[^}]*},?\s*)*)\s*(?:{[^}]*$)?', json_str, re.DOTALL)
            if last_valid:
                questions = json.loads(last_valid.group(1) + "]")
                for q in questions:
                    if q["type"] == "mcq" and "options" in q:
                        q["options"] = [f"{chr(65+i)}) {opt.lstrip('ABCD)')}" if not opt.startswith(f"{chr(65+i)})") else opt for i, opt in enumerate(q["options"])]
                        if q["answer"] in [opt.lstrip('ABCD)') for opt in q["options"]]:
                            q["answer"] = next(o for o in q["options"] if o.endswith(q["answer"]))
                return questions
        except:
            return None
    return None

def generate_quiz(chapter, question_type, difficulty, count):
    if count > 50:
        return {"error": "Count must be ≤ 50"}
    if question_type not in ["mcq", "fill_blank"]:
        return {"error": "Question type must be 'mcq' or 'fill_blank'"}
    if difficulty not in ["beginner", "intermediate", "hard"]:
        return {"error": "Difficulty must be 'beginner', 'intermediate', or 'hard'"}
    try:
        vectorstore, embeddings, status = load_dataset(chapter)
        print(status)
    except Exception as e:
        return {"error": str(e)}
    query = f"Key concepts and details from the chapter {chapter} suitable for {difficulty} {question_type} questions"
    docs = vectorstore.similarity_search(query, k=5)
    if not docs:
        return {"error": f"No relevant chunks found for chapter: {chapter}"}
    context_chunks = [doc.page_content for doc in docs[:3]]
    context = "\n\n".join(context_chunks)[:600]
    print(f"Context length: {len(context)} characters")
    chapter_keywords = {
        "Human Reproduction": ["fertilization", "spermatogenesis", "ovulation", "placenta", "fallopian tube", "uterus", "testes", "ovary", "hormone", "menstrual cycle"]
    }
    batch_size = 3
    max_retries = 7
    consistency_checks = 5
    all_questions = []
    remaining = count
    attempt = 0
    single_question_prompt = f"""Generate ONE {question_type} question for {chapter} at {difficulty} level:\n1. **Extract Concept**: Pick a unique concept (e.g., fertilization, placenta) not covered in: {', '.join([q['question'] for q in all_questions])}.\n2. **Generate Question**: Create a single-sentence question with one of these keywords: {', '.join(chapter_keywords[chapter])}.\n3. **Validate Answer**: Ensure the answer matches NCERT facts (e.g., fertilization occurs in fallopian tube).\n4. **Format**: Return a JSON object with no extra text. For MCQs, use options A), B), C), D).\nContext: {context}\nExample:\n{{\n  "type": "mcq",\n  "question": "What is the role of FSH in ovulation?",\n  "options": ["A) Stimulates egg release", "B) Thickens endometrium", "C) Produces progesterone", "D) Inhibits ovulation"],\n  "answer": "A) Stimulates egg release"\n}}"""
    def generate_batch():
        results = []
        threads = []
        for _ in range(consistency_checks):
            t = threading.Thread(target=lambda r=results: r.append(llm.generate([{"role": "user", "content": prompt}])))
            t.start()
            threads.append(t)
        for t in threads:
            t.join()
        return [r.generations[0][0].text.strip() for r in results]
    while remaining > 0 and attempt < max_retries:
        current_batch = min(batch_size, remaining)
        print(f"Attempt {attempt + 1}/{max_retries}: Generating batch of {current_batch} questions...")
        if question_type == "mcq":
            prompt = f"""You are an expert NCERT Class 12 Biology tutor specializing in {chapter}. Generate exactly {current_batch} unique MCQs at {difficulty} level using this enhanced chain-of-thought process:\n\n1. **Extract Key Concepts**: Identify {current_batch} distinct concepts from the context (e.g., fertilization, spermatogenesis, ovulation, placenta). Avoid overlap with: {', '.join([q['question'] for q in all_questions])}.\n2. **Generate Questions**: Create single-sentence questions matching {difficulty}:\n   - Beginner: Simple recall (e.g., "What is the primary site of fertilization in humans?").\n   - Intermediate: Conceptual understanding (e.g., "What is the role of FSH in ovulation?").\n   - Hard: Analytical/inferential (e.g., "How does hormonal imbalance affect the menstrual cycle?").\n3. **Generate Options**: Provide exactly 4 distinct options labeled A), B), C), D). Avoid "All of the above" unless all options are factually correct per NCERT.\n4. **Validate Answer**: Cross-check the answer against the context using keyword similarity (e.g., "fertilization" occurs in "fallopian tube"). Ensure similarity score > 0.7.\n5. **Self-Critique**:\n   - Relevance: Include at least one keyword: {', '.join(chapter_keywords[chapter])}.\n   - Accuracy: Ensure the answer aligns with NCERT facts.\n   - Difficulty: Reject questions not matching {difficulty} level (e.g., no 'What is' for intermediate/hard).\n   - Format: Return a valid JSON array, starting with [ and ending with ], no extra text.\n6. **Final Format**: Pass the output through a JSON formatter to ensure valid syntax.\n\nContext: {context}\n\nExample Output:\n[\n  {{\n    "type": "mcq",\n    "question": "What is the role of FSH in ovulation?",\n    "options": ["A) Stimulates egg release", "B) Thickens endometrium", "C) Produces progesterone", "D) Inhibits ovulation"],\n    "answer": "A) Stimulates egg release"\n  }}\n]\n\nReturn ONLY the JSON array with {current_batch} questions."""
        else:
            prompt = f"""You are an expert NCERT Class 12 Biology tutor specializing in {chapter}. Generate exactly {current_batch} unique fill-in-the-blank questions at {difficulty} level using this enhanced chain-of-thought process:\n\n1. **Extract Key Concepts**: Identify {current_batch} distinct concepts from the context (e.g., spermatogenesis, ovulation, implantation). Avoid overlap with: {', '.join([q['question'] for q in all_questions])}.\n2. **Generate Questions**: Create single-sentence questions with one blank ("_____") matching {difficulty}:\n   - Beginner: Basic terminology (e.g., "The male gamete is called _____.").\n   - Intermediate: Key processes (e.g., "The process of egg production is called _____.").\n   - Hard: Specific details (e.g., "The hormone that triggers ovulation is _____.").\n3. **Generate Answers**: Provide a single word or short phrase, ensuring accuracy per NCERT.\n4. **Validate Answer**: Cross-check the answer against the context (score > 0.7).\n5. **Self-Critique**:\n   - Relevance: Include at least one keyword: {', '.join(chapter_keywords[chapter])}.\n   - Accuracy: Ensure the answer aligns with NCERT facts.\n   - Difficulty: Reject questions not matching {difficulty} level.\n   - Format: Return a valid JSON array, starting with [ and ending with ], no extra text.\n6. **Final Format**: Pass the output through a JSON formatter to ensure valid syntax.\n\nContext: {context}\n\nExample Output:\n[\n  {{\n    "type": "fill_blank",\n    "question": "The process of sperm production is called _____.",\n    "answer": "spermatogenesis"\n  }}\n]\n\nReturn ONLY the JSON array with {current_batch} questions."""
        best_questions = []
        best_score = -1
        best_output = ""
        outputs = generate_batch()
        for check, raw_output in enumerate(outputs, 1):
            try:
                print(f"Consistency check {check}/{consistency_checks} - Raw LLM output (first 500 chars):")
                print(raw_output[:500] + "..." if len(raw_output) > 500 else raw_output)
                questions = sanitize_json(raw_output)
                if not questions:
                    print(f"No valid JSON array in check {check}, skipping...")
                    continue
                valid_questions = []
                for q in questions:
                    if q["type"] == "mcq" and len(q.get("options", [])) == 4 and q["answer"] in q["options"]:
                        if validate_answer(q["question"], q["answer"], context, embeddings):
                            valid_questions.append(q)
                    elif q["type"] == "fill_blank" and "_____" in q["question"] and isinstance(q["answer"], str):
                        if validate_answer(q["question"], q["answer"], context, embeddings):
                            valid_questions.append(q)
                score = len(valid_questions)
                used_concepts = set()
                for q in valid_questions:
                    if any(keyword in q["question"].lower() for keyword in chapter_keywords[chapter]):
                        score += 1
                    concept = next((k for k in chapter_keywords[chapter] if k in q["question"].lower()), None)
                    if concept and concept not in used_concepts:
                        score += 1
                        used_concepts.add(concept)
                    if difficulty in ["intermediate", "hard"] and "what is" in q["question"].lower():
                        score -= 1
                if score > best_score:
                    best_score = score
                    best_questions = valid_questions
                    best_output = raw_output
                print(f"Check {check} yielded {len(valid_questions)} valid questions, score: {score}")
            except Exception as e:
                print(f"Consistency check {check} failed: {e}")
                continue
        if not best_questions and remaining > 0:
            print("No valid batch questions, trying single-question fallback...")
            for _ in range(min(5, remaining)):
                try:
                    result = llm.generate([{"role": "user", "content": single_question_prompt}])
                    raw_output = result.generations[0][0].text.strip()
                    question = sanitize_json(f"[{raw_output}]")
                    if question and len(question) == 1:
                        q = question[0]
                        if q["type"] == "mcq" and len(q.get("options", [])) == 4 and q["answer"] in q["options"]:
                            if validate_answer(q["question"], q["answer"], context, embeddings):
                                best_questions.append(q)
                        elif q["type"] == "fill_blank" and "_____" in q["question"] and isinstance(q["answer"], str):
                            if validate_answer(q["question"], q["answer"], context, embeddings):
                                best_questions.append(q)
                    print(f"Fallback yielded {len(best_questions)} question(s), score: {best_score}")
                except Exception as e:
                    print(f"Fallback failed: {e}")
        if best_questions:
            all_questions.extend(best_questions)
            print(f"Batch added {len(best_questions)} valid questions, total: {len(all_questions)}")
            remaining -= len(best_questions)
            attempt = 0
        else:
            attempt += 1
            print(f"No valid questions in batch, retrying... (best output: {best_output[:100] + '...' if best_output else 'None'})")
        torch.cuda.empty_cache()
    if all_questions:
        all_questions = deduplicate_questions(all_questions)[:count]
        print(f"After deduplication: {len(all_questions)} questions")
    for q in all_questions:
        q["question_id"] = hashlib.md5(q["question"].encode()).hexdigest()
    torch.cuda.empty_cache()
    return {"questions": all_questions}

def generate_quiz_api(request):
    try:
        result = generate_quiz(
            chapter=request["chapter"],
            question_type=request["question_type"],
            difficulty=request["difficulty"],
            count=request["count"]
        )
        if "error" in result:
            return {"status": "error", "message": result["error"]}
        return {"status": "success", "data": result}
    except Exception as e:
        return {"status": "error", "message": str(e)} 