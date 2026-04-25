# backend/app.py
import os
from typing import List, Dict, Any
from fastapi import FastAPI, Body
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

# Import your existing logic
from utils.parser import parse_job_description
from utils.matcher import load_candidates, compute_match_score
from utils.conversation import generate_chat_fallback as generate_chat
from utils.scorer import compute_interest_score, compute_final_score


app = FastAPI(
    title="AI Talent Scouting Agent (API)",
    description="JSON API for Talent Scouting Agent.",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/match")
async def match_candidates(jd: str = Body(..., embed=True)):
    """Parse JD and return ranked candidates as JSON."""
    try:
        # Use your existing logic
        jd_data = parse_job_description(jd.strip())
        candidates = load_candidates()
        scored = []

        for cand in candidates:
            match_data = compute_match_score(
                jd_skills=jd_data["skills"],
                jd_experience=jd_data["experience"],
                jd_pref=jd_data["preferred_job_type"],
                candidate=cand,
            )
            match_score = match_data["match_score"]

            chat = generate_chat(
                jd_role=jd_data["role"],
                jd_location=jd_data["location"],
                jd_pref=jd_data["preferred_job_type"],
                candidate_summary=cand["summary"],
            )

            interest_score = compute_interest_score(
                chat=chat,
                candidate_location=cand["location"],
                jd_location=jd_data["location"],
            )

            final_score = compute_final_score(match_score, interest_score)

            scored.append(
                {
                    "name": cand["name"],
                    "experience": cand["experience"],
                    "location": cand["location"],
                    "preferred_job_type": cand["preferred_job_type"],
                    "summary": cand["summary"],
                    "match_score": match_score,
                    "interest_score": interest_score,
                    "final_score": round(final_score, 1),
                    "match_explanation": match_data["explanation"],
                    "chat": chat,
                }
            )

        ranked = sorted(scored, key=lambda x: x["final_score"], reverse=True)

        return JSONResponse(
            content={
                "jd": jd_data,
                "candidates": ranked,
            }
        )

    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)