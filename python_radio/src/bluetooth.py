# bluetooth.py
from bluez_peripheral.gatt.service import Service
from bluez_peripheral.gatt.characteristic import characteristic, CharacteristicFlags as CharFlags
import struct

from bluez_peripheral.util import *
from bluez_peripheral.advert import Advertisement
from bluez_peripheral.agent import NoIoAgent
import asyncio

from typing import TypedDict

from encryption import Encryption
aesEncryption = Encryption()

# Define a custom service UUID
service_uuid = "2013E5B6-3C56-4698-B665-7622FA5FBDD8"  # Custom UUID
characteristic_uuid = "20F05D06-FA4E-48B8-89CF-5BF075ECAFA6"  # Custom UUID

class TrimmedSensorData(TypedDict):
  id: int
  temperature: float
  humidity: float
  voltage: float
  rssi: float
  coreTemperatureDelta: float
  location: str

class SensorService(Service):
  def __init__(self):
    super().__init__(service_uuid, True)

  @characteristic(characteristic_uuid, CharFlags.NOTIFY)
  def sensor_data(self, options):
    pass

  def update_sensor_data(self, sensorData: TrimmedSensorData):
    # Pack the numeric data into a byte array
    numeric_data = struct.pack("<ifffff", sensorData["id"], sensorData["temperature"],
                                sensorData["humidity"], sensorData["voltage"], float(sensorData["rssi"]),
                                sensorData["coreTemperatureDelta"])

    # Convert location string to bytes and get its length
    location_bytes = sensorData["location"].encode('utf-8')
    location_length = len(location_bytes)

    # Pack the location length (as a 2-byte unsigned short) and the location string
    location_data = struct.pack(f"<H{location_length}s", location_length, location_bytes)

    # Combine all data
    combined_data = numeric_data + location_data

    # Pad the data to meet the block size requirement (assuming AES with 16-byte block size)
    block_size = 16
    padding_length = block_size - (len(combined_data) % block_size)
    padded_data = combined_data + bytes([padding_length] * padding_length)

    encrypted_data = aesEncryption.encrypt(padded_data)
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

  async def emit_data(self, sensorData: TrimmedSensorData):
    print('Emitting data...')
    if self.service is None:
      await self.initialize()

    print(f'Sending sensor data: {sensorData}')
    # Use asyncio.to_thread to run the update in a separate thread
    await asyncio.to_thread(self.service.update_sensor_data, sensorData)
    # Yield to the event loop to avoid blocking
    await asyncio.sleep(0)