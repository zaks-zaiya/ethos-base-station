from aiohttp import web
import socketio
import asyncio
import sys
import threading
# For stopping execution when shutting down
import signal

from core_temperature import RiskLevelData, calculate_predicted_core_temperature

try:
  import board
  import busio
  from digitalio import DigitalInOut
  import adafruit_rfm9x
except:
  print("Unable to import radio modules, are you on RPi?")

# Function to configure LoRa Radio
def radio_init():
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
  return calculate_predicted_core_temperature(data)

# Function to shutdown the process when termination signal received
def shutdown():
  print("Shutting down Python server...")
  # Stop the radio thread
  stop_event.set()
  try:
    radio_thread.join()
  except:
    pass
  # Stop main event loop
  loop.stop()
  print("Shutdown function finished")

if __name__ == '__main__':
  production_arg = sys.argv[1] if len(sys.argv) > 1 else False
  # Create a threading event to signal the radio thread to stop
  stop_event = threading.Event()

  if production_arg == 'prod' or production_arg == 'production':
    from radio import radio_listen
    rfm9x = radio_init()
    # Start radio listen thread
    radio_thread = threading.Thread(target=asyncio.run, args=(radio_listen(sio, rfm9x, stop_event),))
    radio_thread.start()

  # Setup and start the web server
  loop = asyncio.get_event_loop()
  web_app_runner = web.AppRunner(app)
  loop.run_until_complete(web_app_runner.setup())
  site = web.TCPSite(web_app_runner, port=5001)
  loop.run_until_complete(site.start())

  # Register the shutdown signal handler
  loop.add_signal_handler(signal.SIGINT, shutdown)
  loop.add_signal_handler(signal.SIGTERM, shutdown)

  try:
    loop.run_forever()
  except KeyboardInterrupt:
    pass
  finally:
    # Cleanup after app has shutdown
    loop.run_until_complete(app.shutdown())
    loop.run_until_complete(web_app_runner.cleanup())
    loop.close()
    print("Server stopped")
