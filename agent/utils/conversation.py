# utils/conversation.py

import openai
import os
from typing import List, Optional, Dict


def generate_chat_fallback(
    jd_role: str,
    jd_location: str,
    jd_pref: str,
    candidate_summary: str,
) -> List[Dict[str, str]]:
    """Rule‑based fallback chat between recruiter and candidate."""
    first_name = candidate_summary.split()[0] if candidate_summary.strip() else "Candidate"
    return [
        {
            "speaker": "Recruiter",
            "text": f"Hi {first_name}, are you open to a {jd_role} opportunity in {jd_location} ({jd_pref})?",
        },
        {
            "speaker": "Candidate",
            "text": "I'm generally open to new opportunities, especially in backend roles and remote work.",
        },
        {
            "speaker": "Recruiter",
            "text": "That's great; we'll contact you with the next steps if there's a match.",
        },
    ]


def generate_chat_llm(
    jd_role: str,
    jd_location: str,
    jd_pref: str,
    candidate_summary: str,
    api_key: Optional[str],
) -> List[Dict[str, str]]:
    """Generate recruiter–candidate chat using OpenAI."""
    if api_key is None or openai is None:
        return generate_chat_fallback(jd_role, jd_location, jd_pref, candidate_summary)

    client = openai.OpenAI(api_key=api_key)

    prompt = """
You are a recruiter chatting with a candidate about a job. The job is for a {} role in {}, type: {}.
Candidate profile: {}

Simulate a short 3‑turn conversation:
- Turn 1: Recruiter asks if the candidate is interested.
- Turn 2: Candidate responds.
- Turn 3: Recruiter follows up briefly.

Output the conversation as a list of dict objects:
[
  {{"speaker": "Recruiter", "text": "..."}},
  {{"speaker": "Candidate", "text": "..."}},
  {{"speaker": "Recruiter", "text": "..."}}
]

No extra text.""".format(
        jd_role, jd_location, jd_pref, candidate_summary
    )

    try:
        resp = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.7,
        )
        content = resp.choices[0].message.content.strip()
        import json
        chat = json.loads(content)
        return chat
    except Exception as e:
        print("LLM chat failed:", e)
        return generate_chat_fallback(jd_role, jd_location, jd_pref, candidate_summary)