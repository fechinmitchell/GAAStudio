from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
import pandas as pd
import os

app = Flask(__name__, static_folder='static')
CORS(app)

# Load the player stats CSV file
player_stats_df = pd.read_json('/Users/fechinmitchell/Projects/GAAStudio/backend/DS_Player_Stats_Sorted_by_Difference_with_xPoints.json')

@app.route('/players', methods=['GET'])  # Changed route to '/players'
def get_player_stats():
    try:
        player_stats_json = player_stats_df.to_dict(orient='records')
        return jsonify(player_stats_json)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Path to the datasets directory containing the heatmaps
datasets_path = '/Users/fechinmitchell/Projects/GAAStudio/datasets'

# Serve Pressure Maps
@app.route('/pressuremaps/<team>')
def get_pressure_map(team):
    file_path = os.path.join(datasets_path, 'Pressure', f"{team}_Pressure_Map.png")
    if os.path.isfile(file_path):
        return send_from_directory(os.path.dirname(file_path), os.path.basename(file_path))
    else:
        return jsonify({'error': 'Pressure map not found'}), 404

# Serve tackles Maps
@app.route('/tacklesmaps/<team>')
def get_tackle_map(team):
    file_path = os.path.join(datasets_path, 'Tackles', f"{team}_unsuccesful_tackles.png")
    if os.path.isfile(file_path):
        return send_from_directory(os.path.dirname(file_path), os.path.basename(file_path))
    else:
        return jsonify({'error': 'Tackle map not found'}), 404

@app.route('/blockedmaps/<team>')
def get_blocked_map(team):
    file_path = os.path.join(datasets_path, 'Blocked', f"{team}_block_points.png")
    if os.path.isfile(file_path):
        return send_from_directory(os.path.dirname(file_path), os.path.basename(file_path))
    else:
        return jsonify({'error': 'Blocked map not found'}), 404

# Serve SDPM Maps
@app.route('/sdpmchart/<team>')
def get_sdpm_chart(team):
    file_path = os.path.join(datasets_path, 'SDPM', f"{team}_SDPM_Chart.png")
    if os.path.isfile(file_path):
        return send_from_directory(os.path.dirname(file_path), os.path.basename(file_path))
    else:
        return jsonify({'error': 'Pressure map not found'}), 404

# Serve ASD Maps
@app.route('/asdmap/<team>')
def get_asd_map(team):
    file_path = os.path.join(datasets_path, 'ASD', f"{team}_average_shot_positions.png")
    if os.path.isfile(file_path):
        return send_from_directory(os.path.dirname(file_path), os.path.basename(file_path))
    else:
        return jsonify({'error': 'ASD map not found'}), 404

# Serve Pressure Points Maps
@app.route('/ppmaps/<team>')
def get_pp_map(team):
    file_path = os.path.join(datasets_path, 'PP', f"{team}_pressure_points.png")
    if os.path.isfile(file_path):
        return send_from_directory(os.path.dirname(file_path), os.path.basename(file_path))
    else:
        return jsonify({'error': 'PP map not found'}), 404

# Serve heatmap images
@app.route('/heatmaps/<team>/<category>')
def get_heatmap(team, category):
    file_path = os.path.join(datasets_path, category.capitalize(), f"{team}_{category.lower()}_heat_map.jpg")
    if os.path.isfile(file_path):
        return send_from_directory(os.path.dirname(file_path), os.path.basename(file_path))
    else:
        return "File not found", 404

# Load the player stats and scoring data
player_stats_df = pd.read_json(os.path.join(app.config['JSON_DATASET_PATH'], 'DS_Player_Stats_Sorted_by_Difference_with_xPoints.json'))
df = pd.read_json(os.path.join(app.config['JSON_DATASET_PATH'], 'Football_Championship_2023_Shots_With_Expected_Points.json'))

# Scoring zone parameters
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
        team_data = df[df['TeamName'] == team_name]
        team_data['is_scoring_zone'] = team_data.apply(lambda row: is_within_scoring_zone(row['x'], row['y']), axis=1)
        scoring_zone_counts = team_data.groupby('is_scoring_zone')['Score'].value_counts().unstack().fillna(0)
        scoring_zone_counts['success_rate'] = scoring_zone_counts['Score'] / (scoring_zone_counts['Score'] + scoring_zone_counts.get('Miss', 0))

        response_data = {
            'inside_scoring_zone': scoring_zone_counts.loc[True].to_dict() if True in scoring_zone_counts.index else {},
            'outside_scoring_zone': scoring_zone_counts.loc[False].to_dict() if False in scoring_zone_counts.index else {}
        }
        return jsonify(response_data)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=app.config['DEBUG'], port=5000)
