import os
import time
import requests
from dotenv import load_dotenv

load_dotenv()

GROQ_API_KEY = os.getenv("GROQ_API_KEY")
API_URL = "https://api.groq.com/openai/v1/chat/completions"

headers = {
    "Authorization": f"Bearer {GROQ_API_KEY}",
    "Content-Type": "application/json"
}

MAX_RETRIES = 3


def generate_hypothetical_answer(question: str) -> str:
    """
    HyDE Step.

    Instead of embedding the raw patient query directly, we ask the LLM
    to write a short hypothetical clinical passage that a medical expert
    or textbook might contain, answering the query.

    This hypothetical passage is NOT shown to the user and is NOT the
    final diagnosis — it is only used to generate an embedding that is
    semantically closer to real medical literature than the raw
    natural-language query would be.
    """

    prompt = f"""
You are a medical expert writing a short clinical reference passage.

Given the patient information below, write a concise hypothetical
paragraph (as if taken from a medical textbook or clinical guideline)
that describes the likely condition, relevant clinical findings, and
standard evidence related to this case.

Do NOT address the patient directly. Do NOT ask questions.
Write it the way a textbook or clinical guideline would be written.
Keep it under 120 words.

Patient Information:
{question}

Hypothetical Clinical Passage:
"""

    payload = {
        "model": "llama-3.3-70b-versatile",
        "messages": [
            {
                "role": "system",
                "content": (
                    "You are a medical reference-writing assistant. "
                    "Do not reveal your reasoning. "
                    "Return only the hypothetical passage, nothing else."
                )
            },
            {
                "role": "user",
                "content": prompt
            }
        ],
        "temperature": 0.3,
        "max_tokens": 200
    }

    for attempt in range(MAX_RETRIES):
        try:
            response = requests.post(
                API_URL,
                headers=headers,
                json=payload,
                timeout=60
            )

            if response.status_code == 429:
                wait_time = 10 * (attempt + 1)
                print(f"[HyDE Rate Limit] Waiting {wait_time}s before retry ({attempt + 1}/{MAX_RETRIES})...")
                time.sleep(wait_time)
                continue

            response.raise_for_status()

            result = response.json()
            message = result["choices"][0]["message"]
            hypo_doc = message.get("content", "").strip()

            if not hypo_doc:
                return question

            return hypo_doc

        except Exception as e:
            print(f"[HyDE Warning] Falling back to raw query due to error: {e}")
            return question

    print("[HyDE Warning] Max retries reached. Falling back to raw query.")
    return question


if __name__ == "__main__":
    question = """
Symptoms:
Fever, persistent cough for 3 weeks, night sweats, weight loss

Medical History:
No prior conditions reported
"""
    hypo = generate_hypothetical_answer(question)
    print("\n========== Hypothetical Clinical Passage ==========\n")
    print(hypo)