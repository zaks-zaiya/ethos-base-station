
import csv
import datetime

class Logger:

  @staticmethod
  def log_radio_data(radio_data, rssi):
    print("Radio data.. id: {0}, temp: {1}, RH: {2}, RSSI: {3}".format(radio_data["id"], radio_data["temperature"], radio_data["humidity"], rssi))
    with open('radio_data.csv', 'a', newline='') as datafile:
      data_writer = csv.writer(datafile)
      # Write header if the file is empty
      if datafile.tell() == 0:
        data_writer.writerow(['Time', 'ID', 'Temperature', 'Humidity', 'RSSI'])
      data_writer.writerow([datetime.datetime.now(), radio_data["id"], radio_data["temperature"], radio_data["humidity"], rssi])

  @staticmethod
  def error(msg):
    print(msg)
    with open('radio_errors.csv', 'a', newline='') as errorfile:
      error_writer = csv.writer(errorfile)
      # Write header if the file is empty
      if errorfile.tell() == 0:
        error_writer.writerow(['Time', 'Error'])
      error_writer.writerow([datetime.datetime.now(), msg])
