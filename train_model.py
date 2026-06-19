import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder
import joblib
import os

print("TrafficSense AI: Starting ML Training Pipeline...")

# 1. Load Data
dataset_path = 'Astram event data_anonymized - Astram event data_anonymizedb40ac87 (1).csv'
if not os.path.exists(dataset_path):
    print(f"Error: Dataset not found at {dataset_path}")
    exit(1)

print("Loading dataset...")
df = pd.read_csv(dataset_path)

# 2. Select Features & Targets
features = ['event_cause', 'veh_type', 'corridor', 'police_station']
targets = ['priority', 'requires_road_closure']

# Drop rows where target priority is missing (if any)
df = df.dropna(subset=['priority'])

# Fill missing features with 'Unknown'
for f in features:
    df[f] = df[f].fillna('Unknown')

df['requires_road_closure'] = df['requires_road_closure'].fillna(False)

# 3. Encode Categorical Variables
print("Encoding features...")
encoders = {}
X = pd.DataFrame()

for f in features:
    le = LabelEncoder()
    # Add an 'Unknown' class to handle unseen data during prediction
    le.fit(list(df[f].unique()) + ['Unknown'])
    X[f] = le.transform(df[f])
    encoders[f] = le

# Target 1: Priority (High, Medium, Low)
le_priority = LabelEncoder()
y_priority = le_priority.fit_transform(df['priority'])
encoders['priority'] = le_priority

# Target 2: Requires Road Closure (Boolean to int)
y_closure = df['requires_road_closure'].astype(int)

# 4. Train Models
print("Training Priority Model (RandomForest)...")
X_train, X_test, y_train, y_test = train_test_split(X, y_priority, test_size=0.2, random_state=42)
priority_model = RandomForestClassifier(n_estimators=50, random_state=42)
priority_model.fit(X_train, y_train)
acc_p = priority_model.score(X_test, y_test)
print(f"Priority Model Accuracy: {acc_p * 100:.2f}%")

print("Training Road Closure Model (RandomForest)...")
X_train, X_test, y_train, y_test = train_test_split(X, y_closure, test_size=0.2, random_state=42)
closure_model = RandomForestClassifier(n_estimators=50, random_state=42)
closure_model.fit(X_train, y_train)
acc_c = closure_model.score(X_test, y_test)
print(f"Closure Model Accuracy: {acc_c * 100:.2f}%")

# Generate aggregate data for the dashboard chart
print("Generating Aggregate Analytics...")
df['start_datetime'] = pd.to_datetime(df['start_datetime'], errors='coerce')
df['hour'] = df['start_datetime'].dt.hour
hourly_incidents = df.groupby('hour').size().to_dict()
# Ensure all hours 0-23 exist
for i in range(24):
    if i not in hourly_incidents:
        hourly_incidents[i] = 0

causes_count = df['event_cause'].value_counts().head(5).to_dict()

# 5. Save the Models and Encoders
print("Exporting models and metadata...")
export_data = {
    'priority_model': priority_model,
    'closure_model': closure_model,
    'encoders': encoders,
    'analytics': {
        'hourly': hourly_incidents,
        'causes': causes_count
    }
}

joblib.dump(export_data, 'trafficsense_model.pkl')
print("✅ Success! Models saved to 'trafficsense_model.pkl'.")
