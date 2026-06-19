from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import pandas as pd

app = Flask(__name__)
CORS(app)  # Allow frontend to make requests

# Load ML Models and Metadata
print("Loading TrafficSense AI Models...")
try:
    data = joblib.load('trafficsense_model.pkl')
    priority_model = data['priority_model']
    closure_model = data['closure_model']
    encoders = data['encoders']
    analytics = data['analytics']
    print("Models loaded successfully.")
except Exception as e:
    print(f"Error loading models: {e}")
    print("Please run train_model.py first!")
    exit(1)

def safe_transform(le, val):
    # If the value wasn't seen during training, map it to 'Unknown'
    if val not in le.classes_:
        return le.transform(['Unknown'])[0]
    return le.transform([val])[0]

@app.route('/api/predict', methods=['POST'])
def predict():
    try:
        req = request.json
        cause = req.get('cause', 'Unknown')
        corridor = req.get('corridor', 'Unknown')
        veh_type = req.get('veh_type', 'Unknown')
        station = req.get('station', 'Unknown')
        
        # Prepare feature vector
        X = pd.DataFrame([{
            'event_cause': safe_transform(encoders['event_cause'], cause),
            'veh_type': safe_transform(encoders['veh_type'], veh_type),
            'corridor': safe_transform(encoders['corridor'], corridor),
            'police_station': safe_transform(encoders['police_station'], station)
        }])
        
        # Predict Priority
        priority_encoded = priority_model.predict(X)[0]
        priority = encoders['priority'].inverse_transform([priority_encoded])[0]
        
        # Predict Road Closure
        closure_pred = closure_model.predict(X)[0]
        closure = "yes" if closure_pred == 1 else "no"
        
        # Calculate an Impact Score (0-100) based on confidence of priority
        # If model is highly confident it's High priority, impact is high.
        probs = priority_model.predict_proba(X)[0]
        high_idx = list(encoders['priority'].classes_).index('High')
        med_idx = list(encoders['priority'].classes_).index('Medium')
        
        # Base impact score calculation derived from probabilities
        impact_score = int((probs[high_idx] * 100) + (probs[med_idx] * 50))
        impact_score = min(98, max(12, impact_score)) # Clamp between 12 and 98
        
        return jsonify({
            'status': 'success',
            'prediction': {
                'priority': priority,
                'requires_closure': closure,
                'impact_score': impact_score
            }
        })
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500

@app.route('/api/forecast', methods=['GET'])
def get_forecast():
    # Return aggregated historical data from the model file
    return jsonify({
        'status': 'success',
        'data': analytics
    })

if __name__ == '__main__':
    print("Starting TrafficSense Flask Server on http://localhost:5000")
    app.run(debug=True, port=5000)
