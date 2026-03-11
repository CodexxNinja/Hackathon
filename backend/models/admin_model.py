from datetime import datetime, timezone
from bson.objectid import ObjectId
from config.db_config import admins_collection

class Admin:
    def __init__(self, username, email, password_hash, role='admin', _id=None):
        self._id = _id or ObjectId()
        self.username = username
        self.email = email
        self.password_hash = password_hash
        self.role = role
        self.is_active = True
        self.created_at = datetime.now(timezone.utc)

    def to_dict(self):
        return {
            '_id': self._id,
            'username': self.username,
            'email': self.email,
            'password_hash': self.password_hash,
            'role': self.role,
            'is_active': self.is_active,
            'created_at': self.created_at
        }

    @staticmethod
    def from_dict(data):
        if not data: return None
        admin = Admin(
            username=data.get('username'),
            email=data.get('email'),
            password_hash=data.get('password_hash'),
            role=data.get('role', 'admin'),
            _id=data.get('_id')
        )
        return admin

def find_admin_by_email(email):
    admin_data = admins_collection.find_one({"email": email})
    return Admin.from_dict(admin_data) if admin_data else None

def save_new_admin(admin_obj):
    return admins_collection.insert_one(admin_obj.to_dict())