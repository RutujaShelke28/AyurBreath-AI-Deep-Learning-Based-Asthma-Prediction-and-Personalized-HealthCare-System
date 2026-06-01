from fastapi import APIRouter
from app.model_manager.loader import list_models
from app.core.config import MODEL_FILES

router = APIRouter(prefix="/models", tags=["models"])


@router.get("/list")
def models_list():
    return {"models": list_models(), "available": list(MODEL_FILES.keys())}


@router.get("/info")
def model_info():
    return {
        "ensemble": ["random_forest", "xgboost", "logistic_regression", "ann", "bilstm"],
        "single": ["random_forest", "xgboost", "logistic_regression", "ann", "bilstm"],
        "files": MODEL_FILES,
    }
