import { defineStore } from 'pinia';

export const useUserDataStore = defineStore('userData', {
  persist: true,

  state: () => ({
    postcode: undefined as undefined | number,
    latitude: undefined as undefined | number,
    longitude: undefined as undefined | number,
    ageYears: undefined as undefined | number,
    heightCm: undefined as undefined | number,
    weightKg: undefined as undefined | number,
  }),

  getters: {},

  actions: {},
});
