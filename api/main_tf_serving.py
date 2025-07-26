from fastapi import FastAPI, UploadFile, File
from fastapi.responses import JSONResponse
import uvicorn
import numpy as np
from io import BytesIO
from PIL import Image
import tensorflow as tf


app = FastAPI()

import tensorflow as tf

# MODEL = tf.keras.models.load_model("../saved_models/1/potato_disease_classifier.h5", compile=False)
endpoint = "http://localhost:8501/v1/models/potato_model:predict"



CLASS_NAMES = ["Early Blight","Late Blight","Healthy"]


@app.get("/ping")
async def ping():
    return {"message": "Hello, I am Chakri"}


def read_file_As_image(data : bytes):
    data = BytesIO(data)
    image = Image.open(data).convert("RGB")
    image = image.resize((224, 224))  # Resize to match model input size
    image = np.array(image) / 255.0  # Normalize the image
    return np.array(image)

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    try:
        image = read_file_As_image(await file.read())
        image_batch = np.expand_dims(image, axis=0)

        predictions = MODEL.predict(image_batch)
        predicted_label = CLASS_NAMES[np.argmax(predictions[0])]
        confidence = round(100 * np.max(predictions[0]), 2)

        return {
            "predicted_label": predicted_label,
            "confidence": confidence
        }
    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={"error": f"Prediction failed: {str(e)}"}
        )


# if __name__ == "__main__":
#     uvicorn.run(app, host="localhost", port=8000)
