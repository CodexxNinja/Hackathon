# Database Configuration
import os
from dotenv import load_dotenv
from pymongo import MongoClient

load_dotenv()

# MongoDB connection details
MONGODB_URI = os.getenv('MONGODB_URI', 'mongodb://localhost:27017')
DATABASE_NAME = os.getenv('DATABASE_NAME', 'visitor_management')

# Create MongoDB client and database
client = MongoClient(MONGODB_URI)
db = client[DATABASE_NAME]

def get_db():
    """Get database instance"""
    return db

def get_collection(collection_name):
    """Get a specific collection from database"""
    return db[collection_name]

# Collections
visitors_collection = db['visitors']
visits_collection = db['visits']
training_modules_collection = db['training_modules']
assessments_collection = db['assessments']
otps_collection = db['otps']
admins_collection = db['admins']
audit_logs_collection = db['audit_logs']
