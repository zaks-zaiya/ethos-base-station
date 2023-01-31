import board
import busio
from digitalio import DigitalInOut

import adafruit_rfm9x

def radio_listen(sio):
  # Define radio parameters.
  RADIO_FREQ_MHZ = 915.0  # Frequency of the radio in Mhz. Must match your
  # module! Can be a value like 915.0, 433.0, etc.

  # Configure LoRa Radio
  CS = DigitalInOut(board.CE1)
  RESET = DigitalInOut(board.D25)
  spi = busio.SPI(board.SCK, MOSI=board.MOSI, MISO=board.MISO)
  rfm9x = adafruit_rfm9x.RFM9x(spi, CS, RESET, RADIO_FREQ_MHZ)
  rfm9x.tx_power = 23

  # Radio listen loop
  while True:
    packet = rfm9x.receive()
    # Optionally change the receive timeout from its default of 0.5 seconds:
    # packet = rfm9x.receive(timeout=5.0)
    # If no packet was received during the timeout then None is returned.
    if packet is not None:
      # Received a packet!
      # Print out the raw bytes of the packet:
      print("Received (raw bytes): {0}".format(packet))
      # And decode to ASCII text and print it too.  Note that you always
      # receive raw bytes and need to convert to a text format like ASCII
      # if you intend to do string processing on your data.  Make sure the
      # sending side is sending ASCII data before you try to decode!
      packet_text = str(packet, "ascii")
      print("Received (ASCII): {0}".format(packet_text))
      # Also read the RSSI (signal strength) of the last received message and
      # print it.
      rssi = rfm9x.last_rssi
      print("Received signal strength: {0} dB".format(rssi))
      # TODO: Decode radio packet with temp sensor information
      # TODO: Emit event with temperature information
      sio.emit('data', {'id': 1, 'temperature': 99, 'humidity': 99})
    else:
      print("Nothing received, trying again...")