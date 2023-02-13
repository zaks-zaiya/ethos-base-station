import { defineStore } from 'pinia';

export const useUserDataStore = defineStore('userData', {
  state: () => ({
    postcode: undefined as undefined | number,
    ageYears: undefined as undefined | number,
    heightCm: undefined as undefined | number,
    weightKg: undefined as undefined | number,
  }),

  getters: {},

  actions: {},
});
