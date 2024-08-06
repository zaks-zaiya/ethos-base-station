# bluetooth.py
from bluez_peripheral.gatt.service import Service
from bluez_peripheral.gatt.characteristic import characteristic, CharacteristicFlags as CharFlags
import struct

from bluez_peripheral.util import *
from bluez_peripheral.advert import Advertisement
from bluez_peripheral.agent import NoIoAgent
import asyncio

from encryption import Encryption
aesEncryption = Encryption()

# Define a custom service UUID
service_uuid = "2013E5B6-3C56-4698-B665-7622FA5FBDD8"  # Custom UUID
characteristic_uuid = "20F05D06-FA4E-48B8-89CF-5BF075ECAFA6"  # Custom UUID

class SensorService(Service):
  def __init__(self):
    super().__init__(service_uuid, True)

  @characteristic(characteristic_uuid, CharFlags.NOTIFY)
  def sensor_data(self, options):
    pass

  def update_sensor_data(self, sensorId, temperatureC, humidityRH, batteryVoltage):
    # Pack the data into a 16-byte array
    data = struct.pack("<ifff", sensorId, temperatureC, humidityRH, batteryVoltage)
    encrypted_data = aesEncryption.encrypt(data)
    self.sensor_data.changed(encrypted_data)

async def main():
  print('Getting message bus...')
  bus = await get_message_bus()

  service = SensorService()
  await service.register(bus)

  agent = NoIoAgent()
  await agent.register(bus)

  adapter = await Adapter.get_first(bus)

  print('Advertising EthosRaspberryPi...')
  advert = Advertisement("EthosRaspberryPi", [service_uuid], 0x0340, 60)
  await advert.register(bus, adapter)

  while True:
    print('Sending test sensor data...')
    # Generate some sample data
    sensorId = 1
    temperatureC = 25.5
    humidityRH = 60.0
    batteryVoltage = 3.7

    service.update_sensor_data(sensorId, temperatureC, humidityRH, batteryVoltage)
    await asyncio.sleep(5)

  await bus.wait_for_disconnect()

if __name__ == "__main__":
  print('Bluetooth main function called')
  asyncio.run(main())