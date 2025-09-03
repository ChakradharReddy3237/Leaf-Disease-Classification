import os
import numpy as np
import tensorflow as tf
import keras
from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from io import BytesIO
from PIL import Image
import uvicorn

# FastAPI app
app = FastAPI()

# Enable CORS (for frontend integration)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Update with frontend URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Class names
CLASS_NAMES = ["Early Blight", "Late Blight", "Healthy"]

# ✅ Load the SavedModel using TFSMLayer (Keras 3 style)
MODEL = keras.layers.TFSMLayer("../saved_models/5", call_endpoint="serving_default")


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


def prepare_batch(img_array: np.ndarray) -> tf.Tensor:
    """
    Prepare batch of images (expand dimensions + normalize if needed).
    """
    img_batch = np.expand_dims(img_array, 0)  # Add batch dimension
    return tf.convert_to_tensor(img_batch)


# -------------------------
# Routes
# -------------------------
@app.get("/")
async def root():
    return {"message": "Potato Leaf Disease Classification API is running 🚀"}


@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    """
    Endpoint for prediction from uploaded leaf image.
    """
    contents = await file.read()
    image_array = read_image(contents)
    image_batch = prepare_batch(image_array)

    # ✅ Run inference with TFSMLayer
    predictions = MODEL(image_batch)
    predictions = predictions.numpy()  # Convert tensor to numpy

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
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
