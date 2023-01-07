# render all the templates

from flask import Flask, redirect, render_template, request

# TODO: connect with database to store the vet clinics info

# need to tell Flask what module to locate the current Flask app instance in
# Set FLASK_APP as an environment variable(run the following command in terminal):
# export FLASK_APP=file name


app = Flask(__name__)

@app.route("/")
def index():
    return render_template("index.html")



@app.route("/route-en")
def planInEnglish():
    return render_template("route-planner-en.html")



@app.route("/route-zh")
def planInChinese():
    return render_template("route-planner-zh.html")


@app.route("/detail-en")
def detailsInEnglish():
    return render_template("details-en.html")



@app.route("/detail-zh")
def detailsInChinese():
    return render_template("details-zh.html")


if __name__ == "__main__":
    app.run(debug=True)