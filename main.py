import json
import os

from flask import Flask, abort, jsonify, redirect, render_template, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

CLINICS_PATH = os.path.join(os.path.dirname(__file__), "JSON", "clinics.json")

# clinics.json is tiny and changes rarely — cache it, reload when the file does
_cache = {"mtime": None, "data": None}


def load_clinics():
    mtime = os.path.getmtime(CLINICS_PATH)
    if _cache["mtime"] != mtime:
        with open(CLINICS_PATH, encoding="utf-8") as f:
            _cache["data"] = json.load(f)
        _cache["mtime"] = mtime
    return _cache["data"]


LANG_FIELDS = ["name", "address", "city", "note"]


def localize(clinic, lang):
    out = {k: v for k, v in clinic.items()
           if not any(k.startswith(f + "_") for f in LANG_FIELDS + ["district"])}
    for f in LANG_FIELDS:
        out[f] = clinic.get(f"{f}_{lang}", clinic.get(f"{f}_zh"))
    out["district"] = clinic["district_zh"]
    return out


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
    if lang not in ("zh", "en"):
        abort(404)
    return render_template(f"route-planner-{lang}.html")


@app.route("/details/<lang>")
def details(lang):
    if lang not in ("zh", "en"):
        abort(404)
    return render_template(f"details-{lang}.html")


@app.route("/contact")
def contact():
    return render_template("contact.html")


@app.route("/contact-zh")
def contact_zh():
    return render_template("contact-zh.html")


@app.route("/thankyou.html")
def thankyou():
    return render_template("thankyou.html")


# legacy URLs (bookmarks, search engines)
@app.route("/route-en")
def legacy_route_en():
    return redirect("/route/en", 301)


@app.route("/route-zh")
def legacy_route_zh():
    return redirect("/route/zh", 301)


@app.route("/detail-en")
def legacy_detail_en():
    return redirect("/details/en", 301)


@app.route("/detail-zh")
def legacy_detail_zh():
    return redirect("/details/zh", 301)


if __name__ == "__main__":
    app.run(debug=True)
