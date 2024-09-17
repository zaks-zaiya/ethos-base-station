import os
import joblib
import numpy as np

# Suppress feature names warning
import warnings
warnings.filterwarnings("ignore", category=UserWarning, message="X does not have valid feature names, but MinMaxScaler was fitted with feature names")

# Load scalers
def load_scalers(directory='model_weights/scalars'):
  features_scaler = joblib.load(os.path.join(directory, 'features_scaler.pkl'))
  output_scaler = joblib.load(os.path.join(directory, 'output_scaler.pkl'))

  return features_scaler, output_scaler

# Load model
def load_model(model_name='ml_ridge_regression', directory='model_weights'):
  return joblib.load(os.path.join(directory, f'{model_name}.pkl'))

# Simulate initial 60 minutes
def simulate_initial(body_parameters, features_scaler, output_scaler, model):
    # Initial ambient conditions for cooling environment (23°C 50% RH)
    cool_Ta = 23
    cool_RH = 50
    initial_ambient = [cool_Ta, cool_RH]
    # Initial core and skin temp
    body_conditions = [37, 32]
    # Simulate for 60 mins
    for i in range(60):
        X = np.array(body_parameters + initial_ambient + body_conditions).reshape(1, -1)
        X = features_scaler.transform(X)
        y = model.predict(X)
        y = output_scaler.inverse_transform(y)
        body_conditions = y[0].tolist()
    # Return core and skin temp at end of 60 mins (e.g. [37, 32])
    return body_conditions

# Simulate the heat exposure
def simulate_heat_exposure(custom_input, features_scaler, output_scaler, model, time_steps):
  predicted_values = []
  for _ in range(time_steps):
    X = np.array(custom_input).reshape(1, -1)
    X = features_scaler.transform(X)
    y = model.predict(X)
    y = output_scaler.inverse_transform(y)
    predicted_values.append(y[0].tolist())
    custom_input[-2:] = y[0].tolist()

  # Get the final predicted tre and mtsk values
  final_core_temp, final_mtsk = predicted_values[-1]
  return final_core_temp, final_mtsk