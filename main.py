import json
import os
import re

from flask import Flask, abort, jsonify, redirect, render_template, request, url_for
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

CLINICS_PATH = os.path.join(os.path.dirname(__file__), "JSON", "clinics.json")
# browser key: public by design (ships in the page source) and referrer-locked
# to the production domain + localhost, so the fallback here is safe
MAPS_KEY = os.environ.get("MAPS_KEY", "AIzaSyDGIhVa1IgIS69H7oOjC5l4nog_ZY5L1_c")

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
        "verified": "資料確認於",
        "verified_hint": "標示 ✓ 的診所為近期查證過的資料；急診資訊變動快，前往前建議先電話確認。",
        "report_link": "資訊有誤？回報給我",
        "about_title": "關於這張地圖",
        "kofi": "請這張地圖喝杯抹茶",
        "back_to_map": "回地圖",
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
        "verified": "Verified",
        "verified_hint": "Clinics marked ✓ were recently verified; emergency info changes fast — please call before going.",
        "report_link": "Spotted an error? Report it",
        "about_title": "About This Map",
        "kofi": "Buy this map a matcha",
        "back_to_map": "Back to map",
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
    return render_template("index.html")


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
    return render_template("details.html", lang=lang, t=UI_TEXT[lang], cities=cities)


@app.route("/about/<lang>")
def about(lang):
    require_lang(lang)
    return render_template("about.html", lang=lang, t=UI_TEXT[lang])


@app.route("/contact/<lang>")
def contact(lang):
    require_lang(lang)
    return render_template("contact-form.html", lang=lang, t=UI_TEXT[lang],
                           thankyou_url=url_for("thankyou", _external=True))


@app.route("/thankyou.html")
def thankyou():
    return render_template("thankyou.html")


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
