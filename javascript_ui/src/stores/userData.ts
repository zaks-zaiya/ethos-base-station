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

  getters: {},

  actions: {},
});
