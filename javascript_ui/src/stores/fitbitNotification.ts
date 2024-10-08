import { defineStore } from 'pinia';
import { useDataUserStore } from './dataUser';
import { useDataPhoneNumberStore } from './dataPhoneNumberStore';

const ONE_HOUR_IN_MS = 60 * 60 * 1000;
const FOUR_DAYS_IN_MS = 4 * 24 * 60 * 60 * 1000;

export const useFitbitNotificationStore = defineStore('fitbitNotification', {
  persist: true,

  state: () => ({
    intervalId: null as null | NodeJS.Timeout,
    lastFitbitNotificationTime: null as null | number,
  }),

  getters: {
    shouldSendNotification(): boolean {
      const dataUserStore = useDataUserStore();
      if (!dataUserStore.isFitbitUser) return false;

      if (this.lastFitbitNotificationTime === null) {
        this.lastFitbitNotificationTime = Date.now();
      }

      const timeSinceLastNotification =
        Date.now() - this.lastFitbitNotificationTime;
      return timeSinceLastNotification >= FOUR_DAYS_IN_MS;
    },
  },

  actions: {
    async checkAndSendNotification() {
      if (this.shouldSendNotification) {
        const dataPhoneNumberStore = useDataPhoneNumberStore();
        await dataPhoneNumberStore.sendFitbitNotification();
        this.lastFitbitNotificationTime = Date.now();
      }
    },

    startNotificationSchedule() {
      this.stopNotificationSchedule();

      this.intervalId = setInterval(() => {
        this.checkAndSendNotification();
      }, ONE_HOUR_IN_MS);

      // Perform an initial check without sending a notification
      this.checkAndSendNotification();
    },

    stopNotificationSchedule() {
      if (this.intervalId !== null) {
        clearInterval(this.intervalId);
        this.intervalId = null;
      }
    },
  },
});
