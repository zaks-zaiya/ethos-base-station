
from adafruit_rfm9x import RFM9x
import socketio
import re
from logger import Logger

# For typing stop_event
from threading import Event

# For radio encryption
from Crypto.Cipher import AES
import os
from dotenv import load_dotenv
from pathlib import Path

dotenv_path = Path('../javascript_ui/.env')
load_dotenv(dotenv_path=dotenv_path)

# Get the AES_KEY from environment variables
AES_KEY_STRING = os.getenv('AES_KEY')
AES_KEY = AES_KEY_STRING.encode("utf-8")

def decrypt_data(data: bytes) -> bytes:
    """Decrypt data using AES in ECB mode."""
    cipher = AES.new(AES_KEY, AES.MODE_ECB)
    decrypted_data = cipher.decrypt(data)
    return decrypted_data

async def radio_listen(sio: socketio.AsyncServer, rfm9x: RFM9x, stop_event: Event):
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

    if len(radio_packet) != 16:
      # The radio packet must not be the right type
      continue

    # Decrypt recieved radio data
    try:
      decrypted_packet = decrypt_data(radio_packet)
    except:
      Logger.error(f"Error decrypting data")
      continue

    # Process packet string to radio data
    try:
      radio_data = process_packet(decrypted_packet)
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
    rssi = rfm9x.last_rssi
    Logger.log_radio_data(radio_data, rssi)
    try:
      await sio.emit('data', radio_data)
    except Exception as e:
      Logger.error(f"Error emitting data: {e}")


def process_packet(packet: bytearray):
  try:
    # Slice packet to the first 14 bytes
    # The radio actually sends 15 bytes, however the last byte is \x00 and can be ignored
    packet = packet[:14]
    packet_text = str(packet, "ascii")

    match = re.match("^I(\d+)T([\d\.]+)H([\d\.]+)", packet_text)
    if match is None:
      # Regex failed to match
      # Radio data must be from another device or is corrupted
      return None

    return {
      "id": match[1],
      "temperature": match[2],
      "humidity": match[3]
    }
  except Exception as e:
    Logger.error(f"Error processing packet: {e}")
