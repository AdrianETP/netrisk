from flask import Flask, jsonify

app = Flask(__name__)

@app.route('/')
def home():
    return "Welcome to the Flask app!"

@app.route('/api/data')
def get_data():
    return jsonify({"message": "Hello, World!", "status": "success"})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)

