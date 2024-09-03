import { powerSaveBlocker, powerMonitor } from 'electron';
import { exec } from 'child_process';
import util from 'util';

const execPromise = util.promisify(exec);

export default class PowerSaveBlockerController {
  private powerSaveBlockerId: number | null = null;
  private intervalId: NodeJS.Timeout | null = null;

  constructor() {
    this.setupPowerMonitor();
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

  async sleepDevice(event: Electron.IpcMainEvent) {
    console.log('Putting Raspberry Pi to sleep...');
    this.stopPowerSaveBlocker();
    try {
      await execPromise('xset dpms force off');
      event.reply('set-system-time-response', {
        success: true,
        message: 'Sleeping device',
      });
    } catch (error) {
      event.reply('sleep-device-response', {
        success: false,
        message: `Error setting time: ${error}`,
      });
      console.error('Failed to put device to sleep:', error);
    }
  }

  private onWakeUp() {
    console.log('Device woke up');
    this.updatePowerSaveBlocker();
  }
}
