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
    
# Función para obtener auditorias    
def get_auditorias():
    try:
        collection = db['auditorias']
        auditorias = list(collection.find({}))
        auditorias_serializados = [serialize_document(auditoria) for auditoria in auditorias]
        return jsonify({"status": 200, "data": auditorias_serializados})
    except Exception as e:
        logging.error(f"Error retrieving auditorias: {e}")
        return jsonify({"status": 500, "error": str(e)})

# Función para obtener controles
def get_controles():
    try:
        collection = db['controles']
        controles = list(collection.find({}))
        controles_serializados = [serialize_document(control) for control in controles]
        return jsonify({"status": 200, "data": controles_serializados})
    except Exception as e:
        logging.error(f"Error retrieving controles: {e}")
        return jsonify({"status": 500, "error": str(e)})

# Función para obtener personas
def get_personas():
    try:
        collection = db['personas']
        personas = list(collection.find({}))
        personas_serializados = [serialize_document(persona) for persona in personas]
        return jsonify({"status": 200, "data": personas_serializados})
    except Exception as e:
        logging.error(f"Error retrieving personas: {e}")
        return jsonify({"status": 500, "error": str(e)})

# Función para obtener roles
def get_roles():
    try:
        collection = db['roles']
        roles = list(collection.find({}))
        roles_serializados = [serialize_document(rol) for rol in roles]
        return jsonify({"status": 200, "data": roles_serializados})
    except Exception as e:
        logging.error(f"Error retrieving : {e}")
        return jsonify({"status": 500, "error": str(e)})
    
# Función para obtener vulnerabilidades organizacionales
def get_vul_org():
    try:
        collection = db['vul-org']
        vul_orgs = list(collection.find({}))
        vul_orgs_serializadas = [serialize_document(vul_org) for vul_org in vul_orgs]
        return jsonify({"status": 200, "data": vul_orgs_serializadas})
    except Exception as e:
        logging.error(f"Error retrieving organizational vulnerabilities: {e}")
        return jsonify({"status": 500, "error": str(e)})
    
# Función para obtener vulnerabilidades técnicas
def get_vul_tec():
    try:
        collection = db['vul-tec']
        vul_tecs = list(collection.find({}))
        vul_tecs_serializadas = [serialize_document(vul_tec) for vul_tec in vul_tecs]
        return jsonify({"status": 200, "data": vul_tecs_serializadas})
    except Exception as e:
        logging.error(f"Error retrieving tecnical vulnerabilities: {e}")
        return jsonify({"status": 500, "error": str(e)})
    
# Función para actualizar la descripción de un activo
def update_activo_desc(activo_id, nueva_desc):
    try:
        collection = db['activos']
        result = collection.update_one(
            {"id": activo_id},  # Busca el activo por el campo `id`
            {"$set": {"desc": nueva_desc}}  # Actualiza el campo `desc`
        )

        if result.matched_count == 0:
            return jsonify({"status": 404, "error": "Activo no encontrado"}), 404

        return jsonify({"status": 200, "message": "Descripción actualizada exitosamente"})
    except Exception as e:
        return jsonify({"status": 500, "error": str(e)})
    
# Función para actualizar el estado de implementación de un control en base al código del control 
def update_control_state(code, new_state):
    try:
        collection = db['controles']
        result = collection.update_one(
            {"code": code},
            {"$set": {"state": new_state}}
        )
        
        if result.matched_count == 0:
            return jsonify({"status": 404, "error": "Control no encontrado"}), 404
        
        return jsonify({"status": 200, "message": "Estado actualizado exitosamente"})
    except Exception as e:
        logging.error(f"Error updating control with code {code}: {e}")
        return jsonify({"status": 500, "error": str(e)})

# Función para actualizar el estado de cumplimiento de un rol
def update_role_status(role_id, new_status):
    try:
        collection = db['roles']
        result = collection.update_one(
            {"id": role_id},
            {"$set": {"status": new_status}}
        )
        
        if result.matched_count == 0:
            return jsonify({"status": 404, "error": "Rol no encontrado"}), 404
        
        return jsonify({"status": 200, "message": "Estado del rol actualizado exitosamente"})
    except Exception as e:
        logging.error(f"Error updating role with id {role_id}: {e}")
        return jsonify({"status": 500, "error": str(e)})

# Función para actualizar el estado de cumplimiento de un rol
def update_role_person(role_id, new_person):
    try:
        collection = db['roles']
        result = collection.update_one(
            {"id": role_id},
            {"$set": {"assignedPerson": new_person}}
        )
        
        if result.matched_count == 0:
            return jsonify({"status": 404, "error": "Rol no encontrado"}), 404
        
        return jsonify({"status": 200, "message": "Persona asignada actualizado exitosamente"})
    except Exception as e:
        logging.error(f"Error updating person with role id {role_id}: {e}")
        return jsonify({"status": 500, "error": str(e)})

# Función para actualizar el estado de cumplimiento de un rol
def update_role_pending_actions(role_id, new_pending_actions):
    try:
        collection = db['roles']
        result = collection.update_one(
            {"id": role_id},
            {"$set": {"pendingActions": new_pending_actions}}
        )
        
        if result.matched_count == 0:
            return jsonify({"status": 404, "error": "Rol no encontrado"}), 404
        
        return jsonify({"status": 200, "message": "Acciones pendientes del rol actualizadas exitosamente"})
    except Exception as e:
        logging.error(f"Error updating pending actions for role with id {role_id}: {e}")
        return jsonify({"status": 500, "error": str(e)})

# Función para actualizar el estado de cumplimiento de un rol
def update_person_status(person_id, new_status):
    try:
        collection = db['personas']
        result = collection.update_one(
            {"id": person_id},
            {"$set": {"status": new_status}}
        )
        
        if result.matched_count == 0:
            return jsonify({"status": 404, "error": "Rol no encontrado"}), 404
        
        return jsonify({"status": 200, "message": "Estado de capacitacion actualizado exitosamente"})
    except Exception as e:
        logging.error(f"Error updating training status with id {person_id}: {e}")
        return jsonify({"status": 500, "error": str(e)})