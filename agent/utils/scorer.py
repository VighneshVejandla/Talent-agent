import re
from typing import List, Dict, Any


def analyze_sentiment(text: str) -> float:
    """Simple sentiment scorer from text (0 = negative, 1 = positive)."""
    text = text.lower()
    positive_words = [
        "yes",
        "sure",
        "interested",
        "love",
        "excited",
        "open",
        "okay",
        "cool",
        "great",
        "perfect",
    ]
    negative_words = [
        "no",
        "not",
        "don't",
        "cannot",
        "na",
        "never",
        "not really",
        "not interested",
    ]

    pos_count = sum(1 for w in positive_words if w in text)
    neg_count = sum(1 for w in negative_words if w in text)

    if pos_count == 0 and neg_count == 0:
        return 0.5  # neutral

    if pos_count > neg_count:
        return 0.7 + 0.3 * (pos_count / (pos_count + neg_count))
    return 0.3 * (neg_count / (pos_count + neg_count))


def extract_willingness_to_switch(text: str) -> float:
    """Score willingess to switch (0 = no, 1 = yes)."""
    text = text.lower()
    strong_yes = [
        "yes, i",
        "definitely",
        "absolutely",
        "love to",
        "excited to",
        "interested",
        "open",
        "sure",
    ]
    strong_no = [
        "no ",
        "not really",
        "not interested",
        "i don't",
        "i am not",
        "nope",
        "not looking",
        "happy at",
    ]

    strong_yes_count = sum(1 for p in strong_yes if p in text)
    strong_no_count = sum(1 for p in strong_no if p in text)

    if strong_yes_count > 0:
        return 1.0
    if strong_no_count > 0:
        return 0.0
    return 0.5  # neutral


def is_location_match(candidate_location: str, jd_location: str) -> bool:
    """Rough location match (exact match or very close major cities)."""
    cand = candidate_location.lower()
    jd = jd_location.lower()
    if cand == jd:
        return True
    near_cities = {
        "hyderabad": ["hyderabad"],
        "bengaluru": ["bengaluru", "bangalore"],
        "mumbai": ["mumbai", "bombay"],
        "delhi": ["delhi", "ncr", "gurugram", "noida"],
        "pune": ["pune"],
        "chennai": ["chennai", "madras"],
    }
    for k, variants in near_cities.items():
        if k in cand or k in jd:
            if cand in variants or jd in variants:
                return True
    return False


def compute_interest_score(
    chat: List[Dict[str, str]],
    candidate_location: str,
    jd_location: str,
) -> int:
    """
    Compute Interest Score (0–100) from:
    - sentiment of candidate reply
    - willingness to switch
    - location match
    """
    # Only consider candidate replies
    cand_texts = [
        turn["text"]
        for turn in chat
        if turn["speaker"].lower() == "candidate"
    ]
    if not cand_texts:
        return 50  # neutral

    text = " ".join(cand_texts)

    sentiment_score = analyze_sentiment(text)
    switch_score = extract_willingness_to_switch(text)
    loc_match = 1 if is_location_match(candidate_location, jd_location) else 0

    # Combine into 0–1 value
    raw_score = 0.4 * sentiment_score + 0.4 * switch_score + 0.2 * loc_match
    # Scale to 0–100, clamp
    interest = int(round(raw_score * 100))
    return max(0, min(interest, 100))


def compute_final_score(match_score: int, interest_score: int) -> float:
    """
    Final Score = 0.6 * Match + 0.4 * Interest
    Returns float so UI can show decimals.
    """
    return 0.6 * match_score + 0.4 * interest_score