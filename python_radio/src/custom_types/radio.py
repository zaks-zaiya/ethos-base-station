from typing import Union, TypedDict

# Define RadioData type
class RadioData(TypedDict):
  id: int
  temperature: float
  humidity: float
  voltage: float
  rssi: Union[float, int]