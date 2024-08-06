# main.py
from aiohttp import web
import socketio
import asyncio
import sys
import threading
import signal
from core_temperature import RiskLevelData, calculate_change_core_temperature

# Import the Bluetooth service
try:
  from bluetooth import BluetoothEmitter
except:
  print("Unable to import bluetooth modules, are you on Linux with Bluez installed?")

try:
  import board
  import busio
  from digitalio import DigitalInOut
  import adafruit_rfm9x
except:
  print("Unable to import radio modules, are you on RPi?")

# Function to configure LoRa Radio
def radio_init():
  RADIO_FREQ_MHZ = 915.1  # Frequency of the radio in Mhz
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
async def calculateChangeCoreTemperature(sid, data: RiskLevelData):
  return calculate_change_core_temperature(data)


# Function to shutdown the process when termination signal received
async def shutdown_server(loop):
  print("Shutting down Python server...")

  # Stop the radio thread
  stop_event.set()

  # Stop the site
  await site.stop()
  # Clean up the app runner
  await web_app_runner.cleanup()

  # Cancel remaining tasks
  tasks = [t for t in asyncio.all_tasks() if t is not asyncio.current_task()]
  for task in tasks:
    task.cancel()
    try:
      await task
    except asyncio.CancelledError:
      pass

  # Stop the event loop
  loop.stop()
  print("Shutdown function finished")


async def main(production_arg, stop_event):
  data_queue = None  # Initialize data_queue
  if production_arg == 'prod' or production_arg == 'production':
    # Setup bluetooth
    bluetooth_emitter = BluetoothEmitter()
    await bluetooth_emitter.initialize()

    # Setup radio
    from radio import radio_listen
    rfm9x = radio_init()

    # Create a queue
    data_queue = asyncio.Queue()

    # Start radio listener in a separate task
    loop.create_task(radio_listen(sio, rfm9x, stop_event, data_queue))

  # Register the shutdown signal handlers
  loop.add_signal_handler(signal.SIGTERM, lambda: loop.create_task(shutdown_server(loop)))
  loop.add_signal_handler(signal.SIGINT, lambda: loop.create_task(shutdown_server(loop)))

  # Continuously process data from the queue
  while True:
    try:
      if production_arg == 'prod' or production_arg == 'production':
        radio_data = await data_queue.get()
        print("RADIO DATA PULLED FROM QUEUE:", radio_data)
        # Emit data to server via socketio
        await sio.emit('data', radio_data)
        # Emit data via bluetooth
        await bluetooth_emitter.emit_data(radio_data)
      await asyncio.sleep(1)
    except asyncio.CancelledError:
      break


if __name__ == '__main__':
  production_arg = sys.argv[1] if len(sys.argv) > 1 else False

  # Setup and start the web server
  loop = asyncio.get_event_loop()
  web_app_runner = web.AppRunner(app)
  loop.run_until_complete(web_app_runner.setup())
  site = web.TCPSite(web_app_runner, port=5001)
  loop.run_until_complete(site.start())

  # Create a threading event to signal the radio thread to stop
  stop_event = threading.Event()
  try:
    loop.run_until_complete(main(production_arg, stop_event))
  finally:
    loop.close()
    print("Python server stopped.")