from datetime import datetime, timedelta
from bson.objectid import ObjectId

class OTP:
    """OTP Model - Represents One Time Password for email verification"""
    
    def __init__(self, email, otp_code, expires_in_minutes=10, _id=None):
        self._id = _id or ObjectId()
        self.email = email
        self.otp_code = otp_code
        self.created_at = datetime.utcnow()
        self.expires_at = self.created_at + timedelta(minutes=expires_in_minutes)
        self.is_used = False

    def to_dict(self):
        """Convert to dictionary for database storage"""
        return {
            '_id': self._id,
            'email': self.email,
            'otp_code': self.otp_code,
            'created_at': self.created_at,
            'expires_at': self.expires_at,
            'is_used': self.is_used
        }

    def is_expired(self):
        """Check if OTP has expired"""
        return datetime.utcnow() > self.expires_at

    def is_valid(self, provided_otp):
        """Check if provided OTP is correct and not expired"""
        return (self.otp_code == provided_otp and 
                not self.is_expired() and 
                not self.is_used)

    @staticmethod
    def from_dict(data):
        """Create OTP instance from dictionary"""
        return OTP(
            email=data.get('email'),
            otp_code=data.get('otp_code'),
            _id=data.get('_id')
        )
