import { defineStore } from 'pinia';
import { AudioType } from 'src/components/models';
import { coolingStrategies } from 'src/helpers/coolingStrategies';

const defaultOptions = {
  haveAccessTo: true,
  wouldUse: true,
  whyNotUse: [] as Array<string>,
  whyNotUseOther: '',
};

export const emptyCoolingStrategyRow = {
  name: '',
  shortName: '',
  icon: '',
  effectiveness: 0,
  group: '' as const,
  extraInfo: {
    bestUse: [],
    whenUse: [],
    whenNotUse: [],
  },
  // Additional options
  key: '',
  ...defaultOptions,
};

export const useDataPreferencesStore = defineStore('dataPreferences', {
  persist: true,

  state: () => ({
    audioType: AudioType.TONE,
    isFollowUp: false,
    coolingStrategyOptions: Object.keys(coolingStrategies).map((key) => {
      return {
        key,
        ...defaultOptions,
      };
    }),
  }),

  getters: {
    // Merge coolingStrategyOptions with all info given in the original coolingStrategies
    coolingStrategyRows: (state) => {
      // Append extra strategy info
      const coolingStrategyRows = state.coolingStrategyOptions.map((option) => {
        return { ...option, ...coolingStrategies[option.key] };
      });
      return coolingStrategyRows;
    },
  },

  actions: {
    // Set a either 'haveAccessTo' or 'wouldUse' for a particular strategy
    setWouldUseOrHaveAccessTo(
      strategyKey: string,
      optionKey: 'haveAccessTo' | 'wouldUse',
      newValue: boolean
    ) {
      const strategy = this.coolingStrategyOptions.find(
        (strategy) => strategy.key === strategyKey
      );
      if (strategy) {
        strategy[optionKey] = newValue;
      }
    },
    // Check if any new cooling strategy options are added / deleted
    updateCoolingStrategyOptions() {
      // Get the current strategy keys
      const currentKeys = this.coolingStrategyOptions.map(
        (option) => option.key
      );

      // Iterate through the keys in coolingStrategies and add new ones with default options
      const updatedOptions = Object.keys(coolingStrategies).map((key) => {
        // If key is new, add it with default options, otherwise copy existing
        if (!currentKeys.includes(key)) {
          return {
            key,
            ...defaultOptions,
          };
        } else {
          return (
            this.coolingStrategyOptions.find(
              (option) => option.key === key
            ) || {
              key,
              ...defaultOptions,
            }
          );
        }
      });

      // Replace the current options with the updated options
      this.coolingStrategyOptions = updatedOptions;
    },
  },
});
