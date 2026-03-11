from services.qr_service import QRService
from config.db_config import get_collection
from datetime import datetime

class VisitController:
    """Controller for managing visitor visits"""
    
    def __init__(self):
        self.qr_service = QRService()
        self.visits_collection = get_collection('visits')
        self.visitors_collection = get_collection('visitors')

    def create_visit(self, visitor_data):
        """Create a new visit record"""
        try:
            visit_doc = {
                'visitor_id': visitor_data.get('visitor_id'),
                'entry_time': datetime.utcnow(),
                'exit_time': None,
                'status': 'active',
                'created_at': datetime.utcnow()
            }
            result = self.visits_collection.insert_one(visit_doc)
            return {
                'message': 'Visit created successfully',
                'visit_id': str(result.inserted_id)
            }
        except Exception as e:
            return {'error': str(e)}

    def get_visit(self, visit_id):
        """Get a specific visit record"""
        try:
            from bson.objectid import ObjectId
            visit = self.visits_collection.find_one({'_id': ObjectId(visit_id)})
            if visit:
                visit['_id'] = str(visit['_id'])
                return visit
            return {'error': 'Visit not found'}
        except Exception as e:
            return {'error': str(e)}

    def checkout_visitor(self, visit_id, data):
        """Check out a visitor (record exit time)"""
        try:
            from bson.objectid import ObjectId
            result = self.visits_collection.update_one(
                {'_id': ObjectId(visit_id)},
                {
                    '$set': {
                        'exit_time': datetime.utcnow(),
                        'status': 'completed',
                        'updated_at': datetime.utcnow()
                    }
                }
            )
            if result.modified_count:
                return {'message': 'Visitor checked out successfully'}
            return {'error': 'Visit not found'}
        except Exception as e:
            return {'error': str(e)}

    def get_all_visits(self, filters=None):
        """Get all visits with optional filtering"""
        try:
            query = {}
            if filters:
                if filters.get('status'):
                    query['status'] = filters['status']
                if filters.get('visitor_id'):
                    query['visitor_id'] = filters['visitor_id']
            
            visits = list(self.visits_collection.find(query))
            for visit in visits:
                visit['_id'] = str(visit['_id'])
            
            return {'visits': visits, 'count': len(visits)}
        except Exception as e:
            return {'error': str(e)}
