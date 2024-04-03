from flask import Flask, jsonify
import pandas as pd

app = Flask(__name__)

@app.route('/api/data', methods=['GET'])
def get_data():
    # Load the JSON data
    data = pd.read_json('/path/to/your/football_data.json')
    # Convert DataFrame to JSON
    return jsonify(data.to_dict(orient='records'))

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
