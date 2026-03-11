from functools import wraps
from flask import request, jsonify
from utils.token_generator import TokenGenerator

token_gen = TokenGenerator()

def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        auth_header = request.headers.get('Authorization')
        
        if not auth_header or not auth_header.startswith("Bearer "):
            return jsonify({"error": "Unauthorized: No token provided"}), 401
        
        token = auth_header.split(" ")[1]
        decoded_payload = token_gen.verify_token(token)
        
        if not decoded_payload:
            return jsonify({"error": "Unauthorized: Token is invalid or expired"}), 401
            
        return f(*args, **kwargs)
        
    return decorated_function