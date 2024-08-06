from bluez_peripheral.gatt.service import Service
from bluez_peripheral.gatt.characteristic import characteristic, CharacteristicFlags as CharFlags
import struct

from bluez_peripheral.util import *
from bluez_peripheral.advert import Advertisement
from bluez_peripheral.agent import NoIoAgent
import asyncio

# https://www.bluetooth.com/wp-content/uploads/Files/Specification/HTML/Assigned_Numbers/out/en/Assigned_Numbers.pdf?v=1722318796410
service_uuid = "1809" # Health Thermometer Service
characteristic_uuid = "2A1C" # Temperature Measurement


class SensorService(Service):
  def __init__(self):
    # Base 16 service UUID, This should be a primary service.
    super().__init__(service_uuid, True)

  @characteristic(characteristic_uuid, CharFlags.NOTIFY)
  def sensor_measurement(self, options):
    # This function is called when the characteristic is read.
    # Since this characteristic is notify only this function is a placeholder.
    # You don't need this function Python 3.9+ (See PEP 614).
    # You can generally ignore the options argument
    # (see Advanced Characteristics and Descriptors Documentation).
    pass

  def update_sensor_measurement(self, new_rate):
    # Call this when you get a new sensor reading.
    # Note that notification is asynchronous (you must await something at some point after calling this).
    flags = 0

    # Bluetooth data is little endian.
    rate = struct.pack("<BB", flags, new_rate)
    self.sensor_measurement.changed(rate)

async def main():
  print('Getting message bus...')
  # Alternatively you can request this bus directly from dbus_next.
  bus = await get_message_bus()

  service = SensorService()
  await service.register(bus)

  # An agent is required to handle pairing
  agent = NoIoAgent()
  # This script needs superuser for this to work.
  await agent.register(bus)

  adapter = await Adapter.get_first(bus)

  # Start an advert that will last for 60 seconds.
  print('Advertising EthosRaspberryPi...')
  advert = Advertisement("EthosRaspberryPi", [service_uuid], 0x0340, 60)
  await advert.register(bus, adapter)

  while True:
    print('Sending test sensor measurement...')
    # Update the sensor
    service.update_sensor_measurement(120)
    # Handle dbus requests.
    await asyncio.sleep(5)

  await bus.wait_for_disconnect()

if __name__ == "__main__":
  print('Bluetooth main function called')
  asyncio.run(main())