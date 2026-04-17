from flask import Blueprint, jsonify, request
import jwt
import os
from services.recommender import get_recommendations

recommendations_bp = Blueprint('recommendations', __name__)

def get_user_id_from_token():
    auth_header = request.headers.get('Authorization', '')
    if not auth_header.startswith('Bearer '):
        return None
    token = auth_header.split(' ')[1]
    try:
        decoded = jwt.decode(token, os.getenv('JWT_SECRET'), algorithms=['HS256'])
        return decoded.get('id')
    except Exception:
        return None

@recommendations_bp.route('/recommendations')
def recommendations():
    user_id = get_user_id_from_token()
    if not user_id:
        return jsonify({'error': 'Unauthorized'}), 401
    
    try:
        recs = get_recommendations(user_id)
        return jsonify({'recommendations': recs, 'count': len(recs)})
    except Exception as e:
        return jsonify({'error': str(e)}), 500
