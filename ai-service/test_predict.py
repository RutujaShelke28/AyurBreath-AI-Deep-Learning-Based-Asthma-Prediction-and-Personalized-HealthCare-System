import requests
import time

try:
    print("Testing health endpoint...")
    resp = requests.get('http://127.0.0.1:5002/health', timeout=5)
    print("Health Status:", resp.status_code, resp.text)
except Exception as e:
    print("Health failed:", e)

try:
    print("Testing predict endpoint...")
    payload = {
      "answers": {
        "age": 28, "hq1": "A)", "hq4": "A)", "exercise": "1"
      }
    }
    t0 = time.time()
    resp = requests.post('http://127.0.0.1:5002/predict', json=payload, timeout=60)
    print(f"Predict Status: {resp.status_code} in {time.time()-t0:.2f}s")
    print(resp.text[:200])
except Exception as e:
    print("Predict failed:", e)
