# Admin Controller
from config.db_config import get_db
from datetime import datetime, timedelta
from bson.objectid import ObjectId

class AdminController:
    """Controller for admin operations"""
    
    def __init__(self):
        self.db = get_db()

    def get_dashboard_data(self):
        """Get dashboard statistics"""
        try:
            # Get today's visits
            today_start = datetime.utcnow().replace(hour=0, minute=0, second=0, microsecond=0)
            today_visits = self.db['visits'].count_documents({'created_at': {'$gte': today_start}})
            
            # Get active visitors
            active_visitors = self.db['visits'].count_documents({'status': 'active'})
            
            # Get total visitors
            total_visitors = self.db['visitors'].count_documents({})
            
            # Get training completion stats
            completed_training = self.db['assessments'].count_documents({'passed': True})
            
            return {
                'success': True,
                'data': {
                    'today_visits': today_visits,
                    'active_visitors': active_visitors,
                    'total_visitors': total_visitors,
                    'completed_training': completed_training
                }
            }
        except Exception as e:
            return {'success': False, 'error': str(e)}

    def get_reports(self, report_type='summary', date_from=None, date_to=None):
        """Get admin reports"""
        try:
            if report_type == 'summary':
                return self.get_dashboard_data()
            elif report_type == 'visits':
                visits = list(self.db['visits'].find().sort('created_at', -1).limit(50))
                for visit in visits:
                    visit['_id'] = str(visit['_id'])
                    visit['visitor_id'] = str(visit['visitor_id'])
                return {'success': True, 'data': visits}
            elif report_type == 'training':
                assessments = list(self.db['assessments'].find().sort('completed_at', -1).limit(50))
                for assessment in assessments:
                    assessment['_id'] = str(assessment['_id'])
                return {'success': True, 'data': assessments}
            else:
                return {'success': False, 'error': 'Invalid report type'}
        except Exception as e:
            return {'success': False, 'error': str(e)}

    def get_users(self):
        """Get all admin users"""
        try:
            users = list(self.db['admins'].find({}, {'password_hash': 0}))
            for user in users:
                user['_id'] = str(user['_id'])
            return {'success': True, 'data': users}
        except Exception as e:
            return {'success': False, 'error': str(e)}

    def create_user(self, data):
        """Create new admin user"""
        try:
            from utils.password_hash import PasswordHash
            
            password_hash = PasswordHash.hash_password(data.get('password'))
            user_data = {
                'username': data.get('username'),
                'email': data.get('email'),
                'password_hash': password_hash,
                'role': data.get('role', 'admin'),
                'department': data.get('department'),
                'is_active': True,
                'created_at': datetime.utcnow()
            }
            result = self.db['admins'].insert_one(user_data)
            return {'success': True, 'user_id': str(result.inserted_id), 'message': 'User created'}
        except Exception as e:
            return {'success': False, 'error': str(e)}

    def get_audit_logs(self, limit=100):
        """Get audit logs"""
        try:
            logs = list(self.db['audit_logs'].find().sort('timestamp', -1).limit(limit))
            for log in logs:
                log['_id'] = str(log['_id'])
                log['user_id'] = str(log['user_id'])
            return {'success': True, 'data': logs}
        except Exception as e:
            return {'success': False, 'error': str(e)}
