import os
import json
import pickle

import faiss
import numpy as np

from sentence_transformers import SentenceTransformer

embedding_model = SentenceTransformer("BAAI/bge-small-en-v1.5")

# L2 distance threshold — chunks farther than this are considered
# not relevant enough and are dropped rather than force-included.
# Tune this based on your embedding model / corpus (lower = stricter).
MAX_DISTANCE = 1.2


def build_faiss_index():

    with open("data/embeddings/embeddings.pkl", "rb") as f:
        embeddings = pickle.load(f)

    embeddings = np.array(embeddings, dtype="float32")

    dimension = embeddings.shape[1]

    index = faiss.IndexFlatL2(dimension)
    index.add(embeddings)

    os.makedirs("data/faiss_index", exist_ok=True)

    faiss.write_index(index, "data/faiss_index/index.faiss")

    print("FAISS Index Created Successfully")


def retrieve_context(query, top_k=8, max_results=5):
    """
    Retrieve relevant chunks for a query.

    top_k: how many candidates to pull from FAISS before filtering.
    max_results: max number of chunks to actually return after filtering
                 by MAX_DISTANCE, so irrelevant matches aren't force-fed
                 into the LLM's context just to fill a fixed slot count.
    """

    index = faiss.read_index("data/faiss_index/index.faiss")

    with open("data/embeddings/chunks.pkl", "rb") as f:
        chunks = pickle.load(f)

    with open("data/embeddings/metadata.json", "r", encoding="utf-8") as f:
        metadata = json.load(f)

    query_embedding = embedding_model.encode([query])
    query_embedding = np.array(query_embedding, dtype="float32")

    distances, indices = index.search(query_embedding, top_k)

    results = []

    for dist, idx in zip(distances[0], indices[0]):

        if idx == -1:
            continue

        if dist > MAX_DISTANCE:
            continue

        results.append(
            {
                "document": metadata[idx]["document"],
                "chunk_number": metadata[idx]["chunk_number"],
                "content": chunks[idx],
                "distance": float(dist)
            }
        )

        if len(results) >= max_results:
            break

    # Fallback: if the threshold filtered out everything, return the
    # single closest match anyway so the LLM still has some context
    # rather than none at all.
    if not results and len(indices[0]) > 0 and indices[0][0] != -1:
        idx = indices[0][0]
        results.append(
            {
                "document": metadata[idx]["document"],
                "chunk_number": metadata[idx]["chunk_number"],
                "content": chunks[idx],
                "distance": float(distances[0][0])
            }
        )

    return results


if __name__ == "__main__":

    build_faiss_index()

    print()
    question = input("Enter Symptoms : ")
    response = retrieve_context(question)

    print("\n========== Retrieved Chunks ==========\n")
    for item in response:
        print(f"Document : {item['document']}")
        print(f"Chunk : {item['chunk_number']}")
        print(f"Distance : {item['distance']:.4f}")
        print(item["content"][:500])
        print("-" * 80)