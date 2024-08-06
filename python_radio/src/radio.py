# radio.py
from adafruit_rfm9x import RFM9x
from typing import Union
from logger import Logger
import threading
import asyncio
# For unpacking binary data
import struct

# For typing stop_event
from threading import Event

from encryption import Encryption  # Import the Encryption class

# Define class instance
aesEncryption = Encryption()

async def radio_listen(rfm9x: RFM9x, stop_event: Event, callback_function):
  while not stop_event.is_set():
    try:
      radio_packet = rfm9x.receive(timeout=5.0)

      sensorId = 1
      temperature = 25.5
      humidity = 60.0
      voltage = 3.7
      data = struct.pack("<ifff", sensorId, temperature, humidity, voltage)
      radio_packet = aesEncryption.encrypt(data)

      if radio_packet is not None:
        # Create and start a new thread to handle the processing
        thread = threading.Thread(target=process_and_callback, args=(radio_packet, rfm9x.last_rssi, callback_function))
        thread.start()

    except Exception as e:
      Logger.error(f"Error receiving packet: {e}")
      continue

async def process_and_callback(radio_packet, rssi, callback_function):
  # Decrypt received radio data
  try:
    decrypted_packet = aesEncryption.decrypt(radio_packet)
  except Exception as e:
    Logger.error(f"Error decrypting data: {e}")
    return

  # Process packet string to radio data
  try:
    radio_data = process_packet(decrypted_packet, rssi)
  except Exception as e:
    Logger.error(f"Error processing packet: {e}")
    return

  if radio_data is None:
    return

  # Log radio data
  Logger.log_radio_data(radio_data)

  # Call the callback function with the processed data
  try:
    asyncio.run(callback_function(radio_data))
  except Exception as e:
      Logger.error(f"Error in callback function: {e}")

def process_packet(packet: bytearray, rssi: Union[float, int]):
  try:
    # Unpack the packet into respective fields "IIIITTTTHHHHVVVV"
    # Where I is ID, T is temperature, H is humidity and V is voltage
    sensorId, temperatureC, humidityRH, batteryVoltage = struct.unpack('ifff', packet)

    # Sanity check values to assure that we are getting correct radio signal
    if not (0 < sensorId < 1000
            and -100 < temperatureC < 100
            and 0 <= humidityRH <= 100
            and 0 <= batteryVoltage <= 10):
      raise ValueError("Incorrect data... id: {0}, temp: {1}, RH: {2}, voltage: {3}".format(sensorId, temperatureC, humidityRH, batteryVoltage))

    return {
      "id": sensorId,
      "temperature": temperatureC,
      "humidity": humidityRH,
      "voltage": batteryVoltage,
      "rssi": rssi
    }
  except Exception as e:
    Logger.error(f"Error processing packet: {e}")
    return None