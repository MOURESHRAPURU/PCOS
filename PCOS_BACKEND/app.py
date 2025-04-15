from fastapi import FastAPI
import joblib
import numpy as np
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
# Load the trained model
model = joblib.load("pcos_rf_model-2.pkl")

# Initialize FastAPI
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow requests from any frontend
    allow_credentials=True,
    allow_methods=["*"],   # Allow all HTTP methods (POST, OPTIONS, etc.)
    allow_headers=["*"],   # Allow all headers
)


# Define input data format
class PCOSInput(BaseModel):
    features: list  # List of input features

# API endpoint for prediction
@app.post("/predict")
def predict_pcos(data: PCOSInput):
    try:
        # Convert input to NumPy array and reshape for prediction
        input_features = np.array(data.features).reshape(1, -1)

        # Make prediction
        prediction = model.predict(input_features)[0]

        # Return result
        return {"prediction": int(prediction)}
    
    except Exception as e:
        return {"error": str(e)}

# Run server (if running manually)
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
