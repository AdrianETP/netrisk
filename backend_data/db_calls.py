from pymongo import MongoClient, UpdateOne
import logging
from flask import jsonify, current_app

# Configura la conexión con MongoDB
client = MongoClient('mongodb://mymongo:27017/')
db = client['local']  # Nombre de base de datos
print(db.list_collection_names())



def procesar_y_guardar_resultados(resultado):
    collection = db['vul-tec']

    # Verifica que el resultado sea un diccionario JSON
    if not isinstance(resultado, dict):
        current_app.logger.error("Los datos proporcionados no son un diccionario JSON válido.")
        raise ValueError("Los datos proporcionados no son un diccionario JSON válido.")

    resultado_json = resultado.get('scan', {})
    operaciones = []

    for ip, info in resultado_json.items():
        for puerto, datos_puerto in info.get('tcp', {}).items():
            if datos_puerto['state'] == 'open':
                # Define amenazas conocidas o desconocidas según el puerto
                riesgo = {
                    "23": {"threat": "Acceso no autorizado"},
                    # otros puertos mapeados con amenazas
                }.get(str(puerto), {"threat": "Desconocido"})

                # Crea el documento para MongoDB
                documento = {
                    "id": f"activo_{ip}_{puerto}",
                    "vulnerability": f"Puerto {puerto} ({datos_puerto['name']}) Abierto",
                    "threat": riesgo["threat"],  # Asegura que `threat` es un string
                    "impact": "",                # Se deja en blanco para llenarse posteriormente
                    "potentialLoss": ""          # Se deja en blanco para llenarse posteriormente
                }

                # Agrega el documento a la lista de operaciones
                operaciones.append(
                    UpdateOne(
                        {"id": documento["id"]},
                        {"$set": documento},
                        upsert=True
                    )
                )

                # Loggea el documento creado para debug
                current_app.logger.info(f"Documento creado: {documento}")

    # Ejecuta las operaciones en MongoDB
    try:
        if operaciones:
            result = collection.bulk_write(operaciones)
            current_app.logger.info(f"Operaciones exitosas en bulk_write: {result.bulk_api_result}")
        else:
            current_app.logger.info("No se encontraron puertos abiertos para registrar.")
    except Exception as e:
        current_app.logger.error(f"Error en bulk_write: {e}")

    # Resultado de confirmación
    processed_data = {"status": "Resultados procesados y guardados", "total": len(operaciones)}
    return processed_data


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
    
# Función para actualizar el impacto de un activo
def update_activo_impacto(activo_id, nuevo_impacto):
    try:
        collection = db['activos']
        result = collection.update_one(
            {"id": activo_id},  # Busca el activo por el campo `id`
            {"$set": {"impact": nuevo_impacto}}  # Actualiza el campo `impact`
        )

        if result.matched_count == 0:
            return jsonify({"status": 404, "error": "Activo no encontrado"}), 404

        return jsonify({"status": 200, "message": "Impacto actualizado exitosamente"})
    except Exception as e:
        return jsonify({"status": 500, "error": str(e)})

# Función para actualizar la posible pérdida debido a una vulnerabilidad técinca
def update_perdida_tec(activo_id, nueva_perdida):
    try:
        collection = db['vul-tec']
        result = collection.update_one(
            {"id": activo_id},
            {"$set": {"potentialLoss": nueva_perdida}}
        )

        if result.matched_count == 0:
            return jsonify({"status": 404, "error": "Vulnerabilidad técnica no encontrada"}), 404

        return jsonify({"status": 200, "message": "Pérdida actualizada exitosamente"})
    except Exception as e:
        return jsonify({"status": 500, "error": str(e)})

# Función para actualizar la posible pérdida debido a una vulnerabilidad organizacional
def update_perdida_org(activo_id, nueva_perdida):
    try:
        collection = db['vul-org']
        result = collection.update_one(
            {"id": activo_id},
            {"$set": {"potentialLoss": nueva_perdida}}
        )

        if result.matched_count == 0:
            return jsonify({"status": 404, "error": "Vulnerabilidad organizacional no encontrada"}), 404

        return jsonify({"status": 200, "message": "Pérdida actualizada exitosamente"})
    except Exception as e:
        return jsonify({"status": 500, "error": str(e)})

# Función para actualizar el impacto de una vulnerabilidad técinca
def update_vul_tec_impacto(activo_id, nuevo_impacto):
    try:
        collection = db['vul-tec']
        result = collection.update_one(
            {"id": activo_id},
            {"$set": {"impact": nuevo_impacto}}
        )

        if result.matched_count == 0:
            return jsonify({"status": 404, "error": "Vulnerabilidad técnica no encontrada"}), 404

        return jsonify({"status": 200, "message": "Impacto actualizado exitosamente"})
    except Exception as e:
        return jsonify({"status": 500, "error": str(e)})

# Función para actualizar el impacto de una vulnerabilidad organizacional
def update_vul_org_impacto(activo_id, nuevo_impacto):
    try:
        collection = db['vul-org']
        result = collection.update_one(
            {"id": activo_id},
            {"$set": {"impact": nuevo_impacto}}
        )

        if result.matched_count == 0:
            return jsonify({"status": 404, "error": "Vulnerabilidad organizacional no encontrada"}), 404

        return jsonify({"status": 200, "message": "Impacto actualizado exitosamente"})
    except Exception as e:
        return jsonify({"status": 500, "error": str(e)})