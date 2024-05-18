from flask import Flask, jsonify, request
from flask_cors import CORS
import pandas as pd
import datetime
import firebase_admin
from firebase_admin import credentials, storage

# Initialize Firebase
cred = credentials.Certificate('/Users/fechinmitchell/Projects/GAAStudio/backend/gaastudio-2a7ac-firebase-adminsdk-pxkjd-a10063e0b0.json')
firebase_admin.initialize_app(cred, {
    'storageBucket': 'gaastudio-2a7ac.appspot.com'
})

app = Flask(__name__)
CORS(app)

# Get a reference to the storage service
bucket = storage.bucket()

def generate_signed_url(path):
    blob = bucket.blob(path)
    url = blob.generate_signed_url(expiration=datetime.timedelta(hours=1), method='GET')
    return url

@app.route('/pressuremaps/<team>')
def get_pressure_map(team):
    path = f"datasets/Pressure/{team}_Pressure_Map.png"
    url = generate_signed_url(path)
    return jsonify({'url': url})

@app.route('/tacklesmaps/<team>')
def get_tackle_map(team):
    path = f"datasets/Tackles/{team}_unsuccesful_tackles.png"
    url = generate_signed_url(path)
    return jsonify({'url': url})

@app.route('/players', methods=['GET'])
def get_player_stats():
    path = 'backend/DS_Player_Stats_Sorted_by_Difference_with_xPoints.json'
    url = generate_signed_url(path)
    return jsonify({'url': url})

@app.route('/blockedmaps/<team>')
def get_blocked_map(team):
    path = f"datasets/Blocked/{team}_block_points.png"
    url = generate_signed_url(path)
    return jsonify({'url': url})

@app.route('/sdpmchart/<team>')
def get_sdpm_chart(team):
    path = f"datasets/SDPM/{team}_SDPM_Chart.png"
    url = generate_signed_url(path)
    return jsonify({'url': url})

@app.route('/asdmap/<team>')
def get_asd_map(team):
    path = f"datasets/ASD/{team}_average_shot_positions.png"
    url = generate_signed_url(path)
    return jsonify({'url': url})

@app.route('/ppmaps/<team>')
def get_pp_map(team):
    path = f"datasets/PP/{team}_pressure_points.png"
    url = generate_signed_url(path)
    return jsonify({'url': url})

@app.route('/heatmaps/<team>/<category>')
def get_heatmap(team, category):
    path = f"datasets/{category.capitalize()}/{team}_{category.lower()}_heat_map.jpg"
    url = generate_signed_url(path)
    return jsonify({'url': url})

@app.route('/teams', methods=['GET'])
def get_teams():
    path = 'backend/Football_Championship_2023_Shots_With_Expected_Points.json'
    url = generate_signed_url(path)
    return jsonify({'url': url})


# Define the scoring zone parameters
GOAL_LINE = 145  # The goal line's x-coordinate
SCORING_ZONE_DEPTH = 32  # The depth of the scoring zone from the goal line
CENTER_WIDTH = 44  # The center of the pitch width-wise
SCORING_ZONE_HALF_WIDTH = 28  # Half the width of the scoring zone

# Function to check if a shot is within the scoring zone
def is_within_scoring_zone(x, y):
    return (GOAL_LINE - SCORING_ZONE_DEPTH) <= x <= GOAL_LINE and \
           (CENTER_WIDTH - SCORING_ZONE_HALF_WIDTH) <= y <= (CENTER_WIDTH + SCORING_ZONE_HALF_WIDTH)

# Endpoint for getting scoring zone efficiency
@app.route('/scoring-zone-efficiency', methods=['GET'])
def get_scoring_zone_efficiency():
    team_name = request.args.get('team')
    
    if not team_name:
        return jsonify({'error': 'Team name is required'}), 400
    
    try:
        team_data = df[df['TeamName'] == team_name]
        team_data['is_scoring_zone'] = team_data.apply(
            lambda row: is_within_scoring_zone(row['x'], row['y']), axis=1)
        
        # Calculate counts of Score and Miss in and out of scoring zone
        scoring_zone_counts = team_data.groupby('is_scoring_zone')['Score'].value_counts().unstack().fillna(0)
        
        # Calculate success rates
        scoring_zone_counts['success_rate'] = scoring_zone_counts['Score'] / (scoring_zone_counts['Score'] + scoring_zone_counts.get('Miss', 0))
        
        # Prepare data for JSON response
        response_data = {
            'inside_scoring_zone': scoring_zone_counts.loc[True].to_dict(),
            'outside_scoring_zone': scoring_zone_counts.loc[False].to_dict()
        }
        
        return jsonify(response_data)
    except Exception as e:
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True, port=5000)
