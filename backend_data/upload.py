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
        # Use the base ChromaDB API endpoint for collections
        client = chromadb.HttpClient(host='chromadb', port=8000)
        
        # Attempt to create or get collections using the correct endpoint
        collectiondocs = client.get_or_create_collection(name="docs")
        collectionriesgos = client.get_or_create_collection(name="riesgos")
        collectioncases = client.get_or_create_collection(name="cases")

    except Exception as e:
        logging.error(f"Failed to connect to ChromaDB: {e}")
        return jsonify({"status": 500, "error": str(e)}), 500


    try:
        ollamaClient = ollama.Client(host="http://myollama:11434")
    except Exception as e:
        logging.error(f"Failed to connect to Ollama client: {e}")
        return jsonify({"status": 500, "error": str(e)}), 500

    directorio_pdfs = 'media'
    directorio_cases = 'cases'
    documents = leer_pdfs(directorio_pdfs, 500)
    cases = leer_pdfs(directorio_cases, 100)

    riesgos = [
        "If a computer has port 443 open, there is a threat of a DoS attack.",
        "If a computer has port 23 open, there is a threat of ransomware.",
        "If a computer has port 3389 open, there is a threat of a brute-force attack on RDP.",
        "If a computer has port 21 open, there is a threat of a brute-force attack on FTP.",
    ]

    def add_to_collection(collection, items, prefix):
        for i, item in enumerate(items):
            try:
                response = ollamaClient.embeddings(model="mxbai-embed-large", prompt=item)
                embedding = response["embedding"]
                collection.add(
                    ids=[f"{prefix}_{i}"],
                    embeddings=[embedding],
                    documents=[item]
                )
            except Exception as ex:
                logging.error(f"Error processing item {prefix}_{i}: {ex}")
                continue  # Skip to the next item

    # Upload documents, cases, and risks
    add_to_collection(collectiondocs, documents, "docs")
    add_to_collection(collectioncases, cases, "cases")
    add_to_collection(collectionriesgos, riesgos, "riesgos")

    return jsonify({"status": 200, "message": "Upload successful!"}), 200

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

def generate_impact(prompt):
    ollamaClient = ollama.Client(host="http://myollama:11434")
    output = ollamaClient.generate(
        model= "llama2",
        # bajo, alto, moderado, critico
        prompt=f"""
        Imaginate que eres un analista de ciberseguridad en el sector educativo.
        Uno de tus clientes tiene un dispositivo con la siguiente descripcion:
        {prompt}
        Dale una puntuacion del impacto de ese dispositivo en la red entre bajo (poco impacto), moderado (impacto moderado), alto (alto impacto), critico (impacto critico).
        Considera que tan critico seria si hubiera un incidente de seguridad y este activo dejara de existir. La empresa podria seguir funcionando? que tan bien funcionaria?
        Solo puedes usar una palabra para tu respuesta. No puedes usar mas que eso
        """
    )
    return jsonify({"status":200, "response":output["response"]})

