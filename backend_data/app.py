from flask import Flask, jsonify, request
from upload import upload, ask_docs, ask_riesgo, generate_impact
from db_calls import (
    get_activos, get_auditorias, get_controles, get_personas, get_roles, 
    get_vul_org, get_vul_tec, update_activo_desc, update_control_state, 
    update_role_status, update_role_person, update_role_pending_actions,
    update_person_status, update_activo_impacto, update_perdida_tec,
    update_perdida_org, update_vul_tec_impacto, update_vul_org_impacto,
    procesar_y_guardar_resultados, procesar_y_guardar_activos, delete_reporte, 
    generar_guia, get_guia, get_reportes, get_conf, update_recurrencia,
    update_prox_auditoria, generar_reporte, generar_controles, upload_file, generar_vul_org
    )
from dashboard import ( calculate_netscore, calculate_dashboard, get_dashboard )
import requests
from flask_cors import CORS
import logging


app = Flask(__name__)
CORS(app)  # Habilita CORS en toda la app
app.config['DEBUG'] = True

# Configura el nivel de logger globalmente
app.logger.setLevel(logging.INFO)


@app.route('/')
def home():
    return "Welcome to the Flask app!"

@app.route('/api/scan-network', methods=['GET'])
def api_process_activos():
    try:
        response = requests.get('http://mypentester:5001')
        response.raise_for_status()
        data = response.json()
    except requests.exceptions.RequestException as e:
        return jsonify({"error": "Failed to connect to pentester", "details": str(e)}), 500

    # Process and store the data in the "activos" collection
    processed_data = procesar_y_guardar_activos(data)

    return jsonify(processed_data), 201

@app.route('/api/run-pentest', methods=['GET'])
def api_run_pentest():
    try:
        # Ejecuta el pentest y recibe los datos JSON
        response = requests.get('http://mypentester:5001')
        response.raise_for_status()
        data = response.json()
    except requests.exceptions.RequestException as e:
        return jsonify({"error": "Failed to connect to pentester", "details": str(e)}), 500

    # Procesa y guarda los datos
    processed_data = procesar_y_guardar_resultados(data)
    
    # Retorna el resultado procesado como JSON
    return jsonify(processed_data), 201

@app.route('/api/data')
def get_data():
    return jsonify({"message": "Hello, World!", "status": "success"})


@app.route('/api/models/pull')
def pull_models():
    try:
        requests.post('http://myollama:11434/api/pull', json={"name": "llama2"})
        requests.post('http://myollama:11434/api/pull',
                    json={"name": "mxbai-embed-large"})
        return jsonify({"status": 200, "message": "pulling models"})
    except Exception as error:
        return jsonify({"status": 500, "message": error})



@app.route('/api/models/upload')
def addpdf():
    try:
        upload()
    except Exception as ex:
        return jsonify({"status": 400, "error": ex})
    return jsonify({"status": 200, "message": "data uploaded succesfully"})


@app.route('/api/models/askfordocs', methods=['POST'])
def askaifromdoc():
    data = request.get_json()
    prompt = data['prompt']
    return ask_docs(prompt)


@app.route('/api/models/askforrisk', methods=['POST'])
def askaifromrisk():
    data = request.get_json()
    prompt = data['prompt']
    return ask_riesgo(prompt)

@app.route('/api/models/generateimpact' , methods=['POST'])
def askaiforimpact():
    data = request.get_json()
    prompt = data['prompt']
    return generate_impact(prompt)


# Endpoint para obtener activos
@app.route('/api/activos', methods=['GET'])
def api_get_activos():
    return get_activos()

# Endpoint para obtener auditorias
@app.route('/api/auditorias', methods=['GET'])
def api_get_auditorias():
    return get_auditorias()

# Endpoint para obtener controles
@app.route('/api/controles', methods=['GET'])
def api_get_controles():
    return get_controles()

# Endpoint para obtener personas
@app.route('/api/personas', methods=['GET'])
def api_get_personas():
    return get_personas()

# Endpoint para obtener roles
@app.route('/api/roles', methods=['GET'])
def api_get_roles():
    return get_roles()

# Endpoint para obtener vulnerabilidades organizacionales
@app.route('/api/vul-org', methods=['GET'])
def api_get_vul_org():
    return get_vul_org()

# Endpoint para obtener vulnerabilidades de activos
@app.route('/api/vul-tec', methods=['GET'])
def api_get_vul_tec():
    return get_vul_tec()

# Endpoint para actualizar la descripción de un activo
@app.route('/api/activos/<int:activo_id>/desc', methods=['PUT'])
def api_update_activo_desc(activo_id):
    data = request.get_json()
    nueva_desc = data.get("desc")
    if nueva_desc is None:
        return jsonify({"status": 400, "error": "No se proporcionó una nueva descripción"}), 400
    return update_activo_desc(activo_id, nueva_desc)

# Endpoint para actualizar el estado de implementación de un control
@app.route('/api/controles/<code>', methods=['PUT'])
def api_update_control_state(code):
    data = request.get_json()
    new_state = data.get("state")
    return update_control_state(code, new_state)

# Endpoint para actualizar el estado de cumplimiento de un rol
@app.route('/api/roles/<int:id>/estatus', methods=['PUT'])
def api_update_role_status(id):
    data = request.get_json()
    new_status = data.get("status")
    return update_role_status(id, new_status)

# Endpoint para actualizar la persona asignada a un rol
@app.route('/api/roles/<int:id>/persona', methods=['PUT'])
def api_update_role_person(id):
    data = request.get_json()
    new_person = data.get("assignedPerson")
    return update_role_person(id, new_person)

# Endpoint para actualizar acciones pendientes de un rol
@app.route('/api/roles/<int:id>/pending-actions', methods=['PUT'])
def api_update_role_pending_actions(id):
    data = request.get_json()
    new_pending_actions = data.get("pendingActions")
    return update_role_pending_actions(id, new_pending_actions)

# Endpoint para actualizar el estado de capacitación de una persona
@app.route('/api/personas/<int:id>/estatus', methods=['PUT'])
def api_update_person_status(id):
    data = request.get_json()
    new_status = data.get("status")
    return update_person_status(id, new_status)

# Endpoint para actualizar el impacto de un activo
@app.route('/api/activos/<int:activo_id>/impacto', methods=['PUT'])
def api_update_activo_impacto(activo_id):
    data = request.get_json()
    nuevo_impacto = data.get("impact")
    return update_activo_impacto(activo_id, nuevo_impacto)

# Endpoint para actualizar la posible pérdida debido a una vulnerabilidad técinca
@app.route('/api/vul-tec/<id>/perdida', methods=['PUT'])
def api_update_perdida_tec(id):
    data = request.get_json()
    nueva_perdida = data.get("potentialLoss")
    return update_perdida_tec(id, nueva_perdida)

# Endpoint para actualizar la posible pérdida debido a una vulnerabilidad organizacional
@app.route('/api/vul-org/<int:id>/perdida', methods=['PUT'])
def api_update_perdida_org(id):
    data = request.get_json()
    nueva_perdida = data.get("potentialLoss")
    return update_perdida_org(id, nueva_perdida)

# Endpoint para actualizar el impacto de una vulnerabilidad técinca
@app.route('/api/vul-tec/<id>/impacto', methods=['PUT'])
def api_update_vul_tec_impacto(id):
    data = request.get_json()
    nuevo_impacto = data.get("impact")
    return update_vul_tec_impacto(id, nuevo_impacto)

# Endpoint para actualizar el impacto de una vulnerabilidad organizacional
@app.route('/api/vul-org/<int:id>/impacto', methods=['PUT'])
def api_update_vul_org_impacto(id):
    data = request.get_json()
    nuevo_impacto = data.get("impact")
    return update_vul_org_impacto(id, nuevo_impacto)

# Endpoint para generar la guìa de implementaciòn de un control y guardarlo en la base de datos, regresa la guia
@app.route('/api/controles/<code>/guia', methods=['POST'])
def api_generar_guia(code):
    data = request.get_json()
    nombre = data.get("nombre")
    return generar_guia(code, nombre)

# Endpoint para obtener la guìa de implementaciòn de un control
@app.route('/api/controles/<code>/guia', methods=['GET'])
def api_get_guia(code):
    return get_guia(code)

# Endpoint para obtener todos los reportes generados
@app.route('/api/reportes', methods=['GET'])
def api_get_reportes():
    return get_reportes()

# Endpoint para obtener configuracion de auditorias
@app.route('/api/configuracion', methods=['GET'])
def api_get_conf():
    return get_conf()

# Endpoint para actualizar configuracion de recurrencia
@app.route('/api/configuracion/recurrencia', methods=['PUT'])
def api_update_recurrencia():
    data = request.get_json()
    nueva_recurrencia = data.get("recurrencia")
    return update_recurrencia(nueva_recurrencia)

# Endpoint para actualizar proxima auditoria
@app.route('/api/configuracion/prox_auditoria', methods=['PUT'])
def api_update_prox_auditoria():
    data = request.get_json()
    prox_auditoria = data.get("prox_auditoria")
    return update_prox_auditoria(prox_auditoria)

# Endpoint para generar reporte en base a fechas
@app.route('/api/reportes/generar', methods=['PUT'])
def api_generar_reporte():
    data = request.get_json()
    fechaInicio = data.get("fechaInicio")
    fechaFin = data.get("fechaFin")
    return generar_reporte(fechaInicio, fechaFin)

# Endpoint para generar recomendaciones de controles
@app.route('/api/recomendar', methods=['PUT'])
def api_generar_controles():
    return generar_controles()

# Endpoint para subir NIST pdf
@app.route('/api/upload', methods=['PUT'])
def api_upload_file():
    return upload_file()

# Endpoint para calcular netscore
@app.route('/api/netscore', methods=['PUT'])
def api_calculate_netscore():
    return calculate_netscore()

# Endpoint para calcular la info del dashboard
@app.route('/api/dashboard/calculate', methods=['PUT'])
def api_calculate_dashboard():
    return calculate_dashboard()

# Endpoint para traer la info del dashboard
@app.route('/api/dashboard/get', methods=['GET'])
def api_get_dashboard():
    return get_dashboard()
# Endpoint para borrar un reporte
@app.route('/api/reportes/<int:id>/borrar', methods=['DELETE'])
def api_delete_report(id):
    return delete_reporte(id)


# Endpoint para generar (redactar) vulnerabilidades organizacionales
@app.route('/api/vul-org/generate', methods=['PUT'])
def api_generar_vul_org():
    return generar_vul_org()

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)