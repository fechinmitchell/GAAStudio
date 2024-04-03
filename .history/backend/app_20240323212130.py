from flask import Flask, jsonify, request
from flask_cors import CORS  # Ensure CORS is imported
import pandas as pd

app = Flask(__name__)
CORS(app)  # Apply CORS to the Flask app to allow cross-origin requests

# Load the dataset
df = pd.read_json('/Users/fechinmitchell/Projects/GAAStudio/backend/Football_Championship_2023_Shots_With_Expected_Points.json')

# Define the scoring zone parameters
GOAL_LINE = 145  # The goal line's x-coordinate
SCORING_ZONE_DEPTH = 32  # The depth of the scoring zone from the goal line
CENTER_WIDTH = 44  # The center of the pitch width-wise
SCORING_ZONE_HALF_WIDTH = 28  # Half the width of the scoring zone

# Function to check if a shot is within the scoring zone
def is_within_scoring_zone(x, y):
    return (GOAL_LINE - SCORING_ZONE_DEPTH) <= x <= GOAL_LINE and \
           (CENTER_WIDTH - SCORING_ZONE_HALF_WIDTH) <= y <= (CENTER_WIDTH + SCORING_ZONE_HALF_WIDTH)

# Endpoint for getting a list of unique team names
@app.route('/teams', methods=['GET'])
def get_teams():
    try:
        teams = df['TeamName'].unique().tolist()
        return jsonify(teams)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

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
