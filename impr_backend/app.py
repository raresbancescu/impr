from flask_cors import CORS
from flask import Flask, jsonify
import json

app = Flask(__name__)

CORS(app, origins="http://localhost:3000")

@app.route('/api/initial', methods=['GET'])
def get_initial_data():
    try:
        with open("static/filters/filters1.json", "r") as filters_file:
            filters = json.load(filters_file)

        with open("static/images/images1.json", "r") as images_file:
            images = json.load(images_file)
        return jsonify(
            {
                "filters": filters,
                "images": images
            }
        )
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True)
