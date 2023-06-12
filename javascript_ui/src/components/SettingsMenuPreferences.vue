<template>
  <div>
    <div class="text-h6 q-mb-md">Preferences</div>
    <div>Which audio alert type would you like to receive?</div>
    <q-table
      :rows="options"
      :columns="columns"
      row-key="label"
      @row-click="rowClick"
      hide-bottom=""
    >
      <template v-slot:body-cell-label="props">
        <q-td :props="props">
          <q-radio
            v-model="dataPreferencesStore.audioType"
            :val="props.row.value"
          />
          {{ props.row.label }}
        </q-td>
      </template>
      <template v-slot:body-cell-medium-priority="props">
        <q-td :props="props">
          <q-btn
            color="teal"
            :icon="isPlayingMedium[props.row.value  as AudioType] ? 'stop' : 'play_arrow'"
            @click.stop="playDemoAudio(props.row, RiskLevel.MEDIUM)"
          />
        </q-td>
      </template>
      <template v-slot:body-cell-high-priority="props">
        <q-td :props="props">
          <q-btn
            color="teal"
            :icon="isPlayingHigh[props.row.value  as AudioType] ? 'stop' : 'play_arrow'"
            @click.stop="playDemoAudio(props.row, RiskLevel.HIGH)"
          />
        </q-td>
      </template>
    </q-table>
    <div class="q-mt-lg">Which cooling strategies do you have access to?</div>
    <q-option-group
      v-model="dataPreferencesStore.coolingStrategiesAvailable"
      :options="coolingStrategyOptions"
      type="checkbox"
      color="primary"
    />
  </div>
</template>

<script lang="ts">
import { QTableProps } from 'quasar';
import { playAudio, stopAudio } from 'src/helper/audioAlertDispatcher';
import { coolingStrategies } from 'src/helper/coolingStrategies';
import { useDataPreferencesStore } from 'src/stores/dataPreferences';
import { defineComponent, reactive, computed } from 'vue';
import { AudioType, RiskLevel } from './models';

interface TableOptions {
  label: string;
  value: AudioType;
}

export default defineComponent({
  components: {},
  setup() {
    const dataPreferencesStore = useDataPreferencesStore();

    const isPlayingMedium = reactive<Record<AudioType, boolean>>({
      [AudioType.TONE]: false,
      [AudioType.TTS]: false,
    });

    const isPlayingHigh = reactive<Record<AudioType, boolean>>({
      [AudioType.TONE]: false,
      [AudioType.TTS]: false,
    });

    let options: Array<TableOptions> = [
      {
        label: 'Tone alerts',
        value: AudioType.TONE,
      },
      {
        label: 'Text to speech alerts',
        value: AudioType.TTS,
      },
    ];

    let columns: QTableProps['columns'] = [
      {
        name: 'label',
        label: 'Alert Type',
        field: 'label',
        required: true,
        align: 'left',
      },
      {
        name: 'medium-priority',
        label: 'Medium Priority',
        field: '',
        required: false,
        align: 'left',
      },
      {
        name: 'high-priority',
        label: 'High Priority',
        field: '',
        required: false,
        align: 'left',
      },
    ];

    const coolingStrategyOptions = computed(() => {
      return Object.entries(coolingStrategies).map(([key, value]) => ({
        label: value.name,
        value: key,
      }));
    });

    const rowClick = (evt: Event, row: TableOptions) => {
      // Update group to be the value of the clicked row
      dataPreferencesStore.audioType = row.value;
    };

    const playDemoAudio = async (row: TableOptions, riskLevel: RiskLevel) => {
      if (riskLevel === RiskLevel.MEDIUM) {
        if (isPlayingMedium[row.value]) {
          stopAudio();
        } else {
          isPlayingMedium[row.value] = !isPlayingMedium[row.value];
          await playAudio(row.value, riskLevel);
          isPlayingMedium[row.value] = !isPlayingMedium[row.value];
        }
      } else if (riskLevel === RiskLevel.HIGH) {
        if (isPlayingHigh[row.value]) {
          stopAudio();
        } else {
          isPlayingHigh[row.value] = !isPlayingHigh[row.value];
          await playAudio(row.value, riskLevel);
          isPlayingHigh[row.value] = !isPlayingHigh[row.value];
        }
      }
    };

    return {
      RiskLevel,
      dataPreferencesStore,
      options,
      columns,
      coolingStrategyOptions,
      rowClick,
      playDemoAudio,
      isPlayingMedium,
      isPlayingHigh,
    };
  },
});
</script>
