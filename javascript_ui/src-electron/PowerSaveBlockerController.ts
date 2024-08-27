import { powerSaveBlocker, ipcMain, powerMonitor } from 'electron';
import { exec } from 'child_process';
import util from 'util';

const execPromise = util.promisify(exec);

export default class PowerSaveBlockerController {
  private powerSaveBlockerId: number | null = null;
  private intervalId: NodeJS.Timeout | null = null;

  constructor() {
    this.setupIpcListeners();
    this.setupPowerMonitor();
  }

  private setupIpcListeners() {
    ipcMain.on('sleep-device', () => {
      this.sleepDevice();
    });
  }

  private setupPowerMonitor() {
    powerMonitor.on('resume', () => {
      this.onWakeUp();
    });
  }

  start() {
    this.updatePowerSaveBlocker();
    this.intervalId = setInterval(() => {
      this.updatePowerSaveBlocker();
    }, 60000);
  }

  private updatePowerSaveBlocker() {
    const now = new Date();
    const hours = now.getHours();

    if (hours >= 5 && hours < 21) {
      this.startPowerSaveBlocker();
    } else {
      this.stopPowerSaveBlocker();
    }
  }

  private startPowerSaveBlocker() {
    if (this.powerSaveBlockerId === null) {
      this.powerSaveBlockerId = powerSaveBlocker.start('prevent-display-sleep');
    }
  }

  private stopPowerSaveBlocker() {
    if (this.powerSaveBlockerId !== null) {
      powerSaveBlocker.stop(this.powerSaveBlockerId);
      this.powerSaveBlockerId = null;
    }
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
    this.stopPowerSaveBlocker();
  }

  async sleepDevice() {
    this.stopPowerSaveBlocker();
    console.log('Putting Raspberry Pi to sleep...');
    try {
      // Use 'sudo' to run the sleep command with elevated privileges
      await execPromise('sudo systemctl suspend');
      console.log('Sleep command executed successfully');
    } catch (error) {
      console.error('Failed to put device to sleep:', error);
    }
  }

  private onWakeUp() {
    console.log('Device woke up');
    this.updatePowerSaveBlocker();
  }
}
