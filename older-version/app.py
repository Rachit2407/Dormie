from flask import Flask, request, jsonify, render_template, abort
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime

app = Flask(__name__)
CORS(app)

# SQLite database configuration
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///surveys.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# ------------------ MODELS ------------------
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)

    survey = db.relationship('Survey', back_populates='user', uselist=False)

class Survey(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Link to user (one-to-one)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), unique=True, nullable=False)
    user = db.relationship('User', back_populates='survey')

    # Personal / basic
    name = db.Column(db.String(100))
    age = db.Column(db.Integer)
    major = db.Column(db.String(100))

    # Schedule & calls
    sleep = db.Column(db.String(50))
    calls = db.Column(db.String(50))

    # Cleanliness & sharing
    cleanliness = db.Column(db.String(50))
    sharing_items = db.Column(db.String(50))
    share_household = db.Column(db.String(50))

    # Habits & lifestyle
    diet = db.Column(db.String(50))
    smoke = db.Column(db.String(50))
    alcohol = db.Column(db.String(50))
    visitors = db.Column(db.String(50))

    # Noise & study preferences
    noise = db.Column(db.String(50))
    lighting = db.Column(db.String(50))
    study_env = db.Column(db.String(50))
    headphones = db.Column(db.String(50))

    # Environment & comfort
    temperature = db.Column(db.String(50))
    windows = db.Column(db.String(50))
    scents = db.Column(db.String(50))

    # Money & responsibilities
    split_expenses = db.Column(db.String(50))

    # Stress & personality
    stress = db.Column(db.String(100))
    social = db.Column(db.String(50))

    # Hobbies (stored as comma-separated string)
    hobbies = db.Column(db.Text)

    def to_dict(self):
        return {
            'id': self.id,
            'created_at': self.created_at.isoformat(),
            'user_id': self.user_id,
            'name': self.name,
            'age': self.age,
            'major': self.major,
            'sleep': self.sleep,
            'calls': self.calls,
            'cleanliness': self.cleanliness,
            'sharing_items': self.sharing_items,
            'share_household': self.share_household,
            'diet': self.diet,
            'smoke': self.smoke,
            'alcohol': self.alcohol,
            'visitors': self.visitors,
            'noise': self.noise,
            'lighting': self.lighting,
            'study_env': self.study_env,
            'headphones': self.headphones,
            'temperature': self.temperature,
            'windows': self.windows,
            'scents': self.scents,
            'split_expenses': self.split_expenses,
            'stress': self.stress,
            'social': self.social,
            'hobbies': self.hobbies
        }

# ------------------ PAGE ROUTES ------------------
@app.route('/')
def index():
    return render_template('index.html')

@app.route('/home')
def home():
    return render_template('home.html')

@app.route('/profile')
def profile():
    return render_template('profile.html')

# ------------------ API ENDPOINTS ------------------
@app.route('/survey', methods=['POST'])
def create_or_update_survey():
    """
    Create or update a user's survey/profile.
    Required in request JSON:
      - username   (the owner username; we look up User)
    If a survey for that user exists, update it; otherwise create it.
    """
    data = request.json or {}
    username = data.get('username')
    if not username:
        return jsonify({'message': 'username is required'}), 400

    user = User.query.filter_by(username=username).first()
    if not user:
        return jsonify({'message': 'user not found; please signup first'}), 404

    # normalize hobbies if list
    hobbies = data.get('hobbies')
    if isinstance(hobbies, list):
        hobbies = ', '.join(hobbies)

    # Try to find existing survey for this user
    survey = Survey.query.filter_by(user_id=user.id).first()

    # Helper to set fields from payload
    def set_fields(s):
        s.name = data.get('name')
        s.age = int(data.get('age')) if data.get('age') not in (None, '') else None
        s.major = data.get('major')
        s.sleep = data.get('sleep')
        s.calls = data.get('calls')
        s.cleanliness = data.get('cleanliness')
        s.sharing_items = data.get('sharing_items')
        s.share_household = data.get('share_household')
        s.diet = data.get('diet')
        s.smoke = data.get('smoke')
        s.alcohol = data.get('alcohol')
        s.visitors = data.get('visitors')
        s.noise = data.get('noise')
        s.lighting = data.get('lighting')
        s.study_env = data.get('study_env')
        s.headphones = data.get('headphones')
        s.temperature = data.get('temperature')
        s.windows = data.get('windows')
        s.scents = data.get('scents')
        s.split_expenses = data.get('split_expenses')
        s.stress = data.get('stress')
        s.social = data.get('social')
        s.hobbies = hobbies

    if survey:
        # update
        set_fields(survey)
        db.session.commit()
        return jsonify({'message': 'Survey updated', 'id': survey.id}), 200
    else:
        # create new
        new_survey = Survey(user_id=user.id)
        set_fields(new_survey)
        db.session.add(new_survey)
        db.session.commit()
        return jsonify({'message': 'Survey created', 'id': new_survey.id}), 201

@app.route('/survey/<string:username>', methods=['GET'])
def get_survey_for_user(username):
    """Return the survey for the given username (useful to pre-fill edit form)."""
    user = User.query.filter_by(username=username).first()
    if not user:
        return jsonify({'message': 'user not found'}), 404
    survey = Survey.query.filter_by(user_id=user.id).first()
    if not survey:
        return jsonify({'message': 'no survey found'}), 404
    return jsonify(survey.to_dict())

@app.route('/profiles', methods=['GET'])
def get_profiles():
    surveys = Survey.query.order_by(Survey.created_at.desc()).all()
    profiles = []
    for s in surveys:
        # Build a small profile summary useful for the front-end
        profiles.append({
            'id': s.id,
            'name': s.name or s.user.username,
            'major': s.major,
            'age': s.age,
            'bio': f"{s.major or ''} • Cleanliness: {s.cleanliness or 'N/A'} • Diet: {s.diet or 'N/A'}",
            'preferences': {
                'sleep': s.sleep,
                'calls': s.calls,
                'smoke': s.smoke,
                'alcohol': s.alcohol,
                'noise': s.noise,
                'study_env': s.study_env,
                'scents': s.scents
            },
            # placeholder / sample photo
            'photo': 'https://randomuser.me/api/portraits/lego/1.jpg',
            'hobbies': s.hobbies
        })
    return jsonify(profiles)

@app.route('/api/signup', methods=['POST'])
def signup():
    data = request.json or {}
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')

    if not username or not password:
        return jsonify({'message': 'Username and password required'}), 400

    if User.query.filter_by(username=username).first():
        return jsonify({'message': 'Username already exists'}), 400

    password_hash = generate_password_hash(password)
    new_user = User(username=username, email=email, password_hash=password_hash)
    db.session.add(new_user)
    db.session.commit()

    return jsonify({'message': 'User created successfully', 'username': username})

@app.route('/api/login', methods=['POST'])
def login():
    data = request.json or {}
    username = data.get('username')
    password = data.get('password')

    user = User.query.filter_by(username=username).first()
    if user and check_password_hash(user.password_hash, password):
        # For now return username (frontend can store it in localStorage)
        return jsonify({'success': True, 'username': user.username})
    return jsonify({'success': False}), 401

# ------------------ MAIN ------------------
if __name__ == '__main__':
    with app.app_context():
        db.create_all()  # creates tables if they don't exist
    app.run(debug=True)
