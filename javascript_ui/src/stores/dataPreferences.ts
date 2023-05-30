import { defineStore } from 'pinia';
import { AudioType } from 'src/components/models';

export const useDataPreferencesStore = defineStore('dataPreferences', {
  persist: true,

  state: () => ({
    audioType: AudioType.TONE,
  }),

  getters: {},

  actions: {},
});
