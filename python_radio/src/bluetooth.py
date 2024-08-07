# bluetooth.py
from bluez_peripheral.gatt.service import Service
from bluez_peripheral.gatt.characteristic import characteristic, CharacteristicFlags as CharFlags
import struct

from bluez_peripheral.util import *
from bluez_peripheral.advert import Advertisement
from bluez_peripheral.agent import NoIoAgent
import asyncio

from custom_types.radio import RadioData

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

  def update_sensor_data(self, radio_data: RadioData):
    # Pack the data into a 20-byte array (4 bytes for RSSI as float)
    data = struct.pack("<iffff", radio_data["id"], radio_data["temperature"],
               radio_data["humidity"], radio_data["voltage"], float(radio_data["rssi"]))
    encrypted_data = aesEncryption.encrypt(data)
    self.sensor_data.changed(encrypted_data)

class BluetoothEmitter:
  def __init__(self):
    self.bus = None
    self.service = None
    self.adapter = None

  async def initialize(self):
    print('Getting message bus...')
    self.bus = await get_message_bus()

    self.service = SensorService()
    await self.service.register(self.bus)

    agent = NoIoAgent()
    await agent.register(self.bus)

    self.adapter = await Adapter.get_first(self.bus)

    print('Advertising EthosRaspberryPi...')
    # Always advertise
    advert = Advertisement("EthosRaspberryPi", [service_uuid], 0x0340, 0)
    await advert.register(self.bus, self.adapter)

  async def emit_data(self, radio_data: RadioData):
    print('Emitting data...')
    if self.service is None:
      await self.initialize()

    print(f'Sending sensor data: {radio_data}')
    # Use asyncio.to_thread to run the update in a separate thread
    await asyncio.to_thread(self.service.update_sensor_data, radio_data)
    # Yield to the event loop to avoid blocking
    await asyncio.sleep(0)