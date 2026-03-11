# OTP Service
import random
import string

class OTPService:
    """Service for OTP generation and verification"""
    
    def __init__(self, otp_length=6):
        self.otp_length = otp_length

    def generate_otp(self):
        """Generate a random OTP code"""
        otp = ''.join(random.choices(string.digits, k=self.otp_length))
        return otp

    def verify_otp(self, provided_otp, stored_otp):
        """Verify OTP code"""
        return provided_otp == stored_otp

    def generate_custom_otp(self, characters=None, length=None):
        """Generate custom OTP with specific characters and length"""
        try:
            length = length or self.otp_length
            chars = characters or string.digits
            otp = ''.join(random.choices(chars, k=length))
            return {'success': True, 'otp': otp}
        except Exception as e:
            return {'success': False, 'error': str(e)}
