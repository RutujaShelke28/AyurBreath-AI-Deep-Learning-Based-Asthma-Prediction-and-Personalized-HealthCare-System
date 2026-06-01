# AyurBreath AI — Startup Guide

Full-stack asthma wellness app: React frontend, Node/Express API, Python ML service.

## Ports

| Service       | URL                      |
|---------------|--------------------------|
| Frontend      | http://localhost:3000    |
| Node backend  | http://localhost:5001    |
| AI service    | http://localhost:5002    |

## Prerequisites

- **Node.js** v18+ (tested on v22.22.0)
- **npm** 10+
- **Python** 3.11–3.13 (tested on 3.13.5)
- **Supabase** project (free tier at https://supabase.com)

## One-time setup

### 1. Supabase project

1. Go to https://supabase.com/dashboard and create a new project (or use an existing one).
2. Open the **SQL Editor** and run the following SQL to create the required tables:

```sql
CREATE TABLE IF NOT EXISTS users (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name          text NOT NULL,
  email         text UNIQUE NOT NULL,
  password      text NOT NULL,
  age           integer,
  gender        text CHECK (gender IN ('Male', 'Female', 'Other')),
  asthma_history text,
  health_notes  text,
  is_verified   boolean DEFAULT true,
  created_at    timestamptz DEFAULT now(),
  updated_at    timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS assessments (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id        uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  answers        jsonb NOT NULL,
  dosha          text,
  severity       text,
  score          integer,
  ai_prediction  jsonb,
  created_at     timestamptz DEFAULT now(),
  updated_at     timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_assessments_user_id ON assessments(user_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
```

3. Go to **Project Settings → API** and copy:
   - **Project URL** → `SUPABASE_URL`
   - **anon public** key (or **service_role** key) → `SUPABASE_KEY`

### 2. Node backend

```powershell
cd "New folder\node-backend"
npm install
copy .env.example .env
```

Edit `.env` with your Supabase credentials:

```
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_KEY=your-anon-or-service-role-key
```

### 3. AI service (Python)

```powershell
cd "New folder\ai-service"
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements-fixed.txt
copy .env.example .env
```

Model files must exist in `ai-service\models/`:

- `bilstm_model.pkl`
- `scaler.pkl`
- `label_encoder.pkl`

> **Note:** TensorFlow is **not** required. The BiLSTM label is a scikit-learn ensemble saved with joblib.

### 4. Frontend

```powershell
cd "New folder\frontend"
npm install
copy .env.example .env
```

## Run (3 terminals)

**Terminal 1 — Node backend**

```powershell
cd "New folder\node-backend"
npm run dev
```

Health check: http://localhost:5001/api/health

**Terminal 2 — AI service**

```powershell
cd "New folder\ai-service"
.\venv\Scripts\activate
python app.py
```

Health check: http://localhost:5002/health

**Terminal 3 — Frontend**

```powershell
cd "New folder\frontend"
npm start
```

Open: http://localhost:3000

## Quick test without Supabase

1. Start node-backend and frontend (AI service optional for assessment fallback).
2. On **Login**, click **Try Demo (no backend required)** — works offline in the browser.
3. For backend demo login when Supabase is not configured: use `demo@ayurbreath.ai` / `demo12345` (requires `ALLOW_DEMO_LOGIN=true` in node-backend `.env`).

## API routes used by frontend

| Frontend call              | Backend endpoint              |
|----------------------------|-------------------------------|
| Register                   | `POST /api/auth/register`     |
| Login                      | `POST /api/auth/login`        |
| Assessment analyze         | `POST /api/assessment/analyze`|
| Prediction (direct)        | `POST http://localhost:5002/predict-direct` |

## Troubleshooting

| Issue | Fix |
|-------|-----|
| Port in use | Change `PORT` / `AI_SERVICE_PORT` / frontend `PORT` in `.env` |
| `EADDRINUSE` on 5001 | Stop other Node processes or change `PORT` |
| AI model not loaded | Run from `ai-service` folder; check `models/*.pkl` exist |
| Python package errors | Use `requirements-fixed.txt`, not old TensorFlow list |
| React peer dependency warnings | `npm install --legacy-peer-deps` in `frontend` |
| CORS errors | Ensure all three `.env` URLs match localhost ports |
| Supabase tables not found | Run the CREATE TABLE SQL above in Supabase SQL Editor |
| Supabase connection errors | Verify `SUPABASE_URL` and `SUPABASE_KEY` in `.env` |

## Legacy Flask backend

The `backend/` folder (port 5000) is **not** used by the current React app. Ignore unless you need the old Flask stack.
