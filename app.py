import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from flask import Flask
from flask_cors import CORS
from routes.auth_routes import auth_bp
import os

app = Flask(__name__)
CORS(app) # Allows your frontend to talk to this backend

# Register the authentication routes
app.register_blueprint(auth_bp, url_prefix='/auth')

if __name__ == '__main__':
    app.run(debug=True, port=5000)