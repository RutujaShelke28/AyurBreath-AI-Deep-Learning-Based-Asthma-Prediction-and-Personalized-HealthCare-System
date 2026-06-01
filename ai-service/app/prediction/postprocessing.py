from app.core.config import SEVERITY_MAP


def decode_label(label_encoder, idx: int) -> str:
    if label_encoder is None:
        labels = ["Mild Intermittent", "Mild Persistent", "Moderate Persistent", "Severe Persistent"]
        return labels[min(idx, len(labels) - 1)]
    return str(label_encoder.classes_[idx])


def format_result(severity_label: str, confidence: float, probs: dict, source: str, extra=None):
    out = {
        "severity_detail": severity_label,
        "severity": SEVERITY_MAP.get(severity_label, severity_label),
        "confidence": round(confidence * 100, 1),
        "probabilities": {k: round(v * 100, 1) for k, v in probs.items()},
        "source": source,
    }
    if extra:
        out.update(extra)
    return out
