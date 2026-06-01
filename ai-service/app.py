import os
os.environ["OPENBLAS_NUM_THREADS"] = "1"
os.environ["MKL_NUM_THREADS"] = "1"
os.environ["NUMEXPR_NUM_THREADS"] = "1"
os.environ["OMP_NUM_THREADS"] = "1"

# Backward compat — use: python main.py  OR  uvicorn main:app --port 5002
from main import app

if __name__ == "__main__":
    import uvicorn
    from app.core.config import PORT
    uvicorn.run("main:app", host="127.0.0.1", port=PORT, reload=False)
