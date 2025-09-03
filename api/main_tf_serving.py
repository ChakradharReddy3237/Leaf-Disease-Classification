from fastapi import FastAPI, UploadFile, File, requests
from fastapi.responses import JSONResponse
import uvicorn
import numpy as np
from io import BytesIO
from PIL import Image
import tensorflow as tf
import requests


app = FastAPI()

import tensorflow as tf

endpoint = "http://localhost:8501/v1/models/potatoes_model:predict"


CLASS_NAMES = ["Early Blight","Late Blight","Healthy"]


@app.get("/ping")
async def ping():
    return {"message": "Hello, I am Chakri"}


def read_file_as_image(data : bytes):
    data = BytesIO(data)
    image = Image.open(data).convert("RGB")
    image = image.resize((256, 256))  # Resize to match model input size
    image = np.array(image) / 255.0  # Normalize the image
    return np.array(image)

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    image = read_file_as_image(await file.read())
    image_batch = np.expand_dims(image, axis=0)

    json_data = {"instances": image_batch.tolist()}
    response = requests.post(endpoint, json=json_data)

    if response.status_code != 200:
        return JSONResponse(status_code=500, content={"error": response.text})

    result = response.json()
    print("DEBUG TF Serving Response:", result)  # 👈 Add this for troubleshooting

    # ✅ Fix 3: Use correct key
    try:
        predictions = np.array(result["predictions"][0])
    except KeyError:
        return JSONResponse(status_code=500, content={"error": f"Unexpected response format: {result}"})

    predicted_label = CLASS_NAMES[np.argmax(predictions)]
    confidence = round(100 * np.max(predictions), 2)

    return {
        "predicted_label": predicted_label,
        "confidence": confidence
    }

if __name__ == "__main__":
    uvicorn.run(app, host="localhost", port=8001)
