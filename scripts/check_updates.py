# Scheduled data-drift check. Never mutates clinics.json — it only reports:
#   1. existing clinics whose Google businessStatus is no longer OPERATIONAL
#   2. existing clinics whose Google location moved >150m (likely relocation)
#   3. candidate new 24hr clinics: per-city Places searches for place_ids
#      we don't have yet
# Findings are written to report.md; the GitHub Actions workflow turns a
# non-empty report into a repo issue, which triggers GitHub's own email
# notification. Run from repo root: python3 scripts/check_updates.py

import json
import math
import os
import re
import time

import requests

API_KEY = os.environ["MAPS_KEY"]  # server key — set MAPS_KEY=... (no fallback: the old public key is referrer-locked)
MOVE_THRESHOLD_M = 150

CITIES = ["台北", "新北", "基隆", "桃園", "新竹", "苗栗", "台中", "彰化", "南投",
          "雲林", "嘉義", "台南", "高雄", "屏東", "宜蘭", "花蓮", "台東", "澎湖", "金門", "馬祖"]
QUERIES = ["24小時 動物醫院", "動物醫院 夜間急診"]


def call(fn, *a, tries=5, **kw):
    for attempt in range(tries):
        r = fn(*a, **kw, timeout=20)
        if r.status_code in (403, 429):
            time.sleep(5 * (attempt + 1))
            continue
        r.raise_for_status()
        return r.json()
    raise SystemExit("rate limited after retries")


def dist_m(lat1, lng1, lat2, lng2):
    dx = (lng1 - lng2) * 111320 * math.cos(math.radians(lat1))
    dy = (lat1 - lat2) * 110540
    return math.hypot(dx, dy)


def place_details(place_id):
    return call(requests.get, f"https://places.googleapis.com/v1/places/{place_id}",
                params={"languageCode": "zh-TW"},
                headers={"X-Goog-Api-Key": API_KEY,
                         "X-Goog-FieldMask": "location,businessStatus,formattedAddress,displayName"})


def search(query):
    d = call(requests.post, "https://places.googleapis.com/v1/places:searchText",
             json={"textQuery": query, "languageCode": "zh-TW"},
             headers={"X-Goog-Api-Key": API_KEY,
                      "X-Goog-FieldMask": "places.id,places.displayName,places.formattedAddress,places.businessStatus"})
    return d.get("places", [])


def main():
    clinics = json.load(open("JSON/clinics.json", encoding="utf-8"))
    known_ids = {c["place_id"] for c in clinics if c["place_id"]}
    for c in clinics:
        known_ids.update(c.get("alt_place_ids", []))
    # street+number tail of every known clinic address (text after the last
    # 市/區/鄉/鎮/里 marker), to drop duplicate Google listings of clinics we
    # already track under a different place_id
    def street_tail(addr):
        tail = re.split(r"[市區鄉鎮村里]", addr.replace("臺", "台"))[-1]
        return tail if re.search(r"\d+號", tail) else ""
    known_streets = {t for c in clinics if (t := street_tail(c["address_zh"]))}
    problems, candidates = [], []

    # 1+2: drift check for known clinics
    for c in clinics:
        if not (c["active"] and c["place_id"]):
            continue
        d = place_details(c["place_id"])
        time.sleep(1.0)
        status = d.get("businessStatus", "UNKNOWN")
        if status != "OPERATIONAL":
            problems.append(f"[狀態] {c['name_zh']}: businessStatus={status}")
        loc = d.get("location")
        if loc:
            delta = dist_m(c["lat"], c["lng"], loc["latitude"], loc["longitude"])
            if delta > MOVE_THRESHOLD_M:
                problems.append(
                    f"[搬家?] {c['name_zh']}: 位置移動 {int(delta)}m，Google 地址: {d.get('formattedAddress', '?')}")

    # 3: discovery sweep
    seen = set()
    for city in CITIES:
        for q in QUERIES:
            for p in search(f"{q} {city}"):
                pid = p["id"]
                if pid in known_ids or pid in seen:
                    continue
                addr = p.get("formattedAddress", "")
                if "台灣" not in addr and "臺灣" not in addr:
                    continue  # Google sometimes returns HK/overseas hits
                if street_tail(addr) in known_streets:
                    continue  # duplicate listing of a clinic we already have
                seen.add(pid)
                name = p["displayName"]["text"]
                # only surface results that look like emergency/24hr service,
                # and drop obvious non-candidates (human ERs, "no emergency
                # service" disclaimers, unrelated 24h businesses)
                looks_emergency = any(k in name for k in ("24", "急診", "急救", "夜間"))
                noise = any(k in name for k in ("沒有急診", "無法接急診", "非24小時", "暫時取消",
                                                "自助洗", "基督教醫院", "醫院急診室", "急診請先電聯"))
                if looks_emergency and not noise and "動物" in name + p.get("formattedAddress", ""):
                    candidates.append(f"[候選] {name} | {p.get('formattedAddress', '?')}")
            time.sleep(1.0)

    if not problems and not candidates:
        print("no changes detected")
        return

    report = ["自動比對結果（請人工確認後再更新資料）", ""]
    if problems:
        report += ["## 既有診所異動", ""] + [f"- {p}" for p in problems] + [""]
    if candidates:
        report += ["## 候選新診所", ""] + [f"- {c}" for c in candidates] + [""]
    report.append(f"_{len(problems)} 筆異動、{len(candidates)} 筆候選_")
    text = "\n".join(report)
    print(text)
    with open("report.md", "w", encoding="utf-8") as f:
        f.write(text + "\n")


if __name__ == "__main__":
    main()
