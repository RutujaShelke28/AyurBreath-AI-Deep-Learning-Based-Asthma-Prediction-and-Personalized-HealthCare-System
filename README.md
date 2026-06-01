# AyurBreath AI – Deep Learning Based Asthma Prediction and Personalized Healthcare System

## Setup

Clone the repository:

```bash
git clone https://github.com/RutujaShelke28/AyurBreath-AI-Deep-Learning-Based-Asthma-Prediction-and-Personalized-HealthCare-System.git

cd AyurBreath-AI-Deep-Learning-Based-Asthma-Prediction-and-Personalized-HealthCare-System
```

---

# AI Prediction Service

The AI Prediction Service is responsible for Deep Learning based asthma prediction using a BiLSTM model.

## Setup

```bash
cd ai-service

python -m venv venv

venv\Scripts\activate     # Windows

pip install -r requirements.txt
```

## Run

```bash
python app.py
```

AI Service runs on:

```text
http://localhost:8000
```

---

# Frontend & API Service

The Frontend is built using Next.js and provides the user interface, authentication, health assessment, recommendations, reports, and dashboard functionality.

## Setup

Open a new terminal:

```bash
cd asthma

npm install
```

## Run

```bash
npm run dev
```

Frontend runs on:

```text
http://localhost:3000
```

---

# Microservices Architecture

AyurBreath AI follows a Microservices Architecture where the frontend and AI prediction engine run as independent services.

```text
User
 │
 ▼
Next.js Frontend (Port 3000)
 │
 ▼
Next.js API Routes
 │
 ▼
Python AI Service (Port 8000)
 │
 ▼
BiLSTM Deep Learning Model
 │
 ▼
Prediction Results & Recommendations
```

---

# Technology Stack

### Frontend

* Next.js
* React.js
* JavaScript
* CSS

### AI Service

* Python
* TensorFlow
* Scikit-Learn
* NumPy
* Pandas

### Database & Authentication

* Supabase

---

# Features

* Deep Learning Based Asthma Prediction
* Personalized Healthcare Recommendations
* AI Health Assistant
* Patient Health Assessment
* Health Report Analysis
* Exercise & Wellness Guidance
* Diet Planning Support
* Doctor & Patient Management
* Secure Authentication System

---

# Important

Both services must be running simultaneously:

### Terminal 1

```bash
cd ai-service
venv\Scripts\activate
python app.py
```

### Terminal 2

```bash
cd asthma
npm install
npm run dev
```

The application will be available at:

```text
http://localhost:3000
```
