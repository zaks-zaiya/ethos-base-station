import { defineStore } from 'pinia';
import { io, Socket } from 'socket.io-client';

import {
  SensorData,
  SocketSensorData,
  TrimmedSensorData,
} from 'src/typings/data-types';
import { useDataUserStore } from './dataUser';

interface SensorDataCallback {
  (data: SocketSensorData): void;
}

interface SocketEnvironmentalConditions {
  heightM: number;
  ageYears: number;
  weightKg: number;
  address: string;
  sex: 'male' | 'female';
  Ta: number;
  RH: number;
}

interface ServerToClientEvents {
  data: (data: SocketSensorData) => void;
}
interface ClientToServerEvents {
  calculateChangeCoreTemperature: (
    data: SocketEnvironmentalConditions,
    callback: (response: number) => void
  ) => void;
  sendBluetoothData: (
    sensorData: TrimmedSensorData,
    callback: (response: boolean) => void
  ) => void;
}

export const useSocketStore = defineStore('socket', {
  state: () => ({
    isConnected: false,
    socket: null as null | Socket<ServerToClientEvents, ClientToServerEvents>,
  }),

  actions: {
    /**
     * Initialize the socket connection
     */
    initialize() {
      console.log('Setting up socket...');
      this.socket = io('ws://localhost:5001');

      // Callbacks for socket
      this.socket.on('connect', () => {
        this.isConnected = true;
        console.log('Connected:', this.socket?.id ?? 'socket undefined');
      });

      this.socket.on('disconnect', () => {
        this.isConnected = false;
        console.log('Disconnected:', this.socket?.id ?? 'socket undefined');
      });
    },

    /**
     * Bind to the python server data emitter which will fire when sensor data arrives
     * @param callback Callback which will handle the sensor data when it arrives
     */
    onSensorData(callback: SensorDataCallback) {
      this.socket?.on('data', callback);
    },

    /**
     * Function to send socket communication to python process to emit BLE data
     * @param sensorData The current sensorData
     * @returns `true` if BLE emission succeeds, otherwise `false`
     */
    sendBluetoothData(sensorData: SensorData): Promise<boolean> {
      return new Promise((resolve) => {
        // Check socket exists & initialized
        if (!this.socket) {
          console.error('Socket not initialized');
          resolve(false);
          return;
        }

        // Check required variables exist
        if (
          !(
            sensorData.id &&
            sensorData.location &&
            sensorData.temperature &&
            sensorData.humidity &&
            sensorData.voltage &&
            sensorData.rssi &&
            sensorData.coreTemperatureDelta
          )
        ) {
          console.error('sendBluetoothData is missing data');
          resolve(false);
          return;
        }

        // Construct data to send
        const trimmedSensorData: TrimmedSensorData = {
          id: sensorData.id,
          location: sensorData.location,
          temperature: sensorData.temperature,
          humidity: sensorData.humidity,
          voltage: sensorData.voltage,
          rssi: sensorData.rssi,
          coreTemperatureDelta: sensorData.coreTemperatureDelta,
        };

        // Resolve the response from the server (which should be core temperature)
        this.socket.emit('sendBluetoothData', trimmedSensorData, (response) => {
          if (response) {
            resolve(true);
          } else {
            console.error('SocketError: sendBluetoothData');
            resolve(false);
          }
        });
      });
    },

    /**
     * Calculate predicted core temperature using the python socket server
     * @param sensorData The current sensorData
     * @returns The predicted core temperature for an individual after 3 hours
     */
    calculateChangeCoreTemperature(
      sensorData: SensorData
    ): Promise<number | undefined> {
      return new Promise((resolve) => {
        // Import user data
        const dataUserStore = useDataUserStore();
        // Check all required parameters are provided
        if (
          !(
            dataUserStore.heightCm &&
            dataUserStore.weightKg &&
            dataUserStore.address &&
            dataUserStore.ageYears &&
            dataUserStore.sex &&
            sensorData.temperature &&
            sensorData.humidity
          )
        ) {
          console.error(
            'Unable to calculate core temperature, missing some data'
          );
          resolve(undefined);
          return;
        }
        // Check socket exists & initialized
        if (!this.socket) {
          console.error('Socket not initialized');
          resolve(undefined);
          return;
        }
        // Build data to provide to python server
        const data: SocketEnvironmentalConditions = {
          heightM: dataUserStore.heightCm / 100,
          weightKg: dataUserStore.weightKg,
          ageYears: dataUserStore.ageYears,
          address: dataUserStore.address,
          sex: dataUserStore.sex == 'female' ? 'female' : 'male',
          Ta: sensorData.temperature,
          RH: sensorData.humidity,
        };
        // Resolve the response from the server (which should be core temperature)
        this.socket.emit('calculateChangeCoreTemperature', data, (response) => {
          resolve(response);
        });
      });
    },
  },
});
