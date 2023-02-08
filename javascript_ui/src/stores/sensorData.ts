import { defineStore } from 'pinia';
import { io } from 'socket.io-client';
import { SensorData } from 'src/components/models';

export const useSensorDataStore = defineStore('sensorData', {
  state: () => ({
    isConnected: false,
    socket: io('ws://localhost:5000'),
    allSensorData: [
      {
        id: '001',
        name: 'Bedroom',
        temperature: 31,
        humidity: 24,
        lastSeen: new Date(Date.now()),
      },
      {
        id: '002',
        name: 'Outside',
        temperature: 39,
        humidity: 52,
        lastSeen: new Date(Date.now()),
      },
      {
        id: '003',
        name: 'Kitchen',
        temperature: 31,
        humidity: 24,
        lastSeen: new Date(Date.now() - 5000000),
      },
      {
        id: '004',
        name: 'Living',
        temperature: 35,
        humidity: 48,
        lastSeen: new Date(Date.now()),
      },
    ] as Array<SensorData>, // sensor data
  }),

  getters: {
    getSortedSensorData: (state) => {
      // Take a shallow copy of the array to prevent data mutation
      const copyOfSensorData = [...state.allSensorData];
      // Find index of the sensor that has 'out' in its name
      const outsideIndex = copyOfSensorData.findIndex((el) => {
        if (el.name.toLowerCase().includes('out')) {
          return true;
        }
        return false;
      });
      // If a sensor matches outside, push it to the end of the array
      if (outsideIndex >= 0) {
        copyOfSensorData.push(copyOfSensorData.splice(outsideIndex, 1)[0]);
      }
      return copyOfSensorData;
    },
  },

  actions: {
    setup() {
      console.log('Setting up socket...');

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
        this.allSensorData[i].lastSeen = new Date(Date.now());
      });
    },
  },
});
