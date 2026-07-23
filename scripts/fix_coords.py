# Resolve the 3 clinics whose stored coordinates were too far off for the
# distance-gated match in build_place_ids.py, then sync every clinic's
# lat/lng to its Google place location (authoritative).
# Run from repo root: python3 scripts/fix_coords.py

import json
import math
import time
import requests

API_KEY = "AIzaSyDGIhVa1IgIS69H7oOjC5l4nog_ZY5L1_c"
HEADERS = {"X-Goog-Api-Key": API_KEY}


def call(fn, *a, tries=5, **kw):
    for attempt in range(tries):
        r = fn(*a, **kw, timeout=15)
        if r.status_code in (403, 429):
            time.sleep(5 * (attempt + 1))
            continue
        r.raise_for_status()
        return r.json()
    raise SystemExit("rate limited, rerun later")


def dist_m(lat1, lng1, lat2, lng2):
    dx = (lng1 - lng2) * 111320 * math.cos(math.radians(lat1))
    dy = (lat1 - lat2) * 110540
    return math.hypot(dx, dy)


clinics = json.load(open("JSON/clinics.json", encoding="utf-8"))

# pass 1: clinics still missing a place_id — take the top same-name result
for c in clinics:
    if c["place_id"]:
        continue
    d = call(requests.post, "https://places.googleapis.com/v1/places:searchText",
             json={"textQuery": f"{c['name_zh']} {c['address_zh']}", "languageCode": "zh-TW"},
             headers={**HEADERS, "X-Goog-FieldMask": "places.id,places.displayName,places.formattedAddress,places.businessStatus"})
    time.sleep(1.2)
    top = next((p for p in d.get("places", []) if c["name_zh"][:3] in p["displayName"]["text"]), None)
    if not top:
        print(f"!!  {c['name_zh']}: still no name match — needs manual check")
        continue
    c["place_id"] = top["id"]
    print(f"OK  {c['name_zh']} -> {top['displayName']['text'][:35]} | {top['formattedAddress']}")

# pass 2: sync all coordinates to the Google place location
moved = 0
for c in clinics:
    if not c["place_id"]:
        continue
    d = call(requests.get, f"https://places.googleapis.com/v1/places/{c['place_id']}",
             params={"languageCode": "zh-TW"},
             headers={**HEADERS, "X-Goog-FieldMask": "location,businessStatus,formattedAddress"})
    time.sleep(1.2)
    loc = d["location"]
    delta = dist_m(c["lat"], c["lng"], loc["latitude"], loc["longitude"])
    status = d.get("businessStatus")
    if status != "OPERATIONAL":
        print(f"!!  {c['name_zh']}: businessStatus={status}")
    if delta > 30:
        print(f"~   {c['name_zh']}: moved {int(delta)}m -> {d.get('formattedAddress','')[:40]}")
        moved += 1
    c["lat"], c["lng"] = loc["latitude"], loc["longitude"]

with open("JSON/clinics.json", "w", encoding="utf-8") as f:
    json.dump(clinics, f, ensure_ascii=False, indent=2)
    f.write("\n")
print(f"\ndone: {sum(1 for c in clinics if c['place_id'])}/{len(clinics)} have place_id; {moved} coords corrected >30m")
