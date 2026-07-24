# One-time backfill: resolve a Google place_id for every clinic in
# JSON/clinics.json via Places API (New) text search.
# A match is accepted only if it lands within MAX_DIST_M of our stored
# coordinates; everything else goes to a review list instead of the data.
# Run from repo root: python3 scripts/build_place_ids.py

import json
import math
import time
import requests

import os
API_KEY = os.environ["MAPS_KEY"]  # server key — set MAPS_KEY=... (no fallback: the old public key is referrer-locked)
MAX_DIST_M = 400


def search(query):
    r = requests.post(
        "https://places.googleapis.com/v1/places:searchText",
        json={"textQuery": query, "languageCode": "zh-TW"},
        headers={
            "X-Goog-Api-Key": API_KEY,
            "X-Goog-FieldMask": "places.id,places.displayName,places.location,places.businessStatus,places.formattedAddress",
        },
        timeout=15,
    )
    if r.status_code in (403, 429):
        raise RateLimited(r.text[:200])
    r.raise_for_status()
    return r.json().get("places", [])


class RateLimited(Exception):
    pass


def search_retry(query, tries=5):
    for attempt in range(tries):
        try:
            return search(query)
        except RateLimited:
            wait = 5 * (attempt + 1)
            print(f"    rate limited, waiting {wait}s...")
            time.sleep(wait)
    raise SystemExit("still rate limited after retries — rerun later, progress is saved")


def dist_m(lat1, lng1, lat2, lng2):
    dx = (lng1 - lng2) * 111320 * math.cos(math.radians(lat1))
    dy = (lat1 - lat2) * 110540
    return math.hypot(dx, dy)


clinics = json.load(open("JSON/clinics.json", encoding="utf-8"))
review = []
for c in clinics:
    if c["place_id"]:
        continue
    places = search_retry(f"{c['name_zh']} {c['address_zh']}")
    time.sleep(1.2)
    best = None
    for p in places[:3]:
        d = dist_m(c["lat"], c["lng"], p["location"]["latitude"], p["location"]["longitude"])
        if d <= MAX_DIST_M and (best is None or d < best[1]):
            best = (p, d)
    if best:
        p, d = best
        c["place_id"] = p["id"]
        status = p.get("businessStatus")
        flag = "" if status == "OPERATIONAL" else f"  << {status}"
        print(f"OK  {c['name_zh']:<20} {int(d):>4}m  {p['displayName']['text'][:30]}{flag}")
        json.dump(clinics, open("JSON/clinics.json", "w", encoding="utf-8"), ensure_ascii=False, indent=2)
    else:
        review.append(c["name_zh"])
        tops = [(p["displayName"]["text"], int(dist_m(c["lat"], c["lng"], p["location"]["latitude"], p["location"]["longitude"]))) for p in places[:2]]
        print(f"??  {c['name_zh']:<20} no match within {MAX_DIST_M}m; top: {tops}")

with open("JSON/clinics.json", "w", encoding="utf-8") as f:
    json.dump(clinics, f, ensure_ascii=False, indent=2)
    f.write("\n")

n = sum(1 for c in clinics if c["place_id"])
print(f"\n{n}/{len(clinics)} matched; needs review: {review}")
