import logging
import ollama
import chromadb
import os
import fitz
from flask import jsonify


def dividir_en_chunks(text, words_per_segment=250):
    words = text.split()
    # Dividir en segmentos de 500 palabras
    word_segments = []
    for i in range(0, len(words), words_per_segment):
        segment = words[i:i + words_per_segment]
        word_segments.append(' '.join(segment))

    return word_segments
    # Dividir en segmentos de 500 palabras


def leer_pdfs(directorio):
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
            documentos.extend(dividir_en_chunks(texto))
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
    documents = leer_pdfs(directorio_pdfs)

    riesgos = [
        "Si una computadora tiene el puerto 443 abierto el cual es el puerto https para acceder a paginas web, existe la amenaza de un DoS y corre el riesgo de una perdida de disponibilidad de datos",
        "Si una computadora tiene el puerto 23 abierto el cual es el puerto Telnet, existe la amenaza de un Ransomware y corre el riesgo de una perdida de integridad de datos",
        "Si una computadora tiene el puerto 3389 abierto el cual sirve para acceder remotamente a computadoras con RDP (Remote Desktop Protocol), existe la amenaza de un ataque de fuerza bruta en RDP y corre el riesgo de una perdida de confidencialidad de datos",
        "Si una computadora tiene el puerto 21 abierto el cual sirve para mandar archivos con FTP, existe la amenaza de un ataque de fuerza bruta en FTP y corre el riesgo de una perdida de confidencialidad de datos",
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
        n_results=1
    )
    data = results['documents'][0][0]

# Generate a response combining the prompt and data we retrieved in step 2
    output = ollamaClient.generate(
        model="llama2",
        prompt=f"""
        Usando estos datos:
        {data}.
        responde la siguiente pregunta:
        {prompt}
        """
    )

    return jsonify({"status": 200, "response": output['response']})


def ask_riesgo(prompt):
    try:
        client = chromadb.HttpClient(host="chromadb", port=8000)
        collection = client.get_or_create_collection(name="riesgos")
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
        n_results=1
    )
    data = results['documents'][0][0]
    print("embeddings: ", data)

# Generate a response combining the prompt and data we retrieved in step 2
    output = ollamaClient.generate(
        model="llama2",
        prompt=f"""
        Usando los siguientes datos:
        {data}.
        Dime que amenaza tengo con este puerto abierto
        {prompt}
        Solo dime la amenaza, no debes usar mas de 5 palabras
        """
    )

    return jsonify({"status": 200, "response": output['response']})
