from flask import Flask, jsonify, request
import pandas as pd

app = Flask(__name__)

# Load the dataset
df = pd.read_json('Football_Championship_2023_Shots_With_Expected_Points.json')

# Define the scoring zone parameters (adjust as needed)
GOAL_LINE = 145  # The goal line's x-coordinate
SCORING_ZONE_DEPTH = 32  # The depth of the scoring zone from the goal line
CENTER_WIDTH = 44  # The center of the pitch width-wise
SCORING_ZONE_HALF_WIDTH = 28  # Half the width of the scoring zone

# Function to check if a shot is within the scoring zone
def is_within_scoring_zone(x, y):
    return (GOAL_LINE - SCORING_ZONE_DEPTH) <= x <= GOAL_LINE and \
           (CENTER_WIDTH - SCORING_ZONE_HALF_WIDTH) <= y <= (CENTER_WIDTH + SCORING_ZONE_HALF_WIDTH)

# Add an endpoint for scoring zone efficiency
@app.route('/scoring-zone-efficiency', methods=['GET'])
def get_scoring_zone_efficiency():
    team_name = request.args.get('team')
    
    if not team_name:
        return jsonify({'error': 'Team name is required'}), 400
    
    # Filter by team
    team_data = df[df['TeamName'] == team_name]
    
    # Calculate if each shot is within the scoring zone
    team_data['is_scoring_zone'] = team_data.apply(lambda row: is_within_scoring_zone(row['x'], row['y']), axis=1)
    
    # Group by scoring zone flag, then calculate success rates
    scoring_stats = team_data.groupby(['is_scoring_zone', 'Score'])['Score'].count().unstack().fillna(0)
    
    # Calculate success rates
    scoring_stats['success_rate'] = scoring_stats['Score'] / (scoring_stats['Score'] + scoring_stats['Miss'])
    
    return jsonify(scoring_stats.to_dict())

if __name__ == '__main__':
    app.run(debug=True, port=5000)

