import logging
import ollama
import chromadb
import os
import fitz
from flask import jsonify


def dividir_en_chunks(text, words_per_segment=500):
    words = text.split()
    # Dividir en segmentos de 500 palabras
    word_segments = []
    for i in range(0, len(words), words_per_segment):
        segment = words[i:i + words_per_segment]
        word_segments.append(' '.join(segment))

    return word_segments
    # Dividir en segmentos de 500 palabras


def leer_pdfs(directorio, chunk_size):
    documentos = []
    for archivo in os.listdir(directorio):
        if archivo.endswith('.pdf'):
            ruta_pdf = os.path.join(directorio, archivo)
            doc = fitz.open(ruta_pdf)
            texto = ""
            for pagina in doc:
                texto += pagina.get_text()
            doc.close()
            # Dividir el texto en chunks y añadirlos a la lista
            documentos.extend(dividir_en_chunks(texto, chunk_size))
    return documentos


def upload():
    try:
        client = chromadb.HttpClient(host="chromadb", port=8000)
        collectiondocs = client.get_or_create_collection(name="docs")
        collectionriesgos = client.get_or_create_collection(name="riesgos")

    except Exception as e:
        logging.error(f"Failed to connect to ChromaDB: {e}")
        return jsonify({"status": 500, "error": str(e)}), 500
    ollamaClient = ollama.Client(host="http://myollama:11434")
    directorio_pdfs = 'media'
    directorio_cases = 'cases'
    documents = leer_pdfs(directorio_pdfs, 500)
    cases = leer_pdfs(directorio_cases, 100)

    riesgos = [
        "If a computer has port 443 open, which is the HTTPS port for accessing web pages, there is a threat of a DoS attack and a risk of loss of data availability.",
        "If a computer has port 23 open, which is the Telnet port, there is a threat of ransomware and a risk of loss of data integrity.",
        "If a computer has port 3389 open, which is used for remotely accessing computers via RDP (Remote Desktop Protocol), there is a threat of a brute-force attack on RDP and a risk of loss of data confidentiality.",
        "If a computer has port 21 open, which is used for transferring files via FTP, there is a threat of a brute-force attack on FTP and a risk of loss of data confidentiality.",
    ]

    for i, d in enumerate(documents):
        try:
            response = ollamaClient.embeddings(
                model="mxbai-embed-large", prompt=d)
            embedding = response["embedding"]
            collectiondocs.add(
                ids=["docs_"+str(i)],
                embeddings=[embedding],
                documents=[d]
            )
        except Exception as ex:
            logging.error(f"Error processing document {i}: {ex}")
            continue  # Skip to the next document

    for i, d in enumerate(cases):
        try:
            response = ollamaClient.embeddings(
                model="mxbai-embed-large", prompt=d)
            embedding = response["embedding"]
            collectiondocs.add(
                ids=["docs_"+str(i)],
                embeddings=[embedding],
                documents=[d]
            )
        except Exception as ex:
            logging.error(f"Error processing document {i}: {ex}")
            continue  # Skip to the next document
    for i, d in enumerate(riesgos):
        try:
            response = ollamaClient.embeddings(
                model="mxbai-embed-large", prompt=d)
            embedding = response["embedding"]
            collectionriesgos.add(
                ids=["riesgos_"+str(i)],
                embeddings=[embedding],
                documents=[d]
            )
        except Exception as ex:
            logging.error(f"Error processing document {i}: {ex}")
            continue  # Skip to the next document
    return


def ask_docs(prompt):
    try:
        client = chromadb.HttpClient(host="chromadb", port=8000)
        collection = client.get_or_create_collection(name="docs")
    except Exception as e:
        logging.error(f"Failed to connect to ChromaDB: {e}")
        return jsonify({"status": 500, "error": str(e)}), 500
    ollamaClient = ollama.Client(host="http://myollama:11434")
    # Generate an embedding for the prompt and retrieve the most relevant doc
    response = ollamaClient.embeddings(
        prompt=prompt,
        model="mxbai-embed-large"
    )
    results = collection.query(
        query_embeddings=[response["embedding"]],
        n_results=4
    )
    data = results['documents'][0]

# Generate a response combining the prompt and data we retrieved in step 2
    output = ollamaClient.generate(
        model="llama2",
        prompt=f"""
        Using the following data:
        {data}.
        Answer the following question
        {prompt}
        Use only the relevant data. You dont have to use it all and only use the data provided for your answer
        """
    )

    return jsonify({"status": 200, "response": output['response'], "data": data})


def ask_riesgo(prompt):
    try:
        client = chromadb.HttpClient(host="chromadb", port=8000)
        collection = client.get_or_create_collection(name="riesgos")
    except Exception as e:
        logging.error(f"Failed to connect to ChromaDB: {e}")
        return jsonify({"status": 500, "error": str(e)}), 500
    ollamaClient = ollama.Client(host="http://myollama:11434")
    # Generate an embedding for the prompt and retrieve the most relevant doc

    # Join the filtered words back into a string
    response = ollamaClient.embeddings(
        prompt=prompt,
        model="mxbai-embed-large"
    )
    results = collection.query(
        query_embeddings=[response["embedding"]],
        n_results=1
    )
    data = results['documents'][0]

# Generate a response combining the prompt and data we retrieved in step 2
    output = ollamaClient.generate(
        model="llama2",
        prompt=f"""
        Using the following data
        {data}.
        Tell me what risks I have if I have the following port open:
        {prompt}
        Only tell me the threat. You can't use more than 5 words
        """
    )

    return jsonify({"status": 200, "response": output['response'], "data": data})
