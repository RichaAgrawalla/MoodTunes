import base64
import cv2
import numpy as np
from deepface import DeepFace

def detect_emotion(image_base64):
    # Remove base64 header
    image_base64 = image_base64.split(",")[1]

    # Decode base64 to bytes
    img_bytes = base64.b64decode(image_base64)

    # Convert bytes to numpy array
    img_array = np.frombuffer(img_bytes, np.uint8)

    # Decode image
    frame = cv2.imdecode(img_array, cv2.IMREAD_COLOR)

    # Analyze emotion
    result = DeepFace.analyze(
        frame,
        actions=["emotion"],
        enforce_detection=False
    )

    return result[0]["dominant_emotion"]
