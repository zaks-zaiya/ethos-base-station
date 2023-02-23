import { defineStore } from 'pinia';
import { io } from 'socket.io-client';
import { SensorData } from 'src/components/models';

const deserializeSensorData = (sensorDataString: string) => {
  // Parse the JSON string
  const state = JSON.parse(sensorDataString);
  state.allSensorData.forEach((sensorData: SensorData) => {
    // Parse the date (previously lost with JSON.stringify())
    sensorData.lastSeen = sensorData.lastSeen
      ? new Date(sensorData.lastSeen)
      : undefined;
  });
  // Return parsed state
  return state;
};

export const useSensorDataStore = defineStore('sensorData', {
  persist: {
    serializer: {
      deserialize: deserializeSensorData,
      serialize: JSON.stringify,
    },
  },

  state: () => ({
    isConnected: false,
    allSensorData: [
      {
        id: undefined,
        name: undefined,
        temperature: undefined,
        humidity: undefined,
        lastSeen: undefined,
      },
      {
        id: undefined,
        name: undefined,
        temperature: undefined,
        humidity: undefined,
        lastSeen: undefined,
      },
      {
        id: 3,
        name: 'Kitchen',
        temperature: 31,
        humidity: 24,
        lastSeen: new Date(Date.now() - 5000000),
      },
      {
        id: 4,
        name: 'Living',
        temperature: 35,
        humidity: 48,
        lastSeen: new Date(Date.now()),
      },
    ] as Array<SensorData>, // sensor data
  }),

  getters: {
    // Check whether either the name or id of ANY of the sensors are undefined
    containsUndefined: (state) => {
      for (const sensor of state.allSensorData) {
        // If no sensor ID or sensor name
        if (!sensor.id || !sensor.name) {
          return true;
        }
      }
      return false;
    },
    // Get deep copy of sensor data
    getDeepCopySensorData: (state) => {
      return deserializeSensorData(JSON.stringify(state)).allSensorData;
    },
    // Get sorted sensor data, where the outside sensor comes last in the list
    getSortedSensorData: (state) => {
      // Take a shallow copy of the array to prevent data mutation
      const copyOfSensorData = [...state.allSensorData];
      // Find index of the sensor that has 'out' in its name
      const outsideIndex = copyOfSensorData.findIndex((el) => {
        if (el.name?.toLowerCase().includes('out')) {
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
      const socket = io('ws://localhost:5000');

      // Callbacks for socket
      socket.on('connect', () => {
        this.isConnected = true;
        console.log('Connected:', socket.id);
      });

      socket.on('disconnect', () => {
        this.isConnected = false;
        console.log('Disconnected:', socket.id);
      });

      // Callback to update sensor data when applicable
      socket.on('data', (data) => {
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
