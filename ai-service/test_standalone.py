"""Standalone test - no app imports needed."""

THRESHOLDS = {
    "aqi":            lambda v: v > 100,
    "fev1_pct":       lambda v: v < 80,
    "fvc_pct":        lambda v: v < 80,
    "fev1_fvc_ratio": lambda v: v < 0.70,
    "wheezing":       lambda v: v == 1,
    "smoking":        lambda v: v == 1,
    "exercise_level": lambda v: v == 0,
    "bmi":            lambda v: v < 18.5 or v > 30,
}

def score(data):
    bad = 0
    flags = {}
    for feat, fn in THRESHOLDS.items():
        val = float(data.get(feat, 0))
        hit = fn(val)
        flags[feat] = hit
        if hit:
            bad += 1
    if bad >= 4:
        label = "Severe"
    elif bad >= 2:
        label = "Moderate"
    else:
        label = "Mild"
    return label, bad, flags

tests = [
    ("Mild", {"pm25":50,"pm10":80,"no2":20,"so2":15,"aqi":100,"age":28,"bmi":22,"smoking":0,"exercise_level":2,"fev1_pct":90,"fvc_pct":95,"fev1_fvc_ratio":0.80,"wheezing":0}),
    ("Moderate", {"pm25":50,"pm10":80,"no2":20,"so2":15,"aqi":100,"age":45,"bmi":25,"smoking":1,"exercise_level":1,"fev1_pct":82,"fvc_pct":90,"fev1_fvc_ratio":0.65,"wheezing":0}),
    ("Severe", {"pm25":50,"pm10":80,"no2":20,"so2":15,"aqi":100,"age":60,"bmi":32,"smoking":1,"exercise_level":0,"fev1_pct":45,"fvc_pct":55,"fev1_fvc_ratio":0.55,"wheezing":1}),
]

all_pass = True
for expected, data in tests:
    label, bad, flags = score(data)
    status = "PASS" if label == expected else "FAIL"
    if status == "FAIL":
        all_pass = False
    flagged = [k for k,v in flags.items() if v]
    print(f"[{status}] Expected={expected:10s} Got={label:10s} BadFlags={bad} Flagged={flagged}")

print()
print("ALL TESTS PASSED!" if all_pass else "SOME TESTS FAILED!")
