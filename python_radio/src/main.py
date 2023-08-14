from aiohttp import web
import socketio
import asyncio
import sys
import threading

from core_temperature import RiskLevelData, calculate_predicted_core_temperature

try:
  import board
  import busio
  from digitalio import DigitalInOut
  import adafruit_rfm9x
except:
  print("Unable to import radio modules, are you on RPi?")

def radio_init():
  # Configure LoRa Radio
  RADIO_FREQ_MHZ = 915.0  # Frequency of the radio in Mhz
  CS = DigitalInOut(board.CE1)
  RESET = DigitalInOut(board.D25)
  spi = busio.SPI(board.SCK, MOSI=board.MOSI, MISO=board.MISO)
  rfm9x = adafruit_rfm9x.RFM9x(spi, CS, RESET, RADIO_FREQ_MHZ)
  rfm9x.tx_power = 23
  return rfm9x

# Allow web (9000) or electron (9300) apps to connect
sio = socketio.AsyncServer(cors_allowed_origins='*')
app = web.Application()
sio.attach(app)

@sio.event
def connect(sid, environ):
  print('connect ', sid)

@sio.event
def disconnect(sid):
  print('disconnect ', sid)


# Take in RiskLevelData and return core temperature
@sio.event
async def calculatePredictedCoreTemperature(sid, data: RiskLevelData):
  print('Calculating core temp...')
  height = data.get('height')
  weight = data.get('weight')
  age = data.get('age')
  Ta = data.get('Ta')
  RH = data.get('RH')
  sex = data.get('sex')
  return calculate_predicted_core_temperature(height, weight, age, sex, Ta, RH)

if __name__ == '__main__':
  production_arg = sys.argv[1] if len(sys.argv) > 1 else False
  if production_arg == 'prod' or production_arg == 'production':
    from radio import radio_listen
    rfm9x = radio_init()
    # Start radio listen thread
    radio_thread = threading.Thread(target=asyncio.run, args=(radio_listen(sio, rfm9x),))
    radio_thread.start()
  web.run_app(app, port=5001)
