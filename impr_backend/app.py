from flask_cors import CORS
from flask import Flask, jsonify, request
import json

from rdf_querying import apply_filters, update_filters

app = Flask(__name__)

CORS(app, origins=["http://localhost:3000", "https://impr-git-main-raresbancescus-projects.vercel.app"])

@app.route('/api/initial', methods=['GET'])
def get_initial_data():
    movies = apply_filters({},"")
    new_filters = update_filters({}, movies )
    return jsonify(
        {
            "filters": new_filters,
            "movies": movies
        }
    )


@app.route('/api/filter', methods=['GET'])
def filter_data():
    query_params = request.args.to_dict(flat=False)
    print(query_params)
    decoded_filters = {}

    for key, values in query_params.items():
        if '[checkbox]' in key:
            filter_name = key.replace('[checkbox]', '')
            decoded_filters[filter_name] = {
                'values': values[0].split(',')
            }

        elif '[radio]' in key:
            filter_name = key.replace('[radio]', '')
            decoded_filters[filter_name] = {
                'value': values[0]
            }

        elif '[range]' in key:
            filter_name = key.replace('[range]', '')
            range_values = values[0].split('-')
            decoded_filters[filter_name] = {
                'min': range_values[0],
                'max': range_values[1]
            }

    # print(decoded_filters)
    movies = apply_filters(decoded_filters, "")
    new_filters = update_filters(decoded_filters, movies)

    return jsonify(
        {
            "filters": new_filters,
            "movies": movies
        }
    )

if __name__ == '__main__':
    app.run(debug=True)
