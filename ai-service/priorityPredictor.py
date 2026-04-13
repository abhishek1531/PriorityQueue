from flask import Flask, request, jsonify
import joblib
import numpy as np

app = Flask(__name__)

print("Starting AI Priority Service...")

# Load ML model
model = joblib.load("priority_model.pkl")

# Convert request type to numeric value
type_map = {
    "CRITICAL": 1,
    "HIGH": 2,
    "MEDIUM": 3,
    "LOW": 4
}

@app.route("/predict", methods=["POST"])
def predict():

    try:

        data = request.get_json()

        req_type = data.get("type", "LOW").upper()
        payload_size = data.get("payloadSize", 0)
        sla = data.get("sla", 60)

        type_value = type_map.get(req_type, 4)

        features = np.array([[type_value, payload_size, sla]])

        prediction = model.predict(features)

        return jsonify({
            "priority": int(prediction[0])
        })

    except Exception as e:

        return jsonify({
            "error": str(e)
        }), 400


@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "AI service running"})


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=6000, debug=True)
