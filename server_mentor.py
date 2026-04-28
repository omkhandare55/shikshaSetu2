"""
server_mentor.py — AI Mentor Chatbot for ShikshaSetu
Endpoints: /mentor/chat  /mentor/generate-questions  /mentor/test-paper
           /mentor/weak-topics  /mentor/study-plan  /mentor/important-questions
"""
from __future__ import annotations
import json, os, random, logging
from datetime import datetime, timedelta
from typing import Optional, List
from fastapi import APIRouter
from pydantic import BaseModel
from server_ai import generate_answer, llm_env_configured

log = logging.getLogger(__name__)
mentor_router = APIRouter(prefix="/mentor", tags=["mentor"])

# ── Maharashtra Board Syllabus Structure ─────────────────────────────────────
SYLLABUS = {
    "math": {
        "1":  ["Numbers 1-100","Addition","Subtraction","Shapes"],
        "2":  ["Numbers 1-1000","Addition with carry","Subtraction with borrow","Multiplication tables"],
        "3":  ["4-digit numbers","Multiplication","Division","Fractions intro"],
        "4":  ["Large numbers","LCM & HCF","Fractions","Decimals intro"],
        "5":  ["Number system","Decimals","Percentages","Area & Perimeter"],
        "6":  ["Integers","Fractions & Decimals","Ratio & Proportion","Basic Geometry"],
        "7":  ["Rational Numbers","Algebraic Expressions","Triangles","Data Handling"],
        "8":  ["Squares & Cubes","Linear Equations","Mensuration","Probability"],
        "9":  ["Real Numbers","Polynomials","Coordinate Geometry","Triangles","Statistics"],
        "10": ["Quadratic Equations","Arithmetic Progression","Trigonometry","Circles","Surface Areas"],
    },
    "science": {
        "1":  ["Plants around us","Animals","Food","Water"],
        "2":  ["Living & Non-living","Human Body","Seasons","Materials"],
        "3":  ["Animal Habitats","Soil","Air & Water","Simple Machines"],
        "4":  ["Plants – Structure","Food & Digestion","Rocks & Minerals","Safety"],
        "5":  ["Cell – Basic unit","Photosynthesis","Force & Motion","Light"],
        "6":  ["Body Systems","Chemical Substances","Electricity basics","Climate"],
        "7":  ["Nutrition","Acids Bases Salts","Heat","Motion & Time"],
        "8":  ["Microorganisms","Metals & Non-metals","Stars & Solar System","Pollution"],
        "9":  ["Matter","Atom & Molecules","Gravitation","Sound","Work & Energy"],
        "10": ["Chemical Reactions","Acids Bases Salts","Life Processes","Electricity","Light Reflection"],
    },
    "english": {
        "1":  ["Alphabet","Simple words","Greetings","Colours & Numbers"],
        "2":  ["Nouns","Simple sentences","Short stories","Rhymes"],
        "3":  ["Verbs","Adjectives","Reading comprehension","Letter writing"],
        "4":  ["Tenses – present past","Pronouns","Paragraph writing","Grammar basics"],
        "5":  ["Articles","Prepositions","Composition","Story writing"],
        "6":  ["Active Passive voice","Reported speech","Essay writing","Comprehension"],
        "7":  ["Idioms & phrases","Clauses","Formal letters","Reading skills"],
        "8":  ["Figures of speech","Sentence transformation","Notice writing","Comprehension"],
        "9":  ["Poetry analysis","Grammar advanced","Formal writing","Novel/Story"],
        "10": ["Board exam prose","Poetry","Grammar full","Letter/Essay/Report"],
    },
    "social_science": {
        "5":  ["Our Earth","Maps","Ancient Civilisations","Local Government"],
        "6":  ["Early Humans","Indus Valley","Greek & Roman","Continents & Oceans"],
        "7":  ["Medieval India","Delhi Sultanate","Mughal Empire","Geographical Features"],
        "8":  ["Modern India","British Rule","Freedom Movement","Industries"],
        "9":  ["French Revolution","Indian National Movement","Climate of India","Constitutional Democracy"],
        "10": ["Nationalism Europe","India 1857-1947","Manufacturing Industries","Consumer Rights","Democracy"],
    },
}

# ── Pydantic Models ──────────────────────────────────────────────────────────
class MentorChatRequest(BaseModel):
    message: str
    language: str = "english"
    class_grade: str = "8"
    subject: Optional[str] = None
    chapter: Optional[str] = None
    student_level: str = "medium"  # easy|medium|hard
    session_history: Optional[List[dict]] = []

class GenerateQuestionsRequest(BaseModel):
    class_grade: str = "8"
    subject: str = "math"
    chapter: Optional[str] = None
    count: int = 5
    difficulty: str = "medium"
    question_types: List[str] = ["mcq"]
    language: str = "english"

class TestPaperRequest(BaseModel):
    class_grade: str = "8"
    subjects: List[str] = ["math", "science", "english"]
    test_type: str = "weekly"  # weekly|monthly|chapter|full
    total_marks: int = 50
    language: str = "english"

class WeakTopicsRequest(BaseModel):
    user_id: str
    class_grade: str = "8"
    performance_data: List[dict] = []  # [{subject, topic, score, attempts}]

class StudyPlanRequest(BaseModel):
    class_grade: str = "8"
    exam_date_days: int = 30
    weak_topics: List[str] = []
    daily_hours: float = 2.0
    language: str = "english"

# ── Question Bank (Seed Questions) ───────────────────────────────────────────
SEED_QUESTIONS = {
    ("math","Quadratic Equations"): [
        {"q":"Find roots of x²-5x+6=0","a":"x=2, x=3","opts":["x=1,x=5","x=2,x=3","x=-2,x=-3","x=3,x=4"],"diff":"medium","marks":3,"important":True},
        {"q":"For kx²+4x+1=0 to have equal roots, k=?","a":"4","opts":["2","4","8","16"],"diff":"hard","marks":4,"important":True},
        {"q":"Nature of roots when discriminant > 0?","a":"Two distinct real roots","opts":["No real roots","Two distinct real roots","Equal roots","Imaginary roots"],"diff":"easy","marks":1,"important":True},
    ],
    ("math","Trigonometry"): [
        {"q":"sin²θ + cos²θ = ?","a":"1","opts":["0","1","2","sinθcosθ"],"diff":"easy","marks":1,"important":True},
        {"q":"Value of tan 45°?","a":"1","opts":["0","1","√3","1/√3"],"diff":"easy","marks":1,"important":True},
        {"q":"If sinθ=3/5, find cosθ","a":"4/5","opts":["3/4","4/5","5/3","5/4"],"diff":"medium","marks":2,"important":True},
    ],
    ("science","Chemical Reactions"): [
        {"q":"Which gas is produced when Zn reacts with HCl?","a":"Hydrogen","opts":["Oxygen","Hydrogen","Carbon dioxide","Nitrogen"],"diff":"easy","marks":1,"important":True},
        {"q":"Rusting of iron is a __ reaction","a":"Oxidation","opts":["Reduction","Oxidation","Neutralisation","Decomposition"],"diff":"medium","marks":2,"important":True},
        {"q":"Balanced equation for burning of methane?","a":"CH₄+2O₂→CO₂+2H₂O","opts":["CH₄+O₂→CO₂+H₂O","CH₄+2O₂→CO₂+2H₂O","2CH₄+O₂→2CO+2H₂","CH₄+3O₂→CO₂+2H₂O"],"diff":"hard","marks":3,"important":True},
    ],
    ("science","Life Processes"): [
        {"q":"Powerhouse of the cell?","a":"Mitochondria","opts":["Nucleus","Mitochondria","Ribosome","Cell wall"],"diff":"easy","marks":1,"important":True},
        {"q":"Equation for photosynthesis products?","a":"Glucose + Oxygen","opts":["CO₂ + H₂O","Glucose + Oxygen","Starch + CO₂","ATP + H₂O"],"diff":"medium","marks":2,"important":True},
    ],
    ("english","Grammar"): [
        {"q":"Change to passive: 'The teacher solved the problem'","a":"The problem was solved by the teacher","opts":["The problem is solved by teacher","The problem was solved by the teacher","Teacher had solved the problem","Problem solved by the teacher"],"diff":"medium","marks":2,"important":True},
        {"q":"Identify the figure of speech: 'Life is a journey'","a":"Metaphor","opts":["Simile","Metaphor","Personification","Alliteration"],"diff":"medium","marks":1,"important":True},
    ],
    ("social_science","Nationalism Europe"): [
        {"q":"French Revolution began in?","a":"1789","opts":["1776","1789","1800","1815"],"diff":"easy","marks":1,"important":True},
        {"q":"Who wrote 'Troppau Memorandum'?","a":"Metternich","opts":["Napoleon","Bismarck","Metternich","Garibaldi"],"diff":"hard","marks":2,"important":False},
    ],
}

# ── Helpers ──────────────────────────────────────────────────────────────────
def _get_chapters(class_grade: str, subject: str) -> list:
    return SYLLABUS.get(subject, {}).get(class_grade, [])

def _get_seed_questions(subject: str, chapter: str, difficulty: str, count: int) -> list:
    """Pull from seed bank, fallback to dynamic generation stub."""
    all_q = []
    for (subj, chap), qs in SEED_QUESTIONS.items():
        if subj == subject:
            if chapter is None or chap.lower() in chapter.lower() or chapter.lower() in chap.lower():
                all_q.extend([{**q, "chapter": chap} for q in qs])
    if difficulty != "mixed":
        all_q = [q for q in all_q if q.get("diff") == difficulty] or all_q
    random.shuffle(all_q)
    return all_q[:count]

def _llm_generate_questions(subject: str, chapter: str, class_grade: str,
                             difficulty: str, count: int, lang: str) -> list:
    """Use LLM to generate questions if API key is available."""
    if not llm_env_configured():
        return []
    prompt = (
        f"Generate {count} {difficulty}-difficulty MCQ questions for Class {class_grade} "
        f"{subject.replace('_',' ').title()} chapter '{chapter}' (Maharashtra Board). "
        f"Reply ONLY in valid JSON array: "
        '[ {"question":"...","options":["A","B","C","D"],"answer":"A","explanation":"...","marks":2} ]'
    )
    try:
        result = generate_answer(prompt, lang, chat_mode=True)
        raw = result.get("answer", "")
        lo, hi = raw.find("["), raw.rfind("]")
        if lo >= 0 and hi > lo:
            return json.loads(raw[lo:hi+1])
    except Exception as e:
        log.warning("LLM question gen failed: %s", e)
    return []

def _adapt_difficulty(current: str, score_pct: float) -> str:
    if score_pct >= 0.8 and current == "easy":
        return "medium"
    if score_pct >= 0.8 and current == "medium":
        return "hard"
    if score_pct < 0.4 and current == "hard":
        return "medium"
    if score_pct < 0.4 and current == "medium":
        return "easy"
    return current

# ── Routes ────────────────────────────────────────────────────────────────────

@mentor_router.post("/chat")
def mentor_chat(req: MentorChatRequest):
    """Conversational AI mentor — answers doubts, explains concepts, suggests next steps."""
    chapters = _get_chapters(req.class_grade, req.subject or "math")
    context = ""
    if req.subject:
        context = f"Class {req.class_grade} {req.subject.replace('_',' ').title()} (Maharashtra Board). "
    if req.chapter:
        context += f"Chapter: {req.chapter}. "

    system_hint = (
        f"{context}Student level: {req.student_level}. "
        "You are a friendly AI mentor for rural Indian students (Classes 1-12). "
        "Give simple, clear explanations with examples. "
        "After answering, suggest what the student should study next or offer a practice question."
    )
    full_msg = f"[CONTEXT: {system_hint}]\n\nStudent asks: {req.message}"
    result = generate_answer(full_msg, req.language, chat_mode=True)

    next_chapter = None
    if req.chapter and chapters:
        try:
            idx = next(i for i, c in enumerate(chapters) if req.chapter.lower() in c.lower())
            if idx + 1 < len(chapters):
                next_chapter = chapters[idx + 1]
        except StopIteration:
            pass

    return {
        "answer": result.get("answer", ""),
        "steps": result.get("steps", []),
        "tip": result.get("tip", ""),
        "subject": req.subject,
        "suggested_next": next_chapter,
        "available_chapters": chapters[:5],
        "language": req.language,
    }


@mentor_router.post("/generate-questions")
def generate_questions(req: GenerateQuestionsRequest):
    """Generate MCQ/short-answer questions for a chapter. Adaptive difficulty supported."""
    chapter = req.chapter or (SYLLABUS.get(req.subject, {}).get(req.class_grade, ["General"])[0])

    # Try LLM first, fall back to seed bank
    questions = _llm_generate_questions(req.subject, chapter, req.class_grade,
                                         req.difficulty, req.count, req.language)
    if not questions:
        seed = _get_seed_questions(req.subject, chapter, req.difficulty, req.count)
        questions = [
            {
                "question": q["q"],
                "options": q.get("opts", []),
                "answer": q["a"],
                "explanation": f"The correct answer is {q['a']}.",
                "difficulty": q.get("diff", req.difficulty),
                "marks": q.get("marks", 2),
                "chapter": q.get("chapter", chapter),
                "important": q.get("important", False),
            }
            for q in seed
        ]

    # Tag all questions
    for q in questions:
        q.setdefault("subject", req.subject)
        q.setdefault("class_grade", req.class_grade)
        q.setdefault("type", "mcq" if q.get("options") else "short_answer")

    return {
        "questions": questions,
        "chapter": chapter,
        "subject": req.subject,
        "class_grade": req.class_grade,
        "difficulty": req.difficulty,
        "count": len(questions),
        "generated_at": datetime.utcnow().isoformat(),
    }


@mentor_router.post("/adapt-difficulty")
def adapt_difficulty(current_difficulty: str = "medium", score_pct: float = 0.5):
    """Return the next recommended difficulty level based on performance."""
    new_diff = _adapt_difficulty(current_difficulty, score_pct)
    return {
        "previous": current_difficulty,
        "recommended": new_diff,
        "message": (
            "🔥 Great job! Moving to harder questions." if new_diff > current_difficulty else
            "📚 Let's reinforce the basics first." if new_diff < current_difficulty else
            "👍 Keep going at this level."
        ),
    }


@mentor_router.post("/test-paper")
def generate_test_paper(req: TestPaperRequest):
    """Auto-generate weekly/monthly/chapter test paper."""
    paper = {"title": "", "type": req.test_type, "total_marks": req.total_marks,
              "class_grade": req.class_grade, "sections": [],
              "generated_at": datetime.utcnow().isoformat()}

    marks_map = {"weekly": 25, "monthly": 50, "chapter": 30, "full": 80}
    actual_marks = marks_map.get(req.test_type, req.total_marks)

    titles = {
        "weekly":  f"Class {req.class_grade} — Weekly Test",
        "monthly": f"Class {req.class_grade} — Monthly Examination",
        "chapter": f"Class {req.class_grade} — Chapter Test",
        "full":    f"Class {req.class_grade} — Full Syllabus Test",
    }
    paper["title"] = titles.get(req.test_type, "Test Paper")
    paper["total_marks"] = actual_marks

    per_subject = actual_marks // max(len(req.subjects), 1)

    for subj in req.subjects:
        chapters = SYLLABUS.get(subj, {}).get(req.class_grade, [])
        q_count = max(3, per_subject // 4)
        seed = _get_seed_questions(subj, None, "mixed", q_count)
        llm_qs = _llm_generate_questions(subj, "full syllabus", req.class_grade,
                                          "mixed", q_count, req.language)
        questions = llm_qs or [
            {"question": q["q"], "options": q.get("opts", []), "answer": q["a"],
             "marks": q.get("marks", 2), "type": "mcq"} for q in seed
        ]
        paper["sections"].append({
            "subject": subj,
            "marks": per_subject,
            "questions": questions,
            "chapters_covered": chapters[:4] if req.test_type in ("chapter", "weekly") else chapters,
        })

    paper["instructions"] = [
        f"Total time: {actual_marks * 1.5:.0f} minutes",
        "Attempt all questions.",
        "MCQ carries 1 mark each. No negative marking.",
        "Write clearly and show all working for numerical problems.",
    ]
    return paper


@mentor_router.post("/weak-topics")
def detect_weak_topics(req: WeakTopicsRequest):
    """Analyse performance data, return weak topics and revision recommendations."""
    weak = []
    medium = []
    strong = []

    for item in req.performance_data:
        score = item.get("score", 0)
        topic = item.get("topic", "")
        subj = item.get("subject", "")
        attempts = item.get("attempts", 1)
        avg = score / max(attempts, 1)
        entry = {"topic": topic, "subject": subj, "avg_score": round(avg, 1), "attempts": attempts}
        if avg < 40:
            weak.append(entry)
        elif avg < 70:
            medium.append(entry)
        else:
            strong.append(entry)

    # Fill from syllabus if no performance data
    if not req.performance_data:
        for subj, chapters in SYLLABUS.items():
            ch_list = chapters.get(req.class_grade, [])
            for ch in ch_list[:2]:
                weak.append({"topic": ch, "subject": subj, "avg_score": 0, "attempts": 0,
                             "note": "Not yet attempted"})

    recommendations = []
    for w in weak[:5]:
        recommendations.append({
            "action": f"Revise {w['topic']} ({w['subject']})",
            "priority": "high",
            "suggested_time": "45 minutes",
            "resources": ["Textbook chapter review", "Practice 5 MCQs", "Ask AI mentor"],
        })

    return {
        "user_id": req.user_id,
        "weak_topics": weak,
        "medium_topics": medium,
        "strong_topics": strong,
        "recommendations": recommendations,
        "overall_health": "needs_work" if len(weak) > len(strong) else "on_track",
    }


@mentor_router.post("/study-plan")
def generate_study_plan(req: StudyPlanRequest):
    """Create a personalised daily/weekly AI study plan."""
    days = req.exam_date_days
    subjects = list(SYLLABUS.keys())
    chapters_all = []
    for subj in subjects:
        chs = SYLLABUS.get(subj, {}).get(req.class_grade, [])
        for ch in chs:
            priority = "high" if ch in req.weak_topics else "medium"
            chapters_all.append({"subject": subj, "chapter": ch, "priority": priority})

    # Sort: weak topics first
    chapters_all.sort(key=lambda x: 0 if x["priority"] == "high" else 1)

    daily_slots = max(1, int(req.daily_hours * 2))  # 30-min slots
    schedule = []
    ch_idx = 0
    for day in range(1, min(days + 1, 31)):
        day_tasks = []
        for slot in range(daily_slots):
            if ch_idx >= len(chapters_all):
                ch_idx = 0
            item = chapters_all[ch_idx]
            day_tasks.append({
                "time_slot": f"Slot {slot + 1} (30 min)",
                "subject": item["subject"],
                "chapter": item["chapter"],
                "activity": random.choice(["Read & Notes", "Practice MCQs", "Solve Problems", "Flashcard Review"]),
                "priority": item["priority"],
            })
            ch_idx += 1
        schedule.append({
            "day": day,
            "date": (datetime.utcnow() + timedelta(days=day - 1)).strftime("%d %b %Y"),
            "tasks": day_tasks,
            "daily_goal_xp": 50 * daily_slots,
        })

    return {
        "class_grade": req.class_grade,
        "exam_in_days": days,
        "daily_study_hours": req.daily_hours,
        "schedule": schedule[:7],  # Return first week
        "total_chapters": len(chapters_all),
        "weak_topics_prioritised": req.weak_topics,
        "tip": "Revise weak topics daily. Practice at least 5 MCQs per subject each day.",
    }


@mentor_router.post("/important-questions")
def get_important_questions(class_grade: str = "10", subject: str = "math",
                            language: str = "english"):
    """Return high-probability exam questions tagged by importance."""
    all_imp = []
    for (subj, chap), qs in SEED_QUESTIONS.items():
        if subj == subject:
            for q in qs:
                if q.get("important"):
                    all_imp.append({
                        "question": q["q"],
                        "answer": q["a"],
                        "chapter": chap,
                        "difficulty": q.get("diff", "medium"),
                        "marks": q.get("marks", 2),
                        "exam_probability": random.randint(75, 98),
                        "type": "mcq",
                    })

    all_imp.sort(key=lambda x: x["exam_probability"], reverse=True)

    # LLM top questions if available
    llm_tip = None
    if llm_env_configured():
        res = generate_answer(
            f"List top 3 most important exam topics for Class {class_grade} "
            f"{subject.replace('_',' ').title()} Maharashtra Board board exam in one sentence each.",
            language, chat_mode=True
        )
        llm_tip = res.get("answer", "")

    return {
        "subject": subject,
        "class_grade": class_grade,
        "important_questions": all_imp,
        "ai_prediction": llm_tip,
        "note": "These questions appear frequently in Maharashtra Board examinations.",
    }


@mentor_router.get("/syllabus")
def get_syllabus(class_grade: str = "8", subject: str = "math"):
    """Return chapter list for a given class and subject."""
    chapters = _get_chapters(class_grade, subject)
    return {
        "class_grade": class_grade,
        "subject": subject,
        "chapters": [{"id": i+1, "name": ch, "unlocked": i < 3} for i, ch in enumerate(chapters)],
        "total": len(chapters),
        "board": "Maharashtra State Board",
    }


@mentor_router.get("/health")
def mentor_health():
    return {"status": "ok", "llm_configured": llm_env_configured(),
            "subjects": list(SYLLABUS.keys()), "classes": list(range(1, 13))}
