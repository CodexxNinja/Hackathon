from datetime import datetime
from bson.objectid import ObjectId

class Audit:
    """Audit Model - Represents an audit log entry for tracking system actions"""
    
    def __init__(self, user_id, action, details, ip_address=None, _id=None):
        self._id = _id or ObjectId()
        self.user_id = user_id
        self.action = action
        self.details = details
        self.ip_address = ip_address
        self.timestamp = datetime.utcnow()

    def to_dict(self):
        """Convert to dictionary for database storage"""
        return {
            '_id': self._id,
            'user_id': self.user_id,
            'action': self.action,
            'details': self.details,
            'ip_address': self.ip_address,
            'timestamp': self.timestamp
        }

    @staticmethod
    def from_dict(data):
        """Create Audit instance from dictionary"""
        return Audit(
            user_id=data.get('user_id'),
            action=data.get('action'),
            details=data.get('details'),
            ip_address=data.get('ip_address'),
            _id=data.get('_id')
        )
