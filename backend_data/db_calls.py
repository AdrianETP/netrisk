from pymongo import MongoClient
import logging
from flask import jsonify

# Configura la conexión con MongoDB
client = MongoClient('mongodb://mymongo:27017/')
db = client['local']  # Nombre de base de datos
print(db.list_collection_names())

# Función para serializar documentos y convertir ObjectId a cadena
def serialize_document(document):
    if '_id' in document:
        document['_id'] = str(document['_id'])
    return document

# Función para obtener todos los activos
def get_activos():
    try:
        collection = db['activos']
        activos = list(collection.find({}))
        activos_serializados = [serialize_document(activo) for activo in activos]
        return jsonify({"status": 200, "data": activos_serializados})
    except Exception as e:
        logging.error(f"Error retrieving activos: {e}")
        return jsonify({"status": 500, "error": str(e)})

# Función para obtener vulnerabilidades técnicas asociadas a un activo
def get_vul_tec_by_activo(activo_id):
    try:
        collection = db['vul-tec']
        vul_tecs = list(collection.find({"id-activo": activo_id}))
        vul_tecs_serializadas = [serialize_document(vul_tec) for vul_tec in vul_tecs]
        return jsonify({"status": 200, "data": vul_tecs_serializadas})
    except Exception as e:
        logging.error(f"Error retrieving vul-tec for activo {activo_id}: {e}")
        return jsonify({"status": 500, "error": str(e)})

# Función para obtener vulnerabilidades organizacionales
def get_vul_org():
    try:
        collection = db['vul-org']
        vul_orgs = list(collection.find({}))
        vul_orgs_serializadas = [serialize_document(vul_org) for vul_org in vul_orgs]
        return jsonify({"status": 200, "data": vul_orgs_serializadas})
    except Exception as e:
        logging.error(f"Error retrieving vul-org: {e}")
        return jsonify({"status": 500, "error": str(e)})