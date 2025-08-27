# Potato Leaf Disease Classification

> A deep learning-powered web application to classify potato leaf diseases (Early Blight, Late Blight, & Healthy) from uploaded leaf images.

---

### Project Inspiration

This project is a hands-on implementation based on the excellent end-to-end machine learning project series by **[Codebasics](https://www.youtube.com/c/codebasics)**. The primary goal was to follow the tutorial to gain practical experience in building and deploying a full-stack deep learning application.

A huge thank you to Dhaval Patel for creating such a high-quality, in-depth tutorial.

*   **You can find the original tutorial playlist on YouTube:** [Deep Learning End To End Project | Potato Disease Classification](https://www.youtube.com/watch?v=dGtDTjYs3xc&list=PLeo1K3hjS3utJFNGyBpIvjWgSDY0eOE8S)

---

<!-- 
  IMPORTANT: A visual demo is the best way to showcase your project.
  Record a short GIF of you uploading an image and getting a prediction.
  Use a tool like ScreenToGif (Windows) or Kap (macOS).
-->
<p align="center">
  <img src="https://user-images.githubusercontent.com/8434624/156336029-45553655-11f3-4342-84f7-32b0059e35b7.gif" alt="Project Demo" width="800"/>
  <em><br> A live demo of the application in action. (Please replace this placeholder with your own GIF!)</em>
</p>

## Table of Contents

1.  [The Problem](#-the-problem)
2.  [Key Features](#-key-features)
3.  [Technology Stack](#-technology-stack)
4.  [System Architecture](#-system-architecture)
5.  [Getting Started](#-getting-started)
    *   [Prerequisites](#prerequisites)
    *   [Installation](#installation)
6.  [Usage](#-usage)
7.  [Model Training](#-model-training)
8.  [Contributing](#-contributing)
9.  [License](#-license)
10. [Acknowledgements](#-acknowledgements)

## The Problem

Plant diseases are a major threat to food security, and manual detection can be slow, inefficient, and requires expert knowledge. For potato farmers, diseases like Early Blight and Late Blight can devastate crops. This project aims to provide a fast, accessible, and automated solution for early disease detection using computer vision.

## Key Features

*   **AI-Powered Classification:** Utilizes a Convolutional Neural Network (CNN) to classify leaf images into three categories: `Early Blight`, `Late Blight`, or `Healthy`.
*   **Simple Web Interface:** An intuitive React frontend allows users to easily upload an image and receive an instant prediction.
*   **Fast API Backend:** Built with FastAPI, the Python backend serves the model efficiently and returns predictions in real-time.
*   **Decoupled Architecture:** The frontend, backend, and model training components are separated for better maintainability and scalability.

## 🛠️ Technology Stack

| Component         | Technology                                                                                                  |
| ----------------- | ----------------------------------------------------------------------------------------------------------- |
| **Frontend**      | [React.js](https://reactjs.org/), [JavaScript](https://www.javascript.com/)                                  |
| **Backend**       | [Python](https://www.python.org/), [FastAPI](https://fastapi.tiangolo.com/), [Uvicorn](https://www.uvicorn.org/) |
| **ML/Deep Learning**| [TensorFlow](https://www.tensorflow.org/) |
| **Dataset**       | [PlantVillage Dataset](https://www.kaggle.com/datasets/emmarex/plantdisease)                                |

##  System Architecture

The project follows a standard client-server architecture:

1.  **Client (React Frontend):** The user interacts with the web interface to upload an image.
2.  **API Server (FastAPI Backend):** The frontend sends the image to the API. The API preprocesses the image and feeds it to the loaded TensorFlow model.
3.  **ML Model (TensorFlow/Keras):** The model predicts the disease class.
4.  **Response:** The API returns the prediction as a JSON response to the frontend, which then displays the result to the user.

## 🚀 Getting Started

Follow these instructions to get the project up and running on your local machine.

### Prerequisites

Make sure you have the following installed:
*   [Python](https://www.python.org/downloads/) (3.8 or newer)
*   [Node.js](https://nodejs.org/) (v16 or newer) & npm
*   [Git](https://git-scm.com/)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/ChakradharReddy3237/Leaf-Disease-Classification.git
    cd Leaf-Disease-Classification
    ```

2.  **Setup the Backend (API):**
    ```bash
    # Navigate to the api directory
    cd api

    # Create a virtual environment (recommended)
    python -m venv venv
    source venv/bin/activate  # On Windows, use `venv\Scripts\activate`

    # Install Python dependencies
    pip install -r requirements.txt

    # Return to the root directory
    cd ..
    ```

3.  **Setup the Frontend:**
    ```bash
    # Navigate to the frontend directory from the root
    cd frontend

    # Install npm packages
    npm install
    ```

## Usage

You will need two separate terminal windows to run the backend and frontend servers.

1.  **Start the Backend API Server:**
    *   In your first terminal, navigate to the `api` directory.
    *   Make sure your virtual environment is activated.
    *   Run the Uvicorn server:
    ```bash
    # Make sure you are in the Leaf-Disease-Classification/api directory
    # Activate virtual env: source venv/bin/activate
    uvicorn main:app --reload
    ```
    The API will be running at `http://localhost:8000`.

2.  **Start the Frontend React App:**
    *   In your second terminal, navigate to the `frontend` directory.
    *   Run the React development server:
    ```bash
    # Make sure you are in the Leaf-Disease-Classification/frontend directory
    npm start
    ```
    The application will open automatically in your browser at `http://localhost:3000`.

Now you can upload an image of a potato leaf and get a prediction!

## Model Training

The model was trained using the `training/training.ipynb` Jupyter Notebook.

*   **Dataset:** The project uses a subset of the PlantVillage dataset containing healthy, early blight, and late blight potato leaves.
*   **Process:** The notebook covers data loading, preprocessing, model architecture (CNN), training, and evaluation.
*   **Saved Models:** The trained models are saved in the `saved_models` directory and the root as `.h5` files.

To explore or retrain the model, you can run the Jupyter Notebook using an environment with the required ML libraries (TensorFlow, Matplotlib, etc.).

## Contributing

Contributions are what make the open-source community such an amazing place. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request


## Acknowledgements

*   **Tutorial:** [Codebasics (Dhaval Patel)](https://www.youtube.com/watch?v=dGtDTjYs3xc&list=PLeo1K3hjS3utJFNGyBpIvjWgSDY0eOE8S) for the invaluable project tutorial.
*   **Dataset:** [PlantVillage](https://plantvillage.psu.edu/)
