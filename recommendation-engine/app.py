from flask import Flask, jsonify, request
from flask_cors import CORS
from dotenv import load_dotenv
import os

load_dotenv()

app = Flask(__name__)
CORS(app)

from routes.recommendations import recommendations_bp
app.register_blueprint(recommendations_bp)

@app.route('/health')
def health():
    return jsonify({'status': 'healthy', 'service': 'watchweave-recommendation-engine'})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=os.getenv('FLASK_DEBUG', False))
