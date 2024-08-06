# radio.py
from adafruit_rfm9x import RFM9x
import socketio
from typing import Union, TypedDict
from logger import Logger
# For unpacking binary data
import struct

# For typing stop_event
from threading import Event

from bluetooth import BluetoothEmitter

from encryption import Encryption  # Import the Encryption class

# Define class instance
aesEncryption = Encryption()

# Define RadioData type
class RadioData(TypedDict):
  id: int
  temperature: float
  humidity: float
  voltage: float
  rssi: Union[float, int]


async def radio_listen(sio: socketio.AsyncServer, rfm9x: RFM9x, stop_event: Event):
  bluetoothEmitter = BluetoothEmitter()
  # Radio listen loop
  while not stop_event.is_set():
    try:
      radio_packet = rfm9x.receive(timeout=5.0)
    except Exception as e:
      Logger.error(f"Error receiving packet: {e}")
      continue

    if radio_packet is None:
      # No data received, listen again
      continue

    if len(radio_packet) < 16:
      # The radio packet must not be the right type
      continue

    if len(radio_packet) > 16:
      # We may have received some extra bytes in transit, try trimming them off the end
      radio_packet = radio_packet[:16]

    # Decrypt received radio data
    try:
      decrypted_packet = aesEncryption.decrypt(radio_packet)
    except:
      Logger.error(f"Error decrypting data")
      continue

    # Process packet string to radio data
    rssi = rfm9x.last_rssi
    try:
      radio_data = process_packet(decrypted_packet, rssi)
    except Exception as e:
      Logger.error(f"Error processing packet: {e}")
      continue

    if radio_data is None:
      # Radio data was of wrong type
      continue

    # Send acknowledgment
    # This is not performed for now
    # try:
    #   acknowledgement_data = bytes("R" + radio_data["id"] + "\r\n","utf-8")
    #   rfm9x.send(acknowledgement_data)
    # except Exception as e:
    #   Logger.error(f"Error sending acknowledgement: {e}")

    # Log radio data
    Logger.log_radio_data(radio_data)
    try:
      # Emit data to server via socketio
      await sio.emit('data', radio_data)
      # Emit data via bluetooth
      bluetoothEmitter.emit_data(radio_data)
    except Exception as e:
      Logger.error(f"Error emitting data: {e}")


def process_packet(packet: bytearray, rssi: Union[float, int]) -> Union[RadioData, None]:
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
