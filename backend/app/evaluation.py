"""
Evaluation Script — Standard RAG vs HyDE-RAG Comparison

Per the project proposal, this script evaluates retrieval and answer
quality using: NDCG@10, ROUGE-L, Exact Match, and a basic Faithfulness
check (NLI-style keyword/context overlap), comparing:

    - Standard RAG : raw query embedded directly for retrieval
    - HyDE RAG     : hypothetical clinical passage embedded for retrieval

Rows where the LLM API failed (e.g. HF credits exhausted, returning a
generic fallback message for both pipelines) are flagged as invalid and
excluded from the averaged summary, since they don't reflect real
HyDE vs Standard RAG performance — they just show identical fallback
behavior on both sides.

Run:
    python -m app.evaluation

Outputs:
    data/evaluation/comparison_results.csv   -> per-query scores (all rows, incl. invalid)
    data/evaluation/summary_report.csv       -> averaged metrics table (valid rows only)
"""

import os
import csv
import math
import time

from app.retrieval import retrieve_context
from app.hyde import generate_hypothetical_answer
from app.llm import generate_answer

try:
    from rouge_score import rouge_scorer
    ROUGE_AVAILABLE = True
except ImportError:
    ROUGE_AVAILABLE = False
    print("[Warning] rouge_score not installed. Run: pip install rouge_score --break-system-packages")


FALLBACK_MESSAGE = "I don't have enough information."


# ============================================================
# Test Dataset
# ============================================================

TEST_CASES = [
    {
        "symptoms": "fever, persistent cough for 3 weeks, night sweats, weight loss",
        "history": "no prior conditions reported",
        "expected_document": "Tuberculosis.pdf",
        "expected_disease": "Tuberculosis",
        "reference_answer": "The patient likely has tuberculosis, given chronic cough, night sweats, fever, and weight loss."
    },
    {
        "symptoms": "high fever, severe headache, joint pain, rash",
        "history": "recent travel to a tropical region",
        "expected_document": "Dengue.pdf",
        "expected_disease": "Dengue",
        "reference_answer": "Symptoms are consistent with dengue fever, given high fever, joint pain, and rash after tropical travel."
    },
    {
        "symptoms": "shortness of breath, wheezing, chest tightness",
        "history": "history of childhood allergies",
        "expected_document": "Asthma.pdf",
        "expected_disease": "Asthma",
        "reference_answer": "The presentation of wheezing and chest tightness with an allergy history suggests asthma."
    },
    {
        "symptoms": "chronic cough with sputum, breathlessness on exertion",
        "history": "long-term smoker",
        "expected_document": "COPD.pdf",
        "expected_disease": "COPD",
        "reference_answer": "Chronic cough and breathlessness in a long-term smoker suggest COPD."
    },
    {
        "symptoms": "excessive thirst, frequent urination, unexplained weight loss",
        "history": "family history of diabetes",
        "expected_document": "Diabetes.pdf",
        "expected_disease": "Diabetes",
        "reference_answer": "Excessive thirst, frequent urination and weight loss with a family history suggest diabetes mellitus."
    },
    {
        "symptoms": "swelling in legs, shortness of breath when lying down, fatigue",
        "history": "known hypertension",
        "expected_document": "Heart Failure.pdf",
        "expected_disease": "Heart Failure",
        "reference_answer": "Leg swelling, orthopnea, and fatigue in a hypertensive patient suggest heart failure."
    },
    {
        "symptoms": "sudden weakness on one side of the body, slurred speech",
        "history": "high blood pressure, no medication",
        "expected_document": "Stroke.pdf",
        "expected_disease": "Stroke",
        "reference_answer": "Sudden one-sided weakness and slurred speech indicate a possible stroke."
    },
    {
        "symptoms": "high fever with chills, cyclical fever pattern, fatigue",
        "history": "recent travel to a malaria-endemic region",
        "expected_document": "Malaria.pdf",
        "expected_disease": "Malaria",
        "reference_answer": "Cyclical fever with chills after travel to an endemic region suggests malaria."
    },
    {
        "symptoms": "dry cough, fever, loss of taste and smell",
        "history": "close contact with a confirmed case",
        "expected_document": "COVID-19.pdf",
        "expected_disease": "COVID-19",
        "reference_answer": "Loss of taste and smell with fever and cough after known exposure suggests COVID-19."
    },
    {
        "symptoms": "recurrent infections, unexplained weight loss, persistent fatigue",
        "history": "unprotected sexual contact reported",
        "expected_document": "HIV.pdf",
        "expected_disease": "HIV",
        "reference_answer": "Recurrent infections and weight loss with risk exposure suggest HIV infection."
    },
]


# ============================================================
# Standard RAG (baseline) — embeds the raw query directly,
# skipping the HyDE step, for comparison purposes only.
# ============================================================

def standard_rag_retrieve(symptoms, history):
    raw_query = f"Symptoms:\n{symptoms}\n\nMedical History:\n{history}"
    return retrieve_context(raw_query)


def hyde_rag_retrieve(symptoms, history):
    patient_text = f"Symptoms:\n{symptoms}\n\nMedical History:\n{history}"
    hypo_doc = generate_hypothetical_answer(patient_text)
    return retrieve_context(hypo_doc)


# ============================================================
# Metrics
# ============================================================

def ndcg_at_k(retrieved_docs, expected_doc, k=10):
    """
    Binary relevance NDCG@k: relevance = 1 if the chunk's source
    document matches expected_doc, else 0.
    """
    retrieved_docs = retrieved_docs[:k]

    dcg = 0.0
    for i, doc in enumerate(retrieved_docs):
        relevance = 1 if doc == expected_doc else 0
        dcg += relevance / math.log2(i + 2)

    num_relevant = sum(1 for doc in retrieved_docs if doc == expected_doc)
    idcg = sum(1 / math.log2(i + 2) for i in range(num_relevant))

    if idcg == 0:
        return 0.0

    return dcg / idcg


def hit_rate(retrieved_docs, expected_doc):
    """1 if expected_doc appears anywhere in retrieved results, else 0."""
    return 1 if expected_doc in retrieved_docs else 0


def rouge_l(reference, hypothesis):
    if not ROUGE_AVAILABLE:
        return None
    scorer = rouge_scorer.RougeScorer(["rougeL"], use_stemmer=True)
    scores = scorer.score(reference, hypothesis)
    return scores["rougeL"].fmeasure


def exact_match(expected_disease, generated_answer):
    """
    Loose exact-match: checks if the expected disease name appears
    (case-insensitive) anywhere in the generated diagnosis text.
    """
    return 1 if expected_disease.lower() in generated_answer.lower() else 0


def faithfulness_check(generated_answer, retrieved_chunks):
    """
    Lightweight faithfulness proxy (not a full RAGAS/NLI pipeline):
    checks what fraction of the retrieved context's key terms are
    reflected in the generated answer. Higher = answer is more
    grounded in retrieved evidence rather than invented.
    """
    context_text = " ".join(chunk["content"] for chunk in retrieved_chunks).lower()
    context_words = set(w for w in context_text.split() if len(w) > 5)

    if not context_words:
        return 0.0

    answer_lower = generated_answer.lower()
    matched = sum(1 for w in context_words if w in answer_lower)

    return matched / len(context_words)


# ============================================================
# Main Evaluation Loop
# ============================================================

def run_evaluation():

    os.makedirs("data/evaluation", exist_ok=True)

    per_query_results = []
    skipped_count = 0

    for i, case in enumerate(TEST_CASES, start=1):

        print(f"\n[{i}/{len(TEST_CASES)}] Evaluating: {case['expected_disease']}")

        # --- Standard RAG ---
        std_chunks = standard_rag_retrieve(case["symptoms"], case["history"])
        std_docs = [c["document"] for c in std_chunks]
        std_context = "\n\n".join(c["content"] for c in std_chunks)
        std_answer = generate_answer(std_context, case["symptoms"], case["history"])

        # --- HyDE RAG ---
        hyde_chunks = hyde_rag_retrieve(case["symptoms"], case["history"])
        hyde_docs = [c["document"] for c in hyde_chunks]
        hyde_context = "\n\n".join(c["content"] for c in hyde_chunks)
        hyde_answer = generate_answer(hyde_context, case["symptoms"], case["history"])

        # A row is INVALID if the LLM call failed (API error / credits
        # exhausted) for either pipeline, since both fall back to the
        # same generic message and no longer reflect real HyDE vs
        # Standard RAG performance.
        is_valid = (
            std_answer.strip() != FALLBACK_MESSAGE
            and hyde_answer.strip() != FALLBACK_MESSAGE
        )

        if not is_valid:
            skipped_count += 1

        row = {
            "disease": case["expected_disease"],
            "expected_document": case["expected_document"],
            "valid": is_valid,

            "std_ndcg@10": round(ndcg_at_k(std_docs, case["expected_document"]), 4),
            "hyde_ndcg@10": round(ndcg_at_k(hyde_docs, case["expected_document"]), 4),

            "std_hit_rate": hit_rate(std_docs, case["expected_document"]),
            "hyde_hit_rate": hit_rate(hyde_docs, case["expected_document"]),

            "std_exact_match": exact_match(case["expected_disease"], std_answer),
            "hyde_exact_match": exact_match(case["expected_disease"], hyde_answer),

            "std_rouge_l": round(rouge_l(case["reference_answer"], std_answer) or 0, 4),
            "hyde_rouge_l": round(rouge_l(case["reference_answer"], hyde_answer) or 0, 4),

            "std_faithfulness": round(faithfulness_check(std_answer, std_chunks), 4),
            "hyde_faithfulness": round(faithfulness_check(hyde_answer, hyde_chunks), 4),
        }

        per_query_results.append(row)
        # Small delay between test cases to stay within Groq's free-tier rate limits
        time.sleep(4)

        status = "" if is_valid else "  [SKIPPED FROM SUMMARY - API FAILURE]"
        print(f"  Standard RAG -> NDCG@10: {row['std_ndcg@10']}, Hit: {row['std_hit_rate']}, EM: {row['std_exact_match']}{status}")
        print(f"  HyDE RAG     -> NDCG@10: {row['hyde_ndcg@10']}, Hit: {row['hyde_hit_rate']}, EM: {row['hyde_exact_match']}{status}")

    # --- Write per-query CSV (includes ALL rows, valid + invalid, for transparency) ---
    per_query_path = "data/evaluation/comparison_results.csv"
    with open(per_query_path, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=list(per_query_results[0].keys()))
        writer.writeheader()
        writer.writerows(per_query_results)

    print(f"\nPer-query results saved to: {per_query_path}")

    # --- Compute averaged summary using ONLY valid rows ---
    valid_rows = [r for r in per_query_results if r["valid"]]

    if not valid_rows:
        print("\n[ERROR] No valid rows to summarize — all queries hit API failures.")
        print("Check your HF_API_KEY / credits and re-run once resolved.")
        return

    def avg(key):
        return round(sum(r[key] for r in valid_rows) / len(valid_rows), 4)

    summary = {
        "metric": [
            "NDCG@10", "Hit Rate", "Exact Match", "ROUGE-L", "Faithfulness"
        ],
        "standard_rag": [
            avg("std_ndcg@10"), avg("std_hit_rate"), avg("std_exact_match"),
            avg("std_rouge_l"), avg("std_faithfulness")
        ],
        "hyde_rag": [
            avg("hyde_ndcg@10"), avg("hyde_hit_rate"), avg("hyde_exact_match"),
            avg("hyde_rouge_l"), avg("hyde_faithfulness")
        ],
    }

    summary_path = "data/evaluation/summary_report.csv"
    with open(summary_path, "w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow([f"Based on {len(valid_rows)}/{len(TEST_CASES)} valid queries ({skipped_count} skipped due to API failures)"])
        writer.writerow(["Metric", "Standard RAG", "HyDE RAG", "Improvement"])
        for i in range(len(summary["metric"])):
            std_val = summary["standard_rag"][i]
            hyde_val = summary["hyde_rag"][i]
            improvement = round(hyde_val - std_val, 4)
            writer.writerow([summary["metric"][i], std_val, hyde_val, improvement])

    print(f"Summary report saved to: {summary_path}")

    print(f"\n========== FINAL COMPARISON (based on {len(valid_rows)}/{len(TEST_CASES)} valid queries) ==========")
    if skipped_count > 0:
        print(f"NOTE: {skipped_count} quer{'y' if skipped_count == 1 else 'ies'} skipped due to API failures (e.g. HF credits exhausted).\n")

    print(f"{'Metric':<15}{'Standard RAG':<15}{'HyDE RAG':<15}{'Improvement'}")
    for i in range(len(summary["metric"])):
        std_val = summary["standard_rag"][i]
        hyde_val = summary["hyde_rag"][i]
        improvement = round(hyde_val - std_val, 4)
        print(f"{summary['metric'][i]:<15}{std_val:<15}{hyde_val:<15}{improvement}")


if __name__ == "__main__":
    run_evaluation()