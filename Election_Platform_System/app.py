from flask import Flask, request, jsonify, render_template, url_for, redirect, session
from functools import wraps
import firebase_admin
from firebase_admin import credentials, auth, firestore
from firebase_admin import firestore

# Initialize Firebase Admin with service account key
cred = credentials.Certificate("")
firebase_admin.initialize_app(cred)

app = Flask(__name__, static_folder="Frontend", template_folder="Frontend")
app.secret_key = 'your-secret-key-here'  # Add a secret key for sessions

db = firestore.client()

# Route to home page (results)
@app.route('/')
def home():
    return redirect(url_for('results_page'))

@app.route('/results')
def results_page():
    return render_template('results.html')

@app.route('/register')
def register_page():
    return render_template('register.html')

# Authentication middleware
def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'user_id' not in session:
            return redirect(url_for('login_page'))
        return f(*args, **kwargs)
    return decorated_function

@app.route('/login')
def login_page():
    return render_template('login.html')

@app.route('/vote')
@login_required
def index():
    return render_template('index.html')

@app.route('/cast-vote', methods=['POST'])
@login_required
def cast_vote():
    try:
        user_id = request.json.get('user_id')
        candidate_id = request.json.get('candidate_id')
        province = request.json.get('province')
        
        # Start a batch write
        batch = db.batch()
        
        # Update user's vote status
        user_ref = db.collection('users').document(user_id)
        batch.update(user_ref, {
            'voted': True,
            'votedCandidate': candidate_id,
            'votedAt': firestore.SERVER_TIMESTAMP
        })
        
        # Record vote
        vote_ref = db.collection('votes').document(user_id)
        batch.set(vote_ref, {
            'userId': user_id,
            'candidateId': candidate_id,
            'province': province,
            'timestamp': firestore.SERVER_TIMESTAMP
        })
        
        # Update statistics
        stats_ref = db.collection('statistics').document('vote_counts')
        stats_doc = stats_ref.get()
        
        if stats_doc.exists:
            batch.update(stats_ref, {
                'total_votes': firestore.Increment(1),
                f'candidate_{candidate_id}_votes': firestore.Increment(1),
                f'province_{province}': firestore.Increment(1)
            })
        else:
            batch.set(stats_ref, {
                'total_votes': 1,
                'candidate_1_votes': 1 if candidate_id == 1 else 0,
                'candidate_2_votes': 1 if candidate_id == 2 else 0,
                f'province_{province}': 1
            })
            
        # Commit the batch
        batch.commit()
        
        return jsonify({'success': True}), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/get-vote-counts', methods=['GET'])
def get_vote_counts():
    try:
        stats_doc = db.collection('statistics').document('vote_counts').get()
        if stats_doc.exists:
            return jsonify(stats_doc.to_dict()), 200
        return jsonify({'error': 'No vote data found'}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/auth/login', methods=['POST'])
def login_auth():
    id_token = request.json.get('id_token')
    try:
        decoded_token = auth.verify_id_token(id_token, check_revoked=True, clock_skew_seconds=5)
        user_id = decoded_token['uid']
        session['user_id'] = user_id
        return jsonify({"success": True}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 401

@app.route('/logout', methods=['POST'])
def logout():
    session.clear()
    return jsonify({"success": True}), 200

if __name__ == "__main__":
    app.run(debug=True)
