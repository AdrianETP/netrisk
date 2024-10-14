from flask import Flask, jsonify, request
from upload import upload, ask_docs, ask_riesgo
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


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
