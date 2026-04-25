import re
import os
from typing import Dict, List, Optional

try:
    import openai
except ImportError:
    openai = None


def simple_parse_jd(jd: str) -> Dict[str, object]:
    """Fallback rule‑based parser for job description."""
    # Lowercase for easier matching
    text = jd.lower()

    # Extract role (heuristic)
    role = "Software Engineer"
    role_patterns = [
        r"software\s+[a-z\s]+engineer",
        r"[a-z\s]+developer",
        r"[a-z\s]+programmer",
        r"[a-z\s]+architect",
    ]
    for pat in role_patterns:
        m = re.search(pat, text, re.IGNORECASE)
        if m:
            role = m.group()
            break

    # Extract years of experience
    exp_m = re.search(r"(\d+)\s*-?\s*(years?|yrs?)", text)
    experience = int(exp_m.group(1)) if exp_m else 3

    # Extract skills (naive comma/dot‑separated list or bullet‑style)
    skills = []
    bullets = re.findall(r"[-*•]\s*([a-zA-Z][^.,\n]*)", text)
    bullet_text = " ".join(bullets).lower()
    tech_words = [
        "python",
        "java",
        "javascript",
        "node",
        "react",
        "django",
        "spring",
        "aws",
        "docker",
        "kubernetes",
        "sql",
        "postgresql",
        "mysql",
        "redis",
        "kafka",
        "rest",
        "graphql",
        "typescript",
        "c++",
        "go",
        "ruby",
    ]
    skills = list(set(s for s in tech_words if s in bullet_text))

    # Extract location / preferences
    loc = "India"
    loc_m = re.search(r"location:\s*([^\n]+)", text, re.IGNORECASE)
    if loc_m:
        loc = loc_m.group(1).strip()
    else:
        for place in ["bengaluru", "hyderabad", "mumbai", "delhi", "pune", "chennai"]:
            if place in text:
                loc = place.title()
                break

    pref = "onsite"
    if "remote" in text:
        pref = "remote"
    elif "hybrid" in text:
        pref = "hybrid"

    return {
        "role": role.title(),
        "skills": skills,
        "experience": experience,
        "location": loc,
        "preferred_job_type": pref,
    }


def parse_jd_with_llm(jd: str, api_key: str) -> Dict[str, object]:
    """Use OpenAI to parse job description."""
    if openai is None:
        return simple_parse_jd(jd)

    client = openai.OpenAI(api_key=api_key)

    prompt = """
You are a structured job description parser.
Extract the following fields from the job description:

- role: the main job title (e.g., "Senior Backend Engineer")
- skills: list of required technical skills (strings)
- experience: minimum years of experience (integer)
- location: office location or 'remote'/'hybrid'
- preferred_job_type: one of 'onsite', 'remote', 'hybrid'

Output ONLY as a JSON object with these keys and no extra text.

Job description:
{}

Output:""".format(jd.strip())

    try:
        resp = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.0,
        )
        content = resp.choices[0].message.content.strip()
        import json
        data = json.loads(content)
        # Normalize (defense)
        if not isinstance(data.get("skills"), list):
            data["skills"] = []
        if not isinstance(data.get("experience"), int):
            data["experience"] = 3
        if not isinstance(data.get("role"), str):
            data["role"] = "Unknown Role"
        return data
    except Exception as e:
        print("LLM parse failed:", e)
        return simple_parse_jd(jd)


def parse_job_description(jd: str, api_key: Optional[str] = None) -> Dict[str, object]:
    """Main entrypoint: parse JD with LLM if key exists; fallback to rules."""
    if api_key and openai:
        return parse_jd_with_llm(jd, api_key)
    return simple_parse_jd(jd)