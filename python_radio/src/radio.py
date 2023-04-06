import board
import busio
from digitalio import DigitalInOut
import adafruit_rfm9x

import re

def radio_listen(sio):
  # Configure LoRa Radio
  RADIO_FREQ_MHZ = 915.0  # Frequency of the radio in Mhz
  CS = DigitalInOut(board.CE1)
  RESET = DigitalInOut(board.D25)
  spi = busio.SPI(board.SCK, MOSI=board.MOSI, MISO=board.MISO)
  rfm9x = adafruit_rfm9x.RFM9x(spi, CS, RESET, RADIO_FREQ_MHZ)
  rfm9x.tx_power = 23

  # Radio listen loop
  while True:
    packet = rfm9x.receive(timeout=5.0)

    # If no packet was received during the timeout then None is returned.
    if packet is None:
      print("Nothing received, trying again...")
      continue

    # Received a packet!
    packet_text = str(packet, "ascii")
    print("Received (ASCII): {0}".format(packet_text))
    # Also read the RSSI (signal strength) of the last received message and print it.
    rssi = rfm9x.last_rssi
    print("Received signal strength: {0} dB".format(rssi))

    # Decode radio packet with temp sensor information
    match = re.match("^I(\d+)T([\d\.]+)H([\d\.]+)", packet_text)

    # If no regex match, radio must be coming from a different source
    if match is None:
      print("Incorrect radio message, trying again...")
      continue

    # Decode message
    id = match[1]
    temperature = match[2]
    humidity = match[3]

    # TODO: Check if sensor id is one of the ones tied to the house

    # Send acknowledgement to let sensor know
    # we received the message
    acknowledgement_data = bytes("R" + id + "\r\n","utf-8")
    rfm9x.send(acknowledgement_data)

    # Send socket event to main program with the data
    sio.emit('data', {'id': id, 'temperature': temperature, 'humidity': humidity})