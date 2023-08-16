import { defineStore } from 'pinia';
import { io, Socket } from 'socket.io-client';

import { SocketSensorData } from 'src/typings/data-types';

interface SensorDataCallback {
  (data: SocketSensorData): void;
}

interface SocketEnvironmentalConditions {
  heightM: number;
  ageYears: number;
  weightKg: number;
  sex: 'male' | 'female';
  Ta: number;
  RH: number;
}

interface ServerToClientEvents {
  data: (data: SocketSensorData) => void;
}
interface ClientToServerEvents {
  calculatePredictedCoreTemperature: (
    data: SocketEnvironmentalConditions,
    callback: (response: number) => void
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
     * Calculate predicted core temperature using the python socket server
     * @param data All required information to calculate core temperature
     * @returns The predicted core temperature for an individual after 3 hours
     */
    calculatePredictedCoreTemperature(
      data: SocketEnvironmentalConditions
    ): Promise<number> {
      return new Promise((resolve, reject) => {
        if (!this.socket) {
          reject('Socket not initialized');
          return;
        }
        // If a callback is expected from the server after emitting the event
        this.socket.emit(
          'calculatePredictedCoreTemperature',
          data,
          (response) => {
            resolve(response);
          }
        );
      });
    },
  },
});
