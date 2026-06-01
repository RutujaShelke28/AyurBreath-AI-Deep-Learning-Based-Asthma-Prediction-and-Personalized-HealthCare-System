import os
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()

BASE_DIR = Path(__file__).resolve().parents[2]
MODELS_DIR = Path(os.getenv("TRAINED_MODELS_DIR", BASE_DIR / "models"))
PORT = int(os.getenv("AI_SERVICE_PORT", "5002"))

FEATURES = [
    "pm25", "pm10", "no2", "so2", "aqi", "age", "bmi", "smoking",
    "exercise_level", "fev1_pct", "fvc_pct", "fev1_fvc_ratio", "wheezing",
]

SEVERITY_MAP = {
    "Mild Intermittent": "Mild",
    "Mild Persistent": "Mild",
    "Moderate Persistent": "Moderate",
    "Severe Persistent": "Severe",
    "Mild": "Mild",
    "Moderate": "Moderate",
    "Severe": "Severe",
}

MODEL_FILES = {
    "random_forest": "random_forest.pkl",
    "xgboost": "xgboost.pkl",
    "logistic_regression": "logistic_regression.pkl",
    "label_encoder": "label_encoder.pkl",
    "bilstm": "bilstm_model.pkl",
    "ann": "ann_model.h5",
    "scaler": "scaler.pkl",
}
