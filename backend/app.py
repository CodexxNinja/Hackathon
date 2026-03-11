from flask import Flask, jsonify
from flask_cors import CORS
import os
import sys

# Import the blueprint objects
from routes.auth_routes import auth_bp
from routes.admin_routes import admin_bp
from routes.visit_routes import visit_bp 

app = Flask(__name__)
CORS(app) 

# REGISTER EACH ONLY ONCE
app.register_blueprint(auth_bp)   # Uses prefix defined in auth_routes.py
app.register_blueprint(admin_bp)  # Uses prefix defined in admin_routes.py
app.register_blueprint(visit_bp, url_prefix='/api/visits')

@app.route('/')
def home():
    return jsonify({"status": "online", "message": "Backend is running"})

if __name__ == '__main__':
    app.run(debug=True, port=5000)