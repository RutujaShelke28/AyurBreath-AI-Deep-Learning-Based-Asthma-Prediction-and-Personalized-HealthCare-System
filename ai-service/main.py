"""Run: uvicorn main:app --host 0.0.0.0 --port 5002"""
import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import health_routes, prediction_routes, model_routes
from app.core.config import PORT

logging.basicConfig(level=logging.INFO)

app = FastAPI(title="AyurBreath AI Service", version="2.0.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000", "http://localhost:5001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health_routes.router)
app.include_router(prediction_routes.router)
app.include_router(model_routes.router)

if __name__ == "__main__":
    import uvicorn
    from app.core.config import PORT
    uvicorn.run("main:app", host="127.0.0.1", port=PORT, reload=False)
