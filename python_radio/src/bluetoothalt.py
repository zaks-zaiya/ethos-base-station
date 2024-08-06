import bluetooth
import threading

def start_ble_notification(stop_event):
  server_sock = bluetooth.BluetoothSocket('RFCOMM')
  server_sock.bind(("", 1809))
  server_sock.listen(1)

  port = server_sock.getsockname()[1]

  # UUID for the service
  uuid = "94f39d29-7d6d-437d-973b-fba39e49d4ee"

  bluetooth.advertise_service(server_sock, "SampleServer",
            service_id=uuid,
            service_classes=[uuid, SERIAL_PORT_CLASS],
            profiles=[SERIAL_PORT_PROFILE])

  print(f"Waiting for connection on RFCOMM channel {port}")

  while not stop_event.is_set():
    try:
      client_sock, client_info = server_sock.accept()
      print(f"Accepted connection from {client_info}")

      while True:
        data = client_sock.recv(1024)
        if not data:
          break
        print(f"Received [{data}]")

        # Simulate sending notification (You would replace this with actual sensor data)
        client_sock.send("Sensor data: 123.45")
    except IOError:
      pass

    print("Disconnected")

    client_sock.close()

  server_sock.close()

if __name__ == "__main__":
  stop_event = threading.Event()
  start_ble_notification(stop_event)
