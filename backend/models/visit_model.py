from datetime import datetime
from bson.objectid import ObjectId

class Visit:
    """Visit Model - Represents a visitor's entry and exit record"""
    
    def __init__(self, visitor_id, entry_time, exit_time=None, status='active', _id=None):
        self._id = _id or ObjectId()
        self.visitor_id = visitor_id
        self.entry_time = entry_time
        self.exit_time = exit_time
        self.status = status  # active, completed, cancelled
        self.created_at = datetime.utcnow()
        self.updated_at = datetime.utcnow()

    def to_dict(self):
        """Convert to dictionary for database storage"""
        return {
            '_id': self._id,
            'visitor_id': self.visitor_id,
            'entry_time': self.entry_time,
            'exit_time': self.exit_time,
            'status': self.status,
            'created_at': self.created_at,
            'updated_at': self.updated_at
        }

    @staticmethod
    def from_dict(data):
        """Create Visit instance from dictionary"""
        return Visit(
            visitor_id=data.get('visitor_id'),
            entry_time=data.get('entry_time'),
            exit_time=data.get('exit_time'),
            status=data.get('status', 'active'),
            _id=data.get('_id')
        )
