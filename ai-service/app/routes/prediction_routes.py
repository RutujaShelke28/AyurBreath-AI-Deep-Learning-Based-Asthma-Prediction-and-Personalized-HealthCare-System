from fastapi import APIRouter, HTTPException
from app.schemas.prediction import PredictDirectRequest, PredictAnswersRequest, BatchRequest
from app.prediction.ensemble import predict_single
from app.core.config import FEATURES

router = APIRouter(tags=["prediction"])


def _classify_dosha(answers: dict) -> str:
    votes = {"Vata": 0, "Pitta": 0, "Kapha": 0}
    for k, v in answers.items():
        if not k.startswith("dq"):
            continue
        s = str(v)
        if s.startswith("A)"):
            votes["Vata"] += 1
        elif s.startswith("B)"):
            votes["Pitta"] += 1
        elif s.startswith("C)"):
            votes["Kapha"] += 1
    return max(votes, key=votes.get)


def _answers_to_features(answers: dict) -> dict:
    pollution_map = {
        "A) Cold air or sudden weather changes": 80,
        "B) Dust, pets, or strong perfumes": 120,
        "C) Exercise or physical stress": 60,
        "D) None of the above": 40,
    }
    aqi_val = pollution_map.get(answers.get("hq6", ""), 80)
    wheezing = 1 if str(answers.get("hq1", "A)"))[:2] != "A)" else 0
    fev1_map = {"A)": 85, "B)": 70, "C)": 50}
    fev1_pct = fev1_map.get(str(answers.get("hq4", "A)"))[:2], 75)
    exercise_map = {"Never": 0, "Rarely": 0, "1-2x/week": 1, "3-4x/week": 2, "Daily": 2}
    exercise_level = exercise_map.get(str(answers.get("exercise", "Rarely")), 1)
    age = int(answers.get("age", 35))
    return dict(zip(FEATURES, [
        aqi_val * 0.3, aqi_val * 0.6, aqi_val * 0.15, aqi_val * 0.1, aqi_val,
        age, 22.0, 0, exercise_level,
        fev1_pct, fev1_pct + 10, fev1_pct / (fev1_pct + 10), wheezing,
    ]))


@router.post("/predict")
def predict_answers(body: PredictAnswersRequest):
    data = _answers_to_features(body.answers)
    result = predict_single(data, body.model or "ensemble")
    result["dosha"] = _classify_dosha(body.answers)
    result["score"] = round(sum(
        {"A)": 0, "B)": 1, "C)": 2}.get(str(v)[:2], 0)
        for k, v in body.answers.items() if k.startswith("hq")
    ), 2)
    return result


@router.post("/predict-direct")
def predict_direct(body: PredictDirectRequest):
    data = body.model_dump(exclude={"model"})
    return predict_single(data, body.model or "ensemble")


@router.post("/predict/batch")
def predict_batch(body: BatchRequest):
    if len(body.samples) > 100:
        raise HTTPException(400, "Max 100 samples per batch")
    return [predict_single(s, body.model or "ensemble") for s in body.samples]
