import spotipy
from spotipy.oauth2 import SpotifyClientCredentials
import os

client_id = os.getenv("SPOTIFY_CLIENT_ID")
client_secret = os.getenv("SPOTIFY_CLIENT_SECRET")

if not client_id or not client_secret:
    raise ValueError("Spotify credentials not found in environment variables")

sp = spotipy.Spotify(
    auth_manager=SpotifyClientCredentials(
        client_id=client_id,
        client_secret=client_secret
    )
)

emotion_playlists = {
    "happy": {
        "id": "37i9dQZF1DXdPec7aLTmlC",
        "intent": "Celebrate & positive energy"
    },
    "sad": {
        "id": "37i9dQZF1DX7qK8ma5wgG1",
        "intent": "Comfort & emotional release"
    },
    "angry": {
        "id": "37i9dQZF1DX1tyCD9QhIWF",
        "intent": "Channel anger & intensity"
    },
    "neutral": {
        "id": "37i9dQZF1DX4WYpdgoIcn6",
        "intent": "Relax & focus"
    },
    "surprise": {
        "id": "37i9dQZF1DXaXB8fQg7xif",
        "intent": "High-energy excitement"
    }
}

def get_playlist(emotion):
    data = emotion_playlists.get(emotion)

    if not data:
        return None

    return {
        "url": f"https://open.spotify.com/playlist/{data['id']}",
        "intent": data["intent"]
    }
