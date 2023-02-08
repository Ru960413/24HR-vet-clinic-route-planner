# render all the templates

from flask import Flask, render_template, jsonify
from flask_cors import CORS
from helpers import get_addresses_zh, get_addresses_en

# TODO: connect with database to store the vet clinics info

# need to tell Flask what module to locate the current Flask app instance in
# Set FLASK_APP as an environment variable(run the following command in terminal):
# export FLASK_APP=file name


app = Flask(__name__)

# enable cross-origin HTTP requests
CORS(app)


@app.route("/")
def index():
    return render_template("index.html")



@app.route("/route-en")
def mapInEnglish():
    data = get_addresses_en()
    return render_template("route-planner-en.html", data=data)



@app.route("/route-zh")
def mapInChinese():
    data = get_addresses_zh()
    return render_template("route-planner-zh.html", data=data)



@app.route("/detail-en")
def detailsInEnglish():
    return render_template("details-en.html")



@app.route("/detail-zh")
def detailsInChinese():
    return render_template("details-zh.html")


if __name__ == "__main__":
    app.run(debug=True)