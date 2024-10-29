from flask import Flask, jsonify, request
from upload import upload, ask_docs, ask_riesgo
from db_calls import get_activos, get_auditorias, get_controles, get_personas, get_roles, get_vul_org, get_vul_tec, update_activo_desc, update_control_state_by_code
import requests

app = Flask(__name__)


@app.route('/')
def home():
    return "Welcome to the Flask app!"


@app.route('/api/data')
def get_data():
    return jsonify({"message": "Hello, World!", "status": "success"})


@app.route('/api/models/pull')
def pull_models():
    requests.post('http://myollama:11434/api/pull', json={"name": "llama2"})
    requests.post('http://myollama:11434/api/pull',
                  json={"name": "mxbai-embed-large"})
    return jsonify({"status": 200, "message": "pulling models"})


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
def update_control_state(code):
    data = request.get_json()
    new_state = data.get("state")
    return update_control_state_by_code(code, new_state)


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
