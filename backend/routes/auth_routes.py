from flask import Blueprint, request, jsonify
from models.admin_model import Admin, find_admin_by_email, save_new_admin
from utils.password_hash import hash_user_password, verify_user_password
from utils.token_generator import TokenGenerator

auth_bp = Blueprint('auth', __name__, url_prefix='/api/auth')
token_gen = TokenGenerator()

@auth_bp.route('/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        if find_admin_by_email(data['email']):
            return jsonify({"error": "Admin already exists"}), 400

        hashed_pw = hash_user_password(data['password'])
        new_admin = Admin(
            username=data.get('username', 'Admin'), 
            email=data['email'], 
            password_hash=hashed_pw
        )
        save_new_admin(new_admin)
        return jsonify({'message': 'Admin registered successfully'}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@auth_bp.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        admin = find_admin_by_email(data.get('email'))

        # FIXED: Using admin.password_hash (dot notation) instead of admin['password']
        if admin and verify_user_password(admin.password_hash, data.get('password')):
            token = token_gen.generate_token(user_id=str(admin._id))
            return jsonify({
                "message": "Login successful",
                "token": token,
                "user": {"username": admin.username, "role": admin.role}
            }), 200
        
        return jsonify({"error": "Invalid email or password"}), 401
    except Exception as e:
        # This will no longer catch the 'subscriptable' error because it's fixed above
        return jsonify({'error': str(e)}), 400