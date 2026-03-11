<<<<<<< HEAD
from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route("/api/message")
def message():
    return jsonify({"message": "Hello from Flask backend!"})

if __name__ == "__main__":
    app.run(debug=True)
=======
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
>>>>>>> 8bb1f4a4cfd5d3ee5ab1b809e6bd7fc27aab8e84
