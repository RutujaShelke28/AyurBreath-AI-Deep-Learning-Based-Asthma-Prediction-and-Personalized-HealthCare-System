from app.core.config import FEATURES
from app.model_manager.loader import get_scaler
import numpy as np


def features_from_dict(data: dict) -> np.ndarray:
    return np.array([[float(data.get(f, 0)) for f in FEATURES]], dtype=np.float32)


def scale(X: np.ndarray) -> np.ndarray:
    scaler = get_scaler()
    return scaler.transform(X) if scaler is not None else X
