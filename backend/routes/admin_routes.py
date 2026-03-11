from flask import Blueprint, request, jsonify
from controllers.admin_controller import AdminController
# IMPORT the security guard
from utils.auth_middleware import login_required 

admin_bp = Blueprint('admin', __name__, url_prefix='/api/admin')
admin_controller = AdminController()

@admin_bp.route('/dashboard', methods=['GET'])
@login_required  # <--- LOCK ADDED
def get_dashboard():
    """Get admin dashboard with statistics"""
    try:
        result = admin_controller.get_dashboard_data()
        return jsonify(result), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@admin_bp.route('/reports', methods=['GET'])
@login_required  # <--- LOCK ADDED
def get_reports():
    """Get admin reports"""
    try:
        report_type = request.args.get('type', 'summary')
        result = admin_controller.get_reports(report_type)
        return jsonify(result), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@admin_bp.route('/visitors', methods=['GET'])
@login_required  # <--- LOCK ADDED
def get_visitors():
    """Get all visitors"""
    try:
        filters = request.args.to_dict()
        result = admin_controller.get_visitors(filters)
        return jsonify(result), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@admin_bp.route('/visitors/<visitor_id>', methods=['GET'])
@login_required  # <--- LOCK ADDED
def get_visitor_details(visitor_id):
    """Get detailed information about a visitor"""
    try:
        result = admin_controller.get_visitor_details(visitor_id)
        return jsonify(result), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 404

@admin_bp.route('/audit-logs', methods=['GET'])
@login_required  # <--- LOCK ADDED
def get_audit_logs():
    """Get audit logs"""
    try:
        filters = request.args.to_dict()
        result = admin_controller.get_audit_logs(filters)
        return jsonify(result), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 400