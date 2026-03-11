# Token Generator Utility
import jwt
import os
from datetime import datetime, timedelta

class TokenGenerator:
    """Utility for JWT token generation and verification"""
    
    def __init__(self):
        self.secret_key = os.getenv('SECRET_KEY', 'your-secret-key-change-this')
        self.algorithm = 'HS256'
        self.default_expiry_hours = 24

    def generate_token(self, user_id, expires_in_hours=None):
        """Generate JWT token for a user"""
        try:
            expires_in = expires_in_hours or self.default_expiry_hours
            payload = {
                'user_id': str(user_id),
                'exp': datetime.utcnow() + timedelta(hours=expires_in),
                'iat': datetime.utcnow()
            }
            token = jwt.encode(payload, self.secret_key, algorithm=self.algorithm)
            return {'success': True, 'token': token}
        except Exception as e:
            return {'success': False, 'error': str(e)}

    def verify_token(self, token):
        """Verify and decode JWT token"""
        try:
            payload = jwt.decode(token, self.secret_key, algorithms=[self.algorithm])
            return payload
        except jwt.ExpiredSignatureError:
            print("Token has expired")
            return None
        except jwt.InvalidTokenError:
            print("Invalid token")
            return None
        except Exception as e:
            print(f"Error verifying token: {e}")
            return None

    def decode_token(self, token):
        """Decode token without verification"""
        try:
            payload = jwt.decode(token, options={"verify_signature": False})
            return {'success': True, 'data': payload}
        except Exception as e:
            return {'success': False, 'error': str(e)}

    def refresh_token(self, token):
        """Refresh an existing token"""
        try:
            payload = self.verify_token(token)
            if payload:
                return self.generate_token(payload.get('user_id'))
            else:
                return {'success': False, 'error': 'Invalid or expired token'}
        except Exception as e:
            return {'success': False, 'error': str(e)}
