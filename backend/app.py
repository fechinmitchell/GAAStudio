from flask import Flask, jsonify, request
from flask_cors import CORS
import firebase_admin
from firebase_admin import credentials, storage
import datetime
import pandas as pd
from dotenv import load_dotenv
import os
import logging

logging.basicConfig(level=logging.DEBUG)

# Load environment variables from .env file
load_dotenv()

# Retrieve environment variables
FIREBASE_PRIVATE_KEY = os.getenv("FIREBASE_PRIVATE_KEY")
if FIREBASE_PRIVATE_KEY is None:
    raise ValueError("Missing FIREBASE_PRIVATE_KEY in environment variables")

# Initialize Firebase Admin with environment variables
try:
    firebase_config = {
        "type": os.getenv("FIREBASE_TYPE"),
        "project_id": os.getenv("FIREBASE_PROJECT_ID"),
        "private_key_id": os.getenv("FIREBASE_PRIVATE_KEY_ID"),
        "private_key": FIREBASE_PRIVATE_KEY.replace('\\n', '\n'),
        "client_email": os.getenv("FIREBASE_CLIENT_EMAIL"),
        "client_id": os.getenv("FIREBASE_CLIENT_ID"),
        "auth_uri": os.getenv("FIREBASE_AUTH_URI"),
        "token_uri": os.getenv("FIREBASE_TOKEN_URI"),
        "auth_provider_x509_cert_url": os.getenv("FIREBASE_AUTH_PROVIDER_CERT_URL"),
        "client_x509_cert_url": os.getenv("FIREBASE_CLIENT_CERT_URL"),
        "universe_domain": os.getenv("FIREBASE_UNIVERSE_DOMAIN")
    }
    logging.info("Initializing Firebase Admin")
    cred = credentials.Certificate(firebase_config)
    firebase_admin.initialize_app(cred, {
        'storageBucket': f"{os.getenv('FIREBASE_PROJECT_ID')}.appspot.com"
    })
    logging.info("Firebase Admin initialized successfully.")
except Exception as e:
    logging.error(f"Error initializing Firebase Admin: {e}")
    raise

app = Flask(__name__)

# Allow CORS for your Vercel domain
CORS(app, resources={r"/*": {"origins": ["http://localhost:3000", "https://gaa-studio.vercel.app", "https://gaa-studio.com", "https://www.gaa-studio.com"]}})

@app.route('/healthz')
def health_check():
    return "OK", 200

@app.route('/test-cors', methods=['GET'])
def test_cors():
    response = jsonify({'message': 'CORS is working!'})
    response.headers.add("Access-Control-Allow-Origin", "*")
    return response

@app.route('/test-image-url')
def test_image_url():
    logging.info("Accessed /test-image-url")
    try:
        path = 'datasets/ASD/Armagh_average_shot_positions.png'
        url = generate_signed_url(path)
        logging.debug(f"Generated signed URL: {url}")
        return jsonify({'url': url})
    except Exception as e:
        logging.error(f"Error generating signed URL: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/players', methods=['GET'])
def get_player_stats():
    try:
        path = 'backend/DS_Player_Stats_Sorted_by_Difference_with_xPoints.json'
        url = generate_signed_url(path)
        response = pd.read_json(url)
        player_stats_json = response.to_dict(orient='records')
        return jsonify(player_stats_json)
    except Exception as e:
        logging.error(f"Error fetching player stats: {e}")
        return jsonify({'error': str(e)}), 500

def generate_signed_url(blob_path):
    try:
        bucket = storage.bucket()
        blob = bucket.blob(blob_path)
        signed_url = blob.generate_signed_url(expiration=datetime.timedelta(hours=1), method='GET')
        logging.debug(f"Generated signed URL: {signed_url}")
        return signed_url
    except Exception as e:
        logging.error(f"Error generating signed URL for {blob_path}: {e}")
        raise

@app.route('/pressuremaps/<team>')
def get_pressure_map(team):
    path = f"datasets/Pressure/{team}_Pressure_Map.png"
    return jsonify({'url': generate_signed_url(path)})

@app.route('/tacklesmaps/<team>')
def get_tackle_map(team):
    path = f"datasets/Tackles/{team}_unsuccesful_tackles.png"
    return jsonify({'url': generate_signed_url(path)})

@app.route('/blockedmaps/<team>')
def get_blocked_map(team):
    path = f"datasets/Blocked/{team}_block_points.png"
    return jsonify({'url': generate_signed_url(path)})

@app.route('/sdpmchart/<team>')
def get_sdpm_chart(team):
    path = f"datasets/SDPM/{team}_SDPM_Chart.png"
    return jsonify({'url': generate_signed_url(path)})

@app.route('/asdmap/<team>')
def get_asd_map(team):
    path = f"datasets/ASD/{team}_average_shot_positions.png"
    return jsonify({'url': generate_signed_url(path)})

@app.route('/ppmaps/<team>')
def get_pp_map(team):
    path = f"datasets/PP/{team}_pressure_points.png"
    return jsonify({'url': generate_signed_url(path)})

@app.route('/heatmaps/<team>/<category>')
def get_heatmap(team, category):
    path = f"datasets/{category.capitalize()}/{team}_{category.lower()}_heat_map.jpg"
    return jsonify({'url': generate_signed_url(path)})

@app.route('/teams', methods=['GET'])
def get_teams():
    try:
        df = get_dataframe_from_firebase('backend/Football_Championship_2023_Shots_With_Expected_Points.json')
        teams = df['TeamName'].unique().tolist()
        return jsonify(teams)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

def get_dataframe_from_firebase(blob_name):
    url = generate_signed_url(blob_name)
    return pd.read_json(url)

GOAL_LINE = 145
SCORING_ZONE_DEPTH = 32
CENTER_WIDTH = 44
SCORING_ZONE_HALF_WIDTH = 28

def is_within_scoring_zone(x, y):
    return (GOAL_LINE - SCORING_ZONE_DEPTH) <= x <= GOAL_LINE and \
           (CENTER_WIDTH - SCORING_ZONE_HALF_WIDTH) <= y <= (CENTER_WIDTH + SCORING_ZONE_HALF_WIDTH)

@app.route('/scoring-zone-efficiency', methods=['GET'])
def get_scoring_zone_efficiency():
    team_name = request.args.get('team')
    if not team_name:
        return jsonify({'error': 'Team name is required'}), 400
    try:
        df = get_dataframe_from_firebase('backend/Football_Championship_2023_Shots_With_Expected_Points.json')
        team_data = df[df['TeamName'] == team_name]
        team_data.loc[:, 'is_scoring_zone'] = team_data.apply(lambda row: is_within_scoring_zone(row['x'], row['y']), axis=1)
        scoring_zone_counts = team_data.groupby('is_scoring_zone')['Score'].value_counts().unstack().fillna(0)
        scoring_zone_counts['success_rate'] = scoring_zone_counts['Score'] / (scoring_zone_counts['Score'] + scoring_zone_counts.get('Miss', 0))
        response_data = {
            'inside_scoring_zone': scoring_zone_counts.loc[True].to_dict(),
            'outside_scoring_zone': scoring_zone_counts.loc[False].to_dict()
        }
        return jsonify(response_data)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)

