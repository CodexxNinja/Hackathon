# app.py
from flask import Flask
from flask_cors import CORS
import sys
import os

# Import your blueprints
from routes.auth_routes import auth_bp
from routes.admin_routes import admin_bp  # <--- New Import
from routes.visit_routes import visit_bp 

app = Flask(__name__)
CORS(app) 

# Register Blueprints
app.register_blueprint(auth_bp)   # Prefix is /api/auth (defined in its file)
app.register_blueprint(admin_bp)  # Prefix is /api/admin (defined in its file)
app.register_blueprint(visit_bp, url_prefix='/api/visits')

@app.route('/')
def home():
    return "Backend is running. Admin Dashboard is protected."

if __name__ == '__main__':
    app.run(debug=True, port=5000)