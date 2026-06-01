import logging
from pathlib import Path
import joblib
import numpy as np

from app.core.config import MODELS_DIR, MODEL_FILES

log = logging.getLogger("ayurbreath.ai")
_cache = {}


def _path(name: str) -> Path:
    return MODELS_DIR / MODEL_FILES.get(name, name)


def get_label_encoder():
    if "label_encoder" not in _cache:
        p = _path("label_encoder")
        _cache["label_encoder"] = joblib.load(p) if p.exists() else None
        log.info("label_encoder: %s", "ok" if _cache["label_encoder"] else "missing")
    return _cache["label_encoder"]


def get_scaler():
    if "scaler" not in _cache:
        p = _path("scaler")
        _cache["scaler"] = joblib.load(p) if p.exists() else None
    return _cache["scaler"]


def get_sklearn(name: str):
    if name not in _cache:
        p = _path(name)
        if p.exists():
            _cache[name] = joblib.load(p)
            log.info("%s loaded", name)
        else:
            _cache[name] = None
            log.warning("%s not found at %s", name, p)
    return _cache[name]


def get_keras(name: str):
    if name not in _cache:
        key = "bilstm" if "bilstm" in name else "ann"
        p = _path(key)
        if p.exists():
            import tensorflow as tf
            _cache[name] = tf.keras.models.load_model(str(p), compile=False)
            log.info("%s keras loaded", name)
        else:
            _cache[name] = None
    return _cache[name]


def list_models():
    out = {}
    for k, f in MODEL_FILES.items():
        if k == "scaler":
            continue
        out[k] = {"file": f, "exists": (_path(k if k != "bilstm" else "bilstm").exists() if k != "ann" else _path("ann").exists())}
    # fix keys
    status = {}
    for key in ["random_forest", "xgboost", "logistic_regression", "label_encoder", "bilstm", "ann"]:
        status[key] = _path("bilstm" if key == "bilstm" else key).exists()
    status["scaler"] = _path("scaler").exists()
    return status
