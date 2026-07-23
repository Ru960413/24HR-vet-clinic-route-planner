# One-time migration: merge JSON/info_zh.json (authoritative) + JSON/info_en.json
# into JSON/clinics.json — one record per clinic, bilingual fields.
# Run from repo root: python3 scripts/migrate_data.py

import json
import re

ZH = json.load(open("JSON/info_zh.json", encoding="utf-8"))
EN = json.load(open("JSON/info_en.json", encoding="utf-8"))

# zh clinics with no counterpart in info_en.json — English text sourced from
# needEdit.md and each clinic's own website.
EN_NEW = {
    "上弦動物醫院": {
        "name": "Sensation Animal Emergency Hospital",
        "address": "No. 126-1, Fuzhong Rd., Banqiao Dist., New Taipei City",
        "note": "24-hour emergency service",
    },
    "長佐動物醫院": {
        "name": "Chang Tzuo Animal Hospital",
        "address": "1F., No. 348, Yiwen St., Banqiao Dist., New Taipei City",
        "note": "Emergency hours 9PM-12AM, call before going",
    },
    "吉米哈利動物醫院": {
        "name": "James Herriot Animal Hospital",
        "address": "No. 250, Dasheng St., Nantun Dist., Taichung City",
        "note": "Night emergency service 9PM-2AM",
    },
    "慕光動物醫院": {
        "name": "Ad Astra Veterinary Hospital",
        "address": "No. 569, Sec. 1, Ximen Rd., South Dist., Tainan City",
        "note": "Emergency hours 9PM-1AM",
    },
}

# en notes that lag behind the updated zh notes (needEdit.md changes were only
# applied to info_zh.json) — keyed by zh name.
EN_NOTE_OVERRIDES = {
    "太僕動物醫院（龍江院）": "Call after 9PM. Emergency line: 0928-242-358",
    "太僕動物醫院(南京院)": "Call after 9PM. Emergency line: 0985-699-633",
    "全國動物醫院（台北分院）": "Night emergency 9:30PM-8:30AM (dogs & cats only)",
    "大群動物醫院": "Emergency line: 0982-966-674",
    "大安動物醫院": "Taipei 24H emergency line: 0986-125-003",
    "忠愛動物醫院": "Emergency service until 3AM, call before going",
    "樂活動物醫院": "Call between 9PM to 2AM, Sunday off",
    "聯盟動物醫院（仁武總院）": "Emergency service 9PM-2AM. For dogs, cats, rodents and rabbits",
}

CITY_EN = {
    "台北市": "Taipei City", "新北市": "New Taipei City", "桃園市": "Taoyuan City",
    "新竹市": "Hsinchu City", "新竹縣": "Hsinchu County", "台中市": "Taichung City",
    "彰化縣": "Changhua County", "雲林縣": "Yunlin County", "台南市": "Tainan City",
    "臺南市": "Tainan City", "高雄市": "Kaohsiung City", "屏東縣": "Pingtung County",
    "花蓮縣": "Hualien County",
}


def phones(c):
    return set(re.findall(r"\d{7,10}", c.get("phone", "").replace("-", "").replace(" ", "")))


def split_address(addr):
    m = re.match(r"^(台北市|新北市|桃園市|新竹市|新竹縣|台中市|彰化縣|雲林縣|台南市|臺南市|高雄市|屏東縣|花蓮縣)([^市縣]{1,3}?(?:區|市|鎮|鄉))", addr)
    if not m:
        raise ValueError(f"can't parse city/district from: {addr}")
    city = "台南市" if m.group(1) == "臺南市" else m.group(1)
    return city, m.group(2)


def emergency_phone(note):
    m = re.search(r"急診專線[：:]\s*([\d\-]{9,12})", note)
    return m.group(1) if m else ""


def pick_website(zh_site, en_site):
    for s in (zh_site.strip(), en_site.strip()):
        if s.startswith("http"):
            return s
    return ""


en_used = set()


def match_en(zc):
    p = phones(zc)
    for i, ec in enumerate(EN):
        if i not in en_used and p and p & phones(ec):
            en_used.add(i)
            return ec
    return None


clinics = []
for zc in ZH:
    city, district = split_address(zc["address"])
    ec = match_en(zc)
    if ec is None:
        extra = EN_NEW[zc["name"]]  # KeyError = unexpected unmatched clinic
        name_en, addr_en, note_en = extra["name"], extra["address"], extra["note"]
        site_en = ""
    else:
        name_en, addr_en = ec["name"].strip(), ec["address"].strip()
        note_en = EN_NOTE_OVERRIDES.get(zc["name"], ec["note"]).strip()
        site_en = ec["website"]
    clinics.append({
        "id": len(clinics) + 1,
        "name_zh": zc["name"].strip(),
        "name_en": name_en,
        "address_zh": zc["address"].strip(),
        "address_en": addr_en,
        "city_zh": city,
        "city_en": CITY_EN[city],
        "district_zh": district,
        "note_zh": zc["note"].strip(),
        "note_en": note_en,
        "phone": zc["phone"].strip(),
        "emergency_phone": emergency_phone(zc["note"]),
        "website": pick_website(zc["website"], (ec or {}).get("website", "")),
        "lat": zc["lat"],
        "lng": zc["lng"],
        "place_id": None,
        "last_verified": None,
        "active": True,
    })

unmatched_en = [EN[i]["name"] for i in range(len(EN)) if i not in en_used]
print(f"merged: {len(clinics)} clinics")
print("en-only entries dropped (per needEdit.md):", unmatched_en)

with open("JSON/clinics.json", "w", encoding="utf-8") as f:
    json.dump(clinics, f, ensure_ascii=False, indent=2)
    f.write("\n")
print("wrote JSON/clinics.json")
