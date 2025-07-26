from fastapi import FastAPI, UploadFile, File
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware

import uvicorn
import numpy as np
from io import BytesIO
from PIL import Image
import tensorflow as tf
import requests
from main_tf_serving import endpoint


app = FastAPI()
# CORS middleware to allow requests from the frontend
origins = [
    "http://localhost",
    "http://localhost:3000",
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# MODEL = tf.keras.models.load_model("../saved_models/1/potato_disease_classifier.h5", compile=False)
MODEL = tf.keras.models.load_model("../saved_models/5", compile=False)

CLASS_NAMES = ["Early Blight","Late Blight","Healthy"]


@app.get("/ping")
async def ping():
    return {"message": "Hello, I am Chakri"}


def read_file_As_image(data : bytes):
    data = BytesIO(data)
    image = Image.open(data).convert("RGB")
    image = image.resize((254, 254))  # Resize to match model input size
    # image = np.array(image) / 255.0  # Normalize the image
    return np.array(image)

@app.post("/predict")
async def predict(file: UploadFile = File(...)):

    image = read_file_As_image(await file.read())
    image_batch = np.expand_dims(image, axis=0)

    json_data = {
        "instances": image_batch.tolist()
    }

    response = requests.post(endpoint, json=json_data)
    prediction = np.array(response.json()['predictions'][0])

    predicted_label = CLASS_NAMES[np.argmax(prediction)]
    confidence = round(100 * np.max(prediction), 2)

    all_percentages = {
        CLASS_NAMES[i]: round(100* prediction[i], 2) for i in range(len(CLASS_NAMES))
    }

    return {
        "predicted_label": predicted_label,
        "confidence": confidence,
        "all_percentages": all_percentages
    }


# if __name__ == "__main__":
#     uvicorn.run(app, host="localhost", port=8000)
