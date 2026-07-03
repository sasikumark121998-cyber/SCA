"""Prompt templates placeholder."""
def diagnosis_prompt(history: str, question: str) -> str:
    return f"Context: {history}\nQuestion: {question}"
