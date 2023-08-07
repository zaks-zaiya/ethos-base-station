import logging


class Logger:

  @staticmethod
  def shutdown():
    logging.shutdown()

  @staticmethod
  def setup():
    # Configure logging
    logging.basicConfig(
      level=logging.DEBUG,
      format='%(asctime)s %(levelname)-8s %(message)s',
      datefmt='%Y-%m-%d %H:%M:%S',
      handlers=[
          logging.FileHandler("logs/radio_data.log", mode='a'),
          logging.StreamHandler()
      ]
    )

  @staticmethod
  def log_radio_data(radio_data, rssi):
    id = radio_data.get("id", "Missing ID")
    temp = radio_data.get("temperature", "Missing Temperature")
    humidity = radio_data.get("humidity", "Missing Humidity")
    log_message = "Radio received... id: {0}, temp: {1}, RH: {2}, RSSI: {3}".format(id, temp, humidity, rssi)
    logging.info(log_message)

  @staticmethod
  def error(msg):
    logging.error(msg)

# Setup logger
Logger.setup()

# Sample usage
# Logger.log_radio_data({"id": "123", "temperature": "22.5", "humidity": "50.2"}, "-70dBm")
# Logger.error("Sample Error Message")
