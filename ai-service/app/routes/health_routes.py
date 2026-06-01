from fastapi import APIRouter
from app.model_manager.loader import list_models
from app.core.config import MODELS_DIR

router = APIRouter(tags=["health"])


@router.get("/health")
def health():
    models = list_models()
    return {
        "status": "ok",
        "service": "ai-microservice",
        "framework": "FastAPI",
        "models_dir": str(MODELS_DIR),
        "models": models,
        "loaded_count": sum(1 for v in models.values() if v),
    }
