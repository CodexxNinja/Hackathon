from config.db_config import admins_collection
from bson import ObjectId

class Admin:
    def __init__(self, username, email, password_hash, role='admin', _id=None):
        self._id = _id
        self.username = username
        self.email = email
        self.password_hash = password_hash
        self.role = role

def find_admin_by_email(email):
    """Fetches admin and converts dictionary to Admin Object"""
    admin_data = admins_collection.find_one({"email": email})
    if admin_data:
        return Admin(
            username=admin_data.get('username'),
            email=admin_data.get('email'),
            password_hash=admin_data.get('password'), # Stored as 'password' in DB
            role=admin_data.get('role', 'admin'),
            _id=admin_data.get('_id')
        )
    return None

def save_new_admin(admin_obj):
    """Saves Admin Object back to dictionary in MongoDB"""
    admin_dict = {
        "username": admin_obj.username,
        "email": admin_obj.email,
        "password": admin_obj.password_hash,
        "role": admin_obj.role
    }
    return admins_collection.insert_one(admin_dict)