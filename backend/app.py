from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
import sys
import os
import json

# -------------------------------------------------
# Ensure backend directory is in Python path
# -------------------------------------------------
sys.path.append(os.path.abspath(os.path.dirname(__file__)))

# -------------------------------------------------
# Import Blueprints
# -------------------------------------------------
from routes.auth_routes import auth_bp
from routes.visit_routes import visit_bp

# -------------------------------------------------
# Initialize Flask App
# -------------------------------------------------
app = Flask(__name__)
CORS(app)

# -------------------------------------------------
# MongoDB Atlas Connection
# -------------------------------------------------
MONGO_URI = "mongodb+srv://aiavengers:aiavengers@cluster1.ajdttll.mongodb.net/"

client = MongoClient(MONGO_URI)

db = client["visitor_management"]
visitors_collection = db["visitors"]

print("✅ MongoDB Connected Successfully")

# -------------------------------------------------
# Register Blueprints
# -------------------------------------------------
app.register_blueprint(auth_bp)
app.register_blueprint(visit_bp, url_prefix="/api/visits")

# -------------------------------------------------
# SAVE VISITOR (React Form → Flask → MongoDB)
# -------------------------------------------------
@app.route("/save-visitor", methods=["POST"])
def save_visitor():

    try:
        data = request.json

        visitor_data = {
            "visitorId": data.get("visitorId"),
            "company": data.get("company"),
            "phone": data.get("phone"),
            "hostEmployee": data.get("hostEmployee"),
            "visitDate": data.get("visitDate"),
            "checkIn": data.get("checkIn"),
            "checkOut": data.get("checkOut"),
            "purpose": data.get("purpose"),
            "department": data.get("department"),
            "quizScore": data.get("quizScore"),
            "qrCode": data.get("qrCode"),
            "photo": data.get("photo")
        }

        result = visitors_collection.insert_one(visitor_data)

        return jsonify({
            "status": "success",
            "message": "Visitor saved successfully",
            "visitor_id": str(result.inserted_id)
        })

    except Exception as e:
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500


# -------------------------------------------------
# VERIFY QR CODE (Gate Scanner → MongoDB)
# -------------------------------------------------
@app.route("/verify-qr", methods=["POST"])
def verify_qr():

    try:
        data = request.json
        qr_raw = data.get("qr")

        print("📷 QR RECEIVED:", qr_raw)

        visitor_id = None

        # Try parsing QR as JSON
        try:
            qr_data = json.loads(qr_raw)
            visitor_id = qr_data.get("id")
        except:
            # If not JSON, assume raw value is visitorId
            visitor_id = qr_raw

        print("🔍 Visitor ID:", visitor_id)

        visitor = visitors_collection.find_one({"visitorId": visitor_id})

        if visitor:

            visitor["_id"] = str(visitor["_id"])

            return jsonify({
                "status": "success",
                "visitor": visitor
            })

        return jsonify({
            "status": "error",
            "message": "Visitor not found"
        })

    except Exception as e:
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500


# -------------------------------------------------
# GET ALL VISITORS (For Admin Dashboard)
# -------------------------------------------------
@app.route("/get-visitors", methods=["GET"])
def get_visitors():

    try:
        visitors = []

        for visitor in visitors_collection.find():
            visitor["_id"] = str(visitor["_id"])
            visitors.append(visitor)

        return jsonify(visitors)

    except Exception as e:
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500


# -------------------------------------------------
# HOME ROUTE
# -------------------------------------------------
@app.route("/")
def home():
    return "✅ Visitor Management Backend Running"


# -------------------------------------------------
# RUN SERVER
# -------------------------------------------------
if __name__ == "__main__":
    app.run(debug=True, port=5000)