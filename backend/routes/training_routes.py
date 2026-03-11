from flask import Blueprint, request, jsonify
from controllers.training_controller import TrainingController

training_bp = Blueprint('training', __name__, url_prefix='/api/training')
training_controller = TrainingController()

@training_bp.route('/modules', methods=['GET'])
def get_training_modules():
    """Get all training modules"""
    try:
        result = training_controller.get_training_modules()
        return jsonify(result), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@training_bp.route('/modules/<module_id>', methods=['GET'])
def get_training_module(module_id):
    """Get a specific training module"""
    try:
        result = training_controller.get_training_module(module_id)
        return jsonify(result), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 404

@training_bp.route('/modules', methods=['POST'])
def create_training_module():
    """Create a new training module"""
    try:
        data = request.get_json()
        result = training_controller.create_training_module(data)
        return jsonify(result), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@training_bp.route('/modules/<module_id>', methods=['PUT'])
def update_training_module(module_id):
    """Update a training module"""
    try:
        data = request.get_json()
        result = training_controller.update_training_module(module_id, data)
        return jsonify(result), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@training_bp.route('/complete', methods=['POST'])
def mark_training_complete():
    """Mark training as complete for a visitor"""
    try:
        data = request.get_json()
        result = training_controller.mark_training_complete(data)
        return jsonify(result), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 400
