from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route("/")
def home():
    return "NER Landslide Backend is Running"

@app.route("/api/status")
def status():
    return jsonify({
        "status": "active",
        "system": "NER Landslide Risk Monitoring"
    })
@app.route("/api/all-risks")
def all_risks():
    risk_locations = [
        {
            "id": 1,
            "name": "Sikkim",
            "risk": 78,
            "rainfall": 124,
            "soil_moisture": 82
        },
        {
            "id": 2,
            "name": "Meghalaya",
            "risk": 65,
            "rainfall": 98,
            "soil_moisture": 70
        },
        {
            "id": 3,
            "name": "Arunachal Pradesh",
            "risk": 82,
            "rainfall": 145,
            "soil_moisture": 86
        },
        {
             "id": 4,
             "name": "Nagaland",
             "risk": 72,
             "rainfall": 115,
             "soil_moisture": 76
        }
    ]

    return jsonify(risk_locations)
if __name__ == "__main__":
    app.run(debug=True)
