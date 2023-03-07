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
      // Inverse (!) has to be used to return boolean
      return (
        !state.id ||
        !state.postcode ||
        !state.latitude ||
        !state.longitude ||
        !state.ageYears ||
        !state.heightCm ||
        !state.weightKg
      );
    },
  },

  actions: {},
});
