import { useRef, useState } from "react";
import Webcam from "react-webcam";
import axios from "axios";

function WebcamCapture() {
  const webcamRef = useRef(null);

  const [emotion, setEmotion] = useState(null);
  const [intent, setIntent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [history, setHistory] = useState([]);

  const captureAndDetect = async () => {
    setLoading(true);
    setError(null);

    try {
      const imageSrc = webcamRef.current.getScreenshot();

      // Detect emotion
      const res = await axios.post("http://127.0.0.1:5000/detect", {
        image: imageSrc
      });

      const detectedEmotion = res.data.emotion;
      setEmotion(detectedEmotion);

      // Get playlist + intent
      const playlistRes = await axios.get(
        `http://127.0.0.1:5000/playlist/${detectedEmotion}`
      );

      setIntent(playlistRes.data.intent);

      // Add to history
      setHistory(prev => [
        {
          emotion: detectedEmotion,
          intent: playlistRes.data.intent,
          time: new Date().toLocaleTimeString()
        },
        ...prev
      ]);

      // Open Spotify
      window.open(playlistRes.data.playlist_url, "_blank");
    } catch (err) {
      console.error(err);
      setError("Could not detect mood. Please try again.");
    }

    setLoading(false);
  };

  const clearHistory = () => {
    setHistory([]);
  };

  return (
    <div
      style={{
        maxWidth: "420px",
        margin: "40px auto",
        padding: "20px",
        borderRadius: "20px",
        background: "#121212",
        color: "#fff",
        boxShadow: "0 10px 40px rgba(0,0,0,0.5)"
      }}
    >
      <h2 style={{ textAlign: "center", marginBottom: "15px" }}>
        🎭 Mood → Music
      </h2>

      <Webcam
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        style={{
          width: "100%",
          borderRadius: "16px",
          marginBottom: "15px"
        }}
      />

      <button
        onClick={captureAndDetect}
        disabled={loading}
        style={{
          width: "100%",
          padding: "14px",
          borderRadius: "14px",
          border: "none",
          background: loading ? "#555" : "#1db954",
          color: "#000",
          fontWeight: "bold",
          fontSize: "16px",
          cursor: loading ? "not-allowed" : "pointer"
        }}
      >
        {loading ? "Detecting mood..." : "Detect Mood 🎶"}
      </button>

      {emotion && (
        <div style={{ marginTop: "16px", textAlign: "center" }}>
          <div style={{ fontSize: "18px" }}>
            Detected Mood:{" "}
            <b style={{ textTransform: "uppercase" }}>{emotion}</b>
          </div>

          {intent && (
            <div
              style={{
                marginTop: "6px",
                fontSize: "14px",
                opacity: 0.8
              }}
            >
              🎧 Music intent: <i>{intent}</i>
            </div>
          )}
        </div>
      )}

      {error && (
        <div
          style={{
            marginTop: "12px",
            color: "#ff6b6b",
            textAlign: "center"
          }}
        >
          {error}
        </div>
      )}

      {/* Mood History */}
      {history.length > 0 && (
        <div style={{ marginTop: "25px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "10px"
            }}
          >
            <h4 style={{ margin: 0 }}>🕒 Mood History</h4>
            <button
              onClick={clearHistory}
              style={{
                background: "transparent",
                border: "none",
                color: "#ff6b6b",
                cursor: "pointer"
              }}
            >
              Clear
            </button>
          </div>

          <div
            style={{
              maxHeight: "160px",
              overflowY: "auto"
            }}
          >
            {history.map((item, index) => (
              <div
                key={index}
                style={{
                  background: "#1e1e1e",
                  padding: "10px",
                  borderRadius: "10px",
                  marginBottom: "8px",
                  fontSize: "14px"
                }}
              >
                <b>{item.emotion.toUpperCase()}</b> — {item.intent}
                <div style={{ opacity: 0.6, fontSize: "12px" }}>
                  {item.time}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default WebcamCapture;
