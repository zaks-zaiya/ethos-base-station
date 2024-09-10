from typing import TypedDict, Literal, Union
from logger import Logger

from helpers.machine_learning import load_model, load_scalers, simulate_initial, simulate_heat_exposure

# Load scalers and model
features_scaler, output_scaler = load_scalers()
model = load_model()

# Define data which is provided to core temp algorithm
class RiskLevelData(TypedDict):
  heightM: float
  weightKg: float
  ageYears: float
  sex: Literal['male', 'female', 'other']
  Ta: float
  RH: float

def calculate_change_core_temperature(data: RiskLevelData) -> Union[None, float]:
  print('Calculating core temp...')
  # Extract types
  heightM = data.get('heightM')
  weightKg = data.get('weightKg')
  ageYears = data.get('ageYears')
  sex = data.get('sex')
  Ta = data.get('Ta')
  RH = data.get('RH')

  # Check everything exists
  if not(heightM and weightKg and ageYears and sex and Ta and RH):
    Logger.error('Error calculating core temp: missing parameters')
    return None

  # Calculate core temperature using ridge regression model

  # Prepare input data
  female = 1 if sex == 'female' else 0
  body_parameters = [female, ageYears, heightM * 100, weightKg]
  ambient_conditions = [Ta, RH]

  # Get starting core and skin temp
  initial_body_conditions = simulate_initial(body_parameters, features_scaler, output_scaler, model)

  # Simulate for the required time steps
  custom_input = body_parameters + ambient_conditions + initial_body_conditions
  time_steps = 540
  final_core_temp, final_mtsk = simulate_heat_exposure(custom_input, features_scaler, output_scaler, model, time_steps)
  start_core_temp, initial_mtsk = initial_body_conditions

  return final_core_temp - start_core_temp