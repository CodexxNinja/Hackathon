# Training Service
from config.db_config import get_db
from bson.objectid import ObjectId

class TrainingService:
    """Service for training module operations"""
    
    def __init__(self):
        self.db = get_db()
        self.collection = 'training_modules'
        self.assessment_collection = 'assessments'

    def get_all_training_modules(self):
        """Get all training modules"""
        try:
            modules = list(self.db[self.collection].find().sort('created_at', 1))
            for module in modules:
                module['_id'] = str(module['_id'])
            return {'success': True, 'data': modules}
        except Exception as e:
            return {'success': False, 'error': str(e)}

    def get_required_training_modules(self):
        """Get all required training modules"""
        try:
            modules = list(self.db[self.collection].find({'required': True}).sort('created_at', 1))
            for module in modules:
                module['_id'] = str(module['_id'])
            return {'success': True, 'data': modules}
        except Exception as e:
            return {'success': False, 'error': str(e)}

    def get_training_module(self, module_id):
        """Get a specific training module"""
        try:
            module = self.db[self.collection].find_one({'_id': ObjectId(module_id)})
            if not module:
                return {'success': False, 'error': 'Training module not found'}
            module['_id'] = str(module['_id'])
            return {'success': True, 'data': module}
        except Exception as e:
            return {'success': False, 'error': str(e)}

    def mark_training_complete(self, visitor_id, module_id):
        """Mark training as completed for a visitor"""
        try:
            result = self.db[self.assessment_collection].update_one(
                {'visitor_id': ObjectId(visitor_id), 'training_id': ObjectId(module_id)},
                {'$set': {'completed_at': datetime.utcnow()}},
                upsert=True
            )
            return {'success': True, 'message': 'Training marked as complete'}
        except Exception as e:
            return {'success': False, 'error': str(e)}

    def get_visitor_training_progress(self, visitor_id):
        """Get training progress for a visitor"""
        try:
            assessments = list(self.db[self.assessment_collection].find({'visitor_id': ObjectId(visitor_id)}))
            for assessment in assessments:
                assessment['_id'] = str(assessment['_id'])
            return {'success': True, 'data': assessments}
        except Exception as e:
            return {'success': False, 'error': str(e)}
