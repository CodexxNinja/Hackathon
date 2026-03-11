# Training Controller
from config.db_config import get_db
from models.training_model import Training
from models.assessment_model import Assessment
from bson.objectid import ObjectId

class TrainingController:
    """Controller for training module operations"""
    
    def __init__(self):
        self.db = get_db()
        self.collection = 'training_modules'
        self.assessment_collection = 'assessments'

    def get_training_modules(self):
        """Get all training modules"""
        try:
            modules = list(self.db[self.collection].find().sort('created_at', -1))
            for module in modules:
                module['_id'] = str(module['_id'])
            return {'success': True, 'data': modules}
        except Exception as e:
            return {'success': False, 'error': str(e)}

    def create_training_module(self, data):
        """Create a new training module"""
        try:
            training = Training(
                title=data.get('title'),
                description=data.get('description'),
                video_url=data.get('video_url'),
                duration=data.get('duration'),
                required=data.get('required', True)
            )
            result = self.db[self.collection].insert_one(training.to_dict())
            return {'success': True, 'module_id': str(result.inserted_id), 'message': 'Training module created'}
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

    def update_training_module(self, module_id, data):
        """Update training module"""
        try:
            result = self.db[self.collection].update_one(
                {'_id': ObjectId(module_id)},
                {'$set': data}
            )
            if result.matched_count == 0:
                return {'success': False, 'error': 'Training module not found'}
            return {'success': True, 'message': 'Training module updated'}
        except Exception as e:
            return {'success': False, 'error': str(e)}

    def delete_training_module(self, module_id):
        """Delete training module"""
        try:
            result = self.db[self.collection].delete_one({'_id': ObjectId(module_id)})
            if result.deleted_count == 0:
                return {'success': False, 'error': 'Training module not found'}
            return {'success': True, 'message': 'Training module deleted'}
        except Exception as e:
            return {'success': False, 'error': str(e)}

    def complete_training(self, data):
        """Record training completion and assessment"""
        try:
            assessment = Assessment(
                visitor_id=data.get('visitor_id'),
                training_id=data.get('training_id'),
                score=data.get('score'),
                passed=data.get('passed'),
                attempts=data.get('attempts', 1),
                time_taken=data.get('time_taken')
            )
            result = self.db[self.assessment_collection].insert_one(assessment.to_dict())
            return {'success': True, 'assessment_id': str(result.inserted_id), 'message': 'Training completion recorded'}
        except Exception as e:
            return {'success': False, 'error': str(e)}
