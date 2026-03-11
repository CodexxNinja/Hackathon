from datetime import datetime
from bson.objectid import ObjectId

class Assessment:
    """Assessment Model - Represents a training assessment/quiz result"""
    
    def __init__(self, visitor_id, training_id, score, passed, attempts, _id=None):
        self._id = _id or ObjectId()
        self.visitor_id = visitor_id
        self.training_id = training_id
        self.score = score
        self.passed = passed
        self.attempts = attempts
        self.completed_at = datetime.utcnow()
        self.created_at = datetime.utcnow()
        self.updated_at = datetime.utcnow()

    def to_dict(self):
        """Convert to dictionary for database storage"""
        return {
            '_id': self._id,
            'visitor_id': self.visitor_id,
            'training_id': self.training_id,
            'score': self.score,
            'passed': self.passed,
            'attempts': self.attempts,
            'completed_at': self.completed_at,
            'created_at': self.created_at,
            'updated_at': self.updated_at
        }

    @staticmethod
    def from_dict(data):
        """Create Assessment instance from dictionary"""
        return Assessment(
            visitor_id=data.get('visitor_id'),
            training_id=data.get('training_id'),
            score=data.get('score'),
            passed=data.get('passed'),
            attempts=data.get('attempts'),
            _id=data.get('_id')
        )
