# Email Service
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from config.mail_config import MAIL_CONFIG

class EmailService:
    """Service for sending emails"""
    
    def __init__(self):
        self.config = MAIL_CONFIG

    def send_email(self, recipient_email, subject, body, is_html=True):
        """Send email with given subject and body"""
        try:
            msg = MIMEMultipart('alternative')
            msg['Subject'] = subject
            msg['From'] = self.config['MAIL_DEFAULT_SENDER']
            msg['To'] = recipient_email
            
            content_type = 'html' if is_html else 'plain'
            msg.attach(MIMEText(body, content_type))
            
            # Connect to SMTP server and send
            with smtplib.SMTP(self.config['MAIL_SERVER'], self.config['MAIL_PORT']) as server:
                if self.config['MAIL_USE_TLS']:
                    server.starttls()
                server.login(self.config['MAIL_USERNAME'], self.config['MAIL_PASSWORD'])
                server.send_message(msg)
            
            return {'success': True, 'message': f'Email sent to {recipient_email}'}
        except Exception as e:
            print(f"Error sending email: {e}")
            return {'success': False, 'error': str(e)}

    def send_otp_email(self, recipient_email, otp_code):
        """Send OTP via email"""
        subject = 'Your Visitor Management System OTP'
        body = f"""
        <html>
            <body>
                <p>Hello,</p>
                <p>Your One-Time Password (OTP) is: <strong>{otp_code}</strong></p>
                <p>This code will expire in 10 minutes.</p>
                <p>Please do not share this code with anyone.</p>
                <p>Thank you,<br>Visitor Management System</p>
            </body>
        </html>
        """
        return self.send_email(recipient_email, subject, body, is_html=True)

    def send_welcome_email(self, recipient_email, visitor_name):
        """Send welcome email to visitor"""
        subject = 'Welcome to Visitor Management System'
        body = f"""
        <html>
            <body>
                <p>Hello {visitor_name},</p>
                <p>Welcome to our Visitor Management System!</p>
                <p>Your registration was successful. You can now proceed with the training and assessment.</p>
                <p>Thank you for visiting us.</p>
                <p>Best regards,<br>Admin Team</p>
            </body>
        </html>
        """
        return self.send_email(recipient_email, subject, body, is_html=True)

    def send_checkout_email(self, recipient_email, visitor_name, visit_duration):
        """Send checkout confirmation email"""
        subject = 'Visit Checkout Confirmation'
        body = f"""
        <html>
            <body>
                <p>Hello {visitor_name},</p>
                <p>Thank you for your visit!</p>
                <p>Your visit duration: {visit_duration}</p>
                <p>We hope you had a great experience with us.</p>
                <p>Thank you,<br>Admin Team</p>
            </body>
        </html>
        """
        return self.send_email(recipient_email, subject, body, is_html=True)
