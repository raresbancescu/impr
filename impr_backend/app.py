from flask_cors import CORS
from flask import Flask, jsonify, request
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


@app.route('/api/filter', methods=['GET'])
def filter_data():
    query_params = request.args.to_dict(flat=False)
    decoded_filters = {}

    for key, values in query_params.items():
        if '[checkbox]' in key:
            filter_name = key.replace('[checkbox]', '')
            decoded_filters[filter_name] = {
                'type': 'checkbox',
                'values': values[0].split(',')
            }

        elif '[radio]' in key:
            filter_name = key.replace('[radio]', '')
            decoded_filters[filter_name] = {
                'type': 'radio',
                'value': values[0]
            }

        elif '[range]' in key:
            filter_name = key.replace('[range]', '')
            range_values = values[0].split('-')
            decoded_filters[filter_name] = {
                'type': 'range',
                'min': range_values[0],
                'max': range_values[1]
            }

    print(decoded_filters)

    try:
        with open("static/filters/filters2.json", "r") as filters_file:
            filters = json.load(filters_file)

        with open("static/images/images2.json", "r") as images_file:
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
