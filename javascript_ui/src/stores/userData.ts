import { defineStore } from 'pinia';
import { UserData } from '../components/models';

export const useUserDataStore = defineStore('userData', {
  persist: true,

  state: (): UserData => ({
    id: undefined,
    postcode: undefined,
    latitude: undefined,
    longitude: undefined,
    ageYears: undefined,
    heightCm: undefined,
    weightKg: undefined,
  }),

  getters: {
    containsUndefined(state) {
      // Check whether any state values are equal to undefined
      return Object.values(state).some((val) => val === undefined);
    },
  },

  actions: {},
});
