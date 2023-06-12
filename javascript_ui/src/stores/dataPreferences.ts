import { defineStore } from 'pinia';
import { AudioType } from 'src/components/models';
import { coolingStrategies } from 'src/helper/coolingStrategies';

export const useDataPreferencesStore = defineStore('dataPreferences', {
  persist: true,

  state: () => ({
    audioType: AudioType.TONE,
    coolingStrategiesAvailable: Object.keys(coolingStrategies) as Array<
      keyof typeof coolingStrategies
    >,
  }),

  getters: {},

  actions: {},
});
