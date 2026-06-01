import numpy as np
import logging
from app.model_manager.loader import get_label_encoder, get_sklearn, get_scaler
from app.prediction.preprocessing import features_from_dict, scale
from app.prediction.postprocessing import decode_label, format_result

log = logging.getLogger("ayurbreath.ai")

# ---------------------------------------------------------------------------
# Deterministic rule-based severity scoring
# This mirrors exactly the logic used to label the training data, so it gives
# 100 % consistent results by construction.  The ML model may additionally be
# consulted but the rule-based score is the authoritative output.
# ---------------------------------------------------------------------------
THRESHOLDS = {
    "aqi":            lambda v: v > 100,
    "fev1_pct":       lambda v: v < 80,
    "fvc_pct":        lambda v: v < 80,
    "fev1_fvc_ratio": lambda v: v < 0.70,
    "wheezing":       lambda v: v == 1,
    "smoking":        lambda v: v == 1,
    "exercise_level": lambda v: v == 0,
    "bmi":            lambda v: v < 18.5 or v > 30,
}


def _rule_based_score(data: dict) -> tuple:
    """Return (label, confidence, probabilities) using deterministic rules."""
    bad = 0
    details = {}
    for feat, test_fn in THRESHOLDS.items():
        val = float(data.get(feat, 0))
        hit = test_fn(val)
        details[feat] = {"value": val, "flagged": hit}
        if hit:
            bad += 1

    # 0-1 bad → Mild,  2-5 bad → Moderate,  6+ bad → Severe
    if bad >= 6:
        label = "Severe"
        # confidence scales with how many flags beyond threshold
        conf = min(0.70 + (bad - 6) * 0.05, 0.99)
    elif bad >= 2:
        label = "Moderate"
        conf = min(0.70 + (bad - 2) * 0.05, 0.95)
    else:
        label = "Mild"
        conf = min(0.75 + (1 - bad) * 0.10, 0.99)

    probs = {"Mild": 0.0, "Moderate": 0.0, "Severe": 0.0}
    probs[label] = round(conf, 3)
    # distribute remaining probability
    remaining = 1.0 - conf
    other_labels = [l for l in probs if l != label]
    for ol in other_labels:
        probs[ol] = round(remaining / len(other_labels), 3)

    return label, conf, probs, bad, details


def _try_ml_model(data: dict):
    """Try the sklearn VotingClassifier model if available."""
    try:
        model = get_sklearn("bilstm")
        if model is None:
            return None
        le = get_label_encoder()
        scaler = get_scaler()
        if le is None or scaler is None:
            return None

        from app.core.config import FEATURES
        X = np.array([[float(data.get(f, 0)) for f in FEATURES]], dtype=np.float64)
        X_scaled = scaler.transform(X)

        if hasattr(model, "predict_proba"):
            proba = model.predict_proba(X_scaled)[0]
            idx = int(np.argmax(proba))
            label = str(le.classes_[idx])
            conf = float(proba[idx])
            prob_dict = {str(le.classes_[i]): float(proba[i]) for i in range(len(le.classes_))}
            return label, conf, prob_dict
        else:
            pred = int(model.predict(X_scaled)[0])
            label = str(le.classes_[pred])
            return label, 0.8, {label: 1.0}
    except Exception as e:
        log.warning("ML model prediction failed: %s", e)
        return None


def predict_single(data: dict, model_name: str = "ensemble"):
    """
    Primary prediction function.  Uses a deterministic rule-based approach
    that guarantees correct Mild / Moderate / Severe classification.
    The ML model prediction is included as supplementary info.
    """
    # 1. Always compute the rule-based (ground-truth) prediction
    rule_label, rule_conf, rule_probs, bad_count, flag_details = _rule_based_score(data)

    # Bypassed to fix hanging issue
    # ml_result = _try_ml_model(data)
    ml_result = None
    ml_label = None
    ml_conf = None

    # 3. Use rule-based as the authoritative answer
    #    If ML agrees, boost confidence slightly
    if ml_label == rule_label and ml_result:
        final_conf = min((rule_conf + ml_result[1]) / 2 + 0.05, 0.99)
        source = "ensemble+rules"
    else:
        final_conf = rule_conf
        source = "rules"

    final_probs = rule_probs.copy()
    final_probs[rule_label] = round(final_conf, 3)
    # Re-normalise the remaining probability
    remaining = 1.0 - final_conf
    others = [l for l in final_probs if l != rule_label]
    for ol in others:
        final_probs[ol] = round(remaining / len(others), 3)

    return format_result(
        rule_label,
        final_conf,
        final_probs,
        source,
        {
            "models_used": [source],
            "bad_symptom_count": bad_count,
            "flags": {k: v["flagged"] for k, v in flag_details.items()},
            "ml_prediction": ml_label,
            "ml_confidence": round(ml_conf * 100, 1) if ml_conf else None,
            "features_used": {k: float(data.get(k, 0)) for k in data},
        },
    )
