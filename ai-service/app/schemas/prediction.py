from pydantic import BaseModel, Field
from typing import Optional, Dict, List, Any


class PredictDirectRequest(BaseModel):
    pm25: float = 50
    pm10: float = 80
    no2: float = 20
    so2: float = 15
    aqi: float = 100
    age: float = 35
    bmi: float = 22
    smoking: float = 0
    exercise_level: float = 1
    fev1_pct: float = 75
    fvc_pct: float = 85
    fev1_fvc_ratio: float = 0.75
    wheezing: float = 0
    model: Optional[str] = "ensemble"


class PredictAnswersRequest(BaseModel):
    answers: Dict[str, Any] = Field(default_factory=dict)
    model: Optional[str] = "ensemble"


class BatchRequest(BaseModel):
    samples: List[Dict[str, float]]
    model: Optional[str] = "ensemble"
