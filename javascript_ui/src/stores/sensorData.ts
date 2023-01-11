import { defineStore } from 'pinia';
import net from 'net';
import { SensorData } from 'src/components/models';

export const useSensorDataStore = defineStore('sensorData', {
  state: () => ({
    socket: null as net.Socket | null, // socket to connect to python
    isConnected: false, // whether we are connected to the socket
    allSensorData: [] as Array<SensorData> // sensor data
  }),

  getters: {
  },

  actions: {
    setup () {
      console.log('Setting up socket...')
      this.socket = new net.Socket();

      // Connect to python radio socket
      this.socket.connect(65432, '127.0.0.1', () => {
        console.log('Client connected');
        this.isConnected = true;
      });

      // Set keep alive to ensure the socket connection remains open (checking every 10s)
      this.socket.setKeepAlive(true, 10000);

      // Callback to update sensor data when applicable
      this.socket.on('data', data => {
        console.log('Received: ' + data);
        const data_obj = JSON.parse(data.toString());

        // Check data
        if (!(data_obj.id && data_obj.temperature && data_obj.humidity)) {
          // Some of the data is missing
          console.error('Invalid socket data');
          return;
        }

        // Check it exists in the array
        const i = this.allSensorData.findIndex(sensorData => sensorData.id == data_obj.id)
        if (i < 0) {
          // Could not find index
          console.error('Wrong sensor id')
          return;
        }

        // Update array values
        this.allSensorData[i].temperature = data_obj.temperature;
        this.allSensorData[i].humidity = data_obj.humidity;
      });
    }
  }
});
