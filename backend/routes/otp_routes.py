from flask import Blueprint, request, jsonify
from controllers.otp_controller import OTPController

otp_bp = Blueprint('otp', __name__, url_prefix='/api/otp')
otp_controller = OTPController()

@otp_bp.route('/generate', methods=['POST'])
def generate_otp():
    """Generate and send OTP to email"""
    try:
        data = request.get_json()
        email = data.get('email')
        if not email:
            return jsonify({'error': 'Email is required'}), 400
        
        result = otp_controller.generate_otp(email)
        return jsonify(result), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@otp_bp.route('/verify', methods=['POST'])
def verify_otp():
    """Verify OTP provided by user"""
    try:
        data = request.get_json()
        email = data.get('email')
        otp_code = data.get('otp_code')
        
        if not email or not otp_code:
            return jsonify({'error': 'Email and OTP code are required'}), 400
        
        result = otp_controller.verify_otp(email, otp_code)
        return jsonify(result), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@otp_bp.route('/resend', methods=['POST'])
def resend_otp():
    """Resend OTP to email"""
    try:
        data = request.get_json()
        email = data.get('email')
        if not email:
            return jsonify({'error': 'Email is required'}), 400
        
        result = otp_controller.generate_otp(email)
        return jsonify(result), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 400
