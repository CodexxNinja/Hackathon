from flask import Blueprint, request, jsonify
from controllers.visit_controller import VisitController

visit_bp = Blueprint('visits', __name__, url_prefix='/api/visits')
visit_controller = VisitController()

@visit_bp.route('/', methods=['POST'])
def create_visit():
    """Create a new visit record"""
    try:
        data = request.get_json()
        result = visit_controller.create_visit(data)
        return jsonify(result), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@visit_bp.route('/<visit_id>', methods=['GET'])
def get_visit(visit_id):
    """Get a specific visit record"""
    try:
        result = visit_controller.get_visit(visit_id)
        return jsonify(result), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 404

@visit_bp.route('/<visit_id>/checkout', methods=['PUT'])
def checkout_visit(visit_id):
    """Check out a visitor (record exit time)"""
    try:
        data = request.get_json()
        result = visit_controller.checkout_visitor(visit_id, data)
        return jsonify(result), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@visit_bp.route('/', methods=['GET'])
def get_all_visits():
    """Get all visits with optional filtering"""
    try:
        filters = request.args.to_dict()
        result = visit_controller.get_all_visits(filters)
        return jsonify(result), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 400
