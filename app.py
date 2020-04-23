from flask import Flask, jsonify, render_template, redirect, request, url_for, make_response
import json
from bson.json_util import loads, dumps
import musicDBManager

# To connect 10.20.18.124 server 's mongoDB
# From local
# MONGO_HOST = "10.20.18.124"
# MONGO_DB = "test_han"
# MONGO_USER = "dyhan"#
# server = SSHTunnelForwarder(
#     (MONGO_HOST, 27772),
#     ssh_username=MONGO_USER,
#     ssh_password=MONGO_PASS,
#     remote_bind_address=('127.0.0.1', 27017)
# )
#
# server.start()

############################################
app = Flask(__name__)


@app.route('/', methods=['GET'])
def dashboard_main():
    # return "hello word"
    return render_template("main.html")


@app.route('/getAllFeatures', methods=['GET'])
def getAllFeatures_billboard():
    # state is one of  "billboard" and "top50"
    state = request.args.get("state", 0).lower()

    if state == "billboard":
        result = musicDBManager.getBillboard()
    else:
        result = musicDBManager.getTop50()
    # return json.result
    # return json.dumps(result[0])
    return dumps(result)


@app.route('/getATrackImage', methods=['GET'])
def test():
    track = request.args.get("track", 0).lower()

    trackImg_path = musicDBManager.getATrackImage(track)
    # return json.result
    # return json.dumps(result[0])
    return trackImg_path


if __name__ == '__main__':
    app.run(debug=True, port=5000)
