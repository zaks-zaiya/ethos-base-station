import board
import busio
from digitalio import DigitalInOut
import adafruit_rfm9x

import socketio
import re

async def radio_listen(sio: socketio.AsyncServer):
  # Configure LoRa Radio
  RADIO_FREQ_MHZ = 915.0  # Frequency of the radio in Mhz
  CS = DigitalInOut(board.CE1)
  RESET = DigitalInOut(board.D25)
  spi = busio.SPI(board.SCK, MOSI=board.MOSI, MISO=board.MISO)
  rfm9x = adafruit_rfm9x.RFM9x(spi, CS, RESET, RADIO_FREQ_MHZ)
  rfm9x.tx_power = 23

  # Radio listen loop
  while True:
    try:
      radio_packet = rfm9x.receive(timeout=5.0)
    except Exception as e:
      print(f"Error receiving packet: {e}")
      continue

    if radio_packet is None:
      print("Nothing received, trying again...")
      continue

    rssi = rfm9x.last_rssi
    print("Received signal strength: {0} dB".format(rssi))

    try:
      radio_data = process_packet(radio_packet)
    except Exception as e:
      print(f"Error processing packet: {e}")
      continue

    if radio_data is None:
      continue

    try:
      acknowledgement_data = bytes("R" + radio_data["id"] + "\r\n","utf-8")
      rfm9x.send(acknowledgement_data)
    except Exception as e:
      print(f"Error sending acknowledgement: {e}")

    print("Emitting data... id: {0}, temp: {1}, RH: {2}".format(radio_data["id"], radio_data["temperature"], radio_data["humidity"]))
    try:
      await sio.emit('data', radio_data)
    except Exception as e:
      print(f"Error emitting data: {e}")


def process_packet(packet: bytearray):
  try:
    packet_text = str(packet, "ascii")
    print("Received (ASCII): {0}".format(packet_text))

    match = re.match("^I(\d+)T([\d\.]+)H([\d\.]+)", packet_text)
    if match is None:
      print("Incorrect radio message!")
      return None

    return {
      "id": match[1],
      "temperature": match[2],
      "humidity": match[3]
    }
  except Exception as e:
    print(f"Error processing packet: {e}")
