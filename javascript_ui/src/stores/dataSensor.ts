import { defineStore } from 'pinia';
import { io } from 'socket.io-client';
import { SensorData } from 'src/components/models';

const deserializeSensorData = (sensorDataString: string) => {
  // Parse the JSON string
  const state = JSON.parse(sensorDataString);
  state.allSensorData.forEach((dataSensor: SensorData) => {
    // Parse the date (previously lost with JSON.stringify())
    dataSensor.lastSeen = dataSensor.lastSeen
      ? new Date(dataSensor.lastSeen)
      : undefined;
  });
  // Return parsed state
  return state;
};

export const useDataSensorStore = defineStore('dataSensor', {
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
      const socket = io('ws://localhost:5001');

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
        console.log('Received:');
        console.log(data);

        // Check data
        if (!(data.id && data.temperature && data.humidity)) {
          // Some of the data is missing
          console.error('Invalid/missing socket data');
          console.log('ID:', data.id);
          console.log('Temperature:', data.temperature);
          console.log('Humidity:', data.humidity);
          return;
        }

        // Parse strings to numbers
        const id = parseInt(data.id);
        const temperature = parseFloat(data.temperature);
        const humidity = parseFloat(data.humidity);

        // Check
        if (isNaN(id) || isNaN(temperature) || isNaN(humidity)) {
          console.error('Error parsing strings to numbers');
          console.log('ID:', data.id);
          console.log('Temperature:', data.temperature);
          console.log('Humidity:', data.humidity);
          return;
        }

        // Check it exists in the array
        const i = this.allSensorData.findIndex(
          (dataSensor) => dataSensor.id == id
        );
        if (i < 0) {
          // Could not find index
          console.error('Wrong sensor id:', id);
          return;
        }

        // Update array values
        this.allSensorData[i].temperature = temperature;
        this.allSensorData[i].humidity = humidity;
        this.allSensorData[i].lastSeen = new Date(Date.now());
      });
    },
  },
});
