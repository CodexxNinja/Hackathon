# OTP Controller
from config.db_config import get_db
from models.otp_model import OTP
from services.otp_service import OTPService
from services.email_service import EmailService
from bson.objectid import ObjectId

class OTPController:
    """Controller for OTP operations"""
    
    def __init__(self):
        self.db = get_db()
        self.collection = 'otps'
        self.otp_service = OTPService()
        self.email_service = EmailService()

    def generate_otp(self, email):
        """Generate and send OTP to email"""
        try:
            # Generate OTP
            otp_code = self.otp_service.generate_otp()
            
            # Create OTP record
            otp = OTP(email=email, otp_code=otp_code)
            
            # Save to database
            result = self.db[self.collection].insert_one(otp.to_dict())
            
            # Send OTP via email
            email_sent = self.email_service.send_otp_email(email, otp_code)
            
            if email_sent:
                return {'success': True, 'message': f'OTP sent to {email}', 'otp_id': str(result.inserted_id)}
            else:
                return {'success': False, 'error': 'Failed to send OTP email'}
        except Exception as e:
            return {'success': False, 'error': str(e)}

    def verify_otp(self, email, otp_code):
        """Verify OTP code"""
        try:
            # Find OTP record
            otp_record = self.db[self.collection].find_one({
                'email': email,
                'otp_code': otp_code,
                'is_used': False
            })
            
            if not otp_record:
                return {'success': False, 'error': 'Invalid OTP'}
            
            # Check if expired
            otp = OTP.from_dict(otp_record)
            if otp.is_expired():
                return {'success': False, 'error': 'OTP has expired'}
            
            # Mark as used
            self.db[self.collection].update_one(
                {'_id': otp_record['_id']},
                {'$set': {'is_used': True}}
            )
            
            return {'success': True, 'message': 'OTP verified successfully'}
        except Exception as e:
            return {'success': False, 'error': str(e)}

    def resend_otp(self, email):
        """Resend OTP to email"""
        try:
            # Mark previous OTPs as used
            self.db[self.collection].update_many(
                {'email': email, 'is_used': False},
                {'$set': {'is_used': True}}
            )
            
            # Generate new OTP
            return self.generate_otp(email)
        except Exception as e:
            return {'success': False, 'error': str(e)}
