import { defineStore } from 'pinia';
import { io } from 'socket.io-client';

import { SocketSensorData } from 'src/components/models';

interface SensorDataCallback {
  (data: SocketSensorData): void;
}

export const useSocketStore = defineStore('socket', {
  state: () => ({
    isConnected: false,
    socket: null as null | ReturnType<typeof io>,
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
        console.log('Connected:', this.socket?.id);
      });

      this.socket.on('disconnect', () => {
        this.isConnected = false;
        console.log('Disconnected:', this.socket?.id);
      });
    },

    /**
     * Bind to the python server data emitter which will fire when sensor data arrives
     * @param callback Callback which will handle the sensor data when it arrives
     */
    onSensorData(callback: SensorDataCallback) {
      this.socket?.on('data', callback);
    },
  },
});
