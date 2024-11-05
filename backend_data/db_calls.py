import pymongo
from pymongo import MongoClient, UpdateOne, DESCENDING
import logging
from flask import jsonify, current_app
import google.generativeai as genai
import os
from datetime import datetime
import json


genai.configure(api_key=os.environ["API_KEY"])


# Configura la conexión con MongoDB
client = MongoClient('mongodb://mymongo:27017/')
db = client['local']  # Nombre de base de datos
print(db.list_collection_names())

def delete_documents(collection):
    result = collection.delete_many({})  # Deletes all documents in the collection
    return {"message": f"{result.deleted_count} documents deleted from the collection."}

def procesar_y_guardar_activos(resultados_pentest):
    collection = db["activos"]
    delete_documents(collection)

    if "resultado" not in resultados_pentest or "scan" not in resultados_pentest["resultado"]:
        print("Error: 'scan' no encontrado en los resultados del pentest")
        return {"error": "'scan' no encontrado en los resultados del pentest"}

    for ip, datos in resultados_pentest["resultado"]["scan"].items():
        # Retrieve the auto-incremented id by counting documents in the collection
        next_id = collection.count_documents({}) + 1

        document = {
            "id": next_id,
            "idTabla": f"PC{next_id}",
            "ip": datos["addresses"].get("ipv4", ""),
            "macAddress": datos["addresses"].get("mac", "A1:42:B0:A8:71:12"),
            "device": datos.get("vendor", {}).get("name", "PC"),
            "operatingSystem": datos.get("os", {}).get("osmatch", {}).get("name", "Linux"),
            "desc": "",  # Default blank value
            "impact": "N/A"  # Default blank value
        }
        
        # Insert the document into the collection
        collection.insert_one(document)

    return {"message": "Resultados procesados y guardados en la colección 'activos' correctamente"}

def procesar_y_guardar_resultados(resultados_pentest):
    collection = db["vul-tec"]
    delete_documents(collection)

    # Verifica si "scan" está presente en el JSON
    if "resultado" not in resultados_pentest or "scan" not in resultados_pentest["resultado"]:
        print("Error: 'scan' no encontrado en los resultados del pentest")
        return {"error": "'scan' no encontrado en los resultados del pentest"}

    for ip, datos in resultados_pentest["resultado"]["scan"].items():
        # Extrae la información relevante
        for puerto, info in datos.get("tcp", {}).items():
            # Verifica si el estado es "open"
            if info.get("state") == "open":
                dispositivo_nombre = (
                    datos.get("hostnames")[0].get("name") if datos.get("hostnames") and datos.get("hostnames")[0].get("name") else "dispositivo"
                )
                document = {
                    "id": dispositivo_nombre,  # Obtener el nombre del host o la IP
                    "vulnerability": f"Puerto {puerto} ({info.get('name')}) Abierto",  # Formato para la vulnerabilidad
                    "threat": "Acceso no autorizado",  # Valor por defecto para threat
                    "impact": "N/A",  # Inicialmente vacío
                    "potentialLoss": ""  # Inicialmente vacío
                }
                # Inserta el documento en la colección
                collection.insert_one(document)

    return {"message": "Resultados procesados y guardados correctamente"}


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
            {"$set": {"state": new_state}},
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
    

# Función para generar guia de implementacion y guardarla en la db
def generar_guia(code, nombre):
    try:
        prompt = f"Give me an implementation guide for NIST 800-53 control {code} {nombre} translated to spanish"
        model = genai.GenerativeModel("gemini-1.5-flash")
        response = model.generate_content(prompt)

        # Save the response in the corresponding control in the database
        collection = db['controles']
        collection.update_one(
            {"code": code},
            {"$set": {"guia": response.text}}  # Adjust this field as necessary
        )
        return jsonify({"status": 200, "message": "Guia generada exitosamente", "guia": response.text})

    except Exception as e:
        return jsonify({"status": 500, "error": str(e)})
    
def get_guia(code):
    try:
        collection = db['controles']
        control = collection.find_one({"code": code})  # Usa find_one en lugar de find
        if control:  # Verifica que control no esté vacío
            return control.get('guia', '')  # Devuelve 'guia' o un mensaje de error si no existe
        else:
            return jsonify({"status": 404, "message": "Control no encontrado"})
    except Exception as e:
        return jsonify({"status": 500, "error": str(e)}) 

def get_reportes():
    try:
        collection = db['reportes']
        reportes = list(collection.find({}))
        reportes_serializados = [serialize_document(reporte) for reporte in reportes]
        return jsonify({"status": 200, "data": reportes_serializados})
    except Exception as e:
        return jsonify({"status": 500, "error": str(e)}) 
    
def get_conf():
    try:
        collection = db['configuracion']
        configuracion = collection.find_one({"id": "configuracion"})
        
        # Convert the ObjectId to a string
        if configuracion and '_id' in configuracion:
            configuracion['_id'] = str(configuracion['_id'])
        
        return jsonify({"status": 200, "data": configuracion})
    except Exception as e:
        return jsonify({"status": 500, "error": str(e)})
    
def update_recurrencia(nueva_recurrencia):
    try:
        collection = db['configuracion']
        result = collection.update_one(
            {"id": "configuracion"},
            {"$set": {"recurrencia": nueva_recurrencia}}
        )

        if result.matched_count == 0:
            return jsonify({"status": 404, "error": "Configuracion no encontrada"}), 404
        
        return jsonify({"status": 200, "message": "Recurrencia actualizada exitosamente"})
    except Exception as e:
        return jsonify({"status": 500, "error": str(e)})
    
def update_prox_auditoria(prox_auditoria):
    try:
        collection = db['configuracion']
        result = collection.update_one(
            {"id": "configuracion"},
            {"$set": {"prox_auditoria": prox_auditoria}}
        )

        if result.matched_count == 0:
            return jsonify({"status": 404, "error": "Configuracion no encontrada"}), 404
        
        return jsonify({"status": 200, "message": "Proxima auditoria actualizada exitosamente"})
    except Exception as e:
        return jsonify({"status": 500, "error": str(e)})
    


def generar_reporte(fechaInicio, fechaFin):
    try:
        # Convert input date strings to datetime objects
        fechaInicio = datetime.strptime(fechaInicio, '%Y-%m-%d')
        fechaFin = datetime.strptime(fechaFin, '%Y-%m-%d')

        auditorias_collection = db['auditorias']
        reportes_collection = db['reportes']
        
        # Query to filter audits within the specified date range (inclusive)
        auditorias = list(auditorias_collection.find({
            'fecha': {
                '$gte': fechaInicio.strftime('%Y-%m-%d'),  # Start date (inclusive)
                '$lte': fechaFin.strftime('%Y-%m-%d')      # End date (inclusive)
            }
        }))

        # Generate the report using the filtered auditorias
        prompt = f"Pretend you are a cybersecurity expert in the education field, generate me an executive report translated to Spanish given the following data about the network scans performed: {auditorias}. Only include the report content, do not include a title."
        model = genai.GenerativeModel("gemini-1.5-flash")
        response = model.generate_content(prompt)

        # Prepare report data
        report_data = {
            "id": generate_new_report_id(reportes_collection),  # Function to generate new unique report ID
            "generatedDate": datetime.now().strftime('%Y-%m-%d'),  # Current date for report generation
            "startDate": fechaInicio.strftime('%Y-%m-%d'),  # Start date of the report
            "endDate": fechaFin.strftime('%Y-%m-%d'),        # End date of the report
            "reportContent": response.text  # Assuming response contains the generated report content
        }

        # Store the report in the reportes collection
        reportes_collection.insert_one(report_data)  # Save the report

        # Update the reporteGenerado date for the corresponding auditorias
        auditorias_collection.update_many(
            {
                'fecha': {
                    '$gte': fechaInicio.strftime('%Y-%m-%d'),
                    '$lte': fechaFin.strftime('%Y-%m-%d')
                }
            },
            {
                '$set': {
                    'reporteGenerado': datetime.now().strftime('%Y-%m-%d')  # Update to current date
                }
            }
        )

        return jsonify({
            "status": 200,
            "message": "Reporte generado exitosamente"
        })

    except Exception as e:
        return jsonify({"status": 500, "error": str(e)})

def generate_new_report_id(reportes_collection):
    # Get the last report document based on the highest ID
    last_report = reportes_collection.find().sort("id", -1).limit(1)
    last_report_list = list(last_report)  # Convert cursor to list

    # Check if the list is empty and assign the next ID accordingly
    last_id = last_report_list[0]['id'] if last_report_list else 0
    return last_id + 1

import typing_extensions as typing
import pandas as pd

class Control(typing.TypedDict):
    nombre: str
    code: str
    description: str

# Load Excel data for validation
excel_path = 'controles.xlsx'
df = pd.read_excel(excel_path)

# Create a dictionary for quick lookup by 'Control Identifier'
controls_dict = {
    row['Control Identifier']: {
        'nombre': row['Control (or Control Enhancement) Name'],
        'description': row['Control Text']
    }
    for _, row in df.iterrows()
}

def generar_controles():
    try:
        # Fetch vulnerabilities from collections
        collection = db['vul-org']
        vul_orgs = list(collection.find({}))
        collection = db['vul-tec']
        vul_tecs = list(collection.find({}))

        sample_file = {
        "Retrieved file": "NIST 800-53 PDF",
        "uri": "https://generativelanguage.googleapis.com/v1beta/files/4hpifh756tx7"
        }

        sample_file_2 = {
        "Retrieved file": "NIST Controls PDF",
        "uri": "https://generativelanguage.googleapis.com/v1beta/files/fnky8vhujzx0"
        }

        # Step 1: Generate recommended control codes using Gemini
        prompt = f"You are a cybersecurity expert in the education field, generate me a JSON of around 20 recommended NIST 800-53 control codes to implement using the document provided given the following data about the organization's vulnerabilities: {vul_orgs} {vul_tecs}. Make sure each code corresponds to each control correctly."
        
        model = genai.GenerativeModel("gemini-1.5-pro")
        response = model.generate_content(
            [sample_file_2["uri"], prompt],
            generation_config=genai.GenerationConfig(response_mime_type="application/json", response_schema=list[Control])
        )
         # Parse the JSON response from Gemini
        try:
            controls = json.loads(response.text)  # Convert JSON string to Python object
            recommended_control_codes = [control['code'] for control in controls]  # Extract control codes

            # Step 2: Validate with Excel data
            validated_controls = []
            for control_code in recommended_control_codes:
                if control_code in controls_dict:
                    control_info = controls_dict[control_code]
                    validated_controls.append({
                        'code': control_code,
                        'nombre': control_info['nombre'],
                        'description': control_info['description']
                    })
                else:
                    print(f"Warning: Control code {control_code} not found in Excel data.")

            # Step 3: Summarize and translate each validated control to Spanish
            summarized_controls = []
           # Step 3: Summarize and translate all validated controls in a single request
            # Create a combined prompt with all controls for translation
            controls_text = "\n".join(
                f"Control {i + 1}:\nName: {control['nombre']}\nDescription: {control['description']}\n"
                for i, control in enumerate(validated_controls)
            )

            prompt = (
        f"Please summarize and translate to Spanish the following NIST 800-53 control names and descriptions. Make each description shorter than 20 words."
        f"Return each control as a JSON object with fields 'nombre' and 'description' in the same order as provided. "
        f"Respond with an array of JSON objects, where each object corresponds to each control given:\n\n{controls_text}"
            )

            # Send a single request to Gemini for the translation
            translation_response = model.generate_content(
                [prompt],
                generation_config=genai.GenerationConfig(response_mime_type="application/json")
            )

            try:
                # Parse the JSON response, assuming it returns a list of translated controls
                translated_controls = json.loads(translation_response.text)

                # Ensure translated controls match the length of validated_controls
                if len(translated_controls) == len(validated_controls):
                    # Map each translated control back to its original code
                    summarized_controls = [
                        {
                            'code': control['code'],
                            'nombre': translated_control.get('nombre', control['nombre']),
                            'description': translated_control.get('description', control['description'])
                        }
                        for control, translated_control in zip(validated_controls, translated_controls)
                    ]
                else:
                    print("Error: Mismatch in number of translated controls. Using original data for fallback.")
                    summarized_controls = validated_controls  # Fallback to original data if there's a mismatch

                # Insert summarized controls into the 'controles' collection
                collection = db['controles']
                #collection.delete_many({})  # Clear existing controls
                #collection.insert_many(summarized_controls)  # Insert new controls
                # Insert new controls, verificando si ya existen
                for control in summarized_controls: 
                    collection.update_one(
                        {'code': control['code']},  
                        {'$setOnInsert': control},  # Inserta el control si no existe
                        upsert=True  # Si no existe, lo inserta
                    )

                return jsonify({"status": 200, "message": "Controls inserted successfully."})

            except json.JSONDecodeError:
                print("Error: Invalid JSON format for translated controls.")
                summarized_controls = validated_controls  # Fallback to original data if parsing fails

        except json.JSONDecodeError:
            return jsonify({"status": 400, "error": "Invalid JSON format from Gemini response.", "response": response.text})

    except Exception as e:
        return jsonify({"status": 500, "error": str(e)})
    
def upload_file():
    try:
        # Upload the file and print a confirmation
        sample_file = genai.upload_file(path="NIST-Table.pdf",
                                display_name="NIST Controls PDF")
        file = genai.get_file(name=sample_file.name)
        return jsonify({"Retrieved file": file.display_name, "uri": sample_file.uri})
        
    except Exception as e:
        return jsonify({"status": 500, "error": str(e)})
    
class Vulnerability(typing.TypedDict):
    email: str
    vulnerability: str
    threat: str
    

def generar_vul_org():
    try:
        # Obtener info de roles
        # Obtener info de personas
        collection = db['personas']
        personas = list(collection.find({}))
        collection = db['roles']
        roles = list(collection.find({}))

        # Generar prompt
        prompt = (f"You are a cybersecurity expert in the education field, generate me a JSON of several vulnerabilities in Spanish based on this data about the organization's roles and awareness trainings: {roles} {personas}. The field vulnerability should be less than 15 words. The threat field should be 5 words or less. If the email field does not apply, put N/A")

        # Request a gemini
        model = genai.GenerativeModel("gemini-1.5-pro")
        response = model.generate_content(
            [prompt],
            generation_config=genai.GenerationConfig(response_mime_type="application/json", response_schema=list[Vulnerability])
        )

        cleaned_response = response.text.replace("\\", "").replace("\n", "").replace("\\\\","")


        # Guardar vulnerabilidades en tabla vul-org y en la ultima auditoria
        vulnerabilities = json.loads(cleaned_response)

        # Format vulnerabilities for 'organizacionales' field
        formatted_vulnerabilities = []
        for index, vul in enumerate(vulnerabilities, start=1):
            formatted_vulnerabilities.append({
                "id": index,
                "email": vul.get("email", "N/A"),
                "vulnerability": vul.get("vulnerability", ""),
                "threat": vul.get("threat", ""),
                "impact": vul.get("impact", "Medio"),  # Default impact if not provided
                "potentialLoss": vul.get("potentialLoss", "$1,000 - $10,000")  # Default value if not provided
            })

        collection = db['vul-org']
        collection.delete_many({})  # Clear existing
        collection.insert_many(formatted_vulnerabilities)  # Insert new vulnerabilities

        # Remove '_id' field from formatted vulnerabilities for JSON serialization
        for vul in formatted_vulnerabilities:
            if "_id" in vul:
                vul["_id"] = str(vul["_id"])  # Convert _id to string for JSON compatibility

        # Update the latest audit record with these organizational vulnerabilities
        audit_collection = db['auditorias']
        latest_audit = audit_collection.find_one(sort=[("id", -1)])
        if latest_audit:
            audit_collection.update_one(
                {"id": latest_audit["id"]},
                {"$set": {"vulnerabilidades.organizacionales": formatted_vulnerabilities}}
            )

        


        return jsonify({"status": 200, "response": formatted_vulnerabilities})
    except Exception as e:
        return jsonify({"status": 500, "error": str(e)})
    
# Función para borrar un reporte
def delete_reporte(id):
    try:
        collection = db['reportes']
        result = collection.delete_one(
            {"id": id}
        )
        return jsonify({"status": 200, "message": "Impacto actualizado exitosamente"})
    except Exception as e:
        return jsonify({"status": 500, "error": str(e)})