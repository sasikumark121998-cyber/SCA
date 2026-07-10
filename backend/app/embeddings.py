import os
import json
import pickle
import re

from pypdf import PdfReader
from sentence_transformers import SentenceTransformer

# Load embedding model
embedding_model = SentenceTransformer("BAAI/bge-small-en-v1.5")


def read_pdf(file_path):
    """
    Read a PDF and return its text.
    """
    reader = PdfReader(file_path)
    text = ""
    for page in reader.pages:
        page_text = page.extract_text()
        if page_text:
            text += page_text + "\n"
    return text


def split_into_sentences(text):
    """
    Basic sentence splitter. Splits on '.', '!', '?' followed by
    whitespace, while avoiding common abbreviation false-splits
    (e.g. "Dr.", "e.g.", "Fig.").
    """
    text = re.sub(r"\s+", " ", text).strip()

    # Protect common abbreviations from being treated as sentence ends
    protected = re.sub(
        r"\b(Dr|Mr|Mrs|Ms|Prof|Fig|vs|e\.g|i\.e|etc)\.",
        lambda m: m.group(0).replace(".", "<DOT>"),
        text
    )

    sentences = re.split(r"(?<=[.!?])\s+", protected)

    # Restore protected dots
    sentences = [s.replace("<DOT>", ".") for s in sentences if s.strip()]

    return sentences


def chunk_text(text, chunk_size=1000, overlap_sentences=2):
    """
    Sentence-aware chunking.

    Instead of cutting text at a fixed character offset (which can slice
    a sentence in half mid-word), we group whole sentences together
    until we approach `chunk_size` characters. A small number of
    trailing sentences from each chunk are carried over into the next
    chunk as overlap, so context isn't lost at chunk boundaries.
    """
    sentences = split_into_sentences(text)

    if not sentences:
        return []

    chunks = []
    current = []
    current_len = 0

    for sentence in sentences:
        sentence_len = len(sentence) + 1  # +1 for the space we'll join with

        if current_len + sentence_len > chunk_size and current:
            chunks.append(" ".join(current))

            # Carry the last `overlap_sentences` sentences into the next chunk
            overlap = current[-overlap_sentences:] if overlap_sentences > 0 else []
            current = list(overlap)
            current_len = sum(len(s) + 1 for s in current)

        current.append(sentence)
        current_len += sentence_len

    if current:
        chunks.append(" ".join(current))

    return chunks


def process_documents():

    documents_folder = "data/documents"

    all_chunks = []
    all_metadata = []

    for file_name in os.listdir(documents_folder):

        if not file_name.lower().endswith(".pdf"):
            continue

        pdf_path = os.path.join(documents_folder, file_name)

        print(f"Reading : {file_name}")

        text = read_pdf(pdf_path)

        chunks = chunk_text(text)

        for index, chunk in enumerate(chunks):

            # Skip near-empty/junk chunks (e.g. page headers, stray numbers)
            if len(chunk.strip()) < 40:
                continue

            all_chunks.append(chunk)

            all_metadata.append(
                {
                    "document": file_name,
                    "chunk_number": index + 1
                }
            )

    print(f"Total Chunks : {len(all_chunks)}")

    embeddings = embedding_model.encode(
        all_chunks,
        show_progress_bar=True
    )

    os.makedirs("data/embeddings", exist_ok=True)

    with open("data/embeddings/chunks.pkl", "wb") as f:
        pickle.dump(all_chunks, f)

    with open("data/embeddings/embeddings.pkl", "wb") as f:
        pickle.dump(embeddings, f)

    with open("data/embeddings/metadata.json", "w", encoding="utf-8") as f:
        json.dump(all_metadata, f, indent=4)

    print("Embeddings Created Successfully")


if __name__ == "__main__":
    process_documents()