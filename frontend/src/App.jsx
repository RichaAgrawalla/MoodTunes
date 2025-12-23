import { useState } from 'react'
import './App.css'
import MoodHistory from "./components/MoodHistory";
import WebcamCapture from "./components/WebcamCapture";

function App() {
  return (
    <div className="app-container">
      <h1>🎵 MoodTunes</h1>
      <p>AI-powered music based on your mood</p>

      <div className="card">
        <WebcamCapture />
      </div>

      {/* <div className="card">
        <MoodHistory />
      </div> */}
    </div>
  );
}

export default App;