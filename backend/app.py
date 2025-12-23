from flask import Flask, request, jsonify
from flask_cors import CORS
from emotion import detect_emotion
from datetime import datetime
from spotify import get_playlist
from dotenv import load_dotenv
load_dotenv()


app = Flask(__name__)
CORS(app)

mood_history = []


@app.route("/detect", methods=["POST"])
def detect():
    image = request.json["image"]
    emotion = detect_emotion(image)
    mood_history.append({
        "emotion": emotion,
        "time": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    })
    return jsonify({"emotion": emotion})

@app.route("/playlist/<emotion>")
def playlist(emotion):
    data = get_playlist(emotion)

    if not data:
        return jsonify({"error": "No playlist found"}), 404

    return jsonify({
        "playlist_url": data["url"],
        "intent": data["intent"]
    })


@app.route("/history")
def history():
    return jsonify(mood_history)

@app.route("/history/clear", methods=["POST"])
def clear_history():
    mood_history.clear()
    return jsonify({"message": "Mood history cleared"})


if __name__ == "__main__":
    app.run(debug=True)
