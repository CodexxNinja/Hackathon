# QR Service
import qrcode
from io import BytesIO
import os
from datetime import datetime

class QRService:
    """Service for QR code generation and decoding"""
    
    def __init__(self):
        self.qr_version = 1
        self.box_size = 10
        self.border = 2

    def generate_qr_code(self, data, filename=None):
        """Generate QR code from data and save as image"""
        try:
            qr = qrcode.QRCode(
                version=self.qr_version,
                error_correction=qrcode.constants.ERROR_CORRECT_L,
                box_size=self.box_size,
                border=self.border,
            )
            qr.add_data(data)
            qr.make(fit=True)
            
            img = qr.make_image(fill_color="black", back_color="white")
            
            if filename:
                filepath = os.path.join('backend/uploads', filename)
                os.makedirs(os.path.dirname(filepath), exist_ok=True)
                img.save(filepath)
                return {'success': True, 'filename': filename, 'path': filepath}
            else:
                # Return as BytesIO object
                img_bytes = BytesIO()
                img.save(img_bytes)
                img_bytes.seek(0)
                return {'success': True, 'image': img_bytes}
        except Exception as e:
            return {'success': False, 'error': str(e)}

    def generate_visit_qr(self, visit_id, visitor_name):
        """Generate QR code for visit pass"""
        try:
            qr_data = {
                'visit_id': visit_id,
                'visitor_name': visitor_name,
                'timestamp': datetime.utcnow().isoformat()
            }
            filename = f"qr_{visit_id}.png"
            return self.generate_qr_code(str(qr_data), filename)
        except Exception as e:
            return {'success': False, 'error': str(e)}

    def decode_qr_code(self, image_path):
        """Decode QR code from image"""
        try:
            from pyzbar.pyzbar import decode
            from PIL import Image
            
            img = Image.open(image_path)
            decoded_objects = decode(img)
            
            if decoded_objects:
                results = []
                for obj in decoded_objects:
                    results.append({
                        'type': obj.type,
                        'data': obj.data.decode('utf-8')
                    })
                return {'success': True, 'data': results}
            else:
                return {'success': False, 'error': 'No QR code found in image'}
        except Exception as e:
            return {'success': False, 'error': str(e)}
