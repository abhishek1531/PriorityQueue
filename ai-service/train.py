import numpy as np
from sklearn.linear_model import LinearRegression
import joblib

print("Training model...")

# Example training data
X = np.array([
    [1, 100, 60],
    [2, 80, 60],
    [3, 50, 120],
    [4, 20, 180]
])

y = np.array([1, 2, 3, 4])

model = LinearRegression()
model.fit(X, y)

joblib.dump(model, "priority_model.pkl")

print("Model created successfully!")
