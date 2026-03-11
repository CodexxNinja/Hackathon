from datetime import datetime
from bson.objectid import ObjectId

class Training:
    """Training Model - Represents a training module"""
    
    def __init__(self, title, description, video_url, duration, _id=None):
        self._id = _id or ObjectId()
        self.title = title
        self.description = description
        self.video_url = video_url
        self.duration = duration  # duration in seconds
        self.created_at = datetime.utcnow()
        self.updated_at = datetime.utcnow()

    def to_dict(self):
        """Convert to dictionary for database storage"""
        return {
            '_id': self._id,
            'title': self.title,
            'description': self.description,
            'video_url': self.video_url,
            'duration': self.duration,
            'created_at': self.created_at,
            'updated_at': self.updated_at
        }

    @staticmethod
    def from_dict(data):
        """Create Training instance from dictionary"""
        return Training(
            title=data.get('title'),
            description=data.get('description'),
            video_url=data.get('video_url'),
            duration=data.get('duration'),
            _id=data.get('_id')
        )
