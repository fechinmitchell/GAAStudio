# backend/app.py

from flask import Flask, jsonify, request
from flask_cors import CORS
import firebase_admin
from firebase_admin import credentials, storage
import datetime
import pandas as pd

# Initialize Firebase Admin
cred_path = '/Users/fechinmitchell/Projects/GAAStudio/backend/gaastudio-2a7ac-firebase-adminsdk-pxkjd-a10063e0b0.json'
cred = credentials.Certificate(cred_path)
firebase_admin.initialize_app(cred, {
    'storageBucket': 'gaastudio-2a7ac.appspot.com'
})

app = Flask(__name__)
CORS(app)

@app.route('/test-image-url')
def test_image_url():
    path = 'datasets/ASD/Armagh_average_shot_positions.png'
    url = generate_signed_url(path)
    return jsonify({'url': url})


@app.route('/players', methods=['GET'])
def get_player_stats():
    try:
        path = 'backend/DS_Player_Stats_Sorted_by_Difference_with_xPoints.json'
        url = generate_signed_url(path)
        response = pd.read_json(url)
        player_stats_json = response.to_dict(orient='records')
        return jsonify(player_stats_json)
    except Exception as e:
        return jsonify({'error': str(e)}), 500


def generate_signed_url(blob_path):
    bucket = storage.bucket()
    blob = bucket.blob(blob_path)
    signed_url = blob.generate_signed_url(expiration=datetime.timedelta(hours=1), method='GET')
    print(f"Generated signed URL: {signed_url}")  # Log the URL
    return signed_url

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
