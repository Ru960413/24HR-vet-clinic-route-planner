# render all the templates

from flask import Flask, render_template
from flask_cors import CORS


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
    return render_template("route-planner-en.html")



@app.route("/route-zh")
def mapInChinese():
    # data = get_addresses_zh()
    return render_template("route-planner-zh.html")


# @app.route('/json-value-en', methods=['GET'])
# def JSON_value_en():
#     data = get_addresses_en()
#     return data



# @app.route('/json-value-zh', methods=['GET'])
# def JSON_value_zh():
#     data = get_addresses_zh()
#     return data



@app.route("/detail-en")
def detailsInEnglish():
    return render_template("details-en.html")



@app.route("/detail-zh")
def detailsInChinese():
    return render_template("details-zh.html")


@app.route("/contact")
def contact():
    return render_template("contact.html")


@app.route("/contact-zh")
def contactZh():
    return render_template("contact-zh.html")


@app.route("/thankyou")
def thankyou():
    return render_template("thankyou.html")



if __name__ == "__main__":
    app.run