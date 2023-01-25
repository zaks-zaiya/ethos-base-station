import { defineStore } from 'pinia';
import { io } from 'socket.io-client';
import { SensorData } from 'src/components/models';

export const useSensorDataStore = defineStore('sensorData', {
  state: () => ({
    isConnected: false,
    socket: io(),
    allSensorData: [] as Array<SensorData>, // sensor data
  }),

  getters: {
    // isConnected: (state) => {
    //   return state.socket.connected;
    // }
  },

  actions: {
    setup() {
      console.log('Setting up socket...');
      this.socket = io('localhost:5000', { transports: ['websocket'] });

      // Callbacks for socket
      this.socket.on('connect', () => {
        this.isConnected = true;
        console.log('Connected:', this.socket.id);
      });

      this.socket.on('disconnect', () => {
        this.isConnected = false;
        console.log('Disconnected:', this.socket.id);
      });

      // Callback to update sensor data when applicable
      this.socket.on('data', (data) => {
        console.log('Received: ' + data);
        const data_obj = JSON.parse(data.toString());

        // Check data
        if (!(data_obj.id && data_obj.temperature && data_obj.humidity)) {
          // Some of the data is missing
          console.error('Invalid socket data');
          return;
        }

        // Check it exists in the array
        const i = this.allSensorData.findIndex(
          (sensorData) => sensorData.id == data_obj.id
        );
        if (i < 0) {
          // Could not find index
          console.error('Wrong sensor id');
          return;
        }

        // Update array values
        this.allSensorData[i].temperature = data_obj.temperature;
        this.allSensorData[i].humidity = data_obj.humidity;
      });
    },
  },
});
