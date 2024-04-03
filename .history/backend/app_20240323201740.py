from flask import Flask, jsonify, request
import pandas as pd

app = Flask(__name__)

# Load the dataset
df = pd.read_json('Football_Championship_2023_Shots_With_Expected_Points.json')

@app.route('/teams', methods=['GET'])
def get_teams():
    teams = df['TeamName'].unique().tolist()
    return jsonify(teams)

@app.route('/team-data', methods=['GET'])
def get_team_data():
    team_name = request.args.get('team')
    if not team_name:
        return jsonify({'error': 'Team name is required'}), 400

    team_data = df[df['TeamName'] == team_name].to_dict(orient='records')
    return jsonify(team_data)

if __name__ == '__main__':
    app.run(debug=True, port=5000)
