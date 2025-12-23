import { useEffect, useState } from "react";
import axios from "axios";

function MoodHistory() {
  const [history, setHistory] = useState([]);
  const [clearing, setClearing] = useState(false);

  const fetchHistory = () => {
    axios
      .get("http://127.0.0.1:5000/history")
      .then(res => setHistory(res.data))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const clearHistory = async () => {
    setClearing(true);
    try {
      await axios.post("http://127.0.0.1:5000/history/clear");
      setHistory([]);
    } catch (err) {
      console.error(err);
    }
    setClearing(false);
  };

  return (
    <div>
      <h2>🕒 Mood History</h2>

      {history.length === 0 && <p>No moods detected yet</p>}

      {history.length > 0 && (
        <button
          onClick={clearHistory}
          disabled={clearing}
          style={{
            marginBottom: "12px",
            padding: "6px 12px",
            borderRadius: "8px",
            border: "none",
            background: "#ff4d4d",
            color: "white",
            fontWeight: "bold",
            cursor: clearing ? "not-allowed" : "pointer"
          }}
        >
          {clearing ? "Clearing..." : "Clear History"}
        </button>
      )}

      {history
        .slice()
        .reverse()
        .map((item, index) => (
          <div
            key={index}
            style={{
              background: "#282828",
              padding: "10px",
              borderRadius: "10px",
              marginBottom: "8px"
            }}
          >
            <b>{item.emotion.toUpperCase()}</b>
            <div style={{ fontSize: "12px", opacity: 0.7 }}>
              {item.time}
            </div>
          </div>
        ))}
    </div>
  );
}

export default MoodHistory;
