# TrafficSense — Bengaluru Traffic Command Platform 🚦

**TrafficSense** is an advanced, AI-powered traffic management and event response platform built for the **Flipkart Gridlock Hackathon**. It tackles Bengaluru's notorious traffic congestion by forecasting event-driven gridlocks, smartly deploying traffic officers, suggesting real-time diversions, and empowering citizens to report incidents.

---

## 🌟 Key Features

The platform is divided into three comprehensive, interconnected dashboards:

### 1. Admin Command Center (Police HQ)
- **Live Overview:** Real-time KPIs for active critical alerts, road closures, and deployed officers.
- **AI Event Scoring:** Automatically assigns a priority (Low/Medium/High) and an Impact Score (0-100) to new incidents using a trained Machine Learning model.
- **Smart Deployment:** Calculates the exact number of traffic controllers required based on incident severity and location.
- **Analytics & Forecasting:** Visualizes traffic trends, zone-wise event distribution, and predicts future high-risk windows.
- **Citizen Report Verification:** Admins can review public reports, check uploaded photos, and with a single click, convert verified reports into official live events.

### 2. Traffic Controller Dashboard (Field Officers)
- **Zone-Specific Tracking:** Officers see events only relevant to their assigned areas.
- **Interactive Routing:** Integrates Leaflet maps to show precise incident locations and active barricades.
- **AI Route Diversions:** Automatically generates and displays suggested alternative routes to divert traffic away from blockages.
- **Incident Resolution:** Officers can upload proof-of-clearance photos, add field notes, and mark incidents as "Resolved", updating the Admin dashboard instantly.

### 3. Public Viewer Dashboard (Citizens)
- **Live Bengaluru Map:** A full-screen, interactive city map showing all verified active incidents, color-coded by severity (🔴 High, 🟠 Medium, 🔵 Low, 🟣 Road Closure).
- **Impact Score Checker:** Allows citizens to input a location and calculate the potential traffic risk before starting their commute.
- **Citizen Reporting Portal:** A dedicated form for the public to report accidents, water logging, potholes, or vehicle breakdowns directly to the control room, complete with GPS location and photo uploads.

---

## 🛠️ Technology Stack & Implementation

**TrafficSense** is built with a focus on absolute performance, rapid prototyping, and a stunning "glassmorphism" aesthetic.

### Frontend Architecture
- **Core:** Pure HTML5, Vanilla CSS3, and Vanilla JavaScript. (No heavy JS frameworks like React/Angular were used to ensure zero-lag performance and instant load times).
- **Mapping:** [Leaflet.js](https://leafletjs.com/) integrated with OpenStreetMap tiles for rich, interactive, and lightweight geographic visualizations.
- **Charting:** [Chart.js](https://www.chartjs.org/) for rendering dynamic, animated analytics and priority distribution graphs.
- **Design System:** Custom CSS variables, smooth micro-animations, blur backdrops, and a sophisticated dark/light mode toggle.
- **State Management:** Utilizes browser `localStorage` to sync real-time data seamlessly across all three dashboards without needing a complex database for the prototype phase.

### Backend & AI Architecture
- **Server:** Python with [Flask](https://flask.palletsprojects.com/) providing a lightweight REST API.
- **Machine Learning:** [Scikit-Learn](https://scikit-learn.org/) (RandomForestClassifier and RandomForestRegressor).
- **Data:** Trained on a mock dataset (`Astram event data_anonymized.csv`) containing historical Bengaluru traffic events.
- **Model Pipeline (`train_model.py`):** 
  - Features engineered include time of day, cause of incident, zone, and road closure status.
  - Generates `trafficsense_model.pkl` which predicts both Priority (Classification) and Impact Score (Regression).

---

## 🚀 Setup & Installation Guide

You can run this project in two modes: **Full AI Mode** or **Offline Fallback Mode**.

### Step 1: Clone & Setup Environment
Ensure you have Python 3.8+ installed.
```bash
git clone <repository-url>
cd <project-folder>
pip install -r requirements.txt
```

### Step 2: (Optional) Retrain the AI Model
If you want to generate a fresh model from the CSV dataset:
```bash
python train_model.py
```
*This will create a new `trafficsense_model.pkl` file.*

### Step 3: Start the Backend AI Server
Start the Flask API so the dashboards can communicate with the trained model:
```bash
python app.py
```
*Leave this terminal window open. The server will run on `http://localhost:5000`.*

### Step 4: Launch the Platform
1. Open `index.html` in any modern web browser (or use VS Code Live Server).
2. Use the navigation buttons on the landing page to switch between the **Admin**, **Traffic Controller**, and **Public** views.
3. Test the flow: Create a Citizen Report in the Public Dashboard -> Verify it in the Admin Dashboard -> Resolve it in the Controller Dashboard!

---

## 🛡️ The Fallback Mechanism (Offline Mode)

If you need to demo the project on a strict network or a machine without Python, **the frontend will never break**. 

The JavaScript architecture includes a robust **fallback mechanism**. If it attempts to reach `http://localhost:5000/predict` and the server is down, it automatically switches to a mathematical heuristics engine. It calculates priority and score based on the event's parameters (e.g., Road Closures instantly bump scores by 30 points) locally in the browser, ensuring a flawless presentation every time.
