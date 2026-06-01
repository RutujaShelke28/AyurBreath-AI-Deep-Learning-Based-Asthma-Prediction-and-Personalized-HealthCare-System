"""Test the three presets to verify correct predictions."""
import json
from urllib.request import urlopen, Request

BASE = "http://127.0.0.1:5002/predict-direct"

tests = [
    ("MILD", {
        "pm25": 50, "pm10": 80, "no2": 20, "so2": 15, "aqi": 100,
        "age": 28, "bmi": 22, "smoking": 0, "exercise_level": 2,
        "fev1_pct": 90, "fvc_pct": 95, "fev1_fvc_ratio": 0.80, "wheezing": 0
    }),
    ("MODERATE", {
        "pm25": 50, "pm10": 80, "no2": 20, "so2": 15, "aqi": 100,
        "age": 45, "bmi": 25, "smoking": 1, "exercise_level": 1,
        "fev1_pct": 82, "fvc_pct": 90, "fev1_fvc_ratio": 0.65, "wheezing": 0
    }),
    ("SEVERE", {
        "pm25": 50, "pm10": 80, "no2": 20, "so2": 15, "aqi": 100,
        "age": 60, "bmi": 32, "smoking": 1, "exercise_level": 0,
        "fev1_pct": 45, "fvc_pct": 55, "fev1_fvc_ratio": 0.55, "wheezing": 1
    }),
]

all_pass = True
for expected, payload in tests:
    data = json.dumps(payload).encode()
    req = Request(BASE, data=data, headers={"Content-Type": "application/json"})
    resp = urlopen(req, timeout=10)
    result = json.loads(resp.read())
    actual = result.get("severity", "???")
    conf = result.get("confidence", 0)
    flags = result.get("flags", {})
    bad_count = result.get("bad_symptom_count", "?")
    status = "PASS" if actual == expected.capitalize() else "FAIL"
    if status == "FAIL":
        all_pass = False
    print(f"[{status}] Expected={expected:10s}  Got={actual:10s}  Conf={conf}%  BadFlags={bad_count}  Flags={flags}")

print(f"\n{'ALL TESTS PASSED!' if all_pass else 'SOME TESTS FAILED!'}")
