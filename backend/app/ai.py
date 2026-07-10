from app.hyde import generate_hypothetical_answer
from app.retrieval import retrieve_context
from app.llm import generate_answer


def ask_ai(symptoms: str, medical_history: str = ""):

    patient_text = f"""
Symptoms:
{symptoms}

Medical History:
{medical_history}
"""

    # Step 1: HyDE - generate a hypothetical clinical passage.
    # Used ONLY for retrieval, never shown to the user as the final answer.
    hypothetical_doc = generate_hypothetical_answer(patient_text)

    # Step 2: Retrieve relevant chunks from FAISS using the
    # hypothetical passage's embedding (not the raw patient text)
    retrieved_chunks = retrieve_context(hypothetical_doc)

    # Step 3: Combine chunks into one context
    context = "\n\n".join(
        chunk["content"] for chunk in retrieved_chunks
    )

    # Step 4: Generate the final answer using the ORIGINAL symptoms +
    # history (the real patient input), grounded in retrieved evidence
    answer = generate_answer(
        context=context,
        symptoms=symptoms,
        history=medical_history
    )

    return {
        "symptoms": symptoms,
        "medical_history": medical_history,
        "hypothetical_document": hypothetical_doc,
        "retrieved_chunks": retrieved_chunks,
        "answer": answer
    }


if __name__ == "__main__":
    symptoms = input("Enter Symptoms: ")
    history = input("Enter Medical History (or leave blank): ")

    result = ask_ai(symptoms, history)

    print("\n========== Hypothetical Clinical Passage (HyDE) ==========\n")
    print(result["hypothetical_document"])

    print("\n========== Retrieved Chunks ==========\n")
    for chunk in result["retrieved_chunks"]:
        print(f"Document : {chunk['document']}")
        print(f"Chunk : {chunk['chunk_number']}")
        print(chunk["content"][:300])
        print("-" * 80)

    print("\n========== AI Answer ==========\n")
    print(result["answer"])
