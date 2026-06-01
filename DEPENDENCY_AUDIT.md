# AyurBreath AI — Dependency Audit Report

**Date:** 2026-05-25  
**Environment:** Windows, Node v22.22.0, Python 3.13.5

## Summary

| Component     | Status | Notes |
|---------------|--------|-------|
| frontend      | OK     | React 19 + react-scripts 5; use `--legacy-peer-deps` if install warns |
| node-backend  | OK     | Dependencies pre-installed; Express 4, Mongoose 8 |
| ai-service    | FIXED  | Removed unused TensorFlow; pinned sklearn ≥1.5.2 for Python 3.13 |
| backend (old) | SKIP   | Not wired to frontend |

## Issues found and fixed

### 1. TensorFlow in ai-service requirements (CRITICAL)

- **Problem:** `requirements.txt` listed `tensorflow==2.15.0` but `train_model.py` and runtime use **scikit-learn + joblib** only. TensorFlow fails or is unnecessary on Python 3.13.
- **Fix:** Created `requirements-fixed.txt` without TensorFlow. Updated `requirements.txt` to `-r requirements-fixed.txt`.

### 2. Relative ML model paths (HIGH)

- **Problem:** `MODEL_PATH=models/...` failed if Flask started from another working directory.
- **Fix:** Resolve paths relative to `app.py` via `_BASE_DIR`.

### 3. MongoDB blocking perception (MEDIUM)

- **Problem:** Slow/hung connection; login returned 503 with no dev path.
- **Fix:** `serverSelectionTimeoutMS: 5000`; health endpoint reports mongo status; `ALLOW_DEMO_LOGIN` + demo credentials; frontend **Try Demo** button; auth middleware accepts `demo-local-token`.

### 4. DB routes without fallbacks (MEDIUM)

- **Problem:** `/api/assessment/history` and `/api/reports/summary` could throw when MongoDB down.
- **Fix:** try/catch returns `[]` or empty summary.

### 5. Hardcoded API URLs in frontend (LOW)

- **Problem:** URLs fixed in `api.js` and `Prediction.js`.
- **Fix:** `REACT_APP_API_URL`, `REACT_APP_AI_URL` in `frontend/.env`.

### 6. CORS on AI service (LOW)

- **Problem:** Default CORS only; explicit origins safer for browser calls from :3000.
- **Fix:** `CORS(app, origins=[localhost:3000, 127.0.0.1:3000, localhost:5001])`.

### 7. Missing env templates (LOW)

- **Fix:** Added `.env.example` for node-backend, ai-service, frontend; ensured `.env` files exist.

### 8. Demo mode documented but missing in UI (LOW)

- **Fix:** Restored **Try Demo** on Login page.

## Frontend → Backend route verification

| Client call | Server route | Exists |
|-------------|--------------|--------|
| `POST /auth/register` | `node-backend` auth.js | Yes |
| `POST /auth/login` | `node-backend` auth.js | Yes |
| `POST /assessment/analyze` | `node-backend` assessment.js → AI `/predict` | Yes |
| `POST /predict-direct` | `ai-service` app.py | Yes |

Unused by frontend (available): `GET /api/assessment/history`, `GET /api/reports/summary`, `GET /api/health`, `GET /health` (AI).

## Python compatibility (3.13)

- **TensorFlow:** Not required; not installed.
- **scikit-learn:** Use ≥1.5.2 (Python 3.13 wheels).
- **No downgrade needed** if using `requirements-fixed.txt`.

## MongoDB

- Local: `mongodb://localhost:27017/ayurbreath`
- Atlas: set `MONGO_URI` in `node-backend/.env`
- App starts without MongoDB; persistence and real login need DB or demo mode.

## ML artifacts

Verified present:

- `ai-service/models/bilstm_model.pkl` (~500 KB)
- `ai-service/models/scaler.pkl`
- `ai-service/models/label_encoder.pkl`

Loaded via joblib at AI service startup.
