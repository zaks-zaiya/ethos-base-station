import jos3
from typing import TypedDict, Literal

# Define data which is provided to core temp algorithm
class RiskLevelData(TypedDict):
  height: float
  weight: float
  age: float
  Ta: float
  RH: float
  sex: Literal['male', 'female', 'other']

def calculate_predicted_core_temperature(height, weight, age, sex, Ta, RH):
  model = jos3.JOS3(height=height, weight=weight, age=age, sex=sex)
  model.Ta = Ta
  model.RH = RH
  model.Va = 0.1
  model.PAR = 1.5
  model.simulate(180)

  final_core_temp = model.dict_results()['TcrPelvis'][-1]
  return final_core_temp