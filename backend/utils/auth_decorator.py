from flask import request, jsonify
from functools import wraps
from utils.token_generator import TokenGenerator

token_gen = TokenGenerator()

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization') # Expecting 'Bearer <token>'

        if not token:
            return jsonify({'error': 'Token is missing!'}), 401

        try:
            # Remove 'Bearer ' prefix if present
            actual_token = token.split(" ")[1] if " " in token else token
            payload = token_gen.verify_token(actual_token)
            if not payload:
                raise Exception("Invalid Token")
        except:
            return jsonify({'error': 'Token is invalid or expired!'}), 401

        return f(*args, **kwargs)
    
    return decorated