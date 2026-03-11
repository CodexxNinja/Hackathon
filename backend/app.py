from flask import Flask, render_template, request
from flask_cors import CORS
import sys
import os

# Ensure the backend directory is in the python path for imports
sys.path.append(os.path.abspath(os.path.dirname(__file__)))

from routes.auth_routes import auth_bp
from routes.visit_routes import visit_bp # Assuming this exists now

app = Flask(__name__)
CORS(app) 

# Register Blueprints
# Note: auth_bp already has '/api/auth' defined inside it
app.register_blueprint(auth_bp)
app.register_blueprint(visit_bp, url_prefix='/api/visits')

@app.route('/')
def home():
    # Ensure login.html is in the 'templates' folder
    return "Backend is running. Use /api/auth/login for authentication."

if __name__ == '__main__':
    app.run(debug=True, port=5000)