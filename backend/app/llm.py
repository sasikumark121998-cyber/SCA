import os
import time
import requests
from dotenv import load_dotenv

from app.prompt import SYSTEM_PROMPT, DIAGNOSIS_PROMPT

load_dotenv()

GROQ_API_KEY = os.getenv("GROQ_API_KEY")
API_URL = "https://api.groq.com/openai/v1/chat/completions"

headers = {
    "Authorization": f"Bearer {GROQ_API_KEY}",
    "Content-Type": "application/json"
}

MAX_RETRIES = 3


def generate_answer(context: str, symptoms: str, history: str = ""):
    """
    Generate the final diagnosis using Llama-3.3-70B (via Groq),
    grounded in the retrieved context. Uses the shared SYSTEM_PROMPT
    and DIAGNOSIS_PROMPT templates from app/prompt.py.
    """

    prompt = DIAGNOSIS_PROMPT.format(
        context=context,
        symptoms=symptoms,
        history=history if history else "Not provided"
    )

    payload = {
        "model": "llama-3.3-70b-versatile",
        "messages": [
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": prompt}
        ],
        "temperature": 0.2,
        "max_tokens": 600
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
                print(f"[LLM Rate Limit] Waiting {wait_time}s before retry ({attempt + 1}/{MAX_RETRIES})...")
                time.sleep(wait_time)
                continue

            response.raise_for_status()

            result = response.json()
            message = result["choices"][0]["message"]
            answer = message.get("content", "").strip()

            if not answer:
                return "I don't have enough information."

            return answer

        except Exception as e:
            print(f"[LLM Error] {e}")
            return "I don't have enough information."

    print("[LLM Warning] Max retries reached.")
    return "I don't have enough information."


if __name__ == "__main__":
    context = """
Chest pain may occur because of heart disease.
Common symptoms include shortness of breath,
fatigue and dizziness.
"""
    symptoms = "Chest pain, shortness of breath"
    history = "No prior conditions reported"

    answer = generate_answer(context, symptoms, history)
    print("\nFinal Answer:\n")
    print(answer)