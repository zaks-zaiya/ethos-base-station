<template>
  <div>
    <div class="text-h6 q-mb-md">Preferences</div>
    <div>Which audio alert type would you like to receive?</div>
    <q-table
      :rows="options"
      :columns="columns"
      row-key="label"
      @row-click="rowClick"
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
            icon="play_arrow"
            @click.stop="playDemoAudio(props.row, RiskLevel.MEDIUM)"
          />
        </q-td>
      </template>
      <template v-slot:body-cell-high-priority="props">
        <q-td :props="props">
          <q-btn
            color="teal"
            icon="play_arrow"
            @click.stop="playDemoAudio(props.row, RiskLevel.HIGH)"
          />
        </q-td>
      </template>
    </q-table>
  </div>
</template>

<script lang="ts">
import { QTableProps } from 'quasar';
import { playAudio } from 'src/helper/audioAlertDispatcher';
import { useDataPreferencesStore } from 'src/stores/dataPreferences';
import { defineComponent } from 'vue';
import { AudioType, RiskLevel } from './models';

interface TableOptions {
  label: string;
  value: AudioType;
}

export default defineComponent({
  components: {},
  setup() {
    const dataPreferencesStore = useDataPreferencesStore();

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

    const rowClick = (evt: Event, row: TableOptions) => {
      // Update group to be the value of the clicked row
      dataPreferencesStore.audioType = row.value;
    };

    const playDemoAudio = (row: TableOptions, riskLevel: RiskLevel) => {
      playAudio(row.value, riskLevel);
    };

    return {
      RiskLevel,
      dataPreferencesStore,
      options,
      columns,
      rowClick,
      playDemoAudio,
    };
  },
});
</script>
