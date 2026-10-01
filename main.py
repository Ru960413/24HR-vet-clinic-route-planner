import json
import os
import re

from flask import Flask, abort, jsonify, redirect, render_template, request, url_for
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

CLINICS_PATH = os.path.join(os.path.dirname(__file__), "JSON", "clinics.json")
# browser key: public by design (ships in the page source) and referrer-locked
# to the production domain + localhost, so the fallback here is safe.
# NOTE: deliberately NOT "MAPS_KEY" — that env var holds the server key for
# scripts/, and Flask auto-loads .env, which would feed the wrong key to the map
MAPS_KEY = os.environ.get("MAPS_BROWSER_KEY", "AIzaSyDGIhVa1IgIS69H7oOjC5l4nog_ZY5L1_c")

# clinics.json is tiny and changes rarely — cache it, reload when the file does
_cache = {"mtime": None, "data": None}

UI_TEXT = {
    "zh": {
        "route_title": "急診獸醫院地圖",
        "more_info": "更多獸醫院的詳細資訊",
        "details_title": "獸醫院詳細資訊",
        "details_heading": "全台提供24小時急診服務的獸醫院",
        "toc_title": "內容摘要",
        "toc_suffix": "獸醫院",
        "th_name": "醫院名稱",
        "th_address": "地址",
        "th_website": "網站",
        "th_note": "備註",
        "th_phone": "電話",
        "link": "連結",
        "no_coverage_title": "目前無夜間急診資源的地區",
        "no_coverage_hint": "以下地區經查目前沒有 24 小時或夜間急診獸醫院。緊急時請先電話聯絡當地診所，或前往鄰近縣市：",
        "evening_label": "🌙 晚間門診（非深夜急診，請先電話）：",
        "verified": "資料確認於",
        "verified_hint": "標示 ✓ 的診所為近期查證過的資料；急診資訊變動快，前往前建議先電話確認。",
        "report_link": "資訊有誤？回報給我",
        "about_title": "關於這張地圖",
        "nightlight_title": "關於夜燈",
        "kofi": "請這張地圖喝杯抹茶",
        "campaign_title": "讓地圖亮一整年",
        "support_twd": "支持地圖（台灣・Oen）",
        "support_intl": "海外朋友請走 Ko-fi",
        "back_to_map": "回地圖",
        "support": "支持",
        "faq_title": "常見問題",
        "contact_title": "聯絡我",
        "form_name": "姓名",
        "form_subject": "主旨",
        "form_email": "Email",
        "form_message": "訊息",
        "form_send": "送出",
    },
    "en": {
        "route_title": "Emergency Vet Map",
        "more_info": "More info about vet clinics",
        "details_title": "Clinic Details",
        "details_heading": "Emergency Veterinary Services in Taiwan",
        "toc_title": "Contents",
        "toc_suffix": " Emergency Vet Clinics",
        "th_name": "Name",
        "th_address": "Address",
        "th_website": "Website",
        "th_note": "Note",
        "th_phone": "Phone",
        "link": "Link",
        "no_coverage_title": "Areas currently without night emergency care",
        "no_coverage_hint": "These areas currently have no 24-hour or night-emergency vet clinic. In an emergency, call a local clinic first or head to a neighboring county:",
        "evening_label": "🌙 Evening hours (not a late-night ER — call first): ",
        "verified": "Verified",
        "verified_hint": "Clinics marked ✓ were recently verified; emergency info changes fast — please call before going.",
        "report_link": "Spotted an error? Report it",
        "about_title": "About This Map",
        "nightlight_title": "About the Night Light",
        "kofi": "Buy this map a matcha",
        "campaign_title": "Keep the map lit for a year",
        "support_twd": "Support in Taiwan (Oen, TWD)",
        "support_intl": "International? Ko-fi",
        "back_to_map": "Back to map",
        "support": "Support",
        "faq_title": "FAQ",
        "contact_title": "Get In Touch",
        "form_name": "Name",
        "form_subject": "Subject",
        "form_email": "Email",
        "form_message": "Message",
        "form_send": "Send",
    },
}


def load_clinics():
    mtime = os.path.getmtime(CLINICS_PATH)
    if _cache["mtime"] != mtime:
        with open(CLINICS_PATH, encoding="utf-8") as f:
            _cache["data"] = json.load(f)
        _cache["mtime"] = mtime
    return _cache["data"]


LANG_FIELDS = ["name", "address", "city", "district", "note"]


def localize(clinic, lang):
    out = {k: v for k, v in clinic.items()
           if not any(k.startswith(f + "_") for f in LANG_FIELDS)}
    for f in LANG_FIELDS:
        out[f] = clinic.get(f"{f}_{lang}") or clinic.get(f"{f}_zh")
    return out


def split_phones(raw):
    return [{"label": p.strip(), "tel": re.sub(r"[^0-9+]", "", p)}
            for p in raw.split(" or ") if p.strip()]


def require_lang(lang):
    if lang not in ("zh", "en"):
        abort(404)


CANONICAL_HOST = "vetmap.soulbrush.art"


@app.before_request
def redirect_legacy_host():
    # the old railway.app URL lives on in viral posts and QR codes —
    # permanently forward it (and any other alias) to the canonical domain
    if request.host != CANONICAL_HOST and "localhost" not in request.host \
            and "127.0.0.1" not in request.host:
        return redirect(f"https://{CANONICAL_HOST}{request.full_path.rstrip('?')}", 301)


@app.route("/api/clinics")
def api_clinics():
    clinics = [c for c in load_clinics() if c["active"]]
    lang = request.args.get("lang")
    if lang:
        if lang not in ("zh", "en"):
            abort(400, "lang must be 'zh' or 'en'")
        clinics = [localize(c, lang) for c in clinics]
    return jsonify(clinics)


@app.route("/")
def index():
    latest = max(c["last_verified"] or "" for c in load_clinics())
    y, m = latest[:4], latest[5:7].lstrip("0")
    months_en = ["", "January", "February", "March", "April", "May", "June", "July",
                 "August", "September", "October", "November", "December"]
    return render_template("index.html", updated_zh=f"{y}年{m}月",
                           updated_en=f"{months_en[int(m)]} {y}")


@app.route("/route/<lang>")
def route_planner(lang):
    require_lang(lang)
    return render_template("route-planner.html", lang=lang, t=UI_TEXT[lang], maps_key=MAPS_KEY)


@app.route("/details/<lang>")
def details(lang):
    require_lang(lang)
    # group city -> district in first-seen order; clinics with the same
    # district merge into one table even if they aren't adjacent in the data
    cities, city_ix = [], {}
    for c in (localize(x, lang) for x in load_clinics() if x["active"]):
        c["phones"] = split_phones(c["phone"])
        if c["city"] not in city_ix:
            city_ix[c["city"]] = {"name": c["city"], "anchor": re.sub(r"\W", "", c["city"]),
                                  "districts": [], "_dix": {}}
            cities.append(city_ix[c["city"]])
        city = city_ix[c["city"]]
        if c["district"] not in city["_dix"]:
            city["_dix"][c["district"]] = {"name": c["district"], "clinics": []}
            city["districts"].append(city["_dix"][c["district"]])
        city["_dix"][c["district"]]["clinics"].append(c)
    no_coverage = [dict(zip(("region", "nearest"), r[lang]),
                        evening=r.get("evening", {}).get(lang))
                   for r in NO_COVERAGE]
    return render_template("details.html", lang=lang, t=UI_TEXT[lang], cities=cities,
                           no_coverage=no_coverage)


@app.route("/about/<lang>")
def about(lang):
    require_lang(lang)
    return render_template("about.html", lang=lang, t=UI_TEXT[lang])


@app.route("/contact/<lang>")
def contact(lang):
    require_lang(lang)
    return render_template("contact-form.html", lang=lang, t=UI_TEXT[lang],
                           thankyou_url=url_for("thankyou", _external=True))


@app.route("/wallpapers")
def wallpapers():
    return render_template("wallpapers.html", lang="zh", t=UI_TEXT["zh"])


@app.route("/thankyou.html")
def thankyou():
    return render_template("thankyou.html")


# regions verified (2026-07) to have no night/24h emergency vet at all;
# shown on the details page so rural users don't search in vain
NO_COVERAGE = [
    {"zh": ("宜蘭縣", "最近的急診在大台北地區（雪隧車程約 1 小時）"),
     "en": ("Yilan County", "Nearest emergency care is in greater Taipei (~1 hr via Hsuehshan Tunnel)"),
     "evening": {"zh": "弘隼動物醫院（宜蘭市）門診至 21:00・03-932-7600（查證 2026-10）",
                 "en": "Hong Sun Animal Hospital (Yilan City) open until 9PM · 03-932-7600 (verified Oct 2026)"}},
    {"zh": ("苗栗縣", "最近的急診在新竹市區或台中市區"),
     "en": ("Miaoli County", "Nearest emergency care is in Hsinchu City or Taichung City"),
     "evening": {"zh": "聖心動物醫院（竹南）週一至六門診至 21:00・037-461-332（查證 2026-10）",
                 "en": "Sheng Xin Animal Hospital (Zhunan) Mon–Sat until 9PM · 037-461-332 (verified Oct 2026)"}},
    {"zh": ("南投縣", "最近的急診在台中市區"),
     "en": ("Nantou County", "Nearest emergency care is in Taichung City"),
     "evening": {"zh": "慧光動物醫院（埔里）門診至 21:00，無固定公休（院方：除開會或上課外不休息，前往前請先電話確認）・049-290-1187（查證 2026-10）",
                 "en": "Hui Guang Animal Hospital (Puli) until 9PM, no fixed day off (closed only for meetings/training — call before heading over) · 049-290-1187 (verified Oct 2026)"}},
    {"zh": ("嘉義縣市（深夜時段）", "高醫動物醫院營業至凌晨00:30；之後最近的急診在雲林虎尾或台南市區"),
     "en": ("Chiayi (late night)", "Kao Yi Animal Hospital is open until 12:30AM; after that, the nearest emergency care is in Huwei (Yunlin) or Tainan City")},
    {"zh": ("台東縣", "最近的急診在花蓮市區或高雄市區（車程皆遠，請務必先電話聯絡）"),
     "en": ("Taitung County", "Nearest emergency care is in Hualien City or Kaohsiung City (both far — call ahead)")},
    {"zh": ("澎湖縣", "無夜間急診；緊急時請先電話聯絡當地日間診所"),
     "en": ("Penghu County", "No night emergency care; call a local daytime clinic first"),
     "evening": {"zh": "湖光動物醫院澎湖分院（馬公・預約制）僅週三、四門診至 21:00・06-926-9691（查證 2026-10）",
                 "en": "Hu Kuang Animal Hospital Penghu Branch (Magong, by appointment) Wed & Thu only, until 9PM · 06-926-9691 (verified Oct 2026)"}},
    {"zh": ("金門・馬祖", "金門無夜間急診，緊急時請先電話聯絡當地日間診所；馬祖島上目前沒有獸醫院"),
     "en": ("Kinmen / Matsu", "Kinmen has no night emergency care — call a local daytime clinic first; Matsu currently has no veterinary clinic at all")},
]


# legacy URLs (bookmarks, search engines)
LEGACY = {
    "/route-en": "/route/en", "/route-zh": "/route/zh",
    "/detail-en": "/details/en", "/detail-zh": "/details/zh",
    "/contact": "/contact/en", "/contact-zh": "/contact/zh",
}
for old, new in LEGACY.items():
    app.add_url_rule(old, f"legacy_{old.strip('/')}",
                     lambda new=new: redirect(new, 301))


if __name__ == "__main__":
    app.run(debug=True)
