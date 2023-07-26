<template>
  <q-table
    class="minimal-padding"
    dense
    :rows="sensorsWithIconData"
    :columns="columns"
    hide-bottom
  >
    <template v-slot:header-cell-fanUse="props">
      <q-th class="q-px-none" v-bind="props" :props="props">
        Use a<br />fan?
      </q-th>
    </template>
    <template #body-cell-sensor="props">
      <q-td>{{ props.row.name }}</q-td>
    </template>
    <template #body-cell-fanUse="props">
      <q-td class="text-center" :class="`bg-${props.row.fanUse.color}`">
        <q-icon :name="props.row.fanUse.icon" size="lg" color="white" />
      </q-td>
    </template>
  </q-table>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import { shouldUseFan } from 'src/helpers/fanAndWindowUse';
import { useDataSensorStore, isOutdoorSensor } from 'src/stores/dataSensor';
import { QTableProps } from 'quasar';

export default defineComponent({
  setup() {
    const dataSensorStore = useDataSensorStore();

    const columns: QTableProps['columns'] = [
      {
        name: 'name',
        label: '',
        field: 'name',
        align: 'center',
      },
      {
        name: 'fanUse',
        label: 'Use\na\nfan?',
        field: 'fanUse',
        align: 'center',
      },
    ];

    function getIconColor(result: 'yes' | 'maybe' | 'no' | undefined) {
      let icon, color;
      switch (result) {
        case 'yes':
          icon = 'done';
          color = 'positive';
          break;
        case 'maybe':
          icon = 'question_mark';
          color = 'amber';
          break;
        case 'no':
          icon = 'close';
          color = 'negative';
          break;
        default:
          icon = 'device_unknown';
          color = 'grey';
      }
      return { icon, color };
    }

    const sensorsWithIconData = computed(() => {
      return dataSensorStore.allSensorData.map((sensor) => {
        // Calculate status, and display icon accordingly
        let fanUse = getIconColor(shouldUseFan(sensor));
        // Extend sensor with icon and color data for fan use and blind use
        return { ...sensor, fanUse };
      });
    });

    return { sensorsWithIconData, columns, isOutdoorSensor };
  },
});
</script>

<style>
.minimal-padding th,
.minimal-padding td {
  padding-left: 1px !important; /* Adjust as needed */
  padding-right: 1px !important; /* Adjust as needed */
}
</style>
