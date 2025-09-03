import requests
import numpy as np
from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from io import BytesIO
from PIL import Image
import uvicorn

# FastAPI app
app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],    
)

# Class names
CLASS_NAMES = ["Early Blight", "Late Blight", "Healthy"]

# TensorFlow Serving URL (adjust port/model name if needed)
TF_SERVING_URL = "http://localhost:8501/v1/models/potato_disease:predict"


# -------------------------
# Utility Functions
# -------------------------
def read_image(file) -> np.ndarray:
    """
    Read and preprocess uploaded image file into numpy array.
    """
    image = Image.open(BytesIO(file)).convert("RGB")
    image = image.resize((256, 256))
    img_array = np.array(image)
    return img_array


def prepare_payload(img_array: np.ndarray) -> dict:
    """
    Prepare JSON payload for TensorFlow Serving request.
    """
    img_batch = np.expand_dims(img_array, 0).tolist()  # Convert to list for JSON
    return {"instances": img_batch}


# -------------------------
# Routes
# -------------------------
@app.get("/")
async def root():
    return {"message": "Potato Leaf Disease Classification API (TF Serving) is running 🚀"}


@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    """
    Endpoint that sends image to TensorFlow Serving for prediction.
    """
    contents = await file.read()
    image_array = read_image(contents)
    payload = prepare_payload(image_array)

    # Send request to TensorFlow Serving
    response = requests.post(TF_SERVING_URL, json=payload)

    if response.status_code != 200:
        return {"error": f"TF Serving request failed: {response.text}"}

    predictions = np.array(response.json()["predictions"])
    predicted_label = CLASS_NAMES[np.argmax(predictions[0])]
    confidence = round(100 * np.max(predictions[0]), 2)

    return {
        "class": predicted_label,
        "confidence": confidence,
        "raw_predictions": predictions.tolist()
    }


# -------------------------
# Main Entry
# -------------------------
if __name__ == "__main__":
    uvicorn.run("main_tf_serving:app", host="0.0.0.0", port=8000, reload=True)
