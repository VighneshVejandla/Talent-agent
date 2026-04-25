import json
from typing import List, Dict, Any
from pathlib import Path


def load_candidates() -> List[Dict[str, Any]]:
    candidates_path = Path(__file__).parent.parent / "data" / "candidates.json"
    with open(candidates_path, "r", encoding="utf-8") as f:
        data = json.load(f)
    return data


def compute_match_score(
    jd_skills: List[str], jd_experience: int, jd_pref: str, candidate: Dict[str, Any]
) -> Dict[str, Any]:
    """Compute match score and explanation for one candidate."""
    # Normalize to lowercase
    jd_skills_lower = [s.lower() for s in jd_skills]
    cand_skills_lower = [s.lower() for s in candidate["skills"]]

    # Skill overlap
    matched_skills = set(jd_skills_lower) & set(cand_skills_lower)
    missing_skills = set(jd_skills_lower) - set(cand_skills_lower)
    skill_score = 0.0
    if len(jd_skills) > 0:
        skill_score = len(matched_skills) / len(jd_skills)
    # 50% weight
    skill_contrib = int(skill_score * 50)

    # Experience match (30%)
    exp_diff = abs(jd_experience - candidate["experience"])
    # e.g., ideal: same or 1‑2 more years; otherwise penalty
    exp_score = max(0, 1 - exp_diff / 3.0)
    exp_contrib = int(exp_score * 30)

    # Preference alignment (20%)
    pref_bonus = 0
    if candidate["preferred_job_type"] == jd_pref:
        pref_bonus = 0.2
    elif jd_pref == "remote" and candidate["preferred_job_type"] in ["remote", "hybrid"]:
        pref_bonus = 0.1
    elif jd_pref == "onsite" and candidate["preferred_job_type"] in ["onsite", "hybrid"]:
        pref_bonus = 0.1
    pref_contrib = int(pref_bonus * 100 * 0.2)

    total_match = skill_contrib + exp_contrib + pref_contrib
    total_match = max(0, min(total_match, 100))

    return {
        "match_score": total_match,
        "explanation": {
            "matched_skills": list(matched_skills),
            "missing_skills": list(missing_skills),
            "experience_compared": f"JD: {jd_experience} yrs, candidate: {candidate['experience']} yrs",
            "pref_alignment": f"JD pref: {jd_pref}, candidate pref: {candidate['preferred_job_type']}",
        },
    }